export interface Trade {
  timestamp: number
  type: 'buy' | 'sell'
  price: number
  amount: number
}

export interface TradeStats {
  avgBuyPrice: number
  avgSellPrice: number
  netPosition: number
}