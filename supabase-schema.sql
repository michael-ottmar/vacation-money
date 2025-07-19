-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'aggressive', 'yolo')) DEFAULT 'aggressive',
  max_position_size DECIMAL(5,2) DEFAULT 25.00,
  crypto_allocation_limit DECIMAL(5,2) DEFAULT 40.00,
  alert_frequency TEXT CHECK (alert_frequency IN ('max_3', 'max_5', 'unlimited')) DEFAULT 'max_5',
  morning_analysis_time TIME DEFAULT '07:00:00',
  phone_number TEXT,
  goal_amount DECIMAL(12,2) DEFAULT 1100000.00,
  starting_amount DECIMAL(12,2) DEFAULT 400000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions table
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('crypto', 'stock', 'etf', 'other')) NOT NULL,
  quantity DECIMAL(16,8) NOT NULL,
  cost_basis DECIMAL(12,2) NOT NULL,
  stop_loss DECIMAL(5,2),
  take_profit DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  closed_price DECIMAL(12,2),
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_cost_basis CHECK (cost_basis > 0)
);

-- Watchlist table
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('crypto', 'stock', 'etf', 'ipo')) NOT NULL,
  alert_condition TEXT,
  target_price DECIMAL(12,2),
  is_ai_suggested BOOLEAN DEFAULT FALSE,
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Price data table (cached from APIs)
CREATE TABLE price_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT UNIQUE NOT NULL,
  price DECIMAL(12,6) NOT NULL,
  change_24h DECIMAL(12,2),
  change_percent_24h DECIMAL(8,2),
  volume_24h DECIMAL(16,2),
  market_cap DECIMAL(16,2),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('buy', 'sell')) NOT NULL,
  quantity DECIMAL(16,8) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  fees DECIMAL(8,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_price CHECK (price > 0)
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('price', 'analysis', 'news', 'pattern')) NOT NULL,
  symbol TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis table
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('morning', 'position', 'market', 'chat')) NOT NULL,
  content TEXT NOT NULL,
  symbols_mentioned TEXT[] DEFAULT '{}',
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_positions_user_id ON positions(user_id);
CREATE INDEX idx_positions_symbol ON positions(symbol);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_price_data_symbol ON price_data(symbol);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at DESC);

-- Row Level Security policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own positions" ON positions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own watchlist" ON watchlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own analyses" ON ai_analyses FOR ALL USING (auth.uid() = user_id);

-- Public read access for price data
CREATE POLICY "Anyone can view price data" ON price_data FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_watchlist_updated_at BEFORE UPDATE ON watchlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();