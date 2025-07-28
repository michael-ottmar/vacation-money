import { useState, useEffect, useCallback, useRef } from 'react'
import { marketDataService, type MarketPrice } from '../services/marketData'

interface UseMarketDataOptions {
  refreshInterval?: number // in milliseconds
  enabled?: boolean
  pauseWhenHidden?: boolean // pause updates when tab is not visible
}

export function useMarketData(
  symbols: string[],
  options: UseMarketDataOptions = {}
) {
  const { refreshInterval = 60000, enabled = true, pauseWhenHidden = true } = options
  const [prices, setPrices] = useState<Map<string, MarketPrice>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isDocumentVisible, setIsDocumentVisible] = useState(!document.hidden)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Handle document visibility changes
  useEffect(() => {
    if (!pauseWhenHidden) return

    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden)
      // Fetch immediately when tab becomes visible
      if (!document.hidden && enabled) {
        fetchPrices()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [pauseWhenHidden, enabled, fetchPrices])

  // Initial fetch
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Set up refresh interval
  useEffect(() => {
    if (!enabled || !refreshInterval) return
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Only set interval if document is visible or pauseWhenHidden is false
    if (!pauseWhenHidden || isDocumentVisible) {
      intervalRef.current = setInterval(fetchPrices, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchPrices, refreshInterval, enabled, pauseWhenHidden, isDocumentVisible])

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