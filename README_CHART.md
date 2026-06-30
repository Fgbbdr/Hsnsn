# TradeView Chart Integration

## Overview

The Step Index Analysis Tool includes comprehensive chart visualization and TradeView platform integration with real-time candlestick rendering, multi-indicator overlays, and interactive analysis controls.

## Features

### Chart Visualization

**Candlestick Display:**
- Green candles = Bullish (close > open)
- Red candles = Bearish (close < open)
- Wicks show high/low range
- Body shows open/close

**Technical Indicator Overlays:**
- Bollinger Bands (upper/lower with dashed lines, middle SMA)
- Pivot Points (resistance/support levels)
- Support/Resistance zones (color-coded)

**Pattern Markers:**
- Green highlights = Bullish patterns
- Red highlights = Bearish patterns
- Pattern names displayed on chart

### Interactive Controls

**Timeframe Selection:**
- 1m, 5m, 15m, 30m, 1h, 4h, Daily

**Trade Type Modes:**
- Short-term (scalping - lower timeframes)
- Long-term (swing trading - higher timeframes)

**Chart Type Options:**
- Candlestick (default)
- Line chart
- OHLC bars

### Real-time Indicators Panel

Displays live values for:
- **RSI(14)** - Overbought/oversold indicator
- **MACD** - Momentum direction (Bullish/Bearish)
- **ATR** - Volatility level (High/Medium/Low)
- **Bollinger Bands** - Current band levels

Color coding:
- Green = Bullish signal
- Red = Bearish signal
- Yellow = Neutral

### Support & Resistance Levels

**Three-level display:**
- **Resistance** (red) - Upper breakout level
- **Pivot** (white) - Central support point
- **Support** (green) - Lower support level

### Probability Score

Algorithm-calculated signal strength:
- **80-100%** - Very Strong (Green)
- **60-79%** - Strong (Green)
- **40-59%** - Moderate (Yellow)
- **0-39%** - Weak (Red)

### Alert System

**Three Priority Levels:**

**High (Red):**
- Strong reversal patterns
- Extreme RSI readings (>70 or <30)
- Major economic events

**Medium (Orange):**
- MACD crossovers
- Price near key levels
- Pattern confirmations

**Low (Yellow):**
- Minor indicator signals
- Technical notifications

### Summary Analysis

**Four-Step Comprehensive Report:**

1. **Trend Analysis** - Current market direction and momentum strength
2. **Patterns** - Detected candlestick patterns with confidence levels
3. **Trade Setup** - Recommended entry point, stop loss, take profit target
4. **Risk/Reward** - Calculated ratio and position sizing recommendations

## Files

### 1. Chart Agent (`agents/visualization/chartAgent.js`)

**Core Methods:**

```javascript
// Initialize chart
chart.initChart('canvasId');

// Render complete analysis
chart.renderChart(chartData);

// Individual overlay methods
chart.drawCandlesticks(candles);
chart.drawIndicators(candles, indicators);
chart.drawSupportResistance(candles, trend);
chart.drawPatterns(candles, patterns);

// Server-side HTML generation
const html = chart.generateChartHTML(chartData);
```

**Properties:**
- `chartCanvas` - HTML5 Canvas element
- `chartContext` - 2D drawing context
- `width/height` - Canvas dimensions
- `padding` - Chart margin (default: 40px)

### 2. TradeView Chart UI (`visualization/tradeViewChart.html`)

**Standalone HTML/CSS/JS Interface:**
- Fully functional without backend (uses sample data)
- Interactive chart canvas
- Real-time control panel
- Responsive sidebar panels
- Live indicators display
- Alerts management
- Summary section

**Easy Backend Integration:**
Replace the `generateSampleMarketData()` function with API call:

```javascript
async function runAnalysis() {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timeframe: currentTimeframe,
            tradeType: currentTradeType,
            asset: 'STEP'
        })
    });
    
    const analysisData = await response.json();
    updateUI(analysisData);
    renderChart(analysisData);
}
```

## Usage Guide

### Opening the Chart

**Option 1: Direct File Access**
```bash
open visualization/tradeViewChart.html
```

**Option 2: Local Server**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/visualization/tradeViewChart.html
```

**Option 3: Node.js Server**
```bash
npm install express
# Create simple Express server to serve files
# Visit http://localhost:3000
```

### Using the Interface

1. **Select Timeframe** - Choose from dropdown (default: 15m)
2. **Select Trade Type** - Short-term or long-term analysis
3. **Click "Analyze Now"** - Runs analysis with current settings
4. **Review Results:**
   - Chart displays candlesticks with all overlays
   - Sidebar shows real-time indicator values
   - Alerts panel displays active signals
   - Summary section provides trading recommendations

### Interpreting Chart Elements

**Candlestick Colors:**
- Green (bullish) = Upward momentum
- Red (bearish) = Downward momentum
- Longer wicks = Higher volatility/rejection

**Indicator Lines:**
- Purple dashed = Bollinger Bands
- Cyan solid = 20-period SMA (middle band)
- Red dashed = Resistance levels
- Green dashed = Support levels

**Probability Meter:**
- Combines multiple indicators
- Shows likelihood of successful trade setup
- Higher % = more aligned conditions

## Integration Examples

### Frontend Integration

```html
<!-- Include in your web application -->
<iframe src="/visualization/tradeViewChart.html" 
        width="100%" height="800"></iframe>
