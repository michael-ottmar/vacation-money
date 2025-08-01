import { useState, useEffect, useRef } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { claudeService, type ChatMessage } from '../services/claude'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
  context?: any
}

export function ChatPanel({ isOpen, onClose, context }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Add initial context message when context changes
  useEffect(() => {
    if (context?.type === 'goal_suggestion' && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `I see you're looking to create a $${context.goalAmount} goal! 🎯\n\nI've already suggested ${context.currentOptions?.length || 3} options based on current market momentum. What other stocks are you interested in? I can analyze any ticker and estimate the investment needed for your $${context.goalAmount} target.\n\nFor example, you could ask:\n• "What about AAPL for a $${context.goalAmount} goal?"\n• "Can you analyze BTC for this target?"\n• "Show me energy sector options"`
      }])
    }
  }, [context])
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const response = await claudeService.sendMessage(
        [...messages, userMessage],
        context
      )
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API key in the .env file and try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn(
      "fixed right-0 top-0 w-[calc(25%+40px)] min-w-[400px] max-w-[500px] h-screen bg-background border-l border-border-light transition-transform duration-300 z-[60] flex flex-col",
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
        {messages.length === 0 && !context?.type ? (
          <div className="bg-card-hover p-3 rounded-lg mb-3">
            <p className="text-sm mb-2">Welcome to your AI Investment Assistant! 👋</p>
            <p className="text-[13px] text-muted">
              I can help you with:<br />
              • Analyzing stocks for your goals<br />
              • Market insights and trends<br />
              • Investment strategy suggestions<br />
              • Risk assessment for your positions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg",
                  message.role === 'user' 
                    ? "bg-primary/10 ml-8" 
                    : "bg-card-hover mr-8"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bg-card-hover p-3 rounded-lg mr-8 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 border-t border-border-light">
        <div className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-border-lighter"
            placeholder="Ask about positions, trends, or strategies..."
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-3 rounded-lg transition-colors",
              input.trim() && !isLoading
                ? "bg-primary hover:bg-primary-hover text-white"
                : "bg-card-hover text-muted cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}