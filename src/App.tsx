import { useState } from 'react'
import { Settings, MessageCircle, Plus, User, RefreshCw } from 'lucide-react'
import { PositionCard } from './components/PositionCard'
import { WatchlistItem } from './components/WatchlistItem'
import { ChatPanel } from './components/ChatPanel'
import { SettingsModal } from './components/SettingsModal'
import { GoalSelectionModal } from './components/GoalSelectionModal'
import { AddToWatchlistModal } from './components/AddToWatchlistModal'
import { ReportSaleModal } from './components/ReportSaleModal'
import { MarketStatus } from './components/MarketStatus'
import { LoadingSpinner } from './components/LoadingSpinner'
import { cn } from './lib/utils'
import { useApp } from './context/AppContext'
import type { Position } from './types'

function App() {
  const { 
    user, 
    positions, 
    closedPositions, 
    aiRecommendations, 
    userWatchlist, 
    upcomingIPOs,
    portfolioStats,
    settings,
    marketDataLoading,
    lastMarketUpdate,
    refreshMarketData,
    reportSale,
    addToWatchlist,
    removeFromWatchlist,
    addPosition
  } = useApp()
  
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showAddPosition, setShowAddPosition] = useState(false)
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false)
  const [selectedPositionForSale, setSelectedPositionForSale] = useState<Position | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [chatContext, setChatContext] = useState<any>(null)
  const [preselectedTicker, setPreselectedTicker] = useState<string | undefined>()
  
  // Use realized gains from portfolioStats which is calculated from closed positions
  const realizedGains = portfolioStats.realizedGains
  
  // Calculate progress percentages
  const progressPercent = Math.max(0, (realizedGains / portfolioStats.goalValue) * 100).toFixed(0)
  const afterTaxGains = realizedGains - portfolioStats.taxImpact
  const afterTaxPercent = Math.max(0, (afterTaxGains / portfolioStats.goalValue) * 100).toFixed(0)


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-background z-40 border-b border-border-light">
        <div className="max-w-[1400px] mx-auto p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{settings.portfolioName || 'Portfolio Tracker'}</h1>
            <MarketStatus 
              isLive={!marketDataLoading}
              lastUpdated={lastMarketUpdate}
              className="text-xs"
            />
          </div>
          
          {/* Progress Bar */}
          <div className="flex-1 mx-8 max-w-2xl">
            <div className="bg-card-hover h-8 rounded-full overflow-hidden relative">
              {/* Tax adjusted progress (darker) */}
              <div 
                className="absolute top-0 left-0 bg-gray-700 h-full transition-all duration-500"
                style={{ width: `${afterTaxPercent}%` }}
              />
              {/* Actual progress */}
              <div 
                className="absolute top-0 left-0 bg-gradient-to-r from-primary to-green-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Unrealized goal bricks */}
              {positions.map((position, index) => {
                const goalPercent = ((position.goalAmount || 0) / portfolioStats.goalValue) * 100
                const previousGoalsTotal = positions.slice(0, index).reduce((sum, p) => sum + ((p.goalAmount || 0) / portfolioStats.goalValue) * 100, 0)
                const startPercent = Number(progressPercent) + previousGoalsTotal
                return (
                  <div
                    key={position.symbol + index}
                    className="absolute top-0 h-full"
                    style={{
                      left: `${startPercent}%`,
                      width: `${goalPercent}%`,
                      backgroundColor: 'rgba(34, 197, 94, 0.1)', // green-500 at 10% opacity
                      borderLeft: '1px solid rgba(156, 163, 175, 0.3)', // gray-400 at 30% opacity
                      borderRight: '1px solid rgba(156, 163, 175, 0.3)'
                    }}
                    title={`${position.symbol}: $${position.goalAmount}`}
                  />
                )
              })}
              {/* Current realized gains on left (show 0 if no gains yet) */}
              <div className="absolute left-3 h-full flex items-center font-bold text-sm z-10">
                ${realizedGains > 0 ? (realizedGains / 1000).toFixed(1) : '0'}K
              </div>
              {/* Goal value on right */}
              <div className="absolute right-3 h-full flex items-center font-bold text-sm z-10">
                ${(portfolioStats.goalValue / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-card-hover border border-border-light text-white px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#262626] hover:border-border-lighter flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button 
              onClick={() => setShowChat(true)}
              className="bg-secondary/10 border border-secondary text-[#a5b4fc] px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-secondary/20 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Claude Assistant
            </button>
            
            {/* User Account Circle */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold hover:bg-primary-hover transition-colors"
              >
                {user?.initials || <User className="w-5 h-5" />}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border-light rounded-lg py-2 w-48 z-10">
                  <div className="px-4 py-2 border-b border-border-light">
                    <div className="font-semibold text-sm">{user?.name || 'Guest'}</div>
                    <div className="text-xs text-muted">{user?.email || 'Not logged in'}</div>
                  </div>
                  <button
                    onClick={() => {
                      console.log('Logout')
                      setShowUserMenu(false)
                      // TODO: Implement logout
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-card-hover transition-colors text-error"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content - add padding to account for fixed header */}
      <div className="max-w-[1400px] mx-auto p-5 pt-[104px]">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Today's Change</div>
            <div className={cn(
              "text-2xl font-bold",
              portfolioStats.todaysChange >= 0 ? "text-success" : "text-error"
            )}>
              {portfolioStats.todaysChange >= 0 ? '+' : ''}
              ${Math.abs(portfolioStats.todaysChange).toLocaleString()}
            </div>
            <div className={cn(
              "text-sm mt-1",
              portfolioStats.todaysChangePercent >= 0 ? "text-success" : "text-error"
            )}>
              {portfolioStats.todaysChangePercent >= 0 ? '+' : ''}
              {portfolioStats.todaysChangePercent.toFixed(2)}%
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Unrealized Gains</div>
            <div className="text-2xl font-bold">${portfolioStats.unrealizedGains.toLocaleString()}</div>
            <div className={cn(
              "text-sm mt-1",
              portfolioStats.unrealizedGainsPercent >= 0 ? "text-success" : "text-error"
            )}>
              {portfolioStats.unrealizedGainsPercent >= 0 ? '+' : ''}
              {portfolioStats.unrealizedGainsPercent.toFixed(1)}%
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Realized Gains</div>
            <div className="text-2xl font-bold">${portfolioStats.realizedGains.toLocaleString()}</div>
            <div className={cn(
              "text-sm mt-1",
              portfolioStats.realizedGainsPercent >= 0 ? "text-success" : "text-error"
            )}>
              {portfolioStats.realizedGainsPercent >= 0 ? '+' : ''}
              {portfolioStats.realizedGainsPercent.toFixed(1)}%
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Tax Impact</div>
            <div className="text-2xl font-bold">-${portfolioStats.taxImpact.toLocaleString()}</div>
            <div className="text-sm text-error mt-1">{(portfolioStats.taxRate * 100).toFixed(0)}% rate</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-4 gap-5">
          {/* Positions Section */}
          <div className="col-span-3 bg-card border border-border rounded-xl p-5">
            {/* Total display for active positions */}
            {activeTab === 'active' && positions.length > 0 && (
              <div className="mb-4 text-right">
                <span className="text-sm text-muted">Total ({positions.length}): </span>
                <span className="text-xl font-bold">
                  ${positions.reduce((sum, pos) => sum + (pos.goalAmount || 500), 0).toLocaleString()}
                </span>
              </div>
            )}
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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refreshMarketData}
                    disabled={marketDataLoading}
                    className="bg-transparent border border-border-light hover:border-border-lighter text-muted hover:text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                    title="Refresh prices"
                  >
                    {marketDataLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    Refresh
                  </button>
                  <button 
                    onClick={() => setShowAddPosition(true)}
                    className="bg-transparent border border-border-light hover:border-border-lighter text-muted hover:text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Goal
                  </button>
                </div>
              )}
            </div>
            
            {activeTab === 'active' ? (
              <div>
                {positions.map((position) => (
                  <PositionCard 
                    key={position.symbol} 
                    {...position}
                    goalAmount={position.goalAmount || 500}
                    onReportSale={() => setSelectedPositionForSale(position)}
                    onOpenChat={(context) => {
                      console.log('Opening chat with context:', context)
                      setShowChat(true)
                      // TODO: Pass context to ChatPanel
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>
                {closedPositions.length > 0 ? (
                  closedPositions.map((position) => (
                    <div key={position.symbol + position.closedDate} className="mb-3">
                      <PositionCard 
                        {...position} 
                        buttonText="Repeat Trade"
                        buttonIcon="refresh"
                        onReportSale={() => {
                          // Open goal selection modal for repeat trade
                          setShowAddPosition(true)
                        }}
                        onOpenChat={(context) => {
                          console.log('Opening chat with context:', context)
                          setShowChat(true)
                          // TODO: Pass context to ChatPanel
                        }}
                      />
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
              <button 
                onClick={() => setShowAddToWatchlist(true)}
                className="bg-transparent border border-border-light hover:border-border-lighter text-muted hover:text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors"
              >
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
                  onTransfer={() => {
                    setPreselectedTicker(item.symbol)
                    setShowAddPosition(true)
                  }}
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
                onRemove={() => removeFromWatchlist(item.symbol)}
                onTransfer={() => {
                  setShowAddPosition(true)
                }}
              />
            ))}

            <h3 className="text-lg font-bold mt-8 mb-4">Upcoming IPOs</h3>
            {upcomingIPOs.map((item) => (
              <WatchlistItem 
                key={item.symbol} 
                {...item}
                onRemove={() => removeFromWatchlist(item.symbol)}
                onTransfer={() => {
                  setShowAddPosition(true)
                }}
              />
            ))}
          </div>
        </div>
      </div>


      {/* Modals */}
      <ChatPanel 
        isOpen={showChat} 
        onClose={() => {
          setShowChat(false)
          setChatContext(null)
        }}
        context={chatContext}
      />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AddToWatchlistModal 
        isOpen={showAddToWatchlist}
        onClose={() => setShowAddToWatchlist(false)}
        onSubmit={(item) => {
          addToWatchlist(item)
          setShowAddToWatchlist(false)
        }}
      />
      <GoalSelectionModal 
        isOpen={showAddPosition} 
        onClose={() => {
          setShowAddPosition(false)
          setPreselectedTicker(undefined)
        }}
        isChatOpen={showChat}
        preselectedTicker={preselectedTicker}
        onOpenChat={(context) => {
          setChatContext({
            type: 'goal_suggestion',
            goalAmount: context.goalAmount,
            currentOptions: context.currentOptions
          })
          setShowChat(true)
        }}
        onSubmit={(goal) => {
          const position: Position = {
            symbol: goal.symbol,
            price: goal.costBasis,
            change: 0,
            costBasis: goal.costBasis,
            quantity: goal.quantity,
            totalValue: goal.investmentAmount,
            gain: 0,
            gainPercent: 0,
            stopLoss: goal.stopLoss || -15,
            takeProfit: goal.takeProfit || 50,
            goalAmount: goal.goalAmount
          }
          addPosition(position)
          setShowAddPosition(false)
        }}
      />
      {selectedPositionForSale && (
        <ReportSaleModal
          isOpen={!!selectedPositionForSale}
          onClose={() => setSelectedPositionForSale(null)}
          position={{
            symbol: selectedPositionForSale.symbol,
            quantity: selectedPositionForSale.quantity,
            costBasis: selectedPositionForSale.costBasis,
            currentPrice: selectedPositionForSale.price
          }}
          onSubmit={(sale) => {
            reportSale(selectedPositionForSale.symbol, sale.salePrice, sale.quantity)
            setSelectedPositionForSale(null)
          }}
        />
      )}
    </div>
  )
}

export default App