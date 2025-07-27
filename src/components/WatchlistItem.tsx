import { useState } from 'react'
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../lib/utils'

interface WatchlistItemProps {
  symbol: string
  trigger: string
  isAiSuggested?: boolean
  onRemove?: () => void
  onTransfer?: () => void
}

export function WatchlistItem({ 
  symbol, 
  trigger, 
  isAiSuggested = false,
  onRemove,
  onTransfer
}: WatchlistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Check if text needs truncation (rough estimate: more than 80 chars for 2 lines)
  const needsTruncation = trigger.length > 80
  const displayTrigger = !isExpanded && needsTruncation 
    ? trigger.substring(0, 77) + '...' 
    : trigger
    
  // Mock change percentage for display
  const changePercent = isAiSuggested ? 5.2 : -2.1
  const isPositive = changePercent >= 0

  return (
    <div className={cn(
      "group bg-card-hover border rounded-lg p-3 mb-2.5 transition-all hover:border-border-lighter",
      isAiSuggested 
        ? "border-secondary bg-secondary/5" 
        : "border-border-light"
    )}>
      <div 
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => needsTruncation && setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{symbol}</span>
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded",
              isPositive 
                ? "text-success bg-success/10" 
                : "text-error bg-error/10"
            )}>
              {isPositive ? '+' : ''}{Math.abs(changePercent).toFixed(1)}%
            </span>
            {needsTruncation && (
              isExpanded ? 
                <ChevronUp className="w-3 h-3 text-muted" /> : 
                <ChevronDown className="w-3 h-3 text-muted" />
            )}
          </div>
          <div className="text-xs text-muted leading-relaxed">
            {displayTrigger}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onTransfer && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onTransfer()
              }}
              className="bg-transparent border border-primary text-primary p-1.5 rounded hover:bg-primary/10 transition-colors"
              title="Add to positions"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
          {onRemove && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
              title="Remove from watchlist"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}