'use client'

import { ChangeEvent, FormEvent } from 'react'

interface WalletInputProps {
  wallet: string
  tokenAddress: string
  onWalletChange: (wallet: string) => void
  onTokenChange: (tokenAddress: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function WalletInput({
  wallet,
  tokenAddress,
  onWalletChange,
  onTokenChange,
  onSubmit,
  isLoading
}: WalletInputProps) {
  const handleWalletChange = (e: ChangeEvent<HTMLInputElement>) => {
    onWalletChange(e.target.value)
  }

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTokenChange(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
          Wallet Address
        </label>
        <input
          type="text"
          id="wallet"
          value={wallet}
          onChange={handleWalletChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-700">
          Token Address
        </label>
        <input
          type="text"
          id="token"
          value={tokenAddress}
          onChange={handleTokenChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}