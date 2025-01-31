'use client'

import { Chart } from 'react-chartjs-2'
import { Trade } from '@/types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  BubbleController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BubbleController
)

interface TradeChartProps {
  trades: Trade[]
}

export function TradeChart({ trades }: TradeChartProps) {
  const data: ChartData<'line' | 'bubble'> = {
    datasets: [
      {
        type: 'line',
        label: 'Price',
        data: trades.map(t => ({
          x: t.timestamp,
          y: t.price
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      },
      {
        type: 'bubble',
        label: 'Trades',
        data: trades.map(t => ({
          x: t.timestamp,
          y: t.price,
          r: Math.sqrt(t.amount) * 5
        })),
        backgroundColor: trades.map(t => 
          t.type === 'buy' ? 'rgb(75, 192, 75)' : 'rgb(192, 75, 75)'
        )
      }
    ]
  }

  const options: ChartOptions<'line' | 'bubble'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
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
      <Chart type="line" data={data} options={options} />
    </div>
  )
}