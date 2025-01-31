'use client'

import { useState } from 'react'
import { Trade, TradeStats } from '@/types'
import { WalletInput } from '@/components/WalletInput'

export default function Home() {
  const [wallet, setWallet] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      // TODO: Implement analysis
      console.log('Analyzing', wallet, tokenAddress)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Solana Wallet Analysis
        </h1>
        
        <WalletInput 
          wallet={wallet}
          tokenAddress={tokenAddress}
          onWalletChange={setWallet}
          onTokenChange={setTokenAddress}
          onSubmit={handleAnalyze}
          isLoading={loading}
        />
      </div>
    </main>
  )
}
