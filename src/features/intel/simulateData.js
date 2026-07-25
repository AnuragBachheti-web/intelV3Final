// src/features/intel/simulateData.js

export const SIMULATE_DATA = {
  // Successful simulation (Screenshots 1 & 2)
  success: {
    canSimulate: true,
    sku: 'AFWCLEANER0004',
    title: 'Autofy Storm 3 [4-in-1] Powerful & Fully Wireless Car Vacuum Cleaner Air Blower - 18000PA 3.5X More Suction Power - BLDC',
    description: 'Autofy Storm 3 [4-in-1] Powerful & Fully Wireless Car Vacuum Cleaner Air Blower - 18000PA 3.5X More Suction Power - BLDC now drives 21.3% of your revenue, above your 8% concentration line — about ₹16.0L/mo at stake.\nScenario projection — directional, not a guarantee. Every number below is a current value × a stated assumption; effects ramp in, so 30-day ≠ full effect.',
    contributionAtRisk: {
      now: '₹0',
      doNothingD90: '₹0',
      doThisD90: '₹0'
    },
    intervention: 'This SKU carries 21.3% of your revenue. Stress-test: a 20% sales drop puts ~₹0/mo of contribution at risk. Diversify to reduce the single-SKU dependency.',
    projection: [
      {
        metric: 'Portfolio revenue at risk (cumulative)',
        now: '₹0',
        doNothingD90: '₹0',
        day30: '₹3,20,447',
        day60: '₹6,40,894',
        day90: '₹9,61,341'
      },
      {
        metric: 'Contribution at risk (cumulative)',
        now: '₹0',
        doNothingD90: '₹0',
        day30: '₹0',
        day60: '₹0',
        day90: '₹0'
      }
    ],
    whatCouldGoWrong: [
      {
        title: 'Over-reliance on one SKU',
        subtitle: '21.3% of portfolio revenue rides on this SKU',
        description: 'A stockout, suspension, or competitor hit here flows straight to the portfolio total.'
      },
      {
        title: 'Diversification takes time',
        subtitle: '',
        description: 'Standing up alternative SKUs/channels is a multi-month effort — the exposure persists meanwhile.'
      }
    ],
    monitoringPlan: [
      { day: 7, title: 'Revenue share — expected 21.3%', tripwire: 'Tripwire: share climbs above 23.3% — concentration risk rising; accelerate diversification' },
      { day: 15, title: 'Revenue share — expected 21.3%', tripwire: 'Tripwire: share climbs above 23.3% — concentration risk rising; accelerate diversification' },
      { day: 30, title: 'Revenue share — expected 21.3%', tripwire: 'Tripwire: share climbs above 23.3% — concentration risk rising; accelerate diversification' },
      { day: 60, title: 'Revenue share — expected 21.3%', tripwire: 'Tripwire: share climbs above 23.3% — concentration risk rising; accelerate diversification' }
    ],
    defaultShockPct: 20
  },
  
  // Failed simulation (Screenshot 3)
  error: {
    canSimulate: false,
    sku: 'VKAMCOVER0072',
    title: 'Autofy 100% Waterproof (Tested) Bike Cover Dustproof UV Protection Bike Body Cover for All Two Wheeler Bikes Upto Pulsar',
    description: 'Autofy 100% Waterproof (Tested) Bike Cover Dustproof UV Protection Bike Body Cover for All Two Wheeler Bikes Upto Pulsar is moving 41 units/day, above your 20 watch line — about ₹5.6L/mo at stake.\nScenario projection — directional, not a guarantee. Every number below is a current value × a stated assumption; effects ramp in, so 30-day ≠ full effect.',
    errorReason: "daily velocity / price / unit economics for this SKU — so no projection is shown (honest-empty, never fabricated)."
  }
};
