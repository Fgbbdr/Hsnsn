/**
 * Summary Agent
 * Generates comprehensive step-by-step analysis summary
 */

class SummaryAgent {
  /**
   * Generate comprehensive summary
   */
  async generate(analysisData) {
    const { indicators, patterns, trend, alerts, timeframe, tradeType } = analysisData;

    return {
      timeframe,
      tradeType,
      generatedAt: new Date(),
      steps: [
        this.step1CurrentTrend(trend, indicators),
        this.step2SupportResistance(trend),
        this.step3CandlePatterns(patterns),
        this.step4ProbabilityRating(analysisData)
      ],
      keyLevels: this.identifyKeyLevels(trend, indicators),
      tradeSetup: this.suggestTradeSetup(trend, patterns, indicators),
      riskReward: this.calculateRiskReward(trend),
      alerts: alerts.alerts.slice(0, 5),
      probabilityScore: this.calculateProbabilityScore(analysisData)
    };
  }

  /**
   * Step 1: Current Trend Analysis
   */
  step1CurrentTrend(trend, indicators) {
    const { direction } = trend;
    const { rsi, macd } = indicators;

    let trendDescription = '';
    let color = 'neutral';

    if (direction === 'strongly bullish') {
      trendDescription = 'Strong upward momentum detected. Price showing sustained buying pressure with RSI elevated and MACD bullish.';
      color = 'green';
    } else if (direction === 'bullish') {
      trendDescription = 'Moderate upward momentum. Price climbing with mixed indicator signals but general bullish bias.';
      color = 'lightgreen';
    } else if (direction === 'strongly bearish') {
      trendDescription = 'Strong downward momentum detected. Price showing sustained selling pressure with RSI depressed and MACD bearish.';
      color = 'red';
    } else if (direction === 'bearish') {
      trendDescription = 'Moderate downward momentum. Price declining with mixed indicator signals but general bearish bias.';
      color = 'lightred';
    } else {
      trendDescription = 'Market in consolidation. No clear trend direction - price consolidating with neutral indicators.';
      color = 'yellow';
    }

    return {
      step: 1,
      title: 'Current Trend Analysis',
      trend: direction,
      color,
      description: trendDescription,
      rsiStatus: rsi.status,
      macdSignal: macd.signal
    };
  }

  /**
   * Step 2: Support and Resistance Levels
   */
  step2SupportResistance(trend) {
    const { supportResistance } = trend;

    return {
      step: 2,
      title: 'Key Support & Resistance Levels',
      resistance: {
        level1: supportResistance.nearestResistance,
        distance: supportResistance.resistanceDistance,
        description: `Nearest resistance at ${supportResistance.nearestResistance} (${supportResistance.resistanceDistance} pips above current price)`
      },
      support: {
        level1: supportResistance.nearestSupport,
        distance: supportResistance.supportDistance,
        description: `Nearest support at ${supportResistance.nearestSupport} (${supportResistance.supportDistance} pips below current price)`
      },
      allLevels: {
        resistances: supportResistance.allResistances,
        supports: supportResistance.allSupports
      },
      interpretation: 'Price may consolidate between support and resistance. Breakout likely if price breaks these levels with volume.'
    };
  }

  /**
   * Step 3: Candlestick Patterns
   */
  step3CandlePatterns(patterns) {
    const detectedPatterns = Object.values(patterns).filter(p => p.detected);

    let patternSummary = 'No significant patterns detected. Market showing neutral candlestick structure.';
    let signal = 'neutral';
    let confidence = 0;

    if (detectedPatterns.length > 0) {
      const primary = detectedPatterns[0];
      patternSummary = `${primary.type} pattern detected - ${primary.description}`;
      signal = primary.signal;
      confidence = primary.confidence;
    }

    return {
      step: 3,
      title: 'Candlestick Patterns',
      patternsDetected: detectedPatterns.length,
      patterns: detectedPatterns,
      primaryPattern: detectedPatterns[0] || null,
      summary: patternSummary,
      signal,
      confidence,
      interpretation: 'Candlestick patterns help identify potential reversals and continuations. Combined with other indicators for confirmation.'
    };
  }

