import { Settings } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto p-5">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-5 border-b border-border-light">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
            <p className="text-sm text-muted">Transform $400K → $1.1M</p>
          </div>
          
          {/* Progress Bar */}
          <div className="flex-1 mx-8">
            <div className="bg-card-hover h-10 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-primary to-green-500 h-full flex items-center justify-center font-bold"
                style={{ width: '36%' }}
              >
                $400K / $1.1M
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted">
              <span>Current: $400,000</span>
              <span>36% to goal</span>
              <span>Target: $1,100,000</span>
            </div>
          </div>
          
          <button className="bg-card-hover border border-border-light text-white px-5 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-[#262626] hover:border-border-lighter flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Today's Change</div>
            <div className="text-2xl font-bold">+$4,238</div>
            <div className="text-sm text-success mt-1">+1.06%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Unrealized Gains</div>
            <div className="text-2xl font-bold">$47,392</div>
            <div className="text-sm text-success mt-1">+11.8%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Tax Impact</div>
            <div className="text-2xl font-bold">-$8,450</div>
            <div className="text-sm text-error mt-1">Short-term</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xs text-muted mb-2">Next Milestone</div>
            <div className="text-2xl font-bold">$500K</div>
            <div className="text-sm text-muted mt-1">$100K away</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center py-20">
          <h2 className="text-xl text-muted">Portfolio dashboard coming soon...</h2>
        </div>
      </div>
    </div>
  )
}

export default App