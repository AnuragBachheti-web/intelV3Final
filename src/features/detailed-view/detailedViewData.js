// ─── Static mock data for the Detailed View page ──────────────────────────────

export const STATS_DATA = {
  sales: [
    { title: 'Total Revenue', value: '$124,500', change: '12.4%', isPositive: true },
    { title: 'Units Sold', value: '2,180', change: '8.1%', isPositive: true },
    { title: 'Total Orders', value: '412', change: '6.3%', isPositive: true },
    { title: 'Avg Order Value', value: '$302', change: '4.2%', isPositive: true },
    { title: 'Buy Box %', value: '87.4%', change: '-2.1%', isPositive: false },
    { title: 'ROAS', value: '4.2x', change: '+0.3x', isPositive: true },
    { title: 'Channel Mix', value: '3.8%', change: '-0.5%', isPositive: false },
    { title: 'Repeat Customers', value: '28%', change: '+4.8%', isPositive: true },
  ],
  margin: [
    { title: 'CM2 (Cross-Channel)', value: '$18,450', change: '+5.2%', isPositive: true },
    { title: 'CM%', value: '28.4%', change: '+2.1%', isPositive: true },
    { title: 'Unprofitable SKUs', value: '12', change: '-2', isPositive: true },
    { title: 'Pricing Opportunities', value: '27', change: '+$24.8k', isPositive: true },
    { title: 'CM2 (USD)', value: '$124,500', change: '+$12k', isPositive: true },
    { title: 'CM3 Channel', value: '12.4%', change: '-0.4%', isPositive: false },
    { title: 'CM3 Cross-Ch', value: '11.8%', change: '+1.2%', isPositive: true },
    { title: 'Gross Margin %', value: '42.3%', change: '1.4%', isPositive: true },
    { title: 'Contribution %', value: '19.4%', change: '+2.1%', isPositive: true },
  ],
  inventory: [
    { title: 'DOC (Avg)', value: '42 Days', change: '-3.2d', isPositive: true },
    { title: 'OOS Risk', value: '12', change: '+3', isPositive: false },
    { title: 'Overstock', value: '8', change: 'flat', isPositive: true },
    { title: 'In-Stock %', value: '94.2%', change: '+2.1%', isPositive: true },
    { title: 'Inbound POs', value: '5', change: '$42.4k', isPositive: true },
    { title: 'In-Stock % (health)', value: '94.2%', change: '+2.1%', isPositive: true },
    { title: 'Avg DOC (days)', value: '42', change: '-3.2', isPositive: true },
    { title: 'OOS Risk (14d)', value: '15', change: '+2', isPositive: false },
    { title: 'Overstock (DOC>180)', value: '8', change: '0', isPositive: true },
    { title: 'Inventory at Cost', value: '$1,800,000', change: '+8.2%', isPositive: true },
  ],
  ads: [
    { title: 'Total Ad Spend', value: '$124K', change: '+12.4%', isPositive: true, subtext: 'vs prior 30 days' },
    { title: 'ROAS', value: '4.8x', change: '+18.2%', isPositive: true, subtext: 'Blended average' },
    { title: 'Average CPC', value: '$2.34', change: '-8.5%', isPositive: true, subtext: 'Cost per click' },
    { title: 'Conversion Rate', value: '3.2%', change: '+0.8%', isPositive: true, subtext: 'Checkout success' },
    { title: 'Margin-Adj. ROAS', value: '4.1x', change: '-0.3x', isPositive: false, subtext: 'Profitability-aware' },
    { title: 'TACOS', value: '14.2%', change: '+0.8%', isPositive: false, subtext: 'Ad spend / Total Rev' },
    { title: 'TMCOS', value: '19.2%', change: '+1.2%', isPositive: false, subtext: 'Ad spend / Total CM' },
    { title: 'Wasted Spend', value: '$4.8k', change: '+12%', isPositive: false, subtext: 'Low ROAS spend' },
  ],
};

