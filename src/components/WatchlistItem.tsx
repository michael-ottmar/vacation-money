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
  
  // Mock change percentage for display
  const changePercent = isAiSuggested ? 5.2 : -2.1
  const isPositive = changePercent >= 0

  return (
    <div className={cn(
      "bg-card-hover border rounded-lg p-4 mb-3 transition-all hover:border-border-lighter",
      isAiSuggested 
        ? "border-secondary" 
        : "border-border-light"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{symbol}</span>
          <span className={cn(
            "text-sm px-2 py-0.5 rounded",
            isPositive 
              ? "text-success bg-success/10" 
              : "text-error bg-error/10"
          )}>
            {isPositive ? '+' : ''}{Math.abs(changePercent).toFixed(1)}%
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-card rounded transition-colors"
          >
            {isExpanded ? 
              <ChevronUp className="w-3 h-3 text-muted" /> : 
              <ChevronDown className="w-3 h-3 text-muted" />
            }
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {onTransfer && (
            <button 
              onClick={onTransfer}
              className="bg-transparent border border-primary text-primary px-3 py-1 rounded hover:bg-primary/10 transition-colors text-sm"
              title="Add to positions"
            >
              <Plus className="w-3 h-3 inline mr-1" />
              Add
            </button>
          )}
          {onRemove && (
            <button 
              onClick={onRemove}
              className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
              title="Remove from watchlist"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className={cn(
        "text-xs text-muted leading-relaxed overflow-hidden transition-all",
        isExpanded ? "max-h-40" : "max-h-10"
      )}>
        {trigger}
      </div>
    </div>
  )
}