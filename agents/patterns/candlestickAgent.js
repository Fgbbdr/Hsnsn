/**
 * Candlestick Pattern Agent
 * Detects candlestick patterns: Doji, Hammer, Engulfing, etc.
 */

class CandlestickAgent {
  /**
   * Detect candlestick patterns
   * @param {Object} marketData - OHLC data with current and previous candles
   */
  async detect(marketData) {
    const patterns = {};

    // Single candle patterns
    patterns.doji = this.detectDoji(marketData);
    patterns.hammer = this.detectHammer(marketData);
    patterns.shootingStar = this.detectShootingStar(marketData);

    // Multi-candle patterns
    patterns.engulfing = this.detectEngulfing(marketData);
    patterns.harami = this.detectHarami(marketData);

    // Identify trend continuation patterns
    patterns.continuation = this.detectContinuation(marketData);

    return patterns;
  }

  /**
   * Doji: Open ≈ Close (indecision)
   */
  detectDoji(data) {
    const { open, close, high, low } = data;
    const bodySize = Math.abs(close - open);
    const range = high - low;
    const threshold = range * 0.1; // Body is less than 10% of range

    if (bodySize < threshold) {
      return {
        detected: true,
        type: 'Doji',
        signal: 'indecision',
        confidence: 0.85,
        description: 'Open and close are nearly equal, suggesting market indecision'
      };
    }
    return { detected: false };
  }

  /**
   * Hammer: Small body, long lower wick, minimal upper wick (reversal from downtrend)
   */
  detectHammer(data) {
    const { open, close, high, low } = data;
    const bodySize = Math.abs(close - open);
    const range = high - low;
    const lowerWick = Math.min(open, close) - low;
    const upperWick = high - Math.max(open, close);

    if (bodySize < range * 0.3 && lowerWick > range * 0.5 && upperWick < range * 0.2) {
      return {
        detected: true,
        type: 'Hammer',
        signal: 'bullish reversal',
        confidence: 0.8,
        description: 'Long lower wick with small body suggests potential upward reversal'
      };
    }
    return { detected: false };
  }

  /**
   * Shooting Star: Small body, long upper wick, minimal lower wick (reversal from uptrend)
   */
  detectShootingStar(data) {
    const { open, close, high, low } = data;
    const bodySize = Math.abs(close - open);
    const range = high - low;
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;

    if (bodySize < range * 0.3 && upperWick > range * 0.5 && lowerWick < range * 0.2) {
      return {
        detected: true,
        type: 'Shooting Star',
        signal: 'bearish reversal',
        confidence: 0.8,
        description: 'Long upper wick with small body suggests potential downward reversal'
      };
    }
    return { detected: false };
  }

  /**
   * Engulfing: Current candle body completely engulfs previous candle body
   */
  detectEngulfing(data) {
    const current = data.current || data;
    const previous = data.previous || {};

    if (!previous.open) return { detected: false };

    const currentBodyTop = Math.max(current.open, current.close);
    const currentBodyBottom = Math.min(current.open, current.close);
    const prevBodyTop = Math.max(previous.open, previous.close);
    const prevBodyBottom = Math.min(previous.open, previous.close);

    const bullishEngulfing = current.close > current.open &&
                             previous.close < previous.open &&
                             currentBodyTop > prevBodyTop &&
                             currentBodyBottom < prevBodyBottom;

    const bearishEngulfing = current.close < current.open &&
                             previous.close > previous.open &&
                             currentBodyTop > prevBodyTop &&
                             currentBodyBottom < prevBodyBottom;

    if (bullishEngulfing) {
      return {
        detected: true,
        type: 'Bullish Engulfing',
        signal: 'bullish reversal',
        confidence: 0.85,
        description: 'Current candle completely engulfs previous - potential strong upward move'
      };
    }

    if (bearishEngulfing) {
      return {
        detected: true,
        type: 'Bearish Engulfing',
        signal: 'bearish reversal',
        confidence: 0.85,
        description: 'Current candle completely engulfs previous - potential strong downward move'
      };
    }

    return { detected: false };
  }

  /**
   * Harami: Small body inside previous larger body (reversal)
   */
  detectHarami(data) {
    const current = data.current || data;
    const previous = data.previous || {};

    if (!previous.open) return { detected: false };

    const currentBodyTop = Math.max(current.open, current.close);
    const currentBodyBottom = Math.min(current.open, current.close);
    const prevBodyTop = Math.max(previous.open, previous.close);
    const prevBodyBottom = Math.min(previous.open, previous.close);

    const isInside = currentBodyTop < prevBodyTop && currentBodyBottom > prevBodyBottom;

    if (isInside) {
      const bullish = current.close > current.open;
      return {
        detected: true,
        type: bullish ? 'Bullish Harami' : 'Bearish Harami',
        signal: bullish ? 'potential bullish reversal' : 'potential bearish reversal',
        confidence: 0.75,
        description: 'Small body inside previous larger body - suggests momentum loss and reversal'
      };
    }

    return { detected: false };
  }

  /**
   * Detect continuation patterns
   */
  detectContinuation(data) {
    const { close, open } = data;
    const isBullish = close > open;
    
    return {
      type: isBullish ? 'Bullish Candle' : 'Bearish Candle',
      signal: isBullish ? 'continuation of uptrend' : 'continuation of downtrend',
      confidence: 0.6
    };
  }
}

module.exports = CandlestickAgent;
