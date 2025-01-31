import { NextResponse } from 'next/server'
import { Connection, PublicKey, ParsedTransactionWithMeta, ConfirmedSignatureInfo, SignaturesForAddressOptions } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { setTimeout } from 'timers/promises'

// DEX Program IDs
const RAYDIUM_V4 = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
const ORCA_WHIRLPOOL = new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc')

interface Trade {
  signature: string
  timestamp: number
  type: 'buy' | 'sell' | 'unknown'
  amount: number
  price: number
  usdValue: number
  marketCap: number
}

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

interface JupiterPriceResponse {
  data?: {
    [key: string]: {
      price?: number
    }
  }
}

async function getCurrentPrice(tokenAddress: string): Promise<number> {
  try {
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${tokenAddress}`
    )
    const data: JupiterPriceResponse = await response.json()
    return data.data?.[tokenAddress]?.price || 0
  } catch (error) {
    console.error('Current price fetch error:', error)
    return 0
  }
}

async function getHistoricalPrice(timestamp: number, tokenAddress: string): Promise<number> {
  try {
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${tokenAddress}&timestamp=${timestamp}`
    )
    const data: JupiterPriceResponse = await response.json()
    return data.data?.[tokenAddress]?.price || await getCurrentPrice(tokenAddress)
  } catch (error) {
    console.error('Historical price fetch error:', error)
    return await getCurrentPrice(tokenAddress)
  }
}

async function sleep(ms: number) {
  await setTimeout(ms)
}

async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('429')) {
      await sleep(delay)
      return fetchWithRetry(operation, retries - 1, delay * 2)
    }
    throw error
  }
}

async function parseSwapInstruction(
  tx: ParsedTransactionWithMeta,
  wallet: string,
  tokenAddress: string,
  totalSupply: number
): Promise<Trade | null> {
  if (!tx.blockTime || !tx.meta || !tx.transaction.signatures[0]) return null
  
  const timestamp = tx.blockTime * 1000
  
  const isRaydiumSwap = tx.transaction.message.instructions.some(ix => 
    'programId' in ix && ix.programId.equals(RAYDIUM_V4)
  )
  
  const isOrcaSwap = tx.transaction.message.instructions.some(ix => 
    'programId' in ix && ix.programId.equals(ORCA_WHIRLPOOL)
  )
  
  const isTokenTransfer = tx.transaction.message.instructions.some(ix => 
    'programId' in ix && ix.programId.equals(TOKEN_PROGRAM_ID)
  )

  if (!isRaydiumSwap && !isOrcaSwap && !isTokenTransfer) return null

  const preBalance = tx.meta.preTokenBalances?.find(balance => 
    balance.mint === tokenAddress && balance.owner === wallet
  )?.uiTokenAmount.uiAmount || 0

  const postBalance = tx.meta.postTokenBalances?.find(balance => 
    balance.mint === tokenAddress && balance.owner === wallet
  )?.uiTokenAmount.uiAmount || 0

  if (preBalance === postBalance) return null

  const amount = Math.abs(postBalance - preBalance)
  const type = postBalance > preBalance ? 'buy' : 'sell'
  
  const price = await getHistoricalPrice(timestamp, tokenAddress)
  const usdValue = amount * price
  const marketCap = price * totalSupply

  return {
    signature: tx.transaction.signatures[0],
    timestamp,
    type,
    amount,
    price,
    usdValue,
    marketCap
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { wallet, tokenAddress } = body as { wallet?: string; tokenAddress?: string }

    if (!wallet || !tokenAddress) {
      return NextResponse.json(
        { error: 'Wallet and token address are required' },
        { status: 400 }
      )
    }

    const connection = new Connection(SOLANA_RPC)
    const walletPubkey = new PublicKey(wallet)
    const tokenPubkey = new PublicKey(tokenAddress)

    const tokenSupply = await connection.getTokenSupply(tokenPubkey)
    const totalSupply = Number(tokenSupply.value.uiAmount || 0)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    let allSignatures: ConfirmedSignatureInfo[] = []
    let lastSig: string | undefined = undefined
    
    while (true) {
      const options: SignaturesForAddressOptions = {
        limit: 100,
        before: lastSig
      }
      
      const signatures = await fetchWithRetry(() =>
        connection.getSignaturesForAddress(
          walletPubkey,
          options,
          'confirmed'
        )
      )
      
      if (signatures.length === 0 || 
          (signatures[signatures.length - 1].blockTime || 0) < yesterday.getTime() / 1000) {
        const recentSigs = signatures.filter(sig => 
          (sig.blockTime || 0) >= yesterday.getTime() / 1000
        )
        allSignatures = [...allSignatures, ...recentSigs]
        break
      }
      
      allSignatures = [...allSignatures, ...signatures]
      lastSig = signatures[signatures.length - 1].signature
    }

    const trades = await Promise.all(
      allSignatures.map(async (sig, index) => {
        if (index % 5 === 0) await sleep(500)
        
        const tx = await fetchWithRetry(() =>
          connection.getParsedTransaction(sig.signature, 'confirmed')
        )
        return tx ? parseSwapInstruction(tx, wallet, tokenAddress, totalSupply) : null
      })
    )

    const validTrades = trades.filter((t): t is Trade => t !== null)
    const significantTrades = validTrades.filter(trade => trade.usdValue >= 1000)

    const buyTrades = significantTrades.filter(t => t.type === 'buy')
    const sellTrades = significantTrades.filter(t => t.type === 'sell')

    const totalBuyVolume = buyTrades.reduce((sum, t) => sum + t.amount, 0)
    const totalSellVolume = sellTrades.reduce((sum, t) => sum + t.amount, 0)
    const currentPosition = totalBuyVolume - totalSellVolume

    const avgEntryPrice = buyTrades.length > 0 && totalBuyVolume > 0
      ? buyTrades.reduce((sum, t) => sum + (t.price * t.amount), 0) / totalBuyVolume
      : 0

    const avgExitPrice = sellTrades.length > 0 && totalSellVolume > 0
      ? sellTrades.reduce((sum, t) => sum + (t.price * t.amount), 0) / totalSellVolume
      : 0

    const avgEntryMarketCap = buyTrades.length > 0
      ? buyTrades.reduce((sum, t) => sum + t.marketCap, 0) / buyTrades.length
      : 0

    const avgExitMarketCap = sellTrades.length > 0
      ? sellTrades.reduce((sum, t) => sum + t.marketCap, 0) / sellTrades.length
      : 0

    const results = {
      wallet,
      tokenAddress,
      summary: {
        totalBuyVolume: Number(totalBuyVolume.toFixed(2)),
        totalSellVolume: Number(totalSellVolume.toFixed(2)),
        currentPosition: Number(currentPosition.toFixed(2)),
        avgEntryPrice: Number(avgEntryPrice.toFixed(4)),
        avgExitPrice: Number(avgExitPrice.toFixed(4)),
        avgEntryMarketCap: Number((avgEntryMarketCap / 1_000_000).toFixed(2)),
        avgExitMarketCap: Number((avgExitMarketCap / 1_000_000).toFixed(2)),
        significantTradeCount: significantTrades.length
      },
      timeframe: {
        from: yesterday.toISOString(),
        to: new Date().toISOString()
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze wallet' },
      { status: 500 }
    )
  }
}