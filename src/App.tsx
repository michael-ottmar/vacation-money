import { useState } from 'react'
import { Settings, MessageCircle, Plus } from 'lucide-react'
import { PositionCard } from './components/PositionCard'
import { WatchlistItem } from './components/WatchlistItem'
import { ChatPanel } from './components/ChatPanel'
import { SettingsModal } from './components/SettingsModal'
import { cn } from './lib/utils'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  
  // User configurable values (will come from settings/database later)
  const currentValue = 400000 // TODO: Make this dynamic from settings
  const goalValue = 1100000 // TODO: Make this dynamic from settings
  const taxRate = 0.25 // 25% estimated tax rate
  const realizedGains = 12500 // Placeholder for realized gains
  
  // Calculate total value including realized gains
  const totalValue = currentValue + realizedGains
  
  // Calculate progress percentages
  const progressPercent = ((totalValue / goalValue) * 100).toFixed(0)
  const taxImpact = totalValue * taxRate
  const afterTaxValue = totalValue - taxImpact
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

  // Always show 3 AI recommendations at the top
  const aiRecommendations = [
    { symbol: 'ONDO', trigger: 'Breaking out of consolidation pattern. RWA narrative gaining traction with institutional adoption. Entry below $0.70 offers favorable risk/reward with targets at $1.20.' },
    { symbol: 'MSTR', trigger: 'Bitcoin leverage play trading at discount to NAV. Strong accumulation pattern forming. Consider entry on any pullback to $340 support level.' },
    { symbol: 'NXE', trigger: 'Nuclear sector momentum building on AI data center demand. Chart showing cup & handle formation. Accumulate under $6 for potential breakout to $8+.' }
  ]
  
  // User's personal watchlist
  const userWatchlist = [
    { symbol: 'RKLB', trigger: 'Space sector leader. Wait for breakout above $8.50 resistance with volume confirmation.' },
    { symbol: 'SUI', trigger: 'L1 competitor showing strength. Volume spike + RSI < 40 would signal oversold bounce opportunity.' },
    { symbol: 'PLTR', trigger: 'AI defense play. Watching for pullback to 50-day MA around $42 for entry.' }
  ]

  const upcomingIPOs = [
    { symbol: 'Anduril', trigger: 'Defense tech unicorn valued at $8.5B. Palmer Luckey\'s military drone company expected Q4 2025. Watch for S-1 filing.' },
    { symbol: 'Databricks', trigger: 'AI/ML platform leader. Last valued at $43B. Strong revenue growth could support $60B+ IPO valuation in 2025.' }
  ]
  
  // Mock closed positions for history tab
  const closedPositions = [
    {
      symbol: 'BTC',
      price: 65000,
      change: 0,
      costBasis: 42000,
      quantity: 0.5,
      totalValue: 32500,
      gain: 11500,
      gainPercent: 54.8,
      stopLoss: -20,
      takeProfit: 50,
      closedDate: '2024-03-15',
      closedPrice: 65000
    },
    {
      symbol: 'TSLA',
      price: 180,
      change: 0,
      costBasis: 220,
      quantity: 50,
      totalValue: 9000,
      gain: -2000,
      gainPercent: -18.2,
      stopLoss: -15,
      takeProfit: 30,
      closedDate: '2024-02-28',
      closedPrice: 180
    }
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
                className="absolute top-0 left-0 bg-gradient-to-r from-primary to-green-500 h-full"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Current value on left */}
              <div className="absolute left-3 h-full flex items-center font-bold text-sm">
                ${(totalValue / 1000).toFixed(0)}K
              </div>
              {/* Goal value on right */}
              <div className="absolute right-3 h-full flex items-center font-bold text-sm">
                ${(goalValue / 1000).toFixed(0)}K
              </div>
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
            <div className="text-xs text-muted mb-2">Realized Gains</div>
            <div className="text-2xl font-bold">$12,500</div>
            <div className="text-sm text-success mt-1">+3.1%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Tax Impact</div>
            <div className="text-2xl font-bold">-$103,125</div>
            <div className="text-sm text-error mt-1">25% rate</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-4 gap-5">
          {/* Positions Section */}
          <div className="col-span-3 bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-5">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('active')}
                  className={cn(
                    "text-lg font-bold pb-2 border-b-2 transition-colors",
                    activeTab === 'active' 
                      ? "border-primary text-white" 
                      : "border-transparent text-muted hover:text-white"
                  )}
                >
                  Active Positions
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    "text-lg font-bold pb-2 border-b-2 transition-colors",
                    activeTab === 'history' 
                      ? "border-primary text-white" 
                      : "border-transparent text-muted hover:text-white"
                  )}
                >
                  History
                </button>
              </div>
              {activeTab === 'active' && (
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Position
                </button>
              )}
            </div>
            
            {activeTab === 'active' ? (
              <div>
                {positions.map((position) => (
                  <PositionCard key={position.symbol} {...position} />
                ))}
              </div>
            ) : (
              <div>
                {closedPositions.length > 0 ? (
                  closedPositions.map((position) => (
                    <div key={position.symbol + position.closedDate} className="mb-3">
                      <PositionCard {...position} />
                      <div className="text-xs text-muted mt-1 px-4">
                        Closed on {position.closedDate} at ${position.closedPrice.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted">
                    No closed positions yet
                  </div>
                )}
              </div>
            )}
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
            
            {/* AI Recommendations */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-muted mb-2">AI Recommendations</h4>
              {aiRecommendations.map((item) => (
                <WatchlistItem 
                  key={item.symbol} 
                  {...item}
                  isAiSuggested={true}
                  onTransfer={() => console.log('Transfer to positions:', item.symbol)}
                />
              ))}
            </div>
            
            {/* Divider */}
            <div className="border-t border-border mb-4" />
            
            {/* User Watchlist */}
            {userWatchlist.map((item) => (
              <WatchlistItem 
                key={item.symbol} 
                {...item}
                onRemove={() => console.log('Remove', item.symbol)}
                onTransfer={() => console.log('Transfer to positions:', item.symbol)}
              />
            ))}

            <h3 className="text-lg font-bold mt-8 mb-4">Upcoming IPOs</h3>
            {upcomingIPOs.map((item) => (
              <WatchlistItem 
                key={item.symbol} 
                {...item}
                onRemove={() => console.log('Remove', item.symbol)}
                onTransfer={() => console.log('Transfer to positions:', item.symbol)}
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