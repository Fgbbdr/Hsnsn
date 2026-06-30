/**
 * Complete Step Index Analysis Tool - Backend Server
 * Integrates all agents with Express.js and serves the TradeView UI
 */

const express = require('express');
const path = require('path');
const StepIndexAnalysisTool = require('./agents/index');
const ChartAgent = require('./agents/visualization/chartAgent');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'visualization')));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize tools
const analysisToolTool = new StepIndexAnalysisTool();
const chartAgent = new ChartAgent();

/**
 * API: Get analysis results
 * POST /api/analyze
 */
app.post('/api/analyze', async (req, res) => {
  try {\n    const { timeframe, tradeType, marketData } = req.body;

    // Validate inputs
    if (!marketData || !timeframe || !tradeType) {
      return res.status(400).json({
        error: 'Missing required parameters: marketData, timeframe, tradeType'
      });
    }

    console.log(`[API] Analyzing ${timeframe} - ${tradeType}`);\n\n    // Run analysis
    const result = await analysisToolTool.analyze(marketData, timeframe, tradeType);

    if (result.status !== 'success') {
      return res.status(400).json(result);
    }

    // Add chart data for UI rendering
    result.chartHTML = chartAgent.generateChartHTML({
      candles: marketData.candles || [],
      indicators: result.indicators,
      patterns: result.patterns,
      trend: result.trend,
      timeframe
    });

    res.json(result);
  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

/**
 * API: Get available timeframes
 * GET /api/timeframes
 */
app.get('/api/timeframes', (req, res) => {
  res.json({
    shortTerm: ['1m', '5m', '15m'],
    longTerm: ['1h', '4h', 'daily'],
    all: ['1m', '5m', '15m', '30m', '1h', '4h', 'daily']
  });
});

/**
 * API: Get configuration
 * GET /api/config
 */
app.get('/api/config', (req, res) => {
  const config = require('./config/stepIndexConfig');
  res.json(config);
});

/**
 * API: Stream real-time analysis
 * WebSocket connection for live updates
 */
app.post('/api/stream', async (req, res) => {
  try {
    const { timeframe, tradeType, interval } = req.body;

    console.log(`[Stream] Starting stream for ${timeframe}`);\n\n    // For demonstration, return streaming configuration
    res.json({
      status: 'streaming',
      timeframe,
      tradeType,
      updateInterval: interval || 1000,
      message: 'Connect to WebSocket endpoint for live updates'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Serve main chart UI
 * GET /
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'visualization/tradeViewChart.html'));
});

/**
 * Serve chart documentation
 * GET /docs/chart
 */
app.get('/docs/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'README_CHART.md'));
});

/**
 * API: Get market data (mock data for testing)
 * GET /api/market-data
 */
app.get('/api/market-data', (req, res) => {
  const generateSampleData = () => {
    const candles = [];
    let price = 1000;

    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * 5;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;

      candles.push({ open, high, low, close });
      price = close;
    }

    return {
      open: candles[0].open,
      high: Math.max(...candles.map(c => c.high)),
      low: Math.min(...candles.map(c => c.low)),
      close: candles[candles.length - 1].close,
      volume: Math.floor(Math.random() * 1000000),
      previousHigh: candles[candles.length - 2]?.high || 1003.0,
      previousLow: candles[candles.length - 2]?.low || 998.5,
      previousClose: candles[candles.length - 2]?.close || 1001.0,
      closes: candles.map(c => c.close),
      candles,
      current: candles[candles.length - 1],
      previous: candles[candles.length - 2]
    };
  };

  res.json(generateSampleData());
});

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Step Index Analysis Tool',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

/**
 * Start server
 */
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Step Index Analysis Tool - Backend Server');
  console.log('='.repeat(60));
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`\n📈 Chart UI: http://localhost:${PORT}`);
  console.log(`\n🔌 API Endpoints:`);
  console.log(`   POST /api/analyze - Run market analysis`);
  console.log(`   GET  /api/timeframes - Get supported timeframes`);
  console.log(`   GET  /api/config - Get tool configuration`);
  console.log(`   GET  /api/market-data - Get sample market data`);
  console.log(`   GET  /health - Health check`);
  console.log(`\n📚 Documentation:`);
  console.log(`   /docs/chart - Chart integration guide`);
  console.log(`\n${'='.repeat(60)}\n`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
