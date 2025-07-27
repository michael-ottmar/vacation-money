import { useState } from 'react'
import { X } from 'lucide-react'

interface AddToWatchlistModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (item: {
    symbol: string
    trigger: string
  }) => void
}

export function AddToWatchlistModal({ isOpen, onClose, onSubmit }: AddToWatchlistModalProps) {
  const [symbol, setSymbol] = useState('')
  const [trigger, setTrigger] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!symbol || !trigger) return
    
    onSubmit?.({
      symbol: symbol.toUpperCase(),
      trigger
    })
    
    // Reset form
    setSymbol('')
    setTrigger('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: 0.85 }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-xl p-6 w-full max-w-lg" style={{ width: '75vw', maxWidth: '600px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add to Watchlist</h2>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              form="add-watchlist-form"
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add to Watchlist
            </button>
            <button 
              onClick={onClose}
              className="text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form id="add-watchlist-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Symbol */}
          <div>
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
              placeholder="AAPL, BTC, etc."
              required
              autoFocus
            />
          </div>
          
          {/* Trigger/Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Trigger / Notes</label>
            <textarea
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary resize-none"
              placeholder="Describe what conditions would trigger you to buy this position..."
              rows={4}
              required
            />
          </div>
        </form>
      </div>
    </div>
  )
}