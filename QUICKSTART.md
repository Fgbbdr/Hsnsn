# Quick Start Guide - Step Index Analysis Tool

## 🚀 Getting Started in 5 Minutes

### Installation

```bash
# Clone the repository
git clone https://github.com/Fgbbdr/Hsnsn.git
cd Hsnsn

# Install dependencies
npm install express

# Or if using npm with package.json
npm install
```

### Running the Tool

**Option 1: Start Backend Server**
```bash
node server.js
```

Then open your browser:
```
http://localhost:3000
```

**Option 2: Run Example Analysis**
```bash
node example/analysisExample.js
```

**Option 3: Open Chart Directly**
```bash
# Simply open the HTML file
open visualization/tradeViewChart.html
```

## 📊 Using the Chart Interface

### Step 1: Select Analysis Parameters
- **Timeframe**: Choose from 1m, 5m, 15m, 30m, 1h, 4h, daily
- **Trade Type**: Select short-term (scalping) or long-term (swing)
- **Chart Type**: Candlestick, Line, or OHLC

### Step 2: Click "Analyze Now"
The tool will:
- Calculate all technical indicators
- Detect candlestick patterns
- Identify support/resistance levels
- Generate probability score
- Create trade recommendations

### Step 3: Review Results

**Chart Display:**
- Green candles = Bullish
- Red candles = Bearish
- Purple dashed lines = Bollinger Bands
- Red/Green dashed lines = Resistance/Support

**Sidebar Information:**
- **Indicators** - RSI, MACD, ATR, Bollinger Bands
- **Levels** - Resistance, Pivot, Support
- **Probability** - Signal strength (0-100%)
- **Alerts** - Active trading signals

**Summary Section:**
- Current trend analysis
- Detected patterns
- Recommended trade setup
- Risk/reward ratio

## 🔌 API Integration

### Analyze Market Data

**Request:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "timeframe": "15m",
    "tradeType": "short-term",
    "marketData": {
      "open": 1000.5,
      "high": 1005.2,
      "low": 995.8,
      "close": 1002.3,
      "previousHigh": 1003.0,
      "previousLow": 998.5,
      "previousClose": 1001.0,
      "closes": [1000, 1001, 999.5, 1002, 1000.5]
    }
  }'
```

**Response:**
```json
{
  "status": "success",
  "timeframe": "15m",
  "tradeType": "short-term",
  "indicators": {
    "rsi": { "rsi": 65, "status": "neutral" },
    "macd": { "signal": "bullish" },
    "atr": { "volatilityLevel": "high" },
    "bollingerBands": { "upper": 1010, "middle": 1000, "lower": 990 }
  },
  "patterns": { "hammer": { "detected": true, "type": "Hammer", "signal": "bullish reversal" } },
  "trend": { "direction": "bullish" },
  "alerts": [...],
  "summary": {
    "steps": [...],
    "probabilityScore": { "total": 72, "signal": "BUY" }
  }
}
```

### Get Configuration

```bash
curl http://localhost:3000/api/config
```

### Get Supported Timeframes

```bash
curl http://localhost:3000/api/timeframes
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 💡 Understanding the Analysis

### Indicator Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green | Bullish signal |
| 🔴 Red | Bearish signal |
| 🟡 Yellow | Neutral/Indecision |

### Probability Score Interpretation

| Range | Signal Strength | Recommendation |
|-------|-----------------|-----------------|
| 80-100% | Very Strong | Enter trade with confidence |
| 60-79% | Strong | Consider entering trade |
| 40-59% | Moderate | Wait for better setup |
| 0-39% | Weak | Avoid trade, monitor only |

### Chart Overlays

**Bollinger Bands:**
- Price bounces between upper and lower bands
- Breakout when price moves outside bands
- Middle line = 20-period SMA

**Support/Resistance:**
- Red lines = Resistance (selling pressure)
- Green lines = Support (buying pressure)
- Trade around these levels

**Candlestick Patterns:**
- Doji = Indecision
- Hammer = Bullish reversal (at support)
- Shooting Star = Bearish reversal (at resistance)
- Engulfing = Trend reversal signal

## 🎯 Trade Setup Example

**Scenario: Bullish Setup Detected**