```

### Backend Integration (Node.js)

```javascript
const StepIndexAnalysisTool = require('./agents/index');
const ChartAgent = require('./agents/visualization/chartAgent');
const express = require('express');

const app = express();
const tool = new StepIndexAnalysisTool();
const chart = new ChartAgent();

app.post('/api/analyze', async (req, res) => {
    const { timeframe, tradeType, marketData } = req.body;
    
    const result = await tool.analyze(marketData, timeframe, tradeType);
    
    // Add chart data
    result.chartHTML = chart.generateChartHTML({
        candles: marketData.candles,
        indicators: result.indicators,
        patterns: result.patterns,
        trend: result.trend,
        timeframe
    });
    
    res.json(result);
});

app.listen(3000);
```

## Performance Optimization

**Canvas Rendering:**
- Efficient path drawing
- Minimal redraws
- Debounced updates

**Large Data Sets:**
- Only render visible candles
- Limit to 100-200 candles max
- Use data aggregation for high-volume periods

**Browser Optimization:**
- Enable hardware acceleration
- Use RequestAnimationFrame for updates
- Minimize DOM manipulation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires HTML5 Canvas and ES6 JavaScript support.

## Responsive Design

| Screen Size | Layout | Behavior |
|------------|--------|----------|
| Desktop (1024px+) | 2-column | Chart + sidebar |
| Tablet (768-1024px) | Stacked | Chart above sidebar |
| Mobile (<768px) | Single column | Full-width responsive |

## Customization

### Color Scheme

Edit the CSS style variables in `tradeViewChart.html`:

```css
/* Dark theme (default) */
body { background: #0f0f0f; color: #ffffff; }

/* Bullish color */
--bullish: #00ff00

/* Bearish color */
--bearish: #ff4444

/* Neutral color */
--neutral: #ffff00
```

### Chart Dimensions

```javascript
const chart = new ChartAgent();
chart.width = 1200;  // Canvas width
chart.height = 600;  // Canvas height
chart.padding = 40;  // Margin around chart
```

### Indicator Periods

Edit `config/stepIndexConfig.js`:

```javascript
indicators: {
    rsi: { period: 14, overbought: 70, oversold: 30 },
    macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    bollingerBands: { period: 20, stdDev: 2 },
    atr: { period: 14 }
}
```

## Troubleshooting

**Chart Not Rendering:**
- Verify canvas element exists with correct ID
- Check browser console for JavaScript errors
- Ensure market data includes valid OHLC values

**Indicators Not Updating:**
- Verify indicator calculation values are numeric
- Check time synchronization between backend and frontend
- Ensure sufficient historical data for calculations

**Performance Issues:**
- Reduce number of candlesticks displayed
- Increase update interval (lower frequency)
- Disable pattern detection for high-volume data

**Mobile Display Issues:**
- Check viewport meta tag
- Test on actual mobile devices
- Enable touch event handlers if needed

## API Data Format

**Expected Market Data Structure:**

```javascript
{
    open: 1000.5,
    high: 1005.2,
    low: 995.8,
    close: 1002.3,
    volume: 150000,
    previousHigh: 1003.0,
    previousLow: 998.5,
    previousClose: 1001.0,
    closes: [1000, 1001, 999.5, ...],  // Array of recent closes
    current: { open, high, low, close },
    previous: { open, high, low, close }
}
```

**Chart Data Output:**

```javascript
{
    candles: [{open, high, low, close}, ...],
    indicators: {
        rsi: {...},
        macd: {...},
        atr: {...},
        bollingerBands: {...},
        pivotPoints: {...}
    },
    patterns: {
        doji: {...},
        hammer: {...},
        engulfing: {...}
    },
    trend: {
        direction: 'bullish|bearish|neutral',
        supportResistance: {...}
    },
    alerts: [...]
}
```

## Advanced Features

### Real-time Streaming

```javascript
const stream = new DataStream();

tool.startRealTimeAnalysis(stream, '15m', 'short-term');

// Updates emit automatically every 1000ms
stream.on('update', (result) => {
    chart.renderChart(result);
    updateUI(result);
});
```

### Multi-Asset Analysis

```javascript
const assets = ['STEP', 'EUR/USD', 'BTC/USD'];

assets.forEach(asset => {
    const result = await tool.analyze(marketData, '15m', 'short-term');
    // Process results
});
```

## Support & Documentation

See `README.md` for complete API reference and tool documentation.

For issues or feature requests, open an issue on GitHub.
