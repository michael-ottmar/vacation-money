import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface WatchlistItemProps {
  symbol: string
  trigger: string
  isAiSuggested?: boolean
  onRemove?: () => void
}

export function WatchlistItem({ 
  symbol, 
  trigger, 
  isAiSuggested = false,
  onRemove 
}: WatchlistItemProps) {
  return (
    <div className={cn(
      "bg-card-hover border rounded-lg p-3 mb-2.5 flex justify-between items-center cursor-pointer transition-all hover:border-border-lighter",
      isAiSuggested 
        ? "border-secondary bg-secondary/5" 
        : "border-border-light"
    )}>
      <div className="flex-1">
        <div className="font-bold mb-1">{symbol}</div>
        <div className="text-xs text-muted">{trigger}</div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation()
          onRemove?.()
        }}
        className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}