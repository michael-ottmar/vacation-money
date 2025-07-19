import { Bot } from 'lucide-react'
import { cn } from '../lib/utils'

interface PositionCardProps {
  symbol: string
  price: number
  change: number
  costBasis: number
  quantity: number
  totalValue: number
  gain: number
  gainPercent: number
  stopLoss: number
  takeProfit: number
}

export function PositionCard({
  symbol,
  price,
  change,
  costBasis,
  quantity,
  totalValue,
  gain,
  gainPercent,
  stopLoss,
  takeProfit,
}: PositionCardProps) {
  const isPositive = change >= 0
  const isGainPositive = gain >= 0

  return (
    <div className="bg-card-hover border border-border-light rounded-lg p-4 mb-3 transition-all hover:border-border-lighter hover:-translate-y-[1px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xl font-bold">{symbol}</span>
          <span className="text-lg ml-2">${price.toFixed(2)}</span>
        </div>
        <span className={cn(
          "text-sm px-2 py-1 rounded",
          isPositive 
            ? "text-success bg-success/10" 
            : "text-error bg-error/10"
        )}>
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Cost Basis:</span>
          <span className="text-white">${costBasis.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Quantity:</span>
          <span className="text-white">{quantity.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Total Value:</span>
          <span className="text-white">${totalValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Gain:</span>
          <span className={isGainPositive ? "text-success" : "text-error"}>
            {isGainPositive ? '+' : ''}${gain.toLocaleString()} ({isGainPositive ? '+' : ''}{gainPercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <button className="flex-1 py-2 px-3 border border-border-light bg-transparent text-muted rounded-md cursor-pointer text-[13px] transition-all hover:border-[#666] hover:text-white">
          Stop Loss: {stopLoss}%
        </button>
        <button className="flex-1 py-2 px-3 border border-border-light bg-transparent text-muted rounded-md cursor-pointer text-[13px] transition-all hover:border-[#666] hover:text-white">
          Take Profit: +{takeProfit}%
        </button>
        <button className="flex-1 py-2 px-3 border border-secondary bg-secondary/10 text-[#a5b4fc] rounded-md cursor-pointer text-[13px] transition-all hover:bg-secondary/20 flex items-center justify-center gap-1">
          <Bot className="w-4 h-4" />
          AI Analysis
        </button>
      </div>
    </div>
  )
}