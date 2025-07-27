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
    <div className="border border-border-light rounded-lg mb-3 transition-all hover:border-border-lighter bg-card-hover overflow-hidden relative min-h-[160px]">
      {/* Gradient overlays for profit/loss indicators */}
      {gainPercent >= 0 && progressToTarget > 10 && (
        <div 
          className="absolute inset-0 bg-gradient-to-tl from-success/20 via-success/5 to-transparent pointer-events-none"
          style={{ 
            opacity: Math.min(progressToTarget / 100, 0.8),
            background: `radial-gradient(circle at bottom right, rgba(34, 197, 94, ${0.15 * (progressToTarget / 100)}) 0%, transparent 70%)`
          }}
        />
      )}
      {gainPercent < 0 && progressToStopLoss > 10 && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-error/20 via-error/5 to-transparent pointer-events-none"
          style={{ 
            opacity: Math.min(progressToStopLoss / 100, 0.8),
            background: `radial-gradient(circle at bottom left, rgba(239, 68, 68, ${0.15 * (progressToStopLoss / 100)}) 0%, transparent 70%)`
          }}
        />
      )}
      
      <div className="flex relative">
        {/* Left side - Position details */}
        <div 
          className="flex-1 p-5 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{symbol}</span>
            <span className="text-xl">${price.toFixed(2)}</span>
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
          </div>

          {/* Details Grid - 3 columns with specific pairing */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-base">
            {/* Column 1: Cost Basis & Quantity */}
            <div className="space-y-1">
              <div className="flex gap-2 items-baseline">
                <span className="text-muted">Cost Basis:</span>
                <span className="font-medium">${costBasis.toFixed(2)}</span>
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="text-muted">Quantity:</span>
                <span className="font-medium">{quantity}</span>
              </div>
            </div>
            
            {/* Column 2: Invested & Current Value */}
            <div className="space-y-1">
              <div className="flex gap-2 items-baseline">
                <span className="text-muted">Invested:</span>
                <span className="font-medium">${(costBasis * quantity).toLocaleString()}</span>
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="text-muted">Current value:</span>
                <span className="font-medium">
                  ${totalValue.toLocaleString()} 
                  <span className={cn("text-sm ml-1", isGainPositive ? "text-success" : "text-error")}>
                    {isGainPositive ? '+' : ''}{gainPercent.toFixed(1)}%
                  </span>
                </span>
              </div>
            </div>
            
            {/* Column 3: Stop Loss & Take Profit */}
            <div className="space-y-1">
              <div className="flex gap-2 items-baseline">
                <span className="text-muted">Stop Loss:</span>
                <span className="font-medium">{stopLoss}%</span>
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="text-muted">Take Profit:</span>
                <span className="font-medium text-success">+{takeProfit}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Target value visualization */}
        <div className="w-[200px] flex flex-col p-5 border-l border-border-light relative">
          {/* Notification bell in top right */}
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setNotificationsEnabled(!notificationsEnabled)
            }}
            className="absolute top-2 right-2 p-1 hover:bg-card rounded transition-colors z-20"
            title={notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}
          >
            {notificationsEnabled ? 
              <Bell className="w-4 h-4 text-primary" /> : 
              <BellOff className="w-4 h-4 text-muted" />
            }
          </button>
          
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