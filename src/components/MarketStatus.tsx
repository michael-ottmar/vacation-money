import { Activity } from 'lucide-react'
import { cn } from '../lib/utils'

interface MarketStatusProps {
  isLive?: boolean
  lastUpdated?: Date | null
  className?: string
}

export function MarketStatus({ isLive = false, lastUpdated, className }: MarketStatusProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      <div className={cn(
        'flex items-center gap-1',
        isLive ? 'text-success' : 'text-muted'
      )}>
        <Activity className="w-3 h-3" />
        <span>{isLive ? 'Live' : 'Delayed'}</span>
      </div>
      {lastUpdated && (
        <span className="text-muted">
          Updated: {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  )
}