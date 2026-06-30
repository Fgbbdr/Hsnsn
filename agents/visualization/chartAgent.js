/**
 * Chart Agent
 * Handles TradeView chart rendering and overlay of indicators, patterns, and levels
 */

class ChartAgent {
  constructor() {
    this.chartCanvas = null;
    this.chartContext = null;
    this.candles = [];
    this.width = 1200;
    this.height = 600;
    this.padding = 40;
  }

  /**
   * Initialize chart on HTML canvas element
   * @param {string} canvasId - ID of canvas element
   */
  initChart(canvasId) {
    if (typeof document !== 'undefined') {
      this.chartCanvas = document.getElementById(canvasId);
      if (this.chartCanvas) {
        this.chartContext = this.chartCanvas.getContext('2d');
        this.width = this.chartCanvas.width || 1200;
        this.height = this.chartCanvas.height || 600;
      }
    }
    console.log('[ChartAgent] Chart initialized');
  }

  /**
   * Render complete chart with all overlays
   * @param {Object} chartData - Complete analysis data with candles and indicators
   */
  renderChart(chartData) {
    const { candles, indicators, patterns, trend, timeframe } = chartData;

    if (!this.chartContext) {
      return this.generateChartHTML(chartData);
    }

    // Clear canvas
    this.chartContext.fillStyle = '#1a1a1a';
    this.chartContext.fillRect(0, 0, this.width, this.height);

    // Draw grid
    this.drawGrid();

    // Draw candlesticks
    this.drawCandlesticks(candles);

    // Draw indicators
    this.drawIndicators(candles, indicators);

    // Draw support and resistance
    this.drawSupportResistance(candles, trend);

    // Draw patterns
    this.drawPatterns(candles, patterns);

    // Draw title and info
    this.drawChartInfo(timeframe, indicators);

    console.log('[ChartAgent] Chart rendered successfully');
  }

  /**
   * Draw grid background
   */
  drawGrid() {
    this.chartContext.strokeStyle = '#333';
    this.chartContext.lineWidth = 0.5;

    // Vertical lines
    for (let i = this.padding; i < this.width; i += 50) {
      this.chartContext.beginPath();
      this.chartContext.moveTo(i, this.padding);
      this.chartContext.lineTo(i, this.height - this.padding);
      this.chartContext.stroke();
    }

    // Horizontal lines
    for (let i = this.padding; i < this.height; i += 40) {
      this.chartContext.beginPath();
      this.chartContext.moveTo(this.padding, i);
      this.chartContext.lineTo(this.width - this.padding, i);
      this.chartContext.stroke();
    }
  }

  /**
   * Draw candlesticks
   */
  drawCandlesticks(candles) {
    if (!candles || candles.length === 0) return;

    const candleWidth = (this.width - 2 * this.padding) / candles.length;
    const priceRange = Math.max(...candles.map(c => c.high)) - Math.min(...candles.map(c => c.low));
    const minPrice = Math.min(...candles.map(c => c.low));

    candles.forEach((candle, idx) => {
      const x = this.padding + idx * candleWidth + candleWidth / 2;
      const openY = this.height - this.padding - ((candle.open - minPrice) / priceRange) * (this.height - 2 * this.padding);
      const closeY = this.height - this.padding - ((candle.close - minPrice) / priceRange) * (this.height - 2 * this.padding);
      const highY = this.height - this.padding - ((candle.high - minPrice) / priceRange) * (this.height - 2 * this.padding);
      const lowY = this.height - this.padding - ((candle.low - minPrice) / priceRange) * (this.height - 2 * this.padding);

      // Draw wick
      this.chartContext.strokeStyle = candle.close >= candle.open ? '#00ff00' : '#ff0000';
      this.chartContext.lineWidth = 1;
      this.chartContext.beginPath();
      this.chartContext.moveTo(x, highY);
      this.chartContext.lineTo(x, lowY);
      this.chartContext.stroke();

      // Draw body
      const bodyHeight = Math.abs(closeY - openY) || 2;
      const bodyTop = Math.min(openY, closeY);
      this.chartContext.fillStyle = candle.close >= candle.open ? '#00ff00' : '#ff0000';
      this.chartContext.fillRect(x - candleWidth / 3, bodyTop, candleWidth * 0.66, bodyHeight);
    });
  }

  /**
   * Draw technical indicators as overlays
   */
  drawIndicators(candles, indicators) {
    const { bollingerBands, pivotPoints } = indicators;

    if (!candles || candles.length === 0) return;

    const priceRange = Math.max(...candles.map(c => c.high)) - Math.min(...candles.map(c => c.low));
    const minPrice = Math.min(...candles.map(c => c.low));
    const candleWidth = (this.width - 2 * this.padding) / candles.length;

    // Convert price to y-coordinate
    const priceToY = (price) => {
      return this.height - this.padding - ((price - minPrice) / priceRange) * (this.height - 2 * this.padding);
    };

    // Draw Bollinger Bands
    this.chartContext.strokeStyle = '#8844ff';
    this.chartContext.lineWidth = 1.5;
    this.chartContext.setLineDash([5, 5]);

    // Upper band
    this.chartContext.beginPath();
    this.chartContext.moveTo(this.padding, priceToY(bollingerBands.upper));
    this.chartContext.lineTo(this.width - this.padding, priceToY(bollingerBands.upper));
    this.chartContext.stroke();

    // Lower band
    this.chartContext.beginPath();
    this.chartContext.moveTo(this.padding, priceToY(bollingerBands.lower));
    this.chartContext.lineTo(this.width - this.padding, priceToY(bollingerBands.lower));
    this.chartContext.stroke();

    // Middle band (SMA)
    this.chartContext.setLineDash([]);
    this.chartContext.strokeStyle = '#44ccff';
    this.chartContext.beginPath();
    this.chartContext.moveTo(this.padding, priceToY(bollingerBands.middle));
    this.chartContext.lineTo(this.width - this.padding, priceToY(bollingerBands.middle));
    this.chartContext.stroke();
  }

