'use client'

import { TradeStats } from '@/types'

interface StatsDisplayProps {
  stats: TradeStats
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <h3 className="font-medium">Average Buy Price</h3>
        <p className="text-2xl">${stats.avgBuyPrice.toFixed(4)}</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="font-medium">Average Sell Price</h3>
        <p className="text-2xl">${stats.avgSellPrice.toFixed(4)}</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="font-medium">Net Position</h3>
        <p className="text-2xl">{stats.netPosition.toFixed(2)}</p>
      </div>
    </div>
  )
} 