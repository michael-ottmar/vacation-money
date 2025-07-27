import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Position, ClosedPosition, WatchlistItem, User, StrategySettings, PortfolioStats } from '../types'
import { 
  mockUser, 
  mockPositions, 
  mockClosedPositions, 
  mockAiRecommendations, 
  mockUserWatchlist,
  mockUpcomingIPOs,
  mockRealizedGains
} from '../data/mockData'
import { DEFAULT_STARTING_VALUE, DEFAULT_GOAL_VALUE, DEFAULT_TAX_RATE, DEFAULT_STRATEGY } from '../constants'

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
  const [realizedGains, setRealizedGains] = useState<number>(mockRealizedGains)
  
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
  
  // Calculate portfolio stats
  const currentValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0)
  const totalValue = currentValue + mockRealizedGains
  const unrealizedGains = positions.reduce((sum, pos) => sum + pos.gain, 0)
  const todaysChange = positions.reduce((sum, pos) => sum + (pos.totalValue * (pos.change / 100)), 0)
  
  const portfolioStats: PortfolioStats = {
    currentValue,
    goalValue: settings.goalValue,
    todaysChange,
    todaysChangePercent: (todaysChange / currentValue) * 100,
    unrealizedGains,
    unrealizedGainsPercent: (unrealizedGains / currentValue) * 100,
    realizedGains: realizedGains,
    realizedGainsPercent: (realizedGains / settings.startingValue) * 100,
    taxImpact: totalValue * settings.estimatedTaxRate,
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
    
    // Calculate profit/loss for this sale
    const costBasisForSale = position.costBasis * quantity
    const saleProceeds = salePrice * quantity
    const profitLoss = saleProceeds - costBasisForSale
    
    // Update realized gains
    setRealizedGains(prev => prev + profitLoss)
    
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
    positions,
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