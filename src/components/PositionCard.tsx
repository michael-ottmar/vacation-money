import { useState } from 'react'
import { Bot, ChevronDown, ChevronUp, TrendingUp, Activity, Bell, BellOff, DollarSign } from 'lucide-react'
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
  onReportSale?: () => void
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
  onReportSale,
}: PositionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showStopLossMenu, setShowStopLossMenu] = useState(false)
  const [showTakeProfitMenu, setShowTakeProfitMenu] = useState(false)
  const [customStopLoss, setCustomStopLoss] = useState('')
  const [customTakeProfit, setCustomTakeProfit] = useState('')
  
  const isPositive = change >= 0
  const isGainPositive = gain >= 0

  // Calculate price targets relative to current price
  const targetLowPercent = ((mockAnalystTargets.low - price) / price * 100).toFixed(1)
  const targetAvgPercent = ((mockAnalystTargets.average - price) / price * 100).toFixed(1)
  const targetHighPercent = ((mockAnalystTargets.high - price) / price * 100).toFixed(1)

  // Calculate positions on bar for visualization
  const currentPosition = ((price - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)
  const avgPosition = ((mockAnalystTargets.average - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)

  const presetOptions = [
    { label: '2%', value: 2 },
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: 'AI Rec', value: 15, isAI: true }, // Mock AI recommendation
  ]

  const handleStopLossSelect = (value: number) => {
    // In real app, would update the position
    console.log('Setting stop loss:', value)
    setShowStopLossMenu(false)
  }

  const handleTakeProfitSelect = (value: number) => {
    // In real app, would update the position
    console.log('Setting take profit:', value)
    setShowTakeProfitMenu(false)
  }

  return (
    <div className="bg-card-hover border border-border-light rounded-lg p-4 mb-3 transition-all hover:border-border-lighter relative">
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
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setNotificationsEnabled(!notificationsEnabled)
              }}
              className="p-1 hover:bg-card rounded transition-colors"
              title={notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}
            >
              {notificationsEnabled ? 
                <Bell className="w-4 h-4 text-primary" /> : 
                <BellOff className="w-4 h-4 text-muted" />
              }
            </button>
            <span className={cn(
              "text-sm px-2 py-1 rounded",
              isPositive 
                ? "text-success bg-success/10" 
                : "text-error bg-error/10"
            )}>
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3 text-sm">
          <div className="flex gap-2">
            <span className="text-muted">Cost Basis:</span>
            <span className="text-white">${costBasis.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted">Quantity:</span>
            <span className="text-white">{quantity.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted">Total Value:</span>
            <span className="text-white">${totalValue.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
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
          {/* Price Targets Bar Graph */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Analyst Price Targets
            </h4>
            <div className="relative">
              {/* Price range bar */}
              <div className="bg-card h-8 rounded-full overflow-hidden relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-error/20 via-primary/20 to-success/20" />
                
                {/* Current price indicator */}
                <div 
                  className="absolute top-0 h-full w-1 bg-white"
                  style={{ left: `${currentPosition}%` }}
                />
                
                {/* Average target indicator */}
                <div 
                  className="absolute top-0 h-full w-0.5 bg-muted opacity-50"
                  style={{ left: `${avgPosition}%` }}
                />
              </div>
              
              {/* Labels */}
              <div className="flex justify-between mt-2 text-xs">
                <div className="text-muted">
                  <div>Low</div>
                  <div className="font-semibold">${mockAnalystTargets.low}</div>
                  <div className={Number(targetLowPercent) >= 0 ? "text-success" : "text-error"}>
                    ({targetLowPercent}%)
                  </div>
                </div>
                <div className="text-muted text-center">
                  <div>Avg</div>
                  <div className="font-semibold">${mockAnalystTargets.average}</div>
                  <div className={Number(targetAvgPercent) >= 0 ? "text-success" : "text-error"}>
                    ({targetAvgPercent}%)
                  </div>
                </div>
                <div className="text-muted text-right">
                  <div>High</div>
                  <div className="font-semibold">${mockAnalystTargets.high}</div>
                  <div className={Number(targetHighPercent) >= 0 ? "text-success" : "text-error"}>
                    ({targetHighPercent}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis & Metrics */}
          <div className="bg-card/50 rounded-lg p-4">
            {/* Key Metrics */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-secondary" />
                Key Metrics
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted">RSI (14):</span>
                  <span className={mockMetrics.rsi < 30 ? "text-success" : mockMetrics.rsi > 70 ? "text-error" : "text-white"}>
                    {mockMetrics.rsi}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted">Volume 24h:</span>
                  <span className="text-white">{mockMetrics.volume24h}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted">Market Cap:</span>
                  <span className="text-white">{mockMetrics.marketCap}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted">{symbol === 'CCJ' ? 'P/E Ratio:' : 'Dominance:'}</span>
                  <span className="text-white">{symbol === 'CCJ' ? mockMetrics.peRatio : mockMetrics.dominance}</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-border mb-4" />
            
            {/* AI Summary */}
            <div>
              <p className="italic text-muted">
                "Strong momentum with RSI showing oversold conditions. Breaking above key resistance at $170. 
                Volume surge indicates institutional interest. Next resistance at $185."
              </p>
              <p className="text-xs mt-2 text-muted/70">Last updated: 7:00 AM EST</p>
            </div>
          </div>
          
          {/* AI Analysis Button - moved to expanded view */}
          <button className="w-full py-2.5 px-3 border border-secondary bg-secondary/10 text-[#a5b4fc] rounded-md cursor-pointer text-sm transition-all hover:bg-secondary/20 flex items-center justify-center gap-2">
            <Bot className="w-4 h-4" />
            View Full AI Analysis
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2.5 mt-3">
        <div className="relative flex-1">
          <button 
            onClick={() => setShowStopLossMenu(!showStopLossMenu)}
            className="w-full py-2 px-3 border border-border-light bg-transparent text-muted rounded-md cursor-pointer text-[13px] transition-all hover:border-error hover:text-error"
          >
            Stop Loss: {stopLoss}%
          </button>
          
          {showStopLossMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border-light rounded-lg p-2 z-10">
              <div className="text-xs font-semibold mb-2 text-white">Set Stop Loss</div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                {presetOptions.filter(opt => !opt.isAI).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStopLossSelect(-option.value)}
                    className="py-1 px-2 text-xs bg-card-hover hover:bg-error/20 hover:text-error rounded transition-colors"
                  >
                    -{option.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Custom %"
                  value={customStopLoss}
                  onChange={(e) => setCustomStopLoss(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-card-hover border border-border-light rounded"
                />
                <button
                  onClick={() => customStopLoss && handleStopLossSelect(-Number(customStopLoss))}
                  className="px-2 py-1 text-xs bg-primary hover:bg-primary-hover rounded"
                >
                  Set
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <button 
            onClick={() => setShowTakeProfitMenu(!showTakeProfitMenu)}
            className="w-full py-2 px-3 border border-border-light bg-transparent text-muted rounded-md cursor-pointer text-[13px] transition-all hover:border-success hover:text-success"
          >
            Take Profit: +{takeProfit}%
          </button>
          
          {showTakeProfitMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border-light rounded-lg p-2 z-10">
              <div className="text-xs font-semibold mb-2 text-white">Set Take Profit</div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                {presetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTakeProfitSelect(option.value)}
                    className={cn(
                      "py-1 px-2 text-xs rounded transition-colors",
                      option.isAI 
                        ? "bg-secondary/20 hover:bg-secondary/30 text-secondary" 
                        : "bg-card-hover hover:bg-success/20 hover:text-success"
                    )}
                  >
                    +{option.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Custom %"
                  value={customTakeProfit}
                  onChange={(e) => setCustomTakeProfit(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-card-hover border border-border-light rounded"
                />
                <button
                  onClick={() => customTakeProfit && handleTakeProfitSelect(Number(customTakeProfit))}
                  className="px-2 py-1 text-xs bg-primary hover:bg-primary-hover rounded"
                >
                  Set
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onReportSale}
          className="flex-1 py-2 px-3 border border-error/50 bg-error/10 text-[#ff6b6b] rounded-md cursor-pointer text-[13px] transition-all hover:bg-error/20 hover:border-error flex items-center justify-center gap-1"
        >
          <DollarSign className="w-4 h-4" />
          Report Sale
        </button>
      </div>
    </div>
  )
}