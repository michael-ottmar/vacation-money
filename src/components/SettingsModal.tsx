import { useState } from 'react'
import { X, BellOff, Bell } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [silenceAlerts, setSilenceAlerts] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState('default')
  
  const defaultStrategy = `Swing trade high-momentum assets with a focus on:
• Entry on breakouts with volume confirmation
• Position sizing based on volatility (higher vol = smaller position)
• Take profits in tranches: 25% at +10%, 50% at +25%, let the rest ride
• Stop losses set based on key support levels, typically -15% to -20%
• Focus on sectors with strong narratives (AI, Nuclear, RWA, etc.)
• Hold core positions in market leaders while trading satellites
• Rebalance when any position exceeds 30% of portfolio`
  
  const [strategyText, setStrategyText] = useState(defaultStrategy)
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border-light rounded-xl p-8 w-[75vw] max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light">
          <h2 className="text-xl font-bold">Strategy Settings</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSilenceAlerts(!silenceAlerts)}
              className="flex items-center gap-2 text-sm"
            >
              {silenceAlerts ? 
                <BellOff className="w-4 h-4 text-error" /> : 
                <Bell className="w-4 h-4 text-primary" />
              }
              <span className={silenceAlerts ? "text-error" : "text-muted"}>
                {silenceAlerts ? "Alerts Silenced" : "Alerts Active"}
              </span>
            </button>
            <button 
              onClick={onClose}
              className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {/* Strategy Selection and Text */}
          <div>
            <div className="flex items-center gap-4 mb-3">
              <label className="block text-muted text-sm">General Strategy</label>
              <select 
                value={selectedStrategy}
                onChange={(e) => {
                  setSelectedStrategy(e.target.value)
                  if (e.target.value === 'default') {
                    setStrategyText(defaultStrategy)
                  }
                  // In real app, would load saved strategies here
                }}
                className="bg-card-hover border border-border-light text-white px-3 py-1 rounded-md text-sm"
              >
                <option value="default">Default Strategy</option>
                <option value="conservative">Conservative Growth</option>
                <option value="aggressive">Aggressive Momentum</option>
                <option value="custom1">My Custom Strategy 1</option>
              </select>
            </div>
            <textarea
              value={strategyText}
              onChange={(e) => setStrategyText(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-md min-h-[120px] text-sm"
              placeholder="Describe your trading strategy..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-muted text-sm">Starting Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                <input 
                  type="number" 
                  className="w-full bg-card-hover border border-border-light text-white p-2.5 pl-7 rounded-md"
                  defaultValue="400000"
                  step="1000"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-muted text-sm">Goal Target</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                <input 
                  type="number" 
                  className="w-full bg-card-hover border border-border-light text-white p-2.5 pl-7 rounded-md"
                  defaultValue="1100000"
                  step="10000"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-muted text-sm">Risk Tolerance</label>
            <select className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md">
              <option>Conservative</option>
              <option selected>Aggressive</option>
              <option>YOLO</option>
            </select>
          </div>


          <div>
            <label className="block mb-2 text-muted text-sm">Estimated Tax Rate</label>
            <input 
              type="text" 
              className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
              defaultValue="25%"
            />
          </div>

          <div>
            <label className="block mb-2 text-muted text-sm">Alert Frequency</label>
            <select className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md">
              <option>Max 3 per day</option>
              <option selected>Max 5 per day</option>
              <option>Unlimited</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-muted text-sm">Morning Analysis</label>
              <input 
                type="time" 
                className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
                defaultValue="07:00"
              />
            </div>
            <div>
              <label className="block mb-2 text-muted text-sm">Afternoon Analysis</label>
              <input 
                type="time" 
                className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
                defaultValue="14:00"
              />
            </div>
            <div>
              <label className="block mb-2 text-muted text-sm">Time Zone</label>
              <select className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md">
                <option value="ET">Eastern Time</option>
                <option value="CT">Central Time</option>
                <option value="MT">Mountain Time</option>
                <option value="PT">Pacific Time</option>
                <option value="AKT">Alaska Time</option>
                <option value="HT">Hawaii Time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-muted text-sm">Phone Number for Alerts</label>
            <input 
              type="tel" 
              className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <button className="w-full mt-8 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-md transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  )
}