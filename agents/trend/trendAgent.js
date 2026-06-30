/**
 * Trend Agent
 * Identifies current market trend: Bullish, Bearish, or Neutral
 */

class TrendAgent {
  /**
   * Analyze trend based on price action and indicators
   * @param {Object} marketData - Current market data
   * @param {Object} indicators - Calculated indicators
   */
  async analyze(marketData, indicators) {
    const { close, open, high, low } = marketData;
    const trend = {};

    // Price action analysis
    trend.priceAction = close > open ? 'bullish' : 'bearish';

    // Support and resistance zones
    trend.supportResistance = this.identifySupportResistance(marketData, indicators);

    // Trend direction from multiple indicators
    trend.direction = this.determineTrendDirection(indicators);

    // Strength of trend
    trend.strength = this.calculateTrendStrength(indicators);

    // Breakout potential
    trend.breakoutPotential = this.assessBreakoutPotential(marketData, indicators);

    return trend;
  }

  /**
   * Identify key support and resistance levels
   */
  identifySupportResistance(data, indicators) {
    const { pivotPoints, fibonacci } = indicators;
    const { close } = data;

    const resistanceLevels = [
      pivotPoints.resistance2,
      pivotPoints.resistance1,
      fibonacci.level382
    ].sort((a, b) => b - a);

    const supportLevels = [
      pivotPoints.support2,
      pivotPoints.support1,
      fibonacci.level618
    ].sort((a, b) => a - b);

    // Find nearest resistance and support
    const nearestResistance = resistanceLevels.find(r => r > close) || resistanceLevels[resistanceLevels.length - 1];
    const nearestSupport = supportLevels.reverse().find(s => s < close) || supportLevels[0];

    return {
      nearestResistance: parseFloat(nearestResistance.toFixed(4)),
      nearestSupport: parseFloat(nearestSupport.toFixed(4)),
      resistanceDistance: parseFloat((nearestResistance - close).toFixed(4)),
      supportDistance: parseFloat((close - nearestSupport).toFixed(4)),
      allResistances: resistanceLevels.map(r => parseFloat(r.toFixed(4))),
      allSupports: supportLevels.map(s => parseFloat(s.toFixed(4)))
    };
  }

  /**
   * Determine overall trend direction
   */
  determineTrendDirection(indicators) {
    const { rsi, macd } = indicators;
    
    let signals = 0;
    
    if (macd.signal === 'bullish') signals++;
    if (!rsi.overbought && !rsi.oversold && rsi.rsi > 50) signals++;
    
    if (signals >= 2) return 'strongly bullish';
    if (signals === 1) return 'bullish';
    if (signals <= -2) return 'strongly bearish';
    if (signals === -1) return 'bearish';
    return 'neutral';
  }

  /**
   * Calculate strength of current trend (0-100)
   */
  calculateTrendStrength(indicators) {
    const { rsi, macd, atr } = indicators;
    let strength = 50; // Neutral starting point

    // RSI contribution
    if (rsi.rsi > 50) strength += (rsi.rsi - 50) * 0.4;
    else strength -= (50 - rsi.rsi) * 0.4;

    // MACD contribution
    if (macd.signal === 'bullish') strength += 15;
    else strength -= 15;

    // ATR contribution (higher volatility = stronger moves)
    if (atr.volatilityLevel === 'high') strength += 10;
    else if (atr.volatilityLevel === 'low') strength -= 5;

    return Math.min(100, Math.max(0, parseFloat(strength.toFixed(2))));
  }

  /**
   * Assess potential for breakout
   */
  assessBreakoutPotential(data, indicators) {
    const { supportResistance } = this.identifySupportResistance(data, indicators);
    const { atr } = indicators;

    const resistanceBuffer = supportResistance.resistanceDistance;
    const supportBuffer = supportResistance.supportDistance;

    let breakoutLikelihood = 'low';
    let breakoutDirection = 'neutral';

    // Price closer to resistance with high ATR
    if (resistanceBuffer < atr.atr * 2 && atr.volatilityLevel === 'high') {
      breakoutLikelihood = 'high';
      breakoutDirection = 'upside';
    }
    // Price closer to support with high ATR
    else if (supportBuffer < atr.atr * 2 && atr.volatilityLevel === 'high') {
      breakoutLikelihood = 'high';
      breakoutDirection = 'downside';
    }

    return {
      likelihood: breakoutLikelihood,
      direction: breakoutDirection,
      trigger: 'Price approaching key level with elevated volatility'
    };
  }
}

module.exports = TrendAgent;