1. **Trend**: Strongly bullish (72% probability)
2. **Pattern**: Hammer at support level (995.00)
3. **Entry**: Buy at 997.00 (pullback to support)
4. **Stop Loss**: 990.00 (below support)
5. **Target**: 1010.00 (resistance level)
6. **Risk/Reward**: 1:3 ratio

## 📈 Available Timeframes

### Short-term (Scalping)
- **1m** - Ultra-high frequency, requires fast execution
- **5m** - Intraday quick trades, 5-30 minute holds
- **15m** - Common scalping timeframe, 15-60 minute holds

### Long-term (Swing Trading)
- **1h** - Intraday swings, several hour holds
- **4h** - Multi-hour positions, overnight holds possible
- **Daily** - Swing trades, multi-day positions

## 🔧 Configuration

### Customize Indicators

Edit `config/stepIndexConfig.js`:

```javascript
indicators: {
    rsi: {
        period: 14,        // Change RSI period
        overbought: 70,    // Change overbought level
        oversold: 30       // Change oversold level
    },
    macd: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
    },
    bollingerBands: {
        period: 20,        // Change MA period
        stdDev: 2          // Change standard deviations
    }
}
```

### Adjust Alert Sensitivity

```javascript
alerts: {
    rsiExtremes: true,      // Alert on RSI extremes
    macdCrossover: true,    // Alert on MACD crossovers
    patternDetection: true, // Alert on patterns
    economicCalendar: true, // Alert on economic events
    breakoutAlerts: true    // Alert on potential breakouts
}
```

## 📚 Project Structure

```
Hsnsn/
├── agents/
│   ├── index.js                    # Main tool
│   ├── indicators/indicatorAgent.js
│   ├── patterns/candlestickAgent.js
│   ├── trend/trendAgent.js
│   ├── alerts/alertAgent.js
│   ├── summary/summaryAgent.js
│   └── visualization/chartAgent.js
├── visualization/
│   └── tradeViewChart.html         # Interactive UI
├── config/
│   └── stepIndexConfig.js
├── example/
│   └── analysisExample.js
├── server.js                        # Backend API
├── package.json
├── README.md                        # Complete documentation
└── README_CHART.md                  # Chart guide
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
npm install express
```

### Issue: Chart not displaying

**Solution:**
- Check browser console for errors (F12)
- Verify canvas element ID matches in HTML
- Ensure JavaScript is enabled
- Try different browser

### Issue: Analysis taking too long

**Solution:**
- Reduce number of historical candles
- Use shorter timeframe
- Disable pattern detection if not needed
- Increase server resources

### Issue: API connection refused

**Solution:**
```bash
# Check if server is running
curl http://localhost:3000/health

# Restart server
node server.js

# Check port availability
netstat -tln | grep 3000
```

## 🎓 Learning Resources

### Understanding Indicators

1. **RSI (Relative Strength Index)**
   - Values 0-100
   - Above 70 = Overbought (potential sell)
   - Below 30 = Oversold (potential buy)
   - Neutral between 30-70

2. **MACD (Moving Average Convergence Divergence)**
   - Shows momentum and trend
   - Bullish = MACD above signal line
   - Bearish = MACD below signal line

3. **Bollinger Bands**
   - Shows volatility and support/resistance
   - Price bounces between bands
   - Breakout = strong momentum

4. **ATR (Average True Range)**
   - Measures volatility
   - High ATR = High volatility (risky)
   - Low ATR = Low volatility (choppy)

### Trading Strategies

**Scalping (Short-term):**
- Use 1m, 5m, 15m timeframes
- Trade near support/resistance
- Set tight stop losses
- Quick profit targets (5-20 pips)

**Swing Trading (Long-term):**
- Use 1h, 4h, daily timeframes
- Follow the trend
- Use wider stop losses
- Larger profit targets (50+ pips)

## 📞 Support

For questions or issues:
1. Check `README.md` for detailed documentation
2. Check `README_CHART.md` for chart guide
3. Review example code in `example/analysisExample.js`
4. Open an issue on GitHub

## 🎉 Next Steps

1. **Run the server** - `node server.js`
2. **Open the chart** - http://localhost:3000
3. **Run an analysis** - Click "Analyze Now"
4. **Review results** - Study the indicators and summary
5. **Integrate API** - Connect to your trading platform

Happy trading! 🚀
