import { useState, useEffect, useCallback } from 'react'
import { marketDataService, type MarketPrice } from '../services/marketData'

interface UseMarketDataOptions {
  refreshInterval?: number // in milliseconds
  enabled?: boolean
}

export function useMarketData(
  symbols: string[],
  options: UseMarketDataOptions = {}
) {
  const { refreshInterval = 60000, enabled = true } = options // Default 1 minute refresh
  const [prices, setPrices] = useState<Map<string, MarketPrice>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPrices = useCallback(async () => {
    if (!enabled || symbols.length === 0) return

    try {
      setLoading(true)
      setError(null)
      
      const priceData = await marketDataService.getPrices(symbols)
      setPrices(priceData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      console.error('Error fetching market data:', err)
    } finally {
      setLoading(false)
    }
  }, [symbols.join(','), enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  // Initial fetch
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Set up refresh interval
  useEffect(() => {
    if (!enabled || !refreshInterval) return

    const interval = setInterval(fetchPrices, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchPrices, refreshInterval, enabled])

  const refresh = useCallback(() => {
    fetchPrices()
  }, [fetchPrices])

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refresh
  }
}

// Hook for a single symbol
export function useMarketPrice(
  symbol: string,
  options: UseMarketDataOptions = {}
) {
  const { prices, loading, error, lastUpdated, refresh } = useMarketData(
    symbol ? [symbol] : [],
    options
  )

  return {
    price: prices.get(symbol) || null,
    loading,
    error,
    lastUpdated,
    refresh
  }
}