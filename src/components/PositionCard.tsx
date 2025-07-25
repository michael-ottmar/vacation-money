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
  
  const isPositive = change >= 0
  const isGainPositive = gain >= 0
  
  // Calculate target value and progress
  const targetGain = totalValue * (takeProfit / 100)
  const stopLossValue = totalValue * (Math.abs(stopLoss) / 100)
  
  // Calculate progress towards target
  const progressToTarget = Math.min(100, Math.max(0, (gainPercent / takeProfit) * 100))
  const progressToStopLoss = gainPercent < 0 ? Math.min(100, Math.max(0, (Math.abs(gainPercent) / Math.abs(stopLoss)) * 100)) : 0
  
  // Determine if we're at target or stop loss
  const isAtTarget = gainPercent >= takeProfit
  const isAtStopLoss = gainPercent <= stopLoss

  // Calculate price targets relative to current price
  const targetLowPercent = ((mockAnalystTargets.low - price) / price * 100).toFixed(1)
  const targetAvgPercent = ((mockAnalystTargets.average - price) / price * 100).toFixed(1)
  const targetHighPercent = ((mockAnalystTargets.high - price) / price * 100).toFixed(1)

  // Calculate positions on bar for visualization
  const currentPosition = ((price - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)
  const avgPosition = ((mockAnalystTargets.average - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)
  const aiTargetPosition = ((mockAnalystTargets.aiRecommended - mockAnalystTargets.low) / (mockAnalystTargets.high - mockAnalystTargets.low) * 100)

  return (
    <div className="border border-border-light rounded-lg mb-3 transition-all hover:border-border-lighter bg-card-hover overflow-hidden">
      <div className="flex">
        {/* Left side - Position details */}
        <div 
          className="flex-1 p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold">{symbol}</span>
            <span className="text-lg">${price.toFixed(2)}</span>
            <span className={cn(
              "text-sm px-2 py-1 rounded",
              isPositive 
                ? "text-success bg-success/10" 
                : "text-error bg-error/10"
            )}>
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
            {isExpanded ? 
              <ChevronUp className="w-4 h-4 text-muted" /> : 
              <ChevronDown className="w-4 h-4 text-muted" />
            }
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setNotificationsEnabled(!notificationsEnabled)
              }}
              className="ml-auto p-1 hover:bg-card rounded transition-colors"
              title={notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}
            >
              {notificationsEnabled ? 
                <Bell className="w-4 h-4 text-primary" /> : 
                <BellOff className="w-4 h-4 text-muted" />
              }
            </button>
          </div>

          {/* Details Grid - 3 columns */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
            <div>
              <div className="text-muted text-xs mb-0.5">Cost Basis</div>
              <div className="font-medium">${costBasis.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted text-xs mb-0.5">Quantity</div>
              <div className="font-medium">{quantity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted text-xs mb-0.5">Invested</div>
              <div className="font-medium">${(costBasis * quantity).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted text-xs mb-0.5">Current Value</div>
              <div className="font-medium">${totalValue.toLocaleString()} <span className={cn("text-xs", isGainPositive ? "text-success" : "text-error")}>{isGainPositive ? '+' : ''}{gainPercent.toFixed(1)}%</span></div>
            </div>
            <div>
              <div className="text-muted text-xs mb-0.5">Stop Loss</div>
              <div className="font-medium">{stopLoss}%</div>
            </div>
            <div>
              <div className="text-muted text-xs mb-0.5">Take Profit</div>
              <div className="font-medium">+{takeProfit}%</div>
            </div>
          </div>
        </div>

        {/* Right side - Target value visualization */}
        <div className="w-[200px] flex flex-col p-4 border-l border-border-light relative">
          {/* Progress bar background */}
          <div className="absolute inset-0">
            {gainPercent >= 0 ? (
              <div 
                className="absolute inset-y-0 left-0 bg-success/10"
                style={{ width: `${progressToTarget}%` }}
              />
            ) : (
              <div 
                className="absolute inset-y-0 right-0 bg-error/10"
                style={{ width: `${progressToStopLoss}%` }}
              />
            )}
          </div>
          
          {/* Target value display */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            <div className={cn(
              "text-2xl font-bold mb-1",
              gainPercent >= 0 ? "text-success" : "text-error"
            )}>
              {gainPercent >= 0 ? '+' : '-'} ${Math.abs(gainPercent >= 0 ? targetGain : stopLossValue).toLocaleString()}
            </div>
          </div>
          
          {/* Report Sale button */}
          <button 
            onClick={onReportSale}
            className={cn(
              "relative z-10 w-full py-2 px-3 border rounded-md text-sm font-medium transition-all",
              isAtTarget 
                ? "border-success bg-success/10 text-success hover:bg-success/20" 
                : isAtStopLoss
                ? "border-error bg-error/10 text-error hover:bg-error/20"
                : "border-border-light bg-transparent text-muted hover:border-border-lighter hover:text-white"
            )}
          >
            <DollarSign className="w-4 h-4 inline mr-1" />
            Report Sale
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border-light pt-4 px-4 pb-4 space-y-4">
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
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted/70">Last updated: 7:00 AM EST</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => console.log('Update AI analysis')}
                    className="px-2 py-0.5 bg-secondary hover:bg-secondary-hover text-white rounded text-xs transition-all flex items-center gap-1"
                  >
                    <Bot className="w-3 h-3" />
                    Update
                  </button>
                  <button
                    onClick={() => onOpenChat?.({ 
                      symbol, 
                      metrics: mockMetrics 
                    })}
                    className="px-2 py-0.5 bg-secondary hover:bg-secondary-hover text-white rounded text-xs transition-all flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}