export const PRODUCT_HEATMAP_DATA = [
  { name: 'Smart Hub Pro', abbr: 'SHP', category: 'Electronics', size: 24800, change: 12.4, revenue: '$24,800', margin: '32.1%', units: 412, roas: '4.8x', doc: 28, adSpend: '$850', cashFlow: '+$6.2k' },
  { name: 'LED Strip 5m', abbr: 'LS5', category: 'Electronics', size: 18600, change: 8.2, revenue: '$18,600', margin: '28.4%', units: 820, roas: '3.9x', doc: 45, adSpend: '$620', cashFlow: '+$4.8k' },
  { name: 'Wireless Charger', abbr: 'WCH', category: 'Electronics', size: 15200, change: -3.1, revenue: '$15,200', margin: '24.8%', units: 304, roas: '2.8x', doc: 62, adSpend: '$540', cashFlow: '+$2.1k' },
  { name: 'Smart Plug 4-Pack', abbr: 'SP4', category: 'Electronics', size: 12400, change: 5.7, revenue: '$12,400', margin: '38.2%', units: 248, roas: '5.2x', doc: 34, adSpend: '$310', cashFlow: '+$3.8k' },
  { name: 'Air Purifier XL', abbr: 'APX', category: 'Home & Garden', size: 11800, change: -8.4, revenue: '$11,800', margin: '18.6%', units: 98, roas: '2.1x', doc: 88, adSpend: '$760', cashFlow: '-$0.4k' },
  { name: 'Bamboo Organizer', abbr: 'BOG', category: 'Home & Garden', size: 9800, change: 18.2, revenue: '$9,800', margin: '42.4%', units: 490, roas: '6.1x', doc: 22, adSpend: '$180', cashFlow: '+$3.2k' },
  { name: 'Yoga Mat Pro', abbr: 'YMP', category: 'Apparel', size: 8400, change: 22.8, revenue: '$8,400', margin: '45.8%', units: 280, roas: '7.2x', doc: 18, adSpend: '$140', cashFlow: '+$2.8k' },
  { name: 'Plant Grow Light', abbr: 'PGL', category: 'Home & Garden', size: 7600, change: 0.3, revenue: '$7,600', margin: '29.4%', units: 152, roas: '3.4x', doc: 52, adSpend: '$290', cashFlow: '+$1.4k' },
  { name: 'Stainless Tumbler', abbr: 'STT', category: 'Apparel', size: 6900, change: -12.8, revenue: '$6,900', margin: '22.1%', units: 345, roas: '2.3x', doc: 95, adSpend: '$420', cashFlow: '-$0.8k' },
  { name: 'Resistance Bands', abbr: 'RBX', category: 'Apparel', size: 6200, change: 15.6, revenue: '$6,200', margin: '48.2%', units: 620, roas: '8.4x', doc: 15, adSpend: '$90', cashFlow: '+$2.2k' },
  { name: 'Smart Scale BT', abbr: 'SSB', category: 'Electronics', size: 5800, change: 4.1, revenue: '$5,800', margin: '31.8%', units: 116, roas: '4.1x', doc: 38, adSpend: '$210', cashFlow: '+$1.1k' },
  { name: 'Cat Tree Deluxe', abbr: 'CTD', category: 'Pet Suppliers', size: 5400, change: -5.8, revenue: '$5,400', margin: '26.4%', units: 60, roas: '2.6x', doc: 74, adSpend: '$280', cashFlow: '+$0.6k' },
  { name: 'Foam Roller Set', abbr: 'FRS', category: 'Apparel', size: 4900, change: 9.4, revenue: '$4,900', margin: '44.2%', units: 245, roas: '6.8x', doc: 24, adSpend: '$100', cashFlow: '+$1.6k' },
  { name: 'Cabinet Organizer', abbr: 'COG', category: 'Home & Garden', size: 4400, change: 7.2, revenue: '$4,400', margin: '36.8%', units: 220, roas: '5.6x', doc: 30, adSpend: '$120', cashFlow: '+$1.2k' },
  { name: 'Pet Water Fountain', abbr: 'PWF', category: 'Pet Suppliers', size: 3800, change: 28.4, revenue: '$3,800', margin: '52.4%', units: 190, roas: '9.2x', doc: 12, adSpend: '$60', cashFlow: '+$1.4k' },
  { name: 'Aromatherapy Diffuser', abbr: 'ARD', category: 'Home & Garden', size: 3200, change: -18.2, revenue: '$3,200', margin: '14.8%', units: 128, roas: '1.8x', doc: 112, adSpend: '$390', cashFlow: '-$1.2k' },
  { name: 'Luggage Lock Set', abbr: 'LLS', category: 'Apparel', size: 2800, change: 2.1, revenue: '$2,800', margin: '38.4%', units: 280, roas: '5.1x', doc: 42, adSpend: '$75', cashFlow: '+$0.8k' },
  { name: 'Phone Holder Car', abbr: 'PHC', category: 'Electronics', size: 2400, change: 6.8, revenue: '$2,400', margin: '40.2%', units: 240, roas: '5.8x', doc: 28, adSpend: '$65', cashFlow: '+$0.7k' },
  { name: 'Dog Chew Toy Pack', abbr: 'DCT', category: 'Pet Suppliers', size: 2100, change: 11.4, revenue: '$2,100', margin: '58.2%', units: 420, roas: '10.4x', doc: 10, adSpend: '$30', cashFlow: '+$0.9k' },
];

