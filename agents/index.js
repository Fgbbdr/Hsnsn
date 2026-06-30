/**
 * Step Index Analysis Tool - Main Entry Point
 * Integrates all agents for comprehensive market analysis
 */

const IndicatorAgent = require('./indicators/indicatorAgent');
const CandlestickAgent = require('./patterns/candlestickAgent');
const TrendAgent = require('./trend/trendAgent');
const AlertAgent = require('./alerts/alertAgent');
const SummaryAgent = require('./summary/summaryAgent');

class StepIndexAnalysisTool {
  constructor(config = {}) {
    this.config = {
      platform: 'TradeView',
      updateInterval: config.updateInterval || 1000,
      ...config
    };

    this.indicatorAgent = new IndicatorAgent();
    this.candlestickAgent = new CandlestickAgent();
    this.trendAgent = new TrendAgent();
    this.alertAgent = new AlertAgent();
    this.summaryAgent = new SummaryAgent();
  }

  /**
   * Analyze market data on selected timeframe
   * @param {Object} marketData - Price and volume data
   * @param {string} timeframe - Chart timeframe (e.g., '15m', '1h', '4h')
   * @param {string} tradeType - Type of analysis ('short-term' or 'long-term')
   */
  async analyze(marketData, timeframe, tradeType) {
    try {
      console.log(`\n[StepIndexTool] Analyzing ${timeframe} - ${tradeType}`);

      // Step 1: Calculate all indicators
      const indicators = await this.indicatorAgent.calculate(marketData);

      // Step 2: Detect candlestick patterns
      const patterns = await this.candlestickAgent.detect(marketData);

      // Step 3: Identify trend
      const trend = await this.trendAgent.analyze(marketData, indicators);

      // Step 4: Generate alerts
      const alerts = await this.alertAgent.generate(indicators, patterns, trend);

      // Step 5: Create comprehensive summary
      const summary = await this.summaryAgent.generate({
        indicators,
        patterns,
        trend,
        alerts,
        timeframe,
        tradeType
      });

      return {
        status: 'success',
        timestamp: new Date(),
        timeframe,
        tradeType,
        indicators,
        patterns,
        trend,
        alerts,
        summary
      };
    } catch (error) {
      console.error('[StepIndexTool] Analysis failed:', error);
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Start real-time analysis with automatic updates
   */
  startRealTimeAnalysis(marketDataStream, timeframe, tradeType) {
    console.log(`[StepIndexTool] Starting real-time analysis on ${timeframe}`);
    
    setInterval(async () => {
      const latestData = marketDataStream.getLatest();
      if (latestData) {
        const result = await this.analyze(latestData, timeframe, tradeType);
        this.emitUpdate(result);
      }
    }, this.config.updateInterval);
  }

  emitUpdate(result) {
    // Emit to connected clients or storage
    console.log('[StepIndexTool] Update emitted:', result.summary.signal);
  }
}

module.exports = StepIndexAnalysisTool;
