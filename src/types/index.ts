// User and Authentication
export interface User {
  id: string
  email: string
  name: string
  initials?: string
}

// Position Types
export interface Position {
  symbol: string
  price: number
  change: number
  costBasis: number
  quantity: number
  totalValue: number
  gain: number
  gainPercent: number
  stopLoss: number
  takeProfit: number
  goalAmount?: number  // The goal amount for this position ($100, $200, $500, etc.)
}

export interface ClosedPosition extends Position {
  closedDate: string
  closedPrice: number
}

// Watchlist Types
export interface WatchlistItem {
  symbol: string
  trigger: string
  isAiSuggested?: boolean
  isIPO?: boolean
}

// Market Data Types
export interface AnalystTargets {
  low: number
  average: number
  high: number
  aiRecommended: number
}

export interface MarketMetrics {
  rsi: number
  volume24h: string
  marketCap: string
  peRatio?: string
  dominance?: string
}

// Strategy Settings
export interface StrategySettings {
  strategyName: string
  generalStrategy: string
  startingValue: number
  goalValue: number
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive'
  estimatedTaxRate: number
  morningAnalysisTime: string | null
  afternoonAnalysisTime: string | null
  timezone: string
  alertsEnabled: boolean
  alertFrequency: number
  phoneNumber: string
}

// Transaction Types
export interface NewPosition {
  symbol: string
  quantity: number
  costBasis: number
  targetGain: number
  notes?: string
}

export interface SaleReport {
  symbol: string
  quantity: number
  salePrice: number
  notes?: string
}

// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatContext {
  symbol: string
  metrics: MarketMetrics
}

// Portfolio Stats
export interface PortfolioStats {
  currentValue: number
  goalValue: number
  todaysChange: number
  todaysChangePercent: number
  unrealizedGains: number
  unrealizedGainsPercent: number
  realizedGains: number
  realizedGainsPercent: number
  taxImpact: number
  taxRate: number
}