export const INTEL_METRIC = {
  sales: { label: 'Revenue', valueKey: 'revenue', secondary: 'units', secondaryLabel: 'Units' },
  margin: { label: 'Revenue', valueKey: 'revenue', secondary: 'margin', secondaryLabel: 'Margin' },
  inventory: { label: 'Revenue', valueKey: 'revenue', secondary: 'doc', secondaryLabel: 'DOC (days)' },
  ads: { label: 'Revenue', valueKey: 'revenue', secondary: 'roas', secondaryLabel: 'ROAS' },
  cash: { label: 'Revenue', valueKey: 'revenue', secondary: 'cashFlow', secondaryLabel: 'Cash Flow' },
};

export const PAGE_TITLES = { sales: 'Sales', margin: 'Margin', inventory: 'Inventory', ads: 'Ads', cash: 'Cash' };
export const BACK_ROUTES = { sales: '/sales', margin: '/margin', inventory: '/inventory', ads: '/ads', cash: '/cash' };

export const CHANNEL_MIX_DATA = [
  { label: 'Online Store', pct: 1.0, amount: '$124,400', color: '#0A52E7', dot: 'bg-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-900/50' },
];

export const DETAIL_VIEW_TABS = [
  { key: 'sales', label: 'Sales', icon: 'fa-dollar-sign' },
  { key: 'margin', label: 'Margin', icon: 'fa-chart-line' },
  { key: 'inventory', label: 'Inventory', icon: 'fa-boxes' },
  { key: 'ads', label: 'Ads', icon: 'fa-bullhorn' },
  { key: 'cash', label: 'Cash', icon: 'fa-money-bill-wave' },
];

// ─── Filter option arrays — never change, defined once at module level ────────

export const V2_DATE_OPTS = [['last-7-days', 'Last 7 Days'], ['last-30-days', 'Last 30 Days'], ['last-90-days', 'Last 90 Days'], ['ytd', 'Year to Date']];
export const V2_CAT_OPTS = [['all', 'All Categories'], ['electronics', 'Electronics'], ['home-garden', 'Home & Garden'], ['apparel', 'Apparel'], ['pet-suppliers', 'Pet Suppliers']];
export const V2_CAT_GRID = [['electronics', 'Electronics'], ['apparel', 'Apparel'], ['home-garden', 'Home & Garden'], ['pet-suppliers', 'Pet Suppliers'], ['all', 'All Categories']];
export const CAL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─── Sales tab data ─────────────────────────────────────────────────────────────

export const salesTopMovers = [
  { name: 'Premium Wireless Headphones', sku: 'B09XYZ1234', revenue: '$124,500', change: '+34.2%' },
  { name: 'Smart Home Security Camera', sku: 'B09ABC5678', revenue: '$98,700', change: '+28.1%' },
  { name: 'Organic Pet Food 15lb', sku: 'B09DEF9012', revenue: '$76,340', change: '+22.5%' },
  { name: 'Ergonomic Office Chair Pro', sku: 'B09GHI3456', revenue: '$68,900', change: '+19.8%' },
  { name: 'USB-C Hub 7-in-1', sku: 'B09JKL7890', revenue: '$54,120', change: '+15.3%' },
];