  /**
   * Step 4: Probability Rating
   */
  step4ProbabilityRating(data) {
    const { trend, patterns, indicators } = data;
    let conditionsAligned = 0;
    const totalConditions = 5;

    // Check conditions
    if (trend.direction !== 'neutral') conditionsAligned++;
    if (Object.values(patterns).some(p => p.detected)) conditionsAligned++;
    if (indicators.rsi.status !== 'neutral') conditionsAligned++;
    if (indicators.macd.signal === 'bullish' || indicators.macd.signal === 'bearish') conditionsAligned++;
    if (trend.breakoutPotential.likelihood === 'high') conditionsAligned++;

    const probability = (conditionsAligned / totalConditions) * 100;
    const strength = probability > 80 ? 'Very Strong' : probability > 60 ? 'Strong' : probability > 40 ? 'Moderate' : 'Weak';

    return {
      step: 4,
      title: 'Probability Rating',
      conditionsAligned,
      totalConditions,
      probabilityScore: parseFloat(probability.toFixed(2)),
      strength,
      interpretation: `${strength} signal detected with ${conditionsAligned}/${totalConditions} conditions aligned. Higher alignment = higher confidence.`,
      recommendation: probability > 70 ? 'Consider entering trade' : 'Wait for more confirmation'
    };
  }

  /**
   * Identify key trading levels
   */
  identifyKeyLevels(trend, indicators) {
    const { supportResistance } = trend;
    const { pivotPoints, fibonacci } = indicators;

    return {
      criticalResistance: supportResistance.allResistances[0],
      criticalSupport: supportResistance.allSupports[0],
      pivotPoint: pivotPoints.pivot,
      fibonacciLevels: fibonacci,
      tradingZone: {
        upper: supportResistance.nearestResistance,
        lower: supportResistance.nearestSupport,
        range: supportResistance.nearestResistance - supportResistance.nearestSupport
      }
    };
  }

  /**
   * Suggest trade setup
   */
  suggestTradeSetup(trend, patterns, indicators) {
    const { direction } = trend;
    const hasReversal = Object.values(patterns).some(p => p.detected && p.signal.includes('reversal'));

    if (direction === 'strongly bullish' && !hasReversal) {
      return {
        type: 'BUY',
        entry: 'On pullback to support or immediate on breakout of resistance',
        stopLoss: trend.supportResistance.nearestSupport,
        takeProfit: trend.supportResistance.nearestResistance,
        riskRewardRatio: '1:2',
        confidence: 'HIGH'
      };
    } else if (direction === 'strongly bearish' && !hasReversal) {
      return {
        type: 'SELL',
        entry: 'On bounce to resistance or immediate on break below support',
        stopLoss: trend.supportResistance.nearestResistance,
        takeProfit: trend.supportResistance.nearestSupport,
        riskRewardRatio: '1:2',
        confidence: 'HIGH'
      };
    } else {
      return {
        type: 'NEUTRAL',
        entry: 'Wait for clearer signal or trend confirmation',
        stopLoss: 'N/A',
        takeProfit: 'N/A',
        riskRewardRatio: 'N/A',
        confidence: 'LOW'
      };
    }
  }

  /**
   * Calculate risk/reward ratio
   */
  calculateRiskReward(trend) {
    const { supportResistance } = trend;
    const risk = supportResistance.supportDistance;
    const reward = supportResistance.resistanceDistance;

    return {
      risk,
      reward,
      ratio: parseFloat((reward / risk).toFixed(2)),
      acceptable: (reward / risk) >= 1.5
    };
  }

  /**
   * Calculate overall probability score
   */
  calculateProbabilityScore(data) {
    const { trend, patterns, indicators, alerts } = data;
    
    let score = 0;
    
    // Trend strength (0-30 points)
    score += Math.min(30, (trend.strength || 0) * 0.3);
    
    // Pattern detection (0-25 points)
    const detectedPatterns = Object.values(patterns).filter(p => p.detected).length;
    score += Math.min(25, detectedPatterns * 12.5);
    
    // Indicator alignment (0-30 points)
    if (indicators.macd.signal === 'bullish' || indicators.macd.signal === 'bearish') score += 10;
    if (indicators.rsi.status !== 'neutral') score += 10;
    if (indicators.atr.volatilityLevel === 'high') score += 10;
    
    // Alert severity (0-15 points)
    const highPriorityAlerts = alerts.alerts.filter(a => a.priority === 'high').length;
    score += Math.min(15, highPriorityAlerts * 5);
    
    return {
      total: parseFloat(score.toFixed(2)),
      signal: score > 75 ? 'STRONG BUY/SELL' : score > 60 ? 'BUY/SELL' : score > 40 ? 'HOLD' : 'WAIT',
      recommendation: score > 70 ? 'High confidence setup' : 'Low confidence - wait for better entry'
    };
  }
}

module.exports = SummaryAgent;
