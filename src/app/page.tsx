'use client'

import { useState } from 'react'
import { WalletInput } from '@/components/WalletInput'
import { AnalysisResults } from '@/components/AnalysisResults'

interface AnalysisResults {
  wallet: string
  tokenAddress: string
  summary: {
    totalBuyVolume: number
    totalSellVolume: number
    currentPosition: number
    avgEntryPrice: number
    avgExitPrice: number
    avgEntryMarketCap: number
    avgExitMarketCap: number
    significantTradeCount: number
  }
  timeframe: {
    from: string
    to: string
  }
}

export default function Home() {
  const [wallet, setWallet] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet, tokenAddress }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.')
      }

      const data = await response.json()
      setResults(data)
    } catch (error: unknown) {
      console.error(error)
      setError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-accent-color">
            Solana Wallet Analysis
          </h1>
        </header>

        {/* Main Analysis Card */}
        <div className="card">
          <WalletInput 
            wallet={wallet}
            tokenAddress={tokenAddress}
            onWalletChange={setWallet}
            onTokenChange={setTokenAddress}
            onSubmit={handleAnalyze}
            isLoading={loading}
          />
        </div>

        {/* Display results or error */}
        {error && (
          <div className="card bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {results && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <AnalysisResults results={results} />
          </div>
        )}

        {/* Existing wallet and token address display */}
        {wallet && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="text-text-secondary mb-2">Wallet Address</h2>
              <div className="wallet-address">
                {wallet}
              </div>
            </div>
            <div className="card">
              <h2 className="text-text-secondary mb-2">Token Address</h2>
              <div className="wallet-address">
                {tokenAddress || 'Not specified'}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
