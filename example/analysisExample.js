/**
 * Step Index Analysis Tool - Usage Example
 */

const StepIndexAnalysisTool = require('../agents/index');

// Initialize the tool
const tool = new StepIndexAnalysisTool({
  updateInterval: 1000,
  platform: 'TradeView'
});

// Sample market data
const marketData = {
  open: 1000.5,
  high: 1005.2,
  low: 995.8,
  close: 1002.3,
  volume: 150000,
  previousHigh: 1003.0,
  previousLow: 998.5,
  previousClose: 1001.0,
  closes: [
    1000, 1001, 999.5, 1002, 1000.5, 1003, 1001.5, 998,
    999, 1001, 1000, 1002.5, 1005, 1003, 1002.3
  ],
  current: {
    open: 1000.5,
    high: 1005.2,
    low: 995.8,
    close: 1002.3
  },
  previous: {
    open: 1001.0,
    high: 1003.0,
    low: 998.5,
    close: 1001.0
  }
};

// Run analysis
async function runAnalysis() {
  console.log('\n========================================');
  console.log('Step Index Analysis Tool - Example Run');
  console.log('========================================\n');

  try {
    // Analyze 15-minute chart for short-term trading
    const result = await tool.analyze(marketData, '15m', 'short-term');

    if (result.status === 'success') {
      // Display comprehensive analysis
      console.log('\n--- ANALYSIS COMPLETE ---\n');
      
      console.log('TIMEFRAME:', result.timeframe);
      console.log('TRADE TYPE:', result.tradeType);
      console.log('\n');

      // Display summary steps
      result.summary.steps.forEach(step => {
        console.log(`\nSTEP ${step.step}: ${step.title}`);
        console.log('─'.repeat(50));
        console.log(JSON.stringify(step, null, 2));
      });

      // Display key levels
      console.log('\n\nKEY TRADING LEVELS');
      console.log('─'.repeat(50));
      console.log(JSON.stringify(result.summary.keyLevels, null, 2));

      // Display trade setup
      console.log('\n\nRECOMMENDED TRADE SETUP');
      console.log('─'.repeat(50));
      console.log(JSON.stringify(result.summary.tradeSetup, null, 2));

      // Display probability score
      console.log('\n\nPROBABILITY SCORE');
      console.log('─'.repeat(50));
      console.log(JSON.stringify(result.summary.probabilityScore, null, 2));

      // Display active alerts
      console.log('\n\nACTIVE ALERTS');
      console.log('─'.repeat(50));
      result.summary.alerts.forEach((alert, idx) => {
        console.log(`\nAlert ${idx + 1}:`);
        console.log(`  Type: ${alert.type}`);
        console.log(`  Message: ${alert.message}`);
        console.log(`  Priority: ${alert.priority}`);
        console.log(`  Signal: ${alert.signal}`);
      });

    } else {
      console.log('Analysis failed:', result.error);
    }

  } catch (error) {
    console.error('Error running analysis:', error);
  }
}

// Execute
runAnalysis();

module.exports = { tool, marketData };
