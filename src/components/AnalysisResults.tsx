import { format } from 'date-fns'

interface AnalysisResultsProps {
  results: {
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
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const { summary, timeframe } = results
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          <tr>
            <td className="px-6 py-4 font-medium">Time Period</td>
            <td className="px-6 py-4">
              {format(new Date(timeframe.from), 'MMM d, yyyy HH:mm')} - 
              {format(new Date(timeframe.to), 'MMM d, yyyy HH:mm')}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Total Buy Volume</td>
            <td className="px-6 py-4">{summary.totalBuyVolume.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Total Sell Volume</td>
            <td className="px-6 py-4">{summary.totalSellVolume.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Current Position</td>
            <td className="px-6 py-4">{summary.currentPosition.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Average Entry Price</td>
            <td className="px-6 py-4">${summary.avgEntryPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Average Exit Price</td>
            <td className="px-6 py-4">${summary.avgExitPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Avg Entry Market Cap</td>
            <td className="px-6 py-4">${summary.avgEntryMarketCap.toLocaleString()}M</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Avg Exit Market Cap</td>
            <td className="px-6 py-4">${summary.avgExitMarketCap.toLocaleString()}M</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-medium">Significant Trades (>$1000)</td>
            <td className="px-6 py-4">{summary.significantTradeCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
} 