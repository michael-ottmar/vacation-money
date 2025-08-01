import { useState, useEffect } from 'react'
import { X, Sparkles, TrendingUp, Clock, DollarSign, ChevronRight, AlertCircle, MessageCircle, Plus } from 'lucide-react'
import { cn } from '../lib/utils'
import { claudeService } from '../services/claude'

interface GoalSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  isChatOpen?: boolean
  preselectedTicker?: string  // When coming from watchlist
  onOpenChat?: (context: { goalAmount: number | null; currentOptions: AIOption[] }) => void
  onSubmit?: (goal: {
    symbol: string
    goalAmount: number
    timeHorizon: 'aggressive' | 'balanced' | 'conservative'
    investmentAmount: number
    quantity: number
    costBasis: number
    stopLoss?: number
    takeProfit?: number
  }) => void
}

interface AIOption {
  symbol: string
  name: string
  currentPrice: number
  momentum: 'strong' | 'moderate' | 'building'
  confidence: number
  reason: string
  requiredInvestment: {
    aggressive: number
    balanced: number
    conservative: number
  }
  estimatedTime: {
    aggressive: string
    balanced: string
    conservative: string
  }
}

export function GoalSelectionModal({ isOpen, onClose, isChatOpen, preselectedTicker, onOpenChat, onSubmit }: GoalSelectionModalProps) {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null)
  const [customGoal, setCustomGoal] = useState('')
  const [aiOptions, setAiOptions] = useState<AIOption[]>([])
  const [selectedOption, setSelectedOption] = useState<AIOption | null>(null)
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<'aggressive' | 'balanced' | 'conservative' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  
  const goalAmounts = [
    { value: 100, label: '$100' },
    { value: 200, label: '$200' },
    { value: 500, label: '$500' },
    { value: 1000, label: '$1,000' },
    { value: 2000, label: '$2,000' },
    { value: 3500, label: '$3,500' },
    { value: 5000, label: '$5,000' },
    { value: 'custom', label: 'Custom' },
  ]
  
  // Loading messages for ghost content
  const loadingMessages = [
    'Analyzing market trends...',
    'Scanning volume patterns...',
    'Evaluating momentum indicators...',
    'Checking cyclical patterns...',
    'Calculating optimal entry points...',
    'Finalizing recommendations...'
  ]
  
  // Handle preselected ticker from watchlist
  useEffect(() => {
    if (preselectedTicker && isOpen && !selectedGoal) {
      // Auto-select $500 as default goal
      setSelectedGoal(500)
      // Generate options immediately with preselected ticker
      generateAIOptionsWithTicker(preselectedTicker)
    }
  }, [preselectedTicker, isOpen])

  // Simulate AI analysis when goal is selected
  useEffect(() => {
    if (selectedGoal && !aiOptions.length && !preselectedTicker) {
      setIsLoading(true)
      setLoadingStep(0)
      
      // Simulate loading steps
      const interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= loadingMessages.length - 1) {
            clearInterval(interval)
            // Generate mock AI options
            generateAIOptions()
            setIsLoading(false)
            return prev
          }
          return prev + 1
        })
      }, 800)
      
      return () => clearInterval(interval)
    }
  }, [selectedGoal])
  
  const generateAIOptions = async () => {
    if (!selectedGoal) return
    
    try {
      // Get 3 different stock recommendations
      const symbols = ['NVDA', 'SOL', 'TSLA'] // Default symbols, could be dynamic later
      
      const analysisPromises = symbols.map(symbol => 
        claudeService.analyzeStockForGoal(symbol, selectedGoal)
      )
      
      const results = await Promise.all(analysisPromises)
      setAiOptions(results)
    } catch (error) {
      console.error('Failed to generate AI options:', error)
      // Fallback to basic options if API fails
      setAiOptions([
        {
          symbol: 'NVDA',
          name: 'NVIDIA',
          currentPrice: 485.20,
          momentum: 'strong',
          confidence: 88,
          reason: 'Leading AI technology company',
          requiredInvestment: {
            aggressive: selectedGoal * 2.5,
            balanced: selectedGoal * 4,
            conservative: selectedGoal * 6
          },
          estimatedTime: {
            aggressive: '2-4 weeks',
            balanced: '1-3 months',
            conservative: '3-6 months'
          }
        }
      ])
    }
  }
  
  const generateAIOptionsWithTicker = async (ticker: string) => {
    if (!selectedGoal) return
    
    try {
      // Analyze the selected ticker
      const mainAnalysis = await claudeService.analyzeStockForGoal(ticker, selectedGoal, 'User selected from watchlist')
      
      // Get similar stocks
      const similarSymbols = await claudeService.getSimilarStocks(ticker)
      
      // Analyze similar stocks (take first 2)
      const similarPromises = similarSymbols.slice(0, 2).map(symbol => 
        claudeService.analyzeStockForGoal(symbol, selectedGoal, `Similar to ${ticker}`)
      )
      
      const similarAnalyses = await Promise.all(similarPromises)
      
      // Combine all options
      setAiOptions([mainAnalysis, ...similarAnalyses])
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to analyze ticker:', error)
      // Fallback to basic option
      setAiOptions([{
        symbol: ticker,
        name: ticker,
        currentPrice: 100,
        momentum: 'moderate',
        confidence: 75,
        reason: 'Analysis in progress',
        requiredInvestment: {
          aggressive: selectedGoal * 2.5,
          balanced: selectedGoal * 4,
          conservative: selectedGoal * 6
        },
        estimatedTime: {
          aggressive: '2-4 weeks',
          balanced: '1-3 months',
          conservative: '3-6 months'
        }
      }])
      setIsLoading(false)
    }
  }
  
  const handleGoalSelect = (value: number | 'custom') => {
    if (value === 'custom') {
      setSelectedGoal(null)
      setCustomGoal('')
    } else {
      setSelectedGoal(value)
      setCustomGoal('')
    }
    // Reset subsequent selections
    setAiOptions([])
    setSelectedOption(null)
    setSelectedTimeHorizon(null)
  }
  
  const handleCustomGoalSubmit = () => {
    const amount = parseFloat(customGoal)
    if (amount && amount > 0) {
      setSelectedGoal(amount)
    }
  }
  
  const resetState = () => {
    setSelectedGoal(null)
    setCustomGoal('')
    setAiOptions([])
    setSelectedOption(null)
    setSelectedTimeHorizon(null)
    setIsLoading(false)
    setLoadingStep(0)
  }
  
  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])
  
  const handleSubmit = () => {
    if (!selectedOption || !selectedTimeHorizon || !selectedGoal) return
    
    const investment = selectedOption.requiredInvestment[selectedTimeHorizon]
    const quantity = investment / selectedOption.currentPrice
    
    onSubmit?.({
      symbol: selectedOption.symbol,
      goalAmount: selectedGoal,
      timeHorizon: selectedTimeHorizon,
      investmentAmount: investment,
      quantity: quantity,
      costBasis: selectedOption.currentPrice,
      stopLoss: selectedTimeHorizon === 'aggressive' ? -10 : selectedTimeHorizon === 'balanced' ? -15 : -20,
      takeProfit: (selectedGoal / investment) * 100
    })
    
    // Reset state
    resetState()
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className={cn(
      "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300",
      isChatOpen && "pr-[calc(25%+40px)]"
    )}>
      <div className={cn(
        "bg-background border border-border-light rounded-xl h-[90vh] max-h-[900px] mx-4 flex flex-col transition-all duration-300",
        isChatOpen 
          ? "w-[75vw] max-w-4xl" 
          : "w-[90vw] max-w-5xl"
      )}>
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-5 border-b border-border-light flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create New Goal
          </h2>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Step 1: Goal Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Step 1: Select Your Goal Amount</h3>
            <div className="grid grid-cols-4 gap-3">
              {goalAmounts.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleGoalSelect(goal.value as number | 'custom')}
                  className={cn(
                    "py-3 px-4 rounded-lg border text-center font-medium transition-all",
                    (typeof goal.value === 'number' && selectedGoal === goal.value) || (goal.value === 'custom' && customGoal) 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border-light hover:border-border-lighter hover:bg-card-hover"
                  )}
                >
                  {goal.label}
                </button>
              ))}
            </div>
            
            {/* Custom amount input */}
            {customGoal !== '' && (
              <div className="mt-4 flex gap-2">
                <input
                  type="number"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Enter custom amount"
                  className="flex-1 bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  onClick={handleCustomGoalSubmit}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Set Goal
                </button>
              </div>
            )}
          </div>
          
          {/* Step 2: AI Options */}
          {selectedGoal && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Step 2: AI-Recommended Options</h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  {/* Loading animation with ghost content */}
                  <div className="bg-card border border-border-light rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-primary animate-spin" />
                      <span className="text-sm text-muted">{loadingMessages[loadingStep]}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-card-hover rounded w-3/4"></div>
                      <div className="h-4 bg-card-hover rounded w-1/2"></div>
                    </div>
                  </div>
                  {/* Ghost cards */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border-light rounded-lg p-4 opacity-30">
                      <div className="h-6 bg-card-hover rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-card-hover rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {aiOptions.map((option) => (
                    <button
                      key={option.symbol}
                      onClick={() => setSelectedOption(option)}
                      className={cn(
                        "w-full bg-card border rounded-lg p-4 text-left transition-all",
                        selectedOption?.symbol === option.symbol
                          ? "border-primary bg-primary/5"
                          : "border-border-light hover:border-border-lighter hover:bg-card-hover"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-lg font-semibold">{option.symbol}</span>
                          <span className="text-sm text-muted ml-2">{option.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">${option.currentPrice}</div>
                          <div className={cn(
                            "text-xs px-2 py-1 rounded",
                            option.momentum === 'strong' ? "bg-success/10 text-success" :
                            option.momentum === 'moderate' ? "bg-primary/10 text-primary" :
                            "bg-warning/10 text-warning"
                          )}>
                            {option.momentum} momentum
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted mb-2">{option.reason}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-sm">Confidence: {option.confidence}%</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted" />
                      </div>
                    </button>
                  ))}
                  
                  {/* Chat button for custom suggestions */}
                  <button
                    onClick={() => onOpenChat?.({ goalAmount: selectedGoal, currentOptions: aiOptions })}
                    className="w-full bg-card border border-border-light hover:border-primary hover:bg-primary/5 rounded-lg p-4 transition-all flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">Suggest a different stock with Claude</span>
                    <Plus className="w-4 h-4 text-muted" />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Time Horizon */}
          {selectedOption && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Step 3: Choose Your Time Horizon</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['aggressive', 'balanced', 'conservative'] as const).map((horizon) => (
                  <button
                    key={horizon}
                    onClick={() => setSelectedTimeHorizon(horizon)}
                    className={cn(
                      "border rounded-lg p-6 transition-all min-h-[200px]",
                      selectedTimeHorizon === horizon
                        ? "border-primary bg-primary/5"
                        : "border-border-light hover:border-border-lighter hover:bg-card-hover"
                    )}
                  >
                    <div className="text-center h-full flex flex-col">
                      <div className="font-semibold capitalize mb-4">{horizon}</div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="text-sm text-muted mb-1">Invest:</div>
                        <div className="text-2xl font-bold text-primary mb-3">
                          ${selectedOption.requiredInvestment[horizon].toLocaleString()}
                        </div>
                        <div className="text-sm text-muted flex items-center justify-center gap-1 mb-2">
                          <Clock className="w-3 h-3" />
                          {selectedOption.estimatedTime[horizon]}
                        </div>
                        <div className="text-sm text-muted">
                          Stop Loss: {horizon === 'aggressive' ? '10%' : horizon === 'balanced' ? '15%' : '20%'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedTimeHorizon && (
                <div className="mt-4 p-4 bg-card border border-border-light rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted">
                      <p>
                        To achieve your ${selectedGoal} goal, you'll need to invest{' '}
                        <span className="text-white font-semibold">
                          ${selectedOption.requiredInvestment[selectedTimeHorizon].toLocaleString()}
                        </span>{' '}
                        in {selectedOption.symbol}. This represents a{' '}
                        <span className="text-primary font-semibold">
                          {((selectedGoal! / selectedOption.requiredInvestment[selectedTimeHorizon]) * 100).toFixed(1)}%
                        </span>{' '}
                        target return.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          {selectedTimeHorizon && (
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border-light rounded-lg hover:bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Create Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}