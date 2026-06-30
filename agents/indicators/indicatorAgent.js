/**
 * Indicator Agent
 * Calculates all technical indicators: Pivot Points, Fibonacci, RSI, MACD, Bollinger Bands, ATR
 */

class IndicatorAgent {
  /**
   * Calculate all indicators
   * @param {Object} marketData - {open, high, low, close, volume, previousHigh, previousLow, previousClose}
   */
  async calculate(marketData) {
    const indicators = {};

    indicators.pivotPoints = this.calculatePivotPoints(marketData);
    indicators.fibonacci = this.calculateFibonacci(marketData);
    indicators.rsi = this.calculateRSI(marketData);
    indicators.macd = this.calculateMACD(marketData);
    indicators.bollingerBands = this.calculateBollingerBands(marketData);
    indicators.atr = this.calculateATR(marketData);

    return indicators;
  }

  /**
   * Pivot Points: Support and resistance from previous day's action
   */
  calculatePivotPoints(data) {
    const { previousHigh, previousLow, previousClose } = data;
    
    const pivot = (previousHigh + previousLow + previousClose) / 3;
    const r1 = 2 * pivot - previousLow;
    const s1 = 2 * pivot - previousHigh;
    const r2 = pivot + (previousHigh - previousLow);
    const s2 = pivot - (previousHigh - previousLow);

    return {
      pivot: parseFloat(pivot.toFixed(4)),
      resistance1: parseFloat(r1.toFixed(4)),
      support1: parseFloat(s1.toFixed(4)),
      resistance2: parseFloat(r2.toFixed(4)),
      support2: parseFloat(s2.toFixed(4))
    };
  }

  /**
   * Fibonacci Retracements: 38.2%, 50%, 61.8% levels
   */
  calculateFibonacci(data) {
    const { high, low } = data;
    const range = high - low;

    return {
      level382: parseFloat((high - range * 0.382).toFixed(4)),
      level50: parseFloat((high - range * 0.5).toFixed(4)),
      level618: parseFloat((high - range * 0.618).toFixed(4))
    };
  }

  /**
   * RSI (Relative Strength Index): Overbought/Oversold indicator
   * Formula: RSI = 100 - (100 / (1 + RS)), where RS = average gain / average loss
   */
  calculateRSI(data) {
    const closes = data.closes || [data.close];
    const period = 14;
    
    if (closes.length < period) {
      return { rsi: 50, status: 'neutral', overbought: false, oversold: false };
    }

    let gains = 0, losses = 0;
    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return {
      rsi: parseFloat(rsi.toFixed(2)),
      status: rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral',
      overbought: rsi > 70,
      oversold: rsi < 30
    };
  }

  /**
   * MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(data) {
    const closes = data.closes || [data.close];
    
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return {
      macdLine: parseFloat(macdLine.toFixed(4)),
      signalLine: parseFloat(signalLine.toFixed(4)),
      histogram: parseFloat(histogram.toFixed(4)),
      signal: histogram > 0 ? 'bullish' : 'bearish'
    };
  }

  /**
   * Bollinger Bands: Moving average ± 2 standard deviations
   */
  calculateBollingerBands(data) {
    const closes = data.closes || [data.close];
    const period = 20;
    const stdDev = 2;

    if (closes.length < period) {
      return { upper: data.close, middle: data.close, lower: data.close };
    }

    const recentCloses = closes.slice(-period);
    const sma = recentCloses.reduce((a, b) => a + b) / period;
    const variance = recentCloses.reduce((sq, n) => sq + Math.pow(n - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: parseFloat((sma + stdDev * standardDeviation).toFixed(4)),
      middle: parseFloat(sma.toFixed(4)),
      lower: parseFloat((sma - stdDev * standardDeviation).toFixed(4))
    };
  }

  /**
   * ATR (Average True Range): Volatility measure
   */
  calculateATR(data) {
    const { high, low, close, previousClose } = data;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - previousClose),
      Math.abs(low - previousClose)
    );

    const atr = tr; // Simplified; full ATR uses 14-period average

    return {
      atr: parseFloat(atr.toFixed(4)),
      volatilityLevel: atr > 1.5 ? 'high' : atr > 0.75 ? 'medium' : 'low'
    };
  }

  /**
   * Helper: Calculate Exponential Moving Average
   */
  calculateEMA(data, period) {
    const multiplier = 2 / (period + 1);
    let ema = data[0];
    
    for (let i = 1; i < data.length; i++) {
      ema = data[i] * multiplier + ema * (1 - multiplier);
    }
    
    return ema;
  }
}

module.exports = IndicatorAgent;
