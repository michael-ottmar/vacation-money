import { useState, useEffect } from 'react'
import { X, BellOff, Bell, Clock, Target, Zap, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useApp()
  const [silenceAlerts, setSilenceAlerts] = useState(!settings.alertsEnabled)
  const [portfolioName, setPortfolioName] = useState('Portfolio Tracker')
  const [goalValue, setGoalValue] = useState(settings.goalValue)
  const [goalContext, setGoalContext] = useState('')
  const [pacePreference, setPacePreference] = useState<'fast' | 'steady' | 'patient'>('steady')
  const [openInstructions, setOpenInstructions] = useState('')
  const [morningTime, setMorningTime] = useState(settings.morningAnalysisTime || '07:00')
  const [afternoonTime, setAfternoonTime] = useState(settings.afternoonAnalysisTime || '14:00')
  const [timezone, setTimezone] = useState(settings.timezone)
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber)
  const [alertFrequency, setAlertFrequency] = useState(settings.alertFrequency)
  const [taxRate, setTaxRate] = useState(settings.estimatedTaxRate * 100)
  
  // Update local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPortfolioName(settings.portfolioName || 'Portfolio Tracker')
      setGoalValue(settings.goalValue)
      setGoalContext(settings.goalContext || '')
      setPacePreference(settings.pacePreference || 'steady')
      setOpenInstructions(settings.openInstructions || '')
      setSilenceAlerts(!settings.alertsEnabled)
      setTaxRate(settings.estimatedTaxRate * 100)
      setMorningTime(settings.morningAnalysisTime || '07:00')
      setAfternoonTime(settings.afternoonAnalysisTime || '14:00')
      setTimezone(settings.timezone)
      setPhoneNumber(settings.phoneNumber)
      setAlertFrequency(settings.alertFrequency)
    }
  }, [isOpen, settings])
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border-light rounded-xl w-[75vw] max-w-4xl h-[85vh] max-h-[900px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-bold">Settings</h2>
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
                  portfolioName,
                  goalValue,
                  goalContext,
                  pacePreference,
                  openInstructions,
                  alertsEnabled: !silenceAlerts,
                  estimatedTaxRate: taxRate / 100,
                  morningAnalysisTime: morningTime === 'none' ? null : morningTime,
                  afternoonAnalysisTime: afternoonTime === 'none' ? null : afternoonTime,
                  timezone,
                  phoneNumber,
                  alertFrequency
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

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* 1. Portfolio Identity */}
            <div className="bg-card border border-border-light rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Portfolio Identity</h3>
              </div>
              <div>
                <label className="block mb-2 text-sm text-muted">Portfolio Name</label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My Investment Goals"
                  className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-muted mt-1">This name will appear in the main header</p>
              </div>
            </div>

            {/* 2. Goal Configuration */}
            <div className="bg-card border border-border-light rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Goal Configuration</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm text-muted">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                    <input
                      type="number"
                      value={goalValue}
                      onChange={(e) => setGoalValue(Number(e.target.value))}
                      className="w-full bg-card-hover border border-border-light text-white p-3 pl-8 rounded-lg text-sm focus:outline-none focus:border-primary"
                      step="10000"
                    />
                  </div>
                  <p className="text-xs text-muted mt-1">Your target for the progress bar</p>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-muted">Goal Context (Optional)</label>
                  <textarea
                    value={goalContext}
                    onChange={(e) => setGoalContext(e.target.value)}
                    placeholder="Any timeline or context for your goal? (e.g., 'Hoping to reach this within the year')"
                    className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* 3. Trading Preferences */}
            <div className="bg-card border border-border-light rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Trading Preferences</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-3 text-sm text-muted">Pace Preference</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-card-hover rounded-lg cursor-pointer hover:bg-card transition-colors">
                      <input
                        type="radio"
                        name="pace"
                        value="fast"
                        checked={pacePreference === 'fast'}
                        onChange={() => setPacePreference('fast')}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">Fast Track</div>
                        <div className="text-xs text-muted">Comfortable with shorter holds (days/weeks)</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-card-hover rounded-lg cursor-pointer hover:bg-card transition-colors">
                      <input
                        type="radio"
                        name="pace"
                        value="steady"
                        checked={pacePreference === 'steady'}
                        onChange={() => setPacePreference('steady')}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">Steady Progress</div>
                        <div className="text-xs text-muted">Prefer medium-term plays (weeks/months)</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-card-hover rounded-lg cursor-pointer hover:bg-card transition-colors">
                      <input
                        type="radio"
                        name="pace"
                        value="patient"
                        checked={pacePreference === 'patient'}
                        onChange={() => setPacePreference('patient')}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">Patient Builder</div>
                        <div className="text-xs text-muted">Happy with longer positions (months+)</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-muted">Open Instructions</label>
                  <textarea
                    value={openInstructions}
                    onChange={(e) => setOpenInstructions(e.target.value)}
                    placeholder="Additional preferences or context for AI recommendations..."
                    className="w-full bg-card-hover border border-border-light text-white p-3 rounded-lg text-sm placeholder:text-muted focus:outline-none focus:border-primary resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>


            {/* 4. Notifications & Analysis */}
            <div className="bg-card border border-border-light rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Notifications & Analysis</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-muted">Morning Analysis</label>
                    <div className="relative">
                      <select 
                        value={morningTime}
                        onChange={(e) => setMorningTime(e.target.value)}
                        className="w-full bg-card-hover border border-border-light text-white p-2.5 pr-10 rounded-md appearance-none"
                      >
                        <option value="none">None</option>
                        <option value="05:00">5:00 AM</option>
                        <option value="06:00">6:00 AM</option>
                        <option value="07:00">7:00 AM</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                      </select>
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-muted">Afternoon Analysis</label>
                    <div className="relative">
                      <select 
                        value={afternoonTime}
                        onChange={(e) => setAfternoonTime(e.target.value)}
                        className="w-full bg-card-hover border border-border-light text-white p-2.5 pr-10 rounded-md appearance-none"
                      >
                        <option value="none">None</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-muted">Time Zone</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
                    >
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
                    <label className="block mb-2 text-sm text-muted">Phone Number</label>
                    <input 
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-muted">Alert Frequency</label>
                    <select 
                      value={alertFrequency}
                      onChange={(e) => setAlertFrequency(Number(e.target.value))}
                      className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
                    >
                      <option value="1">Max 1 per day</option>
                      <option value="5">Max 5 per day</option>
                      <option value="10">Max 10 per day</option>
                      <option value="15">Max 15 per day</option>
                      <option value="20">Max 20 per day</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-card/50 border border-border-light/50 rounded-lg p-5">
              <h4 className="text-sm font-medium text-muted mb-3">Advanced</h4>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted">Tax Rate:</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-20 bg-card-hover border border-border-light text-white px-2 py-1 rounded text-sm"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-muted">%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}