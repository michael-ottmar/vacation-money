export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  settings?: UserSettings
}

export interface UserSettings {
  id: string
  user_id: string
  risk_tolerance: 'conservative' | 'aggressive' | 'yolo'
  max_position_size: number // percentage
  crypto_allocation_limit: number // percentage
  alert_frequency: 'max_3' | 'max_5' | 'unlimited'
  morning_analysis_time: string // HH:MM format
  phone_number?: string
  goal_amount: number
  starting_amount: number
  created_at: string
  updated_at: string
}

export interface Position {
  id: string
  user_id: string
  symbol: string
  asset_type: 'crypto' | 'stock' | 'etf' | 'other'
  quantity: number
  cost_basis: number
  stop_loss?: number // percentage
  take_profit?: number // percentage
  notes?: string
  created_at: string
  updated_at: string
  closed_at?: string
  closed_price?: number
}

export interface WatchlistItem {
  id: string
  user_id: string
  symbol: string
  asset_type: 'crypto' | 'stock' | 'etf' | 'ipo'
  alert_condition?: string
  target_price?: number
  is_ai_suggested: boolean
  ai_reasoning?: string
  created_at: string
  updated_at: string
}

export interface PriceData {
  id: string
  symbol: string
  price: number
  change_24h: number
  change_percent_24h: number
  volume_24h?: number
  market_cap?: number
  last_updated: string
}

export interface Transaction {
  id: string
  user_id: string
  position_id: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  fees?: number
  notes?: string
  created_at: string
}

export interface Alert {
  id: string
  user_id: string
  type: 'price' | 'analysis' | 'news' | 'pattern'
  symbol?: string
  title: string
  message: string
  priority: 'low' | 'medium' | 'high'
  is_read: boolean
  created_at: string
}

export interface AIAnalysis {
  id: string
  user_id: string
  type: 'morning' | 'position' | 'market' | 'chat'
  content: string
  symbols_mentioned: string[]
  recommendations?: {
    symbol: string
    action: 'buy' | 'sell' | 'hold' | 'watch'
    reasoning: string
  }[]
  created_at: string
}