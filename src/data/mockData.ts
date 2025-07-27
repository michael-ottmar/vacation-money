import type { Position, ClosedPosition, WatchlistItem, User, AnalystTargets, MarketMetrics } from '../types'

// Mock user data
export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  initials: 'JD'
}

// Mock positions
export const mockPositions: Position[] = [
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

// Mock closed positions
export const mockClosedPositions: ClosedPosition[] = [
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

// AI Recommendations
export const mockAiRecommendations: WatchlistItem[] = [
  { 
    symbol: 'ONDO', 
    trigger: 'Breaking out of consolidation pattern. RWA narrative gaining traction with institutional adoption. Entry below $0.70 offers favorable risk/reward with targets at $1.20.',
    isAiSuggested: true
  },
  { 
    symbol: 'MSTR', 
    trigger: 'Bitcoin leverage play trading at discount to NAV. Strong accumulation pattern forming. Consider entry on any pullback to $340 support level.',
    isAiSuggested: true
  },
  { 
    symbol: 'NXE', 
    trigger: 'Nuclear sector momentum building on AI data center demand. Chart showing cup & handle formation. Accumulate under $6 for potential breakout to $8+.',
    isAiSuggested: true
  }
]

// User's personal watchlist
export const mockUserWatchlist: WatchlistItem[] = [
  { 
    symbol: 'RKLB', 
    trigger: 'Space sector leader. Wait for breakout above $8.50 resistance with volume confirmation.' 
  },
  { 
    symbol: 'SUI', 
    trigger: 'L1 competitor showing strength. Volume spike + RSI < 40 would signal oversold bounce opportunity.' 
  },
  { 
    symbol: 'PLTR', 
    trigger: 'AI defense play. Watching for pullback to 50-day MA around $42 for entry.' 
  }
]

// Upcoming IPOs
export const mockUpcomingIPOs: WatchlistItem[] = [
  { 
    symbol: 'Anduril', 
    trigger: 'Defense tech unicorn valued at $8.5B. Palmer Luckey\'s military drone company expected Q4 2025. Watch for S-1 filing.',
    isIPO: true
  },
  { 
    symbol: 'Databricks', 
    trigger: 'AI/ML platform leader. Last valued at $43B. Strong revenue growth could support $60B+ IPO valuation in 2025.',
    isIPO: true
  }
]

// Mock analyst targets
export const mockAnalystTargets: AnalystTargets = {
  low: 150,
  average: 185,
  high: 220,
  aiRecommended: 195
}

// Mock market metrics
export const mockMarketMetrics: MarketMetrics = {
  rsi: 42,
  volume24h: '1.2B',
  marketCap: '72.5B',
  peRatio: 'N/A',
  dominance: '2.4%'
}

// Mock realized gains
export const mockRealizedGains = 12500