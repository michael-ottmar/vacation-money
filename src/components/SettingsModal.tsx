import { X } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center z-[100]">
      <div className="bg-card border border-border-light rounded-xl p-8 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light">
          <h2 className="text-xl font-bold">Strategy Settings</h2>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-[#666] cursor-pointer p-1 hover:text-error transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-muted text-sm">Risk Tolerance</label>
            <select className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md">
              <option>Conservative</option>
              <option selected>Aggressive</option>
              <option>YOLO</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-muted text-sm">Max Single Position Size</label>
            <input 
              type="text" 
              className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
              defaultValue="25%"
            />
          </div>

          <div>
            <label className="block mb-2 text-muted text-sm">Crypto Allocation Limit</label>
            <input 
              type="text" 
              className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
              defaultValue="40%"
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

          <div>
            <label className="block mb-2 text-muted text-sm">Morning Analysis Time</label>
            <input 
              type="time" 
              className="w-full bg-card-hover border border-border-light text-white p-2.5 rounded-md"
              defaultValue="07:00"
            />
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