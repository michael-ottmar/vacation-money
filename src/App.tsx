import { useState } from 'react'
import { Settings, MessageCircle, Plus } from 'lucide-react'
import { PositionCard } from './components/PositionCard'
import { WatchlistItem } from './components/WatchlistItem'
import { ChatPanel } from './components/ChatPanel'
import { SettingsModal } from './components/SettingsModal'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  // User configurable values (will come from settings/database later)
  const [currentValue, setCurrentValue] = useState(400000)
  const [goalValue, setGoalValue] = useState(1100000)
  const taxRate = 0.25 // 25% estimated tax rate
  
  // Calculate progress percentages
  const progressPercent = ((currentValue / goalValue) * 100).toFixed(0)
  const taxImpact = currentValue * taxRate
  const afterTaxValue = currentValue - taxImpact
  const afterTaxPercent = ((afterTaxValue / goalValue) * 100).toFixed(0)

  // Mock data for now
  const positions = [
    {
      symbol: 'SOL',
      price: 175.43,
      change: 5.2,
      costBasis: 140.00,
      quantity: 285.7,
      totalValue: 50122,
      gain: 10122,
      gainPercent: 25.3,
      stopLoss: -15,
      takeProfit: 50
    },
    {
      symbol: 'LINK',
      price: 17.82,
      change: -2.1,
      costBasis: 16.50,
      quantity: 3636,
      totalValue: 64793,
      gain: 4793,
      gainPercent: 8.0,
      stopLoss: -20,
      takeProfit: 100
    },
    {
      symbol: 'CCJ',
      price: 52.15,
      change: 3.8,
      costBasis: 48.00,
      quantity: 416,
      totalValue: 21694,
      gain: 1726,
      gainPercent: 8.6,
      stopLoss: -25,
      takeProfit: 150
    }
  ]

  const watchlist = [
    { symbol: 'ONDO', trigger: 'Alert < $0.70 | AI Suggested', isAiSuggested: true },
    { symbol: 'RKLB', trigger: 'Alert on breakout > $8.50', isAiSuggested: false },
    { symbol: 'NXE', trigger: 'Alert < $6.00', isAiSuggested: false },
    { symbol: 'MSTR', trigger: 'BTC leverage play | AI Suggested', isAiSuggested: true },
    { symbol: 'SUI', trigger: 'Volume spike + RSI < 40', isAiSuggested: false }
  ]

  const upcomingIPOs = [
    { symbol: 'Anduril', trigger: 'Defense Tech | Q4 2025?', isAiSuggested: true },
    { symbol: 'Databricks', trigger: 'AI/Data | 2025', isAiSuggested: true }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto p-5">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-5 border-b border-border-light">
          <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          
          {/* Progress Bar */}
          <div className="flex-1 mx-8 max-w-2xl">
            <div className="bg-card-hover h-8 rounded-full overflow-hidden relative">
              {/* Tax adjusted progress (darker) */}
              <div 
                className="absolute top-0 left-0 bg-gray-700 h-full"
                style={{ width: `${afterTaxPercent}%` }}
              />
              {/* Actual progress */}
              <div 
                className="absolute top-0 left-0 bg-gradient-to-r from-primary to-green-500 h-full flex items-center justify-center font-bold text-sm"
                style={{ width: `${progressPercent}%` }}
              >
                ${(currentValue / 1000).toFixed(0)}K / ${(goalValue / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>Current: ${currentValue.toLocaleString()}</span>
              <span>{progressPercent}% to goal</span>
              <span>After tax: {afterTaxPercent}%</span>
              <span>Target: ${goalValue.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => setShowChat(true)}
              className="bg-card-hover border border-border-light text-white px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#262626] hover:border-border-lighter flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Claude Assistant
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-card-hover border border-border-light text-white px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#262626] hover:border-border-lighter flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Today's Change</div>
            <div className="text-2xl font-bold">+$4,238</div>
            <div className="text-sm text-success mt-1">+1.06%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Unrealized Gains</div>
            <div className="text-2xl font-bold">$47,392</div>
            <div className="text-sm text-success mt-1">+11.8%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Tax Impact</div>
            <div className="text-2xl font-bold">-$8,450</div>
            <div className="text-sm text-error mt-1">Short-term</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Next Milestone</div>
            <div className="text-2xl font-bold">$500K</div>
            <div className="text-sm text-muted mt-1">$100K away</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[1fr_300px] gap-8">
          {/* Active Positions */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Active Positions</h2>
              <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add Position
              </button>
            </div>
            
            {positions.map((position) => (
              <PositionCard key={position.symbol} {...position} />
            ))}
          </div>

          {/* Watchlist */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold">Watchlist</h3>
              <button className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            
            {watchlist.map((item) => (
              <WatchlistItem 
                key={item.symbol} 
                {...item}
                onRemove={() => console.log('Remove', item.symbol)}
              />
            ))}

            <h3 className="text-lg font-bold mt-8 mb-4">Upcoming IPOs</h3>
            {upcomingIPOs.map((item) => (
              <WatchlistItem 
                key={item.symbol} 
                {...item}
                onRemove={() => console.log('Remove', item.symbol)}
              />
            ))}
          </div>
        </div>
      </div>


      {/* Modals */}
      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default App