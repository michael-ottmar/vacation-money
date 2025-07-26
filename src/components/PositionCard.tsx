import { useState } from 'react'
import { Bot, ChevronDown, ChevronUp, TrendingUp, Activity, Bell, BellOff, DollarSign, MessageCircle } from 'lucide-react'
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
  onOpenChat?: (context: { symbol: string; metrics: any }) => void
}

// Mock data for expanded view - will come from API/AI analysis later
const mockAnalystTargets = {
  low: 150,
  average: 185,
  high: 220,
  aiRecommended: 195, // AI's recommended target
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
  onOpenChat,
}: PositionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showStopLossMenu, setShowStopLossMenu] = useState(false)
  const [showTakeProfitMenu, setShowTakeProfitMenu] = useState(false)
  const [customStopLoss, setCustomStopLoss] = useState('')
  const [customTakeProfit, setCustomTakeProfit] = useState('')
  
  const isPositive = change >= 0
  const isGainPositive = gain >= 0
  
  // Calculate if position is near take profit or stop loss
  const currentGainPercent = gainPercent
  const isNearTakeProfit = currentGainPercent >= takeProfit * 0.8 // 80% of take profit target
  const isNearStopLoss = currentGainPercent <= stopLoss * 0.8 && currentGainPercent < 0 // 80% of stop loss

  // Calculate price targets relative to current price
  const targetLowPercent = ((mockAnalystTargets.low - price) / price * 100).toFixed(1)
  const targetAvgPercent = ((mockAnalystTargets.average - price) / price * 100).toFixed(1)
  const targetHighPercent = ((mockAnalystTargets.high - price) / price * 100).toFixed(1)

  // Calculate positions on bar for visualization
  const currentPosition = ((price - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)
  const avgPosition = ((mockAnalystTargets.average - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)
  const aiTargetPosition = ((mockAnalystTargets.aiRecommended - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)

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
    <div className={cn(
      "border border-border-light rounded-lg p-4 mb-3 transition-all hover:border-border-lighter relative overflow-hidden",
      "bg-card-hover"
    )}>
      {/* Gradient overlays for profit/loss indicators */}
      {isNearTakeProfit && (
        <div className="absolute inset-0 bg-gradient-to-tl from-success/10 via-transparent to-transparent pointer-events-none" />
      )}
      {isNearStopLoss && (
        <div className="absolute inset-0 bg-gradient-to-tr from-error/10 via-transparent to-transparent pointer-events-none" />
      )}
      <div 
        className="cursor-pointer relative z-10"
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
                
                {/* AI Recommended target indicator */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                  style={{ left: `calc(${aiTargetPosition}% - 12px)` }}
                  title={`AI Target: $${mockAnalystTargets.aiRecommended}`}
                >
                  <Bot className="w-3 h-3 text-white" />
                </div>
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
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-secondary" />
                  Key Metrics
                </h4>
                <button
                  onClick={() => onOpenChat?.({ 
                    symbol, 
                    metrics: mockMetrics 
                  })}
                  className="px-3 py-1 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary rounded-md text-xs transition-all flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  Chat
                </button>
              </div>
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
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-muted/70">Last updated: 7:00 AM EST</p>
                <button
                  onClick={() => console.log('Update AI analysis')}
                  className="px-2 py-0.5 bg-secondary hover:bg-secondary-hover text-white rounded text-xs transition-all flex items-center gap-1"
                >
                  <Bot className="w-3 h-3" />
                  Update
                </button>
              </div>
            </div>
          </div>
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
          className="flex-1 py-2 px-3 border border-border-light bg-transparent text-muted rounded-md cursor-pointer text-[13px] transition-all hover:border-border-lighter hover:text-white flex items-center justify-center gap-1"
        >
          <DollarSign className="w-4 h-4" />
          Report Sale
        </button>
      </div>
    </div>
  )
}