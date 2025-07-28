// Market data service for fetching prices from various APIs
import { RateLimiter } from '../utils/rateLimiter'

// CoinGecko API (free tier, no API key required)
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Yahoo Finance API via RapidAPI (requires API key)
const YAHOO_FINANCE_BASE_URL = 'https://yahoo-finance-api.vercel.app'

// Alpha Vantage API (free tier available)
// const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

// Finnhub API (free tier available)
// const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

export interface MarketPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume?: string
  marketCap?: string
  high24h?: number
  low24h?: number
  lastUpdated: Date
}

export interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  high_24h: number
  low_24h: number
}

export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  dayHigh?: number
  dayLow?: number
}

// Map common crypto symbols to CoinGecko IDs
const CRYPTO_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  LINK: 'chainlink',
  ONDO: 'ondo-finance',
  SUI: 'sui',
  // Add more mappings as needed
}

export class MarketDataService {
  private cache: Map<string, { data: MarketPrice; timestamp: number }> = new Map()
  private cacheTimeout = 120000 // 2 minute cache to reduce API calls
  private rateLimiter = new RateLimiter(5, 60000) // 5 requests per minute to stay well within limits

  // Get price for a single symbol (auto-detects crypto vs stock)
  async getPrice(symbol: string): Promise<MarketPrice | null> {
    // Check cache first
    const cached = this.cache.get(symbol)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    // Try crypto first if it's in our mapping
    if (CRYPTO_ID_MAP[symbol.toUpperCase()]) {
      const cryptoPrice = await this.getCryptoPrice(symbol)
      if (cryptoPrice) return cryptoPrice
    }

    // Otherwise try stock
    return this.getStockPrice(symbol)
  }

  // Get multiple prices at once
  async getPrices(symbols: string[]): Promise<Map<string, MarketPrice>> {
    const results = new Map<string, MarketPrice>()
    
    // Separate crypto and stock symbols
    const cryptoSymbols = symbols.filter(s => CRYPTO_ID_MAP[s.toUpperCase()])
    const stockSymbols = symbols.filter(s => !CRYPTO_ID_MAP[s.toUpperCase()])

    // Fetch in parallel
    const [cryptoPrices, stockPrices] = await Promise.all([
      this.getCryptoPrices(cryptoSymbols),
      this.getStockPrices(stockSymbols)
    ])

    // Combine results
    cryptoPrices.forEach((price, symbol) => results.set(symbol, price))
    stockPrices.forEach((price, symbol) => results.set(symbol, price))

    return results
  }

  // Fetch crypto price from CoinGecko
  private async getCryptoPrice(symbol: string): Promise<MarketPrice | null> {
    try {
      const geckoId = CRYPTO_ID_MAP[symbol.toUpperCase()]
      if (!geckoId) return null

      // Check rate limit
      if (!this.rateLimiter.canMakeRequest()) {
        console.warn('Rate limit exceeded, using cached data')
        return null
      }

      const response = await fetch(
        `${COINGECKO_BASE_URL}/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      )
      
      if (!response.ok) return null
      
      const data = await response.json()
      const priceData = data[geckoId]
      
      if (!priceData) return null

      const marketPrice: MarketPrice = {
        symbol: symbol.toUpperCase(),
        price: priceData.usd,
        change: priceData.usd_24h_change || 0,
        changePercent: priceData.usd_24h_change || 0,
        volume: priceData.usd_24h_vol?.toLocaleString(),
        marketCap: priceData.usd_market_cap?.toLocaleString(),
        lastUpdated: new Date()
      }

      // Cache the result
      this.cache.set(symbol, { data: marketPrice, timestamp: Date.now() })
      
      return marketPrice
    } catch (error) {
      console.error(`Error fetching crypto price for ${symbol}:`, error)
      return null
    }
  }

  // Fetch multiple crypto prices at once
  private async getCryptoPrices(symbols: string[]): Promise<Map<string, MarketPrice>> {
    const results = new Map<string, MarketPrice>()
    if (symbols.length === 0) return results

    try {
      // Check rate limit
      if (!this.rateLimiter.canMakeRequest()) {
        console.warn('Rate limit exceeded, using cached data')
        return results
      }

      const geckoIds = symbols
        .map(s => CRYPTO_ID_MAP[s.toUpperCase()])
        .filter(Boolean)
        .join(',')

      const response = await fetch(
        `${COINGECKO_BASE_URL}/simple/price?ids=${geckoIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      )
      
      if (!response.ok) return results
      
      const data = await response.json()
      
      symbols.forEach(symbol => {
        const geckoId = CRYPTO_ID_MAP[symbol.toUpperCase()]
        if (!geckoId || !data[geckoId]) return
        
        const priceData = data[geckoId]
        const marketPrice: MarketPrice = {
          symbol: symbol.toUpperCase(),
          price: priceData.usd,
          change: priceData.usd_24h_change || 0,
          changePercent: priceData.usd_24h_change || 0,
          volume: priceData.usd_24h_vol?.toLocaleString(),
          marketCap: priceData.usd_market_cap?.toLocaleString(),
          lastUpdated: new Date()
        }
        
        results.set(symbol, marketPrice)
        this.cache.set(symbol, { data: marketPrice, timestamp: Date.now() })
      })
    } catch (error) {
      console.error('Error fetching crypto prices:', error)
    }

    return results
  }

  // Fetch stock price (using free Yahoo Finance API)
  private async getStockPrice(symbol: string): Promise<MarketPrice | null> {
    try {
      // Using a free Yahoo Finance API proxy
      const response = await fetch(`${YAHOO_FINANCE_BASE_URL}/${symbol}`)
      
      if (!response.ok) return null
      
      const data = await response.json()
      
      const marketPrice: MarketPrice = {
        symbol: symbol.toUpperCase(),
        price: data.price || 0,
        change: data.change || 0,
        changePercent: data.changePercent || 0,
        volume: data.volume?.toLocaleString(),
        marketCap: data.marketCap?.toLocaleString(),
        high24h: data.dayHigh,
        low24h: data.dayLow,
        lastUpdated: new Date()
      }

      // Cache the result
      this.cache.set(symbol, { data: marketPrice, timestamp: Date.now() })
      
      return marketPrice
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error)
      return null
    }
  }

  // Fetch multiple stock prices
  private async getStockPrices(symbols: string[]): Promise<Map<string, MarketPrice>> {
    const results = new Map<string, MarketPrice>()
    
    // Fetch in parallel with rate limiting
    const promises = symbols.map(symbol => 
      this.getStockPrice(symbol)
        .then(price => price && results.set(symbol, price))
        .catch(err => console.error(`Error fetching ${symbol}:`, err))
    )
    
    await Promise.all(promises)
    
    return results
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService()