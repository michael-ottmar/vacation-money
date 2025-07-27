import { useState } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface ReportSaleModalProps {
  isOpen: boolean
  onClose: () => void
  position: {
    symbol: string
    quantity: number
    costBasis: number
    currentPrice?: number
  }
  onSubmit?: (sale: {
    quantity: number
    salePrice: number
    notes?: string
  }) => void
}

export function ReportSaleModal({ isOpen, onClose, position, onSubmit }: ReportSaleModalProps) {
  const [quantity, setQuantity] = useState(position.quantity.toString())
  const [salePrice, setSalePrice] = useState(position.currentPrice?.toString() || '')
  const [notes, setNotes] = useState('')
  
  // Calculate profit/loss
  const saleQuantity = parseFloat(quantity) || 0
  const price = parseFloat(salePrice) || 0
  const totalSaleValue = saleQuantity * price
  const totalCostBasis = saleQuantity * position.costBasis
  const profitLoss = totalSaleValue - totalCostBasis
  const profitLossPercent = totalCostBasis > 0 ? (profitLoss / totalCostBasis * 100) : 0
  const isProfit = profitLoss >= 0
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!quantity || !salePrice) return
    
    onSubmit?.({
      quantity: parseFloat(quantity),
      salePrice: parseFloat(salePrice),
      notes: notes || undefined
    })
    
    // Reset form
    setQuantity(position.quantity.toString())
    setSalePrice('')
    setNotes('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border-light rounded-xl w-[75vw] max-w-4xl mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border-light">
          <h2 className="text-xl font-bold">Report Sale - {position.symbol}</h2>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Position Info */}
          <div className="bg-card-hover rounded-lg p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-muted">Current Holdings:</span>
              <span>{position.quantity.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Cost Basis:</span>
              <span>${position.costBasis.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Sale Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity to Sell</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                max={position.quantity}
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sale Price ($)</label>
              <input
                type="number"
                step="any"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          {/* Profit/Loss Preview */}
          {saleQuantity > 0 && price > 0 && (
            <div className={cn(
              "rounded-lg p-4 border",
              isProfit 
                ? "bg-success/10 border-success/30" 
                : "bg-error/10 border-error/30"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  {isProfit ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-error" />
                  )}
                  {isProfit ? 'Profit' : 'Loss'} Preview
                </span>
                <span className={cn(
                  "text-lg font-bold",
                  isProfit ? "text-success" : "text-error"
                )}>
                  {isProfit ? '+' : ''}{profitLossPercent.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Sale Value:</span>
                  <span>${totalSaleValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Cost Basis:</span>
                  <span>${totalCostBasis.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border">
                  <span className="font-medium">{isProfit ? 'Profit:' : 'Loss:'}</span>
                  <span className={cn(
                    "font-medium",
                    isProfit ? "text-success" : "text-error"
                  )}>
                    {isProfit ? '+' : ''}${Math.abs(profitLoss).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary resize-none"
              placeholder="Exit reasoning, market conditions, etc."
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
              className="flex-1 py-2.5 px-4 bg-error hover:bg-error/80 text-white rounded-lg cursor-pointer text-sm transition-all"
            >
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}