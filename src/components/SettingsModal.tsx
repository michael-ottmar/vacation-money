import { useState, useEffect } from 'react'
import { X, BellOff, Bell, Clock } from 'lucide-react'
import { DEFAULT_STRATEGY } from '../constants'
import { useApp } from '../context/AppContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useApp()
  const [silenceAlerts, setSilenceAlerts] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState(settings.strategyName)
  const [strategyText, setStrategyText] = useState(settings.generalStrategy)
  const [startingValue, setStartingValue] = useState(settings.startingValue)
  const [goalValue, setGoalValue] = useState(settings.goalValue)
  
  // Update local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStrategy(settings.strategyName)
      setStrategyText(settings.generalStrategy)
      setStartingValue(settings.startingValue)
      setGoalValue(settings.goalValue)
    }
  }, [isOpen, settings])
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border-light rounded-xl p-8 w-[75vw] max-w-4xl h-[85vh] max-h-[900px] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-light">
          <h2 className="text-xl font-bold">Strategy Settings</h2>
          <div className="flex items-center gap-3">
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
              onClick={() => {
                updateSettings({
                  strategyName: selectedStrategy,
                  generalStrategy: strategyText,
                  startingValue,
                  goalValue
                })
                onClose()
              }}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-md text-sm transition-colors"
            >
              Save
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
              <select 
                value={selectedStrategy}
                onChange={(e) => {
                  setSelectedStrategy(e.target.value)
                  if (e.target.value === 'default') {
                    setStrategyText(DEFAULT_STRATEGY)
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
              <input
                type="text"
                placeholder="Strategy name..."
                className="bg-card-hover border border-border-light text-white px-3 py-1 rounded-md text-sm flex-1 max-w-xs"
                defaultValue={selectedStrategy === 'default' ? 'Default Strategy' : ''}
              />
            </div>
            <textarea
              value={strategyText}
              onChange={(e) => setStrategyText(e.target.value)}
              className="w-full bg-card-hover border border-border-light text-white p-3 rounded-md min-h-[200px] text-sm"
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
                  value={startingValue}
                  onChange={(e) => setStartingValue(Number(e.target.value))}
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
                  value={goalValue}
                  onChange={(e) => setGoalValue(Number(e.target.value))}
                  step="10000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>



          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-muted text-sm">Morning Analysis</label>
              <div className="relative">
                <select className="w-full bg-card-hover border border-border-light text-white p-2.5 pr-10 rounded-md appearance-none">
                  <option value="none">None</option>
                  <option value="05:00">5:00 AM</option>
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00" selected>7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-muted text-sm">Afternoon Analysis</label>
              <div className="relative">
                <select className="w-full bg-card-hover border border-border-light text-white p-2.5 pr-10 rounded-md appearance-none">
                  <option value="none">None</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00" selected>2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-muted text-sm">Time Zone</label>
              <select className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md" style={{ height: '42px' }}>
                <option value="ET">Eastern Time</option>
                <option value="CT">Central Time</option>
                <option value="MT">Mountain Time</option>
                <option value="PT">Pacific Time</option>
                <option value="AKT">Alaska Time</option>
                <option value="HT">Hawaii Time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-muted text-sm">Phone Number for Alerts</label>
              <input 
                type="tel" 
                className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block mb-2 text-muted text-sm">Alert Frequency</label>
              <select className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md">
                <option value="1">Max 1 per day</option>
                <option value="5">Max 5 per day</option>
                <option value="10" selected>Max 10 per day</option>
                <option value="15">Max 15 per day</option>
                <option value="20">Max 20 per day</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}