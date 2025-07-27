// UI Constants
export const MODAL_WIDTH = '75vw'
export const MODAL_BACKDROP_OPACITY = 0.85

// Portfolio Constants
export const DEFAULT_STARTING_VALUE = 400000
export const DEFAULT_GOAL_VALUE = 1100000
export const DEFAULT_TAX_RATE = 0.25

// Strategy Constants
export const DEFAULT_STRATEGY = `My approach focuses on swing trading high-conviction positions in emerging tech and crypto assets. I look for asymmetric risk/reward setups with 3-5x potential over 6-18 months. Core positions in crypto infrastructure (SOL, LINK), uranium/nuclear plays (CCJ, NXE), and disruptive tech (RKLB, PLTR). I size positions based on conviction level and use wider stops on volatile assets. I target 5-10% gains on swing trades, exiting the full position when the target is reached to capture consistent profits.`

export const RISK_TOLERANCE_OPTIONS = ['Conservative', 'Moderate', 'Aggressive'] as const
export const ALERT_FREQUENCY_OPTIONS = [1, 5, 10, 15, 20] as const
export const DEFAULT_ALERT_FREQUENCY = 10

// Time Zone Options
export const US_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Phoenix', label: 'Mountain Time - Arizona (MST)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
]

// Chart Colors
export const CHART_COLORS = {
  success: 'rgb(34, 197, 94)',
  error: 'rgb(239, 68, 68)',
  primary: 'rgb(99, 102, 241)',
  secondary: 'rgb(165, 180, 252)',
  muted: 'rgb(148, 163, 184)'
}

// Gradient Configurations
export const PROFIT_GRADIENT_CONFIG = {
  minOpacity: 0.1,
  maxOpacity: 0.8,
  threshold: 10 // Start showing gradient after 10% progress
}

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
}