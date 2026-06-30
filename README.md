# Step Index Analysis Tool

A comprehensive, multi-layered market analysis tool designed for the Step Index synthetic asset on the TradeView platform.

## Overview

The Step Index Analysis Tool provides real-time technical analysis by integrating multiple indicators, candlestick pattern detection, trend analysis, and economic calendar monitoring. It delivers step-by-step analysis summaries with probability ratings to help traders make informed decisions.

## Core Features

### 1. **Indicator Analysis**
- **Pivot Points**: Key support and resistance levels from previous day's action
- **Fibonacci Retracements**: 38.2%, 50%, 61.8% retracement levels
- **RSI (Relative Strength Index)**: Overbought/oversold detection
- **MACD**: Momentum and trend confirmation
- **Bollinger Bands**: Volatility and breakout zones
- **ATR (Average True Range)**: Volatility measurement

### 2. **Candlestick Pattern Recognition**
- Doji (indecision)
- Hammer (bullish reversal)
- Shooting Star (bearish reversal)
- Engulfing patterns (reversal signals)
- Harami patterns (reversal potential)

### 3. **Trend Analysis**
- Current trend identification (bullish, bearish, neutral)
- Support and resistance zone mapping
- Trend strength calculation
- Breakout potential assessment

### 4. **Alert System**
- Indicator-based alerts (RSI extremes, MACD crossovers)
- Pattern-based alerts
- Trend-based alerts
- Economic calendar monitoring
- Real-time alert generation

### 5. **Comprehensive Summary**
Step-by-step analysis reporting:
1. **Current Trend Analysis**: Market direction and momentum
2. **Support & Resistance**: Key price levels
3. **Candlestick Patterns**: Detected patterns and signals
4. **Probability Rating**: Overall signal strength based on aligned conditions

## Project Structure

```
agents/
├── index.js                    # Main tool entry point
├── indicators/
│   └── indicatorAgent.js      # All technical indicators
├── patterns/
│   └── candlestickAgent.js    # Candlestick pattern detection
├── trend/
│   └── trendAgent.js          # Trend analysis
├── alerts/
│   └── alertAgent.js          # Alert generation
└── summary/
    └── summaryAgent.js        # Analysis summary generation

config/
├── stepIndexConfig.js         # Configuration settings

example/
├── analysisExample.js         # Usage example
```

## Installation

```bash
git clone https://github.com/Fgbbdr/Hsnsn.git
cd Hsnsn
npm install
```

## Usage

### Basic Analysis

```javascript
const StepIndexAnalysisTool = require('./agents/index');

const tool = new StepIndexAnalysisTool();

const marketData = {
  open: 1000.5,
  high: 1005.2,
  low: 995.8,
  close: 1002.3,
  previousHigh: 1003.0,
  previousLow: 998.5,
  previousClose: 1001.0,
  closes: [1000, 1001, 999.5, ...] // Array of recent close prices
};

// Analyze 15-minute chart for short-term trading
const result = await tool.analyze(marketData, '15m', 'short-term');

console.log(result.summary);
```

### Analysis Output

The tool returns a comprehensive object containing:

```javascript
{
  status: 'success',
  timestamp: Date,
  timeframe: '15m',
  tradeType: 'short-term',
  indicators: { /* all calculated indicators */ },
  patterns: { /* detected patterns */ },
  trend: { /* trend analysis */ },
  alerts: { /* generated alerts */ },
  summary: {
    steps: [ /* 4-step analysis */ ],
    keyLevels: { /* trading levels */ },
    tradeSetup: { /* recommended entry/exit */ },
    riskReward: { /* risk/reward calculation */ },
    probabilityScore: { /* overall signal strength */ }
  }
}
```

## Configuration

Edit `config/stepIndexConfig.js` to customize:

- Indicator periods and thresholds
- Alert sensitivity
- Timeframe preferences
- Risk management settings
- Economic calendar events to monitor

## Supported Timeframes

- **Short-term**: 1m, 5m, 15m (scalping, quick entries)
- **Long-term**: 1h, 4h, daily (swing trades, position trading)

## Trade Analysis Modes

### Short-term Analysis
- Focuses on quick reversals and intraday scalping
- Uses lower timeframe data (1m, 5m, 15m)
- Sensitive to quick momentum shifts

### Long-term Analysis
- Focuses on swing trades and trend following
- Uses higher timeframe data (1h, 4h, daily)
- Filters out market noise

## Probability Rating System

The tool calculates signal strength based on aligned conditions:

| Score | Signal | Recommendation |
|-------|--------|----------------|
| 80-100 | Very Strong | High confidence entry |
| 60-79 | Strong | Consider entering trade |
| 40-59 | Moderate | Wait for confirmation |
| 0-39 | Weak | Avoid, wait for setup |

## Risk Management

Built-in risk/reward calculations:

- Minimum risk/reward ratio: 1.5:1
- Automatic stop loss placement at support/resistance
- Take profit targets at key levels
- Position sizing recommendations

## Economic Calendar Integration

Monitored events:
- Interest Rate Decisions
- Non-Farm Payroll
- GDP Reports
- Inflation Data
- Employment Data
- Consumer Confidence
- Trade Balance

High-impact events trigger volatility alerts.

## Real-time Updates

Enable real-time analysis with automatic updates:

```javascript
tool.startRealTimeAnalysis(marketDataStream, '15m', 'short-term');
```

## Example Output

See `example/analysisExample.js` for a complete working example with sample output.

## API Reference

### StepIndexAnalysisTool

#### Methods

**`analyze(marketData, timeframe, tradeType)`**
- Runs complete analysis on provided market data
- Returns: Full analysis result object

**`startRealTimeAnalysis(stream, timeframe, tradeType)`**
- Starts continuous real-time analysis
- Emits updates at configured intervals

### Agents

- **IndicatorAgent**: Calculates all technical indicators
- **CandlestickAgent**: Detects chart patterns
- **TrendAgent**: Analyzes market trend and levels
- **AlertAgent**: Generates trading alerts
- **SummaryAgent**: Creates step-by-step summary

## Contributing

Contributions welcome! Areas for enhancement:
- Additional technical indicators
- Machine learning pattern recognition
- Advanced risk management algorithms
- Multi-asset analysis
- WebSocket real-time data integration

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Disclaimer

This tool is for educational and analytical purposes. Past performance does not guarantee future results. Always conduct your own research and consult with financial advisors before making trading decisions.