export const salesBottomMovers = [
  { name: 'Portable Charger X 20000mAh', sku: 'B09MNO1234', revenue: '$8,420', change: '-42.1%' },
  { name: 'Bamboo Cutting Board Set', sku: 'B09PQR5678', revenue: '$5,670', change: '-38.7%' },
  { name: 'Yoga Mat Eco Premium', sku: 'B09STU9012', revenue: '$4,230', change: '-31.4%' },
  { name: 'LED Desk Lamp Smart', sku: 'B09VWX3456', revenue: '$3,890', change: '-28.9%' },
  { name: 'Kitchen Timer Digital 3-Pack', sku: 'B09YZA7890', revenue: '$2,140', change: '-25.3%' },
];

export const salesRevenueData = [
  { sku: 'SKU-001', name: 'Smart Home Security Camera', channel: 'Amazon', units: 312, price: '$89.99', revenue: '$28,077', returns: 18, net: '$26,457' },
  { sku: 'SKU-002', name: 'Wireless Earbuds Pro', channel: 'Shopify', units: 284, price: '$79.99', revenue: '$22,717', returns: 9, net: '$21,997' },
  { sku: 'SKU-004', name: 'Yoga Mat Premium', channel: 'Amazon', units: 198, price: '$54.99', revenue: '$10,888', returns: 12, net: '$10,228' },
  { sku: 'SKU-005', name: 'Organic Pet Food 15lb', channel: 'TikTok', units: 420, price: '$42.99', revenue: '$18,056', returns: 5, net: '$17,841' },
  { sku: 'SKU-008', name: 'Bamboo Cutting Board Set', channel: 'Google', units: 246, price: '$34.99', revenue: '$8,607', returns: 0, net: '$8,607' },
  { sku: 'SKU-009', name: 'Running Shoes Pro', channel: 'Amazon', units: 168, price: '$124.99', revenue: '$20,999', returns: 21, net: '$18,374' },
  { sku: 'SKU-006', name: 'Desk Organizer Premium', channel: 'Amazon', units: 145, price: '$32.99', revenue: '$4,784', returns: 4, net: '$4,652' },
  { sku: 'SKU-007', name: 'Ergonomic Chair Cushion', channel: 'Shopify', units: 204, price: '$52.00', revenue: '$10,608', returns: 7, net: '$10,244' },
  { sku: 'SKU-003', name: 'Stainless Water Bottle', channel: 'eBay', units: 156, price: '$18.99', revenue: '$2,962', returns: 3, net: '$2,905' },
  { sku: 'SKU-010', name: 'Portable Bluetooth Speaker', channel: 'Amazon', units: 47, price: '$89.99', revenue: '$4,230', returns: 2, net: '$4,050' },
];

export const salesUnitsData = [
  { sku: 'SKU-005', name: 'Organic Pet Food 15lb', amazon: 180, shopify: 80, tiktok: 160, ebay: 0, google: 0, total: 420 },
  { sku: 'SKU-001', name: 'Smart Home Security Camera', amazon: 280, shopify: 0, tiktok: 0, ebay: 32, google: 0, total: 312 },
  { sku: 'SKU-002', name: 'Wireless Earbuds Pro', amazon: 0, shopify: 220, tiktok: 0, ebay: 64, google: 0, total: 284 },
  { sku: 'SKU-008', name: 'Bamboo Cutting Board Set', amazon: 0, shopify: 40, tiktok: 0, ebay: 0, google: 206, total: 246 },
  { sku: 'SKU-007', name: 'Ergonomic Chair Cushion', amazon: 80, shopify: 124, tiktok: 0, ebay: 0, google: 0, total: 204 },
  { sku: 'SKU-004', name: 'Yoga Mat Premium', amazon: 160, shopify: 0, tiktok: 38, ebay: 0, google: 0, total: 198 },
  { sku: 'SKU-009', name: 'Running Shoes Pro', amazon: 168, shopify: 0, tiktok: 0, ebay: 0, google: 0, total: 168 },
  { sku: 'SKU-003', name: 'Stainless Water Bottle', amazon: 60, shopify: 0, tiktok: 0, ebay: 96, google: 0, total: 156 },
  { sku: 'SKU-006', name: 'Desk Organizer Premium', amazon: 145, shopify: 0, tiktok: 0, ebay: 0, google: 0, total: 145 },
  { sku: 'SKU-010', name: 'Portable Bluetooth Speaker', amazon: 47, shopify: 0, tiktok: 0, ebay: 0, google: 0, total: 47 },
];

