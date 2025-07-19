import { useState } from 'react'
import { Bot, ChevronDown, ChevronUp, TrendingUp, Activity } from 'lucide-react'
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

// Mock data for expanded view - will come from API/AI analysis later
const mockAnalystTargets = {
  low: 150,
  average: 185,
  high: 220,
}

const mockMetrics = {
  rsi: 42,
  volume24h: '1.2B',
  marketCap: '72.5B',
  peRatio: 'N/A', // For stocks
  dominance: '2.4%', // For crypto
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
  const [isExpanded, setIsExpanded] = useState(false)
  const isPositive = change >= 0
  const isGainPositive = gain >= 0

  // Calculate price targets relative to current price
  const targetLowPercent = ((mockAnalystTargets.low - price) / price * 100).toFixed(1)
  const targetAvgPercent = ((mockAnalystTargets.average - price) / price * 100).toFixed(1)
  const targetHighPercent = ((mockAnalystTargets.high - price) / price * 100).toFixed(1)

  return (
    <div className="bg-card-hover border border-border-light rounded-lg p-4 mb-3 transition-all hover:border-border-lighter">
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{symbol}</span>
            <span className="text-lg">${price.toFixed(2)}</span>
            {isExpanded ? 
              <ChevronUp className="w-4 h-4 text-muted" /> : 
              <ChevronDown className="w-4 h-4 text-muted" />
            }
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
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border-light pt-4 mt-4 space-y-4">
          {/* Price Targets */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Analyst Price Targets
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Low Target</span>
                <div className="flex items-center gap-2">
                  <span>${mockAnalystTargets.low}</span>
                  <span className={Number(targetLowPercent) >= 0 ? "text-success" : "text-error"}>
                    ({targetLowPercent}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Average Target</span>
                <div className="flex items-center gap-2">
                  <span>${mockAnalystTargets.average}</span>
                  <span className={Number(targetAvgPercent) >= 0 ? "text-success" : "text-error"}>
                    ({targetAvgPercent}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">High Target</span>
                <div className="flex items-center gap-2">
                  <span>${mockAnalystTargets.high}</span>
                  <span className={Number(targetHighPercent) >= 0 ? "text-success" : "text-error"}>
                    ({targetHighPercent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-secondary" />
              Key Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">RSI (14)</span>
                <span className={mockMetrics.rsi < 30 ? "text-success" : mockMetrics.rsi > 70 ? "text-error" : ""}>
                  {mockMetrics.rsi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Volume 24h</span>
                <span>{mockMetrics.volume24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Market Cap</span>
                <span>{mockMetrics.marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{symbol === 'CCJ' ? 'P/E Ratio' : 'Dominance'}</span>
                <span>{symbol === 'CCJ' ? mockMetrics.peRatio : mockMetrics.dominance}</span>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-card/50 rounded-lg p-3 text-sm text-muted">
            <p className="italic">
              "Strong momentum with RSI showing oversold conditions. Breaking above key resistance at $170. 
              Volume surge indicates institutional interest. Next resistance at $185."
            </p>
            <p className="text-xs mt-2 text-muted/70">Last updated: 7:00 AM EST</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2.5 mt-3">
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