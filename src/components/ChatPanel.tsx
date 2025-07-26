import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  return (
    <div className={cn(
      "fixed right-0 top-0 w-[calc(25%+40px)] min-w-[400px] max-w-[500px] h-screen bg-background border-l border-border-light transition-transform duration-300 z-50 flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header - aligned to match main header height */}
      <div className="h-[88px] border-b border-border-light flex items-center px-5">
        <h3 className="text-xl font-bold flex-1">Claude Assistant</h3>
        <button 
          onClick={onClose}
          className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="bg-card-hover p-3 rounded-lg mb-3">
          <p className="text-sm mb-2">Good morning! Here's your 7am analysis:</p>
          <p className="text-[13px] text-muted">
            • SOL up 5.2% overnight on ETF speculation<br />
            • Nuclear sector heating up - CCJ approaching resistance<br />
            • LINK consolidating, good accumulation zone<br />
            • New watchlist: ONDO token launch imminent
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="p-5 border-t border-border-light">
        <input 
          type="text" 
          className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-border-lighter"
          placeholder="Ask about positions, trends, or strategies..."
        />
      </div>
    </div>
  )
}