export const salesOrdersData = [
  { channel: 'Amazon', orders: 198, units: 1238, aov: '$302', revenue: '$59,796', pct: '48.1%' },
  { channel: 'Shopify', orders: 86, units: 464, aov: '$298', revenue: '$25,628', pct: '20.6%' },
  { channel: 'TikTok Shop', orders: 62, units: 198, aov: '$291', revenue: '$18,042', pct: '14.5%' },
  { channel: 'eBay', orders: 42, units: 192, aov: '$273', revenue: '$11,466', pct: '9.2%' },
  { channel: 'Google Shopping', orders: 24, units: 206, aov: '$359', revenue: '$8,616', pct: '6.9%' },
  { channel: 'Walmart', orders: 0, units: 0, aov: '—', revenue: '—', pct: '0%' },
];

export const salesAovData = [
  { sku: 'SKU-009', name: 'Running Shoes Pro', price: '$124.99', orders: 168, aov: '$124.99', vsAvg: '+$23', pctVsAvg: '+22.6%', positive: true },
  { sku: 'SKU-001', name: 'Smart Home Security Camera', price: '$89.99', orders: 312, aov: '$89.99', vsAvg: '-$12', pctVsAvg: '-11.8%', positive: false },
  { sku: 'SKU-010', name: 'Portable Bluetooth Speaker', price: '$89.99', orders: 47, aov: '$89.99', vsAvg: '-$12', pctVsAvg: '-11.8%', positive: false },
  { sku: 'SKU-002', name: 'Wireless Earbuds Pro', price: '$79.99', orders: 284, aov: '$79.99', vsAvg: '-$22', pctVsAvg: '-21.6%', positive: false },
  { sku: 'SKU-007', name: 'Ergonomic Chair Cushion', price: '$52.00', orders: 204, aov: '$52.00', vsAvg: '-$50', pctVsAvg: '-49.0%', positive: false },
  { sku: 'SKU-004', name: 'Yoga Mat Premium', price: '$54.99', orders: 198, aov: '$54.99', vsAvg: '-$47', pctVsAvg: '-46.1%', positive: false },
  { sku: 'SKU-005', name: 'Organic Pet Food 15lb', price: '$42.99', orders: 420, aov: '$42.99', vsAvg: '-$59', pctVsAvg: '-57.8%', positive: false },
  { sku: 'SKU-006', name: 'Desk Organizer Premium', price: '$32.99', orders: 145, aov: '$32.99', vsAvg: '-$69', pctVsAvg: '-67.7%', positive: false },
  { sku: 'SKU-008', name: 'Bamboo Cutting Board Set', price: '$34.99', orders: 246, aov: '$34.99', vsAvg: '-$67', pctVsAvg: '-65.7%', positive: false },
  { sku: 'SKU-003', name: 'Stainless Water Bottle', price: '$18.99', orders: 156, aov: '$18.99', vsAvg: '-$83', pctVsAvg: '-81.4%', positive: false },
];

export const CHAN_STYLE = {
  Amazon: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400' },
  Shopify: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
  TikTok: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
  Google: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' },
  eBay: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
};

export const SPARKLINE_DATA = [
  [20, 25, 18, 30, 24, 35, 28], [30, 28, 22, 25, 20, 18, 15], [18, 22, 26, 20, 28, 24, 32],
  [28, 22, 30, 18, 26, 20, 24], [14, 20, 25, 18, 30, 26, 34], [34, 28, 22, 30, 20, 24, 18],
  [20, 22, 24, 26, 28, 30, 32], [32, 28, 24, 20, 22, 18, 16], [20, 30, 16, 28, 22, 32, 25], [25, 18, 28, 20, 14, 22, 18],
];

export const CARD_COLORS = ['bg-violet-50', 'bg-sky-50', 'bg-emerald-50', 'bg-amber-50', 'bg-rose-50', 'bg-indigo-50', 'bg-teal-50', 'bg-orange-50', 'bg-cyan-50', 'bg-pink-50'];

