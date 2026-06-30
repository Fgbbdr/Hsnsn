/**
 * Step Index Analysis Tool Configuration
 */

module.exports = {
  // TradeView integration
  tradeView: {
    baseUrl: 'https://api.tradeview.com',
    apiKey: process.env.TRADEVIEW_API_KEY || 'YOUR_API_KEY',
    asset: 'STEP',
    supportedTimeframes: ['1m', '5m', '15m', '30m', '1h', '4h', 'daily']
  },

  // Indicator settings
  indicators: {
    rsi: {
      period: 14,
      overbought: 70,
      oversold: 30
    },
    macd: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    },
    bollingerBands: {
      period: 20,
      stdDev: 2
    },
    atr: {
      period: 14
    }
  },

  // Alert thresholds
  alerts: {
    rsiExtremes: true,
    macdCrossover: true,
    patternDetection: true,
    economicCalendar: true,
    breakoutAlerts: true
  },

  // Analysis modes
  analysisTypes: {
    shortTerm: {
      timeframes: ['1m', '5m', '15m'],
      focus: 'Quick scalp entries, intraday reversals'
    },
    longTerm: {
      timeframes: ['1h', '4h', 'daily'],
      focus: 'Swing trades, position trading, trend following'
    }
  },

  // Probability thresholds
  probabilityThresholds: {
    veryStrong: 80,
    strong: 60,
    moderate: 40,
    weak: 20
  },

  // Risk management
  riskManagement: {
    minRiskRewardRatio: 1.5,
    maxRiskPerTrade: 2,
    positionSizingMethod: 'fixed_percentage' // or 'fixed_contracts', 'kelly_criterion'
  },

  // Update intervals (milliseconds)
  updateIntervals: {
    realTime: 1000,
    shortTerm: 5000,
    longTerm: 60000
  },

  // Economic calendar events to monitor
  economicEvents: [
    'Interest Rate Decision',
    'Non-Farm Payroll',
    'GDP Report',
    'Inflation Data',
    'Employment Data',
    'Consumer Confidence',
    'Trade Balance'
  ]
};
