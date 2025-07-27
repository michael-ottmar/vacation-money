import { useState } from 'react'
import { X } from 'lucide-react'

interface AddPositionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (position: {
    symbol: string
    quantity: number
    costBasis: number
    stopLoss?: number
    takeProfit?: number
    notes?: string
  }) => void
}

export function AddPositionModal({ isOpen, onClose, onSubmit }: AddPositionModalProps) {
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState('')
  const [costBasis, setCostBasis] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [notes, setNotes] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!symbol || !quantity || !costBasis) return
    
    onSubmit?.({
      symbol: symbol.toUpperCase(),
      quantity: parseFloat(quantity),
      costBasis: parseFloat(costBasis),
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      notes: notes || undefined
    })
    
    // Reset form
    setSymbol('')
    setQuantity('')
    setCostBasis('')
    setStopLoss('')
    setTakeProfit('')
    setNotes('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border-light rounded-xl w-[75vw] max-w-4xl h-[85vh] max-h-[900px] mx-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border-light">
          <h2 className="text-xl font-bold">Add New Position</h2>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Symbol */}
          <div>
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
              placeholder="e.g. SOL, BTC, AAPL"
              required
            />
          </div>
          
          {/* Quantity & Cost Basis */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cost Basis ($)</label>
              <input
                type="number"
                step="any"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          {/* Stop Loss & Take Profit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stop Loss (%)</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="e.g. 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Take Profit (%)</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Gain ($)</label>
              <input
                type="number"
                step="any"
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="e.g. 5000"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary resize-none"
              placeholder="Entry reasoning, strategy, etc."
              rows={3}
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-border-light bg-transparent text-white rounded-lg cursor-pointer text-sm transition-all hover:bg-card-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg cursor-pointer text-sm transition-all"
            >
              Add Position
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}