// ─── Ads tab data ────────────────────────────────────────────────────────────────

export const campaignData = [
  { campaign: 'Security Camera — SP', type: 'SP', spend: '$1,400', revenue: '$12,500', roas: '8.9×', acos: '11.2%', impressions: '420,000', clicks: '4,200', ctr: '1.0%', cpc: '$0.33', convRate: '7.4%', status: 'Review' },
  { campaign: 'Earbuds — Sponsored Products', type: 'SP', spend: '$620', revenue: '$5,127', roas: '8.3×', acos: '12.1%', impressions: '186,000', clicks: '2,480', ctr: '1.3%', cpc: '$0.25', convRate: '4.6%', status: 'Healthy' },
  { campaign: 'Pet Food — TikTok Spark', type: 'TikTok', spend: '$150', revenue: '$2,504', roas: '16.7×', acos: '6.0%', impressions: '84,000', clicks: '1,680', ctr: '2.0%', cpc: '$0.09', convRate: '14.9%', status: 'Scale' },
  { campaign: 'Bamboo Board — Google Shop', type: 'Shopping', spend: '$210', revenue: '$3,510', roas: '16.7×', acos: '6.0%', impressions: '42,000', clicks: '840', ctr: '2.0%', cpc: '$0.25', convRate: '29.3%', status: 'Scale' },
  { campaign: 'Yoga Mat — Google PMax', type: 'PMax', spend: '$380', revenue: '$2,090', roas: '5.5×', acos: '18.2%', impressions: '95,000', clicks: '950', ctr: '1.0%', cpc: '$0.40', convRate: '8.4%', status: 'Healthy' },
  { campaign: 'Running Shoes — SP', type: 'SP', spend: '$920', revenue: '$1,288', roas: '1.4×', acos: '71.4%', impressions: '276,000', clicks: '2,760', ctr: '1.0%', cpc: '$0.33', convRate: '2.2%', status: 'Pause' },
  { campaign: 'Chair Cushion — SP', type: 'SP', spend: '$340', revenue: '$1,428', roas: '4.2×', acos: '23.8%', impressions: '102,000', clicks: '1,020', ctr: '1.0%', cpc: '$0.33', convRate: '3.8%', status: 'Healthy' },
  { campaign: 'Desk Organizer — SP', type: 'SP', spend: '$180', revenue: '$432', roas: '2.4×', acos: '41.7%', impressions: '72,000', clicks: '720', ctr: '1.0%', cpc: '$0.25', convRate: '2.8%', status: 'Review' },
];

export const platformData = [
  { platform: 'Amazon Sponsored Products', spend: '$3,460', revenue: '$20,775', roas: '6.0×', acos: '16.7%', campaigns: 5, skus: 8 },
  { platform: 'TikTok Shop Spark Ads', spend: '$150', revenue: '$2,504', roas: '16.7×', acos: '6.0%', campaigns: 1, skus: 1 },
  { platform: 'Google Shopping / PMax', spend: '$590', revenue: '$5,600', roas: '9.5×', acos: '10.5%', campaigns: 2, skus: 3 },
];

// ─── Inventory tab data ──────────────────────────────────────────────────────────

export const poDrafts = [
  { title: 'Premium Wireless Headphones', vendor: 'TechSource', lt: '14d', qty: '500 units', value: '$18,400', status: 'Critical' },
  { title: 'USB-C Hub 7-in-1', vendor: 'ComponentPro', lt: '21d', qty: '300 units', value: '$12,200', status: 'High' },
  { title: 'Pet Grooming Kit 5-Piece', vendor: 'PetSupplies Co', lt: '10d', qty: '200 units', value: '$8,600', status: 'Medium' },
];

export const overstockItems = [
  { title: 'Bamboo Cutting Board Set', doc: '245d', units: '890', value: '$42,720', action: 'Liquidate', sub: 'Tied up capital · DOC critical' },
  { title: 'Kitchen Timer Digital 3-Pack', doc: '210d', units: '1,420', value: '$28,400', action: 'Discount', sub: 'Slow moving · consider bundle' },
  { title: 'Winter Coats (Old Season)', doc: '195d', units: '320', value: '$22,400', action: 'Bundle', sub: 'Seasonal overhang · offload' },
];
