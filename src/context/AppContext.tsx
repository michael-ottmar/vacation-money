import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Position, ClosedPosition, WatchlistItem, User, StrategySettings, PortfolioStats } from '../types'
import { 
  mockUser, 
  mockPositions, 
  mockClosedPositions, 
  mockAiRecommendations, 
  mockUserWatchlist,
  mockUpcomingIPOs
} from '../data/mockData'
import { DEFAULT_STARTING_VALUE, DEFAULT_GOAL_VALUE, DEFAULT_TAX_RATE, DEFAULT_STRATEGY } from '../constants'
import { useMarketData } from '../hooks/useMarketData'

interface AppContextType {
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Portfolio
  positions: Position[]
  setPositions: (positions: Position[]) => void
  closedPositions: ClosedPosition[]
  setClosedPositions: (positions: ClosedPosition[]) => void
  
  // Watchlist
  aiRecommendations: WatchlistItem[]
  userWatchlist: WatchlistItem[]
  setUserWatchlist: (items: WatchlistItem[]) => void
  upcomingIPOs: WatchlistItem[]
  
  // Settings
  settings: StrategySettings
  updateSettings: (settings: Partial<StrategySettings>) => void
  
  // Portfolio Stats
  portfolioStats: PortfolioStats
  
  // Market Data
  marketDataLoading: boolean
  marketDataError: string | null
  lastMarketUpdate: Date | null
  refreshMarketData: () => void
  
  // Actions
  addPosition: (position: Position) => void
  removePosition: (symbol: string) => void
  reportSale: (symbol: string, salePrice: number, quantity: number) => void
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (symbol: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser)
  const [positions, setPositions] = useState<Position[]>(mockPositions)
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>(mockClosedPositions)
  const [userWatchlist, setUserWatchlist] = useState<WatchlistItem[]>(mockUserWatchlist)
  
  const [settings, setSettings] = useState<StrategySettings>({
    strategyName: 'Default Strategy',
    generalStrategy: DEFAULT_STRATEGY,
    startingValue: DEFAULT_STARTING_VALUE,
    goalValue: DEFAULT_GOAL_VALUE,
    riskTolerance: 'Moderate',
    estimatedTaxRate: DEFAULT_TAX_RATE,
    morningAnalysisTime: '07:00',
    afternoonAnalysisTime: '14:00',
    timezone: 'America/New_York',
    alertsEnabled: true,
    alertFrequency: 10,
    phoneNumber: ''
  })
  
  // Get all unique symbols from positions
  const positionSymbols = positions.map(p => p.symbol)
  
  // Fetch real-time market data
  const { 
    prices: marketPrices, 
    loading: marketDataLoading,
    error: marketDataError,
    lastUpdated: lastMarketUpdate,
    refresh: refreshMarketData
  } = useMarketData(positionSymbols, {
    refreshInterval: 120000, // Refresh every 2 minutes to stay within free tier
    enabled: positionSymbols.length > 0,
    pauseWhenHidden: true // Pause updates when tab is not visible
  })
  
  // Update positions with real-time prices
  const positionsWithLivePrices = positions.map(position => {
    const livePrice = marketPrices.get(position.symbol)
    if (!livePrice) return position
    
    const newTotalValue = livePrice.price * position.quantity
    const newGain = newTotalValue - (position.costBasis * position.quantity)
    const newGainPercent = ((livePrice.price - position.costBasis) / position.costBasis) * 100
    
    return {
      ...position,
      price: livePrice.price,
      change: livePrice.changePercent,
      totalValue: newTotalValue,
      gain: newGain,
      gainPercent: newGainPercent
    }
  })
  
  // Calculate portfolio stats using live prices
  const currentValue = positionsWithLivePrices.reduce((sum, pos) => sum + pos.totalValue, 0)
  
  // Calculate unrealized gains (current value - cost basis of active positions)
  const totalCostBasis = positionsWithLivePrices.reduce((sum, pos) => sum + (pos.costBasis * pos.quantity), 0)
  const unrealizedGains = currentValue - totalCostBasis
  
  // Calculate today's change based on the price change percentage
  const todaysChange = positionsWithLivePrices.reduce((sum, pos) => {
    // Calculate the previous day's value: current value / (1 + change%)
    const previousValue = pos.totalValue / (1 + pos.change / 100)
    return sum + (pos.totalValue - previousValue)
  }, 0)
  
  // Calculate realized gains from closed positions
  const calculatedRealizedGains = closedPositions.reduce((sum, pos) => {
    const gain = (pos.closedPrice - pos.costBasis) * pos.quantity
    return sum + gain
  }, 0)
  
  const portfolioStats: PortfolioStats = {
    currentValue,
    goalValue: settings.goalValue,
    todaysChange,
    todaysChangePercent: currentValue > 0 ? (todaysChange / currentValue) * 100 : 0,
    unrealizedGains,
    unrealizedGainsPercent: totalCostBasis > 0 ? (unrealizedGains / totalCostBasis) * 100 : 0,
    realizedGains: calculatedRealizedGains,
    realizedGainsPercent: settings.startingValue > 0 ? (calculatedRealizedGains / settings.startingValue) * 100 : 0,
    taxImpact: calculatedRealizedGains * settings.estimatedTaxRate,
    taxRate: settings.estimatedTaxRate
  }
  
  const updateSettings = (newSettings: Partial<StrategySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }
  
  const addPosition = (newPosition: Position) => {
    setPositions(prev => [...prev, newPosition])
  }
  
  const removePosition = (symbol: string) => {
    setPositions(prev => prev.filter(p => p.symbol !== symbol))
  }
  
  const reportSale = (symbol: string, salePrice: number, quantity: number) => {
    const position = positions.find(p => p.symbol === symbol)
    if (!position) return
    
    
    
    // Create closed position
    const closedPosition: ClosedPosition = {
      ...position,
      closedDate: new Date().toISOString().split('T')[0],
      closedPrice: salePrice
    }
    
    // Update or remove position
    if (quantity < position.quantity) {
      // Partial sale
      const remainingQuantity = position.quantity - quantity
      const updatedPosition: Position = {
        ...position,
        quantity: remainingQuantity,
        totalValue: remainingQuantity * position.price,
        gain: (position.price - position.costBasis) * remainingQuantity,
        gainPercent: ((position.price - position.costBasis) / position.costBasis) * 100
      }
      setPositions(prev => prev.map(p => p.symbol === symbol ? updatedPosition : p))
    } else {
      // Full sale
      removePosition(symbol)
      setClosedPositions(prev => [...prev, closedPosition])
    }
  }
  
  const addToWatchlist = (item: WatchlistItem) => {
    setUserWatchlist(prev => [...prev, item])
  }
  
  const removeFromWatchlist = (symbol: string) => {
    setUserWatchlist(prev => prev.filter(item => item.symbol !== symbol))
  }
  
  const value: AppContextType = {
    user,
    setUser,
    positions: positionsWithLivePrices,
    setPositions,
    closedPositions,
    setClosedPositions,
    aiRecommendations: mockAiRecommendations,
    userWatchlist,
    setUserWatchlist,
    upcomingIPOs: mockUpcomingIPOs,
    settings,
    updateSettings,
    portfolioStats,
    marketDataLoading,
    marketDataError,
    lastMarketUpdate,
    refreshMarketData,
    addPosition,
    removePosition,
    reportSale,
    addToWatchlist,
    removeFromWatchlist
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}