  /**
   * Draw support and resistance levels
   */
  drawSupportResistance(candles, trend) {
    if (!candles || candles.length === 0) return;

    const priceRange = Math.max(...candles.map(c => c.high)) - Math.min(...candles.map(c => c.low));
    const minPrice = Math.min(...candles.map(c => c.low));

    const priceToY = (price) => {
      return this.height - this.padding - ((price - minPrice) / priceRange) * (this.height - 2 * this.padding);
    };

    const { supportResistance } = trend;

    // Resistance levels
    supportResistance.allResistances.forEach(resistance => {
      this.chartContext.strokeStyle = '#ff4444';
      this.chartContext.lineWidth = 2;
      this.chartContext.setLineDash([10, 5]);
      this.chartContext.beginPath();
      this.chartContext.moveTo(this.padding, priceToY(resistance));
      this.chartContext.lineTo(this.width - this.padding, priceToY(resistance));
      this.chartContext.stroke();
    });

    // Support levels
    supportResistance.allSupports.forEach(support => {
      this.chartContext.strokeStyle = '#51cf66';
      this.chartContext.lineWidth = 2;
      this.chartContext.setLineDash([10, 5]);
      this.chartContext.beginPath();
      this.chartContext.moveTo(this.padding, priceToY(support));
      this.chartContext.lineTo(this.width - this.padding, priceToY(support));
      this.chartContext.stroke();
    });

    this.chartContext.setLineDash([]);
  }

  /**
   * Draw detected candlestick patterns
   */
  drawPatterns(candles, patterns) {
    if (!candles || candles.length === 0) return;

    const priceRange = Math.max(...candles.map(c => c.high)) - Math.min(...candles.map(c => c.low));
    const minPrice = Math.min(...candles.map(c => c.low));
    const candleWidth = (this.width - 2 * this.padding) / candles.length;
    const lastCandleIdx = candles.length - 1;
    const x = this.padding + lastCandleIdx * candleWidth + candleWidth / 2;
    const y = this.height - this.padding - ((candles[lastCandleIdx].high - minPrice) / priceRange) * (this.height - 2 * this.padding) - 30;

    // Check for detected patterns
    Object.values(patterns).forEach(pattern => {
      if (pattern.detected) {
        this.drawPatternLabel(x, y, pattern.type, pattern.signal);
      }
    });
  }

  /**
   * Draw pattern label on chart
   */
  drawPatternLabel(x, y, patternName, signal) {
    const isPositive = signal.includes('bullish') ? true : false;
    
    this.chartContext.fillStyle = isPositive ? '#00ff0080' : '#ff000080';
    this.chartContext.fillRect(x - 80, y, 160, 30);
    
    this.chartContext.fillStyle = '#ffffff';
    this.chartContext.font = 'bold 12px Arial';
    this.chartContext.textAlign = 'center';
    this.chartContext.fillText(patternName, x, y + 20);
  }

  /**
   * Draw chart title and info
   */
  drawChartInfo(timeframe, indicators) {
    this.chartContext.fillStyle = '#ffffff';
    this.chartContext.font = 'bold 16px Arial';
    this.chartContext.textAlign = 'left';
    this.chartContext.fillText(`Step Index - ${timeframe}`, this.padding, 25);

    // Draw indicator info
    this.chartContext.font = '12px Arial';
    const { rsi, macd } = indicators;
    this.chartContext.fillText(`RSI: ${rsi.rsi.toFixed(2)} | MACD: ${macd.signal.toUpperCase()}`, this.padding, this.height - 10);
  }

  /**
   * Generate HTML chart (for server-side or non-canvas environments)
   */
  generateChartHTML(chartData) {
    const { candles, indicators, patterns, trend, timeframe } = chartData;
    const { supportResistance } = trend;

    return `
    <div style="background:#1a1a1a; color:#fff; padding:20px; border-radius:8px;">
      <h2>Step Index Chart - ${timeframe}</h2>
      
      <div style="background:#2a2a2a; padding:15px; margin:10px 0; border-radius:5px;">
        <h3>Price Action</h3>
        <div style="font-family:monospace;">
          <div>Open: ${candles[0]?.open || 'N/A'}</div>
          <div>High: ${Math.max(...candles.map(c => c.high)) || 'N/A'}</div>
          <div>Low: ${Math.min(...candles.map(c => c.low)) || 'N/A'}</div>
          <div>Close: ${candles[candles.length - 1]?.close || 'N/A'}</div>
        </div>
      </div>

      <div style="background:#2a2a2a; padding:15px; margin:10px 0; border-radius:5px;">
        <h3>Technical Indicators</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <strong>RSI:</strong> ${indicators.rsi.rsi.toFixed(2)}<br>
            <strong>Status:</strong> ${indicators.rsi.status}
          </div>
          <div>
            <strong>MACD:</strong> ${indicators.macd.signal.toUpperCase()}<br>
            <strong>ATR:</strong> ${indicators.atr.volatilityLevel}
          </div>
        </div>
      </div>

      <div style="background:#2a2a2a; padding:15px; margin:10px 0; border-radius:5px;">
        <h3>Support & Resistance</h3>
        <div>
          <strong style="color:#ff6b6b;">Resistance:</strong> ${supportResistance.nearestResistance.toFixed(4)}<br>
          <strong style="color:#51cf66;">Support:</strong> ${supportResistance.nearestSupport.toFixed(4)}
        </div>
      </div>
    </div>
    `;
  }
}

module.exports = ChartAgent;
