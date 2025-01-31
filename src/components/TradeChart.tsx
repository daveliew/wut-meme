'use client'

import { Line } from 'react-chartjs-2'
import { Trade } from '@/types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface TradeChartProps {
  trades: Trade[]
}

export function TradeChart({ trades }: TradeChartProps) {
  const data = {
    labels: trades.map(t => new Date(t.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: trades.map(t => t.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Trades',
        data: trades.map(t => ({
          x: new Date(t.timestamp),
          y: t.price,
          r: Math.sqrt(t.amount) * 5
        })),
        backgroundColor: trades.map(t => 
          t.type === 'buy' ? 'rgb(75, 192, 75)' : 'rgb(192, 75, 75)'
        ),
        type: 'bubble'
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  }

  return (
    <div className="w-full h-[400px] bg-gray-800 p-4 rounded-lg">
      <Line data={data} options={options} />
    </div>
  )
}