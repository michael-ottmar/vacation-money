import { useMarketData } from '../hooks/useMarketData'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function TestMarketData() {
  const { prices, loading, error, lastUpdated, refresh } = useMarketData(
    ['BTC', 'ETH', 'SOL', 'LINK', 'AAPL', 'TSLA', 'GOOGL'],
    { refreshInterval: 30000 }
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Market Data Test</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={refresh}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg"
        >
          Refresh Prices
        </button>
        {lastUpdated && (
          <span className="text-sm text-muted">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span>Loading market data...</span>
        </div>
      )}

      {error && (
        <div className="text-error mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(prices.entries()).map(([symbol, price]) => (
          <div key={symbol} className="bg-card border border-border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold">{symbol}</h3>
              <span className={price.changePercent >= 0 ? 'text-success' : 'text-error'}>
                {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-2xl font-bold mb-2">
              ${price.price.toFixed(2)}
            </div>
            <div className="text-sm text-muted space-y-1">
              {price.volume && <div>Volume: {price.volume}</div>}
              {price.marketCap && <div>Market Cap: {price.marketCap}</div>}
              {price.high24h && <div>24h High: ${price.high24h.toFixed(2)}</div>}
              {price.low24h && <div>24h Low: ${price.low24h.toFixed(2)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}