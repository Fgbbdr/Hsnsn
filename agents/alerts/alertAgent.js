/**
 * Alert Agent
 * Generates trading alerts and economic calendar notifications
 */

class AlertAgent {
  /**
   * Generate alerts based on indicators, patterns, and trends
   */
  async generate(indicators, patterns, trend) {
    const alerts = [];

    // Indicator-based alerts
    this.checkIndicatorAlerts(indicators, alerts);

    // Pattern-based alerts
    this.checkPatternAlerts(patterns, alerts);

    // Trend-based alerts
    this.checkTrendAlerts(trend, alerts);

    // Economic calendar alerts (simulated)
    this.checkEconomicCalendar(alerts);

    return {
      count: alerts.length,
      alerts: alerts,
      highPriority: alerts.filter(a => a.priority === 'high'),
      timestamp: new Date()
    };
  }

  /**
   * Check for indicator-based alerts
   */
  checkIndicatorAlerts(indicators, alerts) {
    const { rsi, macd, bollingerBands } = indicators;

    // RSI Overbought/Oversold
    if (rsi.overbought) {
      alerts.push({
        type: 'RSI Overbought',
        message: `RSI at ${rsi.rsi} - Overbought conditions. Potential pullback risk.`,
        priority: 'high',
        signal: 'bearish',
        timestamp: new Date()
      });
    }

    if (rsi.oversold) {
      alerts.push({
        type: 'RSI Oversold',
        message: `RSI at ${rsi.rsi} - Oversold conditions. Potential bounce expected.`,
        priority: 'high',
        signal: 'bullish',
        timestamp: new Date()
      });
    }

    // MACD Crossover
    if (Math.abs(macd.histogram) < 0.01) {
      alerts.push({
        type: 'MACD Crossover',
        message: `MACD lines near crossover - Momentum shift expected. Signal: ${macd.signal}`,
        priority: 'medium',
        signal: macd.signal,
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for pattern-based alerts
   */
  checkPatternAlerts(patterns, alerts) {
    Object.values(patterns).forEach(pattern => {
      if (pattern.detected) {
        alerts.push({
          type: 'Candlestick Pattern',
          pattern: pattern.type,
          message: `${pattern.type} detected - ${pattern.description}`,
          signal: pattern.signal,
          confidence: pattern.confidence,
          priority: pattern.confidence > 0.8 ? 'high' : 'medium',
          timestamp: new Date()
        });
      }
    });
  }

  /**
   * Check for trend-based alerts
   */
  checkTrendAlerts(trend, alerts) {
    const { direction, breakoutPotential, supportResistance } = trend;

    // Strong trend alert
    if (direction === 'strongly bullish' || direction === 'strongly bearish') {
      alerts.push({
        type: 'Strong Trend',
        message: `Market showing ${direction} trend. Consider trend-following strategies.`,
        priority: 'high',
        signal: direction.includes('bullish') ? 'bullish' : 'bearish',
        timestamp: new Date()
      });
    }

    // Breakout alert
    if (breakoutPotential.likelihood === 'high') {
      alerts.push({
        type: 'Potential Breakout',
        message: `Price near key ${breakoutPotential.direction} breakout level. High volatility detected.`,
        priority: 'high',
        signal: breakoutPotential.direction,
        timestamp: new Date()
      });
    }
  }

  /**
   * Check economic calendar (simulated)
   */
  checkEconomicCalendar(alerts) {
    // Simulated major economic events
    const upcomingEvents = [
      {
        name: 'Interest Rate Decision',
        impact: 'high',
        time: '+2 hours',
        currency: 'USD'
      },
      {
        name: 'GDP Report',
        impact: 'high',
        time: '+4 hours',
        currency: 'EUR'
      }
    ];

    upcomingEvents.forEach(event => {
      alerts.push({
        type: 'Economic Calendar',
        event: event.name,
        message: `${event.name} (${event.currency}) - High impact event ${event.time}. Expect volatility spike.`,
        priority: event.impact === 'high' ? 'high' : 'medium',
        impact: event.impact,
        timestamp: new Date()
      });
    });
  }
}

module.exports = AlertAgent;
