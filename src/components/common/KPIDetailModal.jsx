import React from 'react';
import BaseModal from './BaseModal';

/* ── Period labels ─────────────────────────────────────────────── */
const PERIOD_LABELS = {
  'last-7-days':  'Last 7 Days',
  'last-30-days': 'Last 30 Days',
  'last-90-days': 'Last 90 Days',
  'ytd':          'Year to Date',
  'custom':       'Custom Range',
};

/* ── Format helpers ────────────────────────────────────────────── */
const $c = (n) => {
  if (n == null) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000)    return `$${(n / 1000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};
const fN = (n) => n == null ? '—' : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toLocaleString();
const fP = (n) => n == null ? '—' : `${(+n).toFixed(1)}%`;
const fX = (n) => n == null ? '—' : `${(+n).toFixed(2)}x`;
const fPr = (n) => n == null ? '—' : `$${(+n).toFixed(2)}`;

/* ── Product master data ───────────────────────────────────────── */
const SKUS = [
  {
    sku: 'SKU-001', name: 'Smart Home Security Camera', cat: 'Electronics', channel: 'Amazon',
    units: 302, price: 88.0, revenue: 26576,
    cogs: 11476, grossMargin: 15100, gmPct: 56.8,
    adSpend: 2988, returnQty: 10, returnVal: 880, netSettled: 25696,
    stock: 124, dailySales: 43.1, doc: 2.9, docStatus: 'Low',
    buyBoxPct: 94, bbStatus: 'Winning', competitorPrice: 84.99,
    orders: 74, roas: 8.9, ctr: 1.8, cpc: 0.58, convRate: 3.8, tacos: 11.2,
    newCust: 84, returnReason: 'Changed mind',
    cm2: 8612, cm3: 7880,
  },
  {
    sku: 'SKU-002', name: 'Wireless Earbuds Pro', cat: 'Electronics', channel: 'Amazon',
    units: 412, price: 52.0, revenue: 21424,
    cogs: 9064, grossMargin: 12360, gmPct: 57.7,
    adSpend: 2143, returnQty: 12, returnVal: 624, netSettled: 20800,
    stock: 284, dailySales: 58.9, doc: 4.8, docStatus: 'Healthy',
    buyBoxPct: 88, bbStatus: 'Winning', competitorPrice: 51.50,
    orders: 92, roas: 10.0, ctr: 1.8, cpc: 0.24, convRate: 4.2, tacos: 10.0,
    newCust: 64, returnReason: 'Sound quality',
    cm2: 7498, cm3: 6760,
  },
  {
    sku: 'SKU-003', name: 'Portable Charger 20K', cat: 'Electronics', channel: 'Shopify',
    units: 386, price: 39.0, revenue: 15054,
    cogs: 6562, grossMargin: 8492, gmPct: 56.4,
    adSpend: 1204, returnQty: 8, returnVal: 312, netSettled: 14742,
    stock: 312, dailySales: 55.1, doc: 5.7, docStatus: 'Healthy',
    buyBoxPct: 72, bbStatus: 'Winning', competitorPrice: 36.99,
    orders: 62, roas: 12.5, ctr: 1.8, cpc: 0.32, convRate: 3.9, tacos: 8.0,
    newCust: 52, returnReason: 'Charging speed',
    cm2: 4816, cm3: 4280,
  },
  {
    sku: 'SKU-004', name: 'Desk Organizer Premium', cat: 'Home & Garden', channel: 'Shopify',
    units: 218, price: 59.0, revenue: 12862,
    cogs: 5886, grossMargin: 6976, gmPct: 54.2,
    adSpend: 1029, returnQty: 7, returnVal: 413, netSettled: 12449,
    stock: 188, dailySales: 31.1, doc: 6.0, docStatus: 'Healthy',
    buyBoxPct: 41, bbStatus: 'Lost', competitorPrice: 53.99,
    orders: 48, roas: 12.5, ctr: 1.8, cpc: 0.33, convRate: 3.6, tacos: 8.0,
    newCust: 38, returnReason: 'Size mismatch',
    cm2: 2576, cm3: 2090,
  },
  {
    sku: 'SKU-005', name: 'Organic Pet Food 15lb', cat: 'Pet Supplies', channel: 'TikTok Shop',
    units: 196, price: 47.0, revenue: 9212,
    cogs: 3501, grossMargin: 5711, gmPct: 62.0,
    adSpend: 553, returnQty: 2, returnVal: 94, netSettled: 9118,
    stock: 92, dailySales: 28.0, doc: 3.3, docStatus: 'Low',
    buyBoxPct: 98, bbStatus: 'Winning', competitorPrice: 49.99,
    orders: 36, roas: 16.7, ctr: 2.0, cpc: 0.05, convRate: 3.3, tacos: 6.0,
    newCust: 112, returnReason: 'N/A',
    cm2: 3604, cm3: 3220,
  },
  {
    sku: 'SKU-006', name: 'LED Ring Light 10"', cat: 'Electronics', channel: 'Amazon',
    units: 168, price: 50.0, revenue: 8400,
    cogs: 3528, grossMargin: 4872, gmPct: 58.0,
    adSpend: 840, returnQty: 6, returnVal: 300, netSettled: 8100,
    stock: 168, dailySales: 24.0, doc: 7.0, docStatus: 'Healthy',
    buyBoxPct: 86, bbStatus: 'Winning', competitorPrice: 50.00,
    orders: 34, roas: 10.0, ctr: 1.8, cpc: 0.38, convRate: 3.4, tacos: 10.0,
    newCust: 28, returnReason: 'Brightness',
    cm2: 2520, cm3: 2100,
  },
  {
    sku: 'SKU-007', name: 'Ergonomic Chair Cushion', cat: 'Home & Garden', channel: 'Shopify',
    units: 148, price: 52.0, revenue: 7696,
    cogs: 3256, grossMargin: 4440, gmPct: 57.7,
    adSpend: 616, returnQty: 5, returnVal: 260, netSettled: 7436,
    stock: 204, dailySales: 21.1, doc: 9.7, docStatus: 'Excess',
    buyBoxPct: 79, bbStatus: 'Winning', competitorPrice: 52.50,
    orders: 28, roas: 12.5, ctr: 1.8, cpc: 0.35, convRate: 3.7, tacos: 8.0,
    newCust: 24, returnReason: 'Comfort',
    cm2: 2464, cm3: 2156,
  },
  {
    sku: 'SKU-008', name: 'Bamboo Cutting Board Set', cat: 'Home & Garden', channel: 'Amazon',
    units: 124, price: 52.0, revenue: 6448,
    cogs: 2318, grossMargin: 4130, gmPct: 64.1,
    adSpend: 387, returnQty: 3, returnVal: 156, netSettled: 6292,
    stock: 246, dailySales: 17.7, doc: 13.9, docStatus: 'Excess',
    buyBoxPct: 92, bbStatus: 'Winning', competitorPrice: 54.00,
    orders: 22, roas: 16.7, ctr: 1.8, cpc: 0.28, convRate: 4.1, tacos: 6.0,
    newCust: 18, returnReason: 'N/A',
    cm2: 2004, cm3: 1740,
  },
  {
    sku: 'SKU-009', name: 'Running Shoes Pro', cat: 'Apparel', channel: 'Shopify',
    units: 112, price: 88.0, revenue: 9856,
    cogs: 4437, grossMargin: 5419, gmPct: 55.0,
    adSpend: 788, returnQty: 14, returnVal: 1232, netSettled: 8624,
    stock: 142, dailySales: 16.0, doc: 8.9, docStatus: 'Healthy',
    buyBoxPct: 100, bbStatus: 'Winning', competitorPrice: 90.00,
    orders: 24, roas: 12.5, ctr: 1.8, cpc: 0.55, convRate: 3.4, tacos: 8.0,
    newCust: 44, returnReason: 'Size issues',
    cm2: 2616, cm3: 2240,
  },
  {
    sku: 'SKU-010', name: 'Yoga Mat Premium', cat: 'Apparel', channel: 'TikTok Shop',
    units: 114, price: 62.0, revenue: 7068,
    cogs: 2686, grossMargin: 4382, gmPct: 62.0,
    adSpend: 424, returnQty: 3, returnVal: 186, netSettled: 6882,
    stock: 186, dailySales: 16.3, doc: 11.4, docStatus: 'Healthy',
    buyBoxPct: 95, bbStatus: 'Winning', competitorPrice: 64.00,
    orders: 20, roas: 16.7, ctr: 1.8, cpc: 0.25, convRate: 3.6, tacos: 6.0,
    newCust: 36, returnReason: 'N/A',
    cm2: 2544, cm3: 2232,
  },
];

/* ── Ads campaign data ─────────────────────────────────────────── */
const CAMPAIGNS = [
  { name: 'Security Camera - Sponsored Products', sku: 'SKU-001', type: 'SP', spend: 2988, revenue: 26576, roas: 8.9, impressions: 284000, clicks: 5112, orders: 74, ctr: 1.8, cpc: 0.58, convRate: 3.8, tacos: 11.2, acos: 11.2 },
  { name: 'Earbuds Pro - Sponsored Products',      sku: 'SKU-002', type: 'SP', spend: 2143, revenue: 21424, roas: 10.0, impressions: 412000, clicks: 7416, orders: 92, ctr: 1.8, cpc: 0.24, convRate: 4.2, tacos: 10.0, acos: 10.0 },
  { name: 'Portable Charger - Sponsored Display',  sku: 'SKU-003', type: 'SD', spend: 1204, revenue: 15054, roas: 12.5, impressions: 186000, clicks: 3348, orders: 62, ctr: 1.8, cpc: 0.32, convRate: 3.9, tacos:  8.0, acos:  8.0 },
  { name: 'Home Category - Sponsored Brands',      sku: 'Mixed',   type: 'SB', spend: 1645, revenue: 20558, roas:  12.5, impressions: 380000, clicks: 6840, orders: 76, ctr: 1.8, cpc: 0.24, convRate: 3.7, tacos:  8.0, acos:  8.0 },
  { name: 'Pet Food - TikTok Ads',                 sku: 'SKU-005', type: 'TT', spend:  553, revenue:  9212, roas: 16.7, impressions: 526000, clicks: 10520, orders: 36, ctr: 2.0, cpc: 0.05, convRate: 3.3, tacos:  6.0, acos:  6.0 },
  { name: 'Yoga Mat - TikTok Ads',                 sku: 'SKU-010', type: 'TT', spend:  424, revenue:  7068, roas: 16.7, impressions:  84000, clicks:  1512, orders: 20, ctr: 1.8, cpc: 0.25, convRate: 3.6, tacos:  6.0, acos:  6.0 },
  { name: 'Ring Light - Sponsored Products',       sku: 'SKU-006', type: 'SP', spend:  840, revenue:  8400, roas: 10.0, impressions: 124000, clicks:  2232, orders: 34, ctr: 1.8, cpc: 0.38, convRate: 3.4, tacos: 10.0, acos: 10.0 },
  { name: 'Running Shoes - Google Shopping',       sku: 'SKU-009', type: 'GS', spend:  788, revenue:  9856, roas: 12.5, impressions:  68000, clicks:  1224, orders: 24, ctr: 1.8, cpc: 0.55, convRate: 3.4, tacos:  8.0, acos:  8.0 },
];

/* ── Settlement / cash data ────────────────────────────────────── */
const SETTLEMENTS = [
  { platform: 'Amazon',      period: 'Jun 16–22',  grossSales: 72458, fees: 10868, refunds: 2180, adFees: 7449, net: 51961, status: 'Settled',  date: 'Jun 24' },
  { platform: 'Shopify',     period: 'Jun 16–22',  grossSales: 34682, fees:  1040, refunds:  968, adFees: 1648, net: 31026, status: 'Settled',  date: 'Jun 23' },
  { platform: 'TikTok Shop', period: 'Jun 16–22',  grossSales: 16280, fees:  1465, refunds:  280, adFees:  977, net: 13558, status: 'Processing', date: 'Jun 27' },
  { platform: 'Amazon',      period: 'Jun 9–15',   grossSales: 68900, fees: 10335, refunds: 1860, adFees: 7024, net: 49681, status: 'Settled',  date: 'Jun 17' },
  { platform: 'Shopify',     period: 'Jun 9–15',   grossSales: 31240, fees:   937, refunds:  780, adFees: 1530, net: 27993, status: 'Settled',  date: 'Jun 16' },
];

const OUTFLOWS = [
  { category: 'Inventory Restock',  description: 'PO #4821 — Electronics restock',       amount: 28400, date: 'Jun 20', status: 'Paid'    },
  { category: 'Ad Spend',           description: 'Amazon Ads — Jun 16-22',                amount: 14962, date: 'Jun 22', status: 'Paid'    },
  { category: 'Fulfillment / FBA',  description: 'Amazon FBA fees — Jun 16-22',           amount: 10868, date: 'Jun 22', status: 'Paid'    },
  { category: 'Platform Fees',      description: 'Shopify + TikTok platform fees',        amount:  2505, date: 'Jun 22', status: 'Paid'    },
  { category: 'Inventory Restock',  description: 'PO #4820 — Home & Garden restock',     amount: 18600, date: 'Jun 18', status: 'Paid'    },
  { category: 'Returns & Refunds',  description: 'Customer refunds processed',            amount:  4457, date: 'Jun 21', status: 'Paid'    },
  { category: 'Shipping & Freight', description: 'Inbound freight — PO #4819',            amount:  3840, date: 'Jun 15', status: 'Paid'    },
  { category: 'SaaS / Software',    description: 'Tools & subscriptions',                  amount:  1240, date: 'Jun 1',  status: 'Paid'    },
];

/* ── Table config per KPI ──────────────────────────────────────── */
const getTableDef = (title) => {
  /* ─ Total Revenue ──────────────────────────────────────────── */
  if (title === 'Total Revenue') return {
    summary: [
      { label: 'Total SKUs', value: '10' },
      { label: 'Avg Rev / SKU', value: $c(124500 / 10) },
      { label: 'Total Returns', value: $c(4457) },
      { label: 'Net Settled', value: $c(124500 - 4457) },
    ],
    cols: [
      { label: 'Product',      key: 'name',       cls: 'text-left',  minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',      key: 'channel',    cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Units Sold',   key: 'units',      cls: 'text-right', render: (r) => <span className="font-medium text-gray-800 dark:text-slate-200">{fN(r.units)}</span> },
      { label: 'Unit Price',   key: 'price',      cls: 'text-right', render: (r) => <span>{fPr(r.price)}</span> },
      { label: 'Revenue',      key: 'revenue',    cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{$c(r.revenue)}</span> },
      { label: 'Return Qty',   key: 'returnQty',  cls: 'text-right', render: (r) => <ReturnQtyCell qty={r.returnQty} units={r.units} /> },
      { label: 'Returns Value',key: 'returnVal',  cls: 'text-right', render: (r) => <span className="text-red-500 dark:text-red-400">{$c(r.returnVal)}</span> },
      { label: 'Net Settled',  key: 'netSettled', cls: 'text-right', render: (r) => <span className="font-semibold text-green-600 dark:text-green-400">{$c(r.netSettled)}</span> },
    ],
    rows: SKUS,
    totals: { name: 'TOTAL', units: 2180, revenue: 124500, returnQty: 70, returnVal: 4457, netSettled: 120043 },
  };

  /* ─ Units Sold ─────────────────────────────────────────────── */
  if (title === 'Units Sold') return {
    summary: [
      { label: 'Active SKUs', value: '10' },
      { label: 'Avg Units / SKU', value: fN(2180 / 10) },
      { label: 'Top SKU', value: 'Earbuds Pro' },
      { label: 'Returns (units)', value: '70' },
    ],
    cols: [
      { label: 'Product',     key: 'name',      cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',     key: 'channel',   cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Units Sold',  key: 'units',     cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{fN(r.units)}</span> },
      { label: '% of Total',  key: 'pct',       cls: 'text-right', render: (r) => <PctBar pct={(r.units / 2180 * 100).toFixed(1)} /> },
      { label: 'Unit Price',  key: 'price',     cls: 'text-right', render: (r) => <span>{fPr(r.price)}</span> },
      { label: 'Revenue',     key: 'revenue',   cls: 'text-right', render: (r) => <span className="font-medium">{$c(r.revenue)}</span> },
      { label: 'Returns',     key: 'returnQty', cls: 'text-right', render: (r) => <ReturnQtyCell qty={r.returnQty} units={r.units} /> },
    ],
    rows: [...SKUS].sort((a, b) => b.units - a.units),
    totals: { name: 'TOTAL', units: 2180, revenue: 124500, returnQty: 70 },
  };

  /* ─ Total Orders ───────────────────────────────────────────── */
  if (title === 'Total Orders') return {
    summary: [
      { label: 'Total Orders', value: '412' },
      { label: 'Avg Units / Order', value: fP(2180 / 412) },
      { label: 'Avg Order Value', value: $c(124500 / 412) },
      { label: 'Returned Orders', value: '28' },
    ],
    cols: [
      { label: 'Product',         key: 'name',    cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',         key: 'channel', cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Orders',          key: 'orders',  cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{r.orders}</span> },
      { label: 'Units / Order',   key: 'upo',     cls: 'text-right', render: (r) => <span>{(r.units / r.orders).toFixed(1)}</span> },
      { label: 'Avg Order Value', key: 'aov',     cls: 'text-right', render: (r) => <span className="font-medium">{$c(r.revenue / r.orders)}</span> },
      { label: 'Revenue',         key: 'revenue', cls: 'text-right', render: (r) => <span>{$c(r.revenue)}</span> },
      { label: 'Return Orders',   key: 'retOrd',  cls: 'text-right', render: (r) => <span className={r.returnQty > 10 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'}>{Math.round(r.returnQty * 0.6)}</span> },
    ],
    rows: [...SKUS].sort((a, b) => b.orders - a.orders),
    totals: { name: 'TOTAL', orders: 412, revenue: 124500 },
  };

  /* ─ Avg Order Value ────────────────────────────────────────── */
  if (title === 'Avg Order Value') return {
    summary: [
      { label: 'Portfolio AOV', value: '$302' },
      { label: 'Highest AOV SKU', value: 'Security Cam' },
      { label: 'Lowest AOV SKU', value: 'Portable Charger' },
      { label: 'AOV vs Prior', value: '+$12.40' },
    ],
    cols: [
      { label: 'Product',         key: 'name',    cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',         key: 'channel', cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Orders',          key: 'orders',  cls: 'text-right', render: (r) => <span>{r.orders}</span> },
      { label: 'Avg Order Value', key: 'aov',     cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{$c(r.revenue / r.orders)}</span> },
      { label: 'Units / Order',   key: 'upo',     cls: 'text-right', render: (r) => <span>{(r.units / r.orders).toFixed(1)}</span> },
      { label: 'vs Avg ($302)',   key: 'vsAvg',   cls: 'text-right', render: (r) => { const v = r.revenue/r.orders - 302; return <span className={v >= 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 dark:text-red-400 font-medium'}>{v >= 0 ? '+' : ''}{$c(Math.abs(v))}</span>; } },
      { label: 'Revenue',         key: 'revenue', cls: 'text-right', render: (r) => <span>{$c(r.revenue)}</span> },
    ],
    rows: [...SKUS].sort((a, b) => (b.revenue / b.orders) - (a.revenue / a.orders)),
    totals: null,
  };

  /* ─ Buy Box % ──────────────────────────────────────────────── */
  if (title === 'Buy Box %') return {
    summary: [
      { label: 'Overall Buy Box', value: '87.4%' },
      { label: 'SKUs Winning',    value: '9 / 10' },
      { label: 'SKUs Lost',       value: '1 / 10' },
      { label: 'Revenue at Risk', value: $c(12862) },
    ],
    cols: [
      { label: 'Product',          key: 'name',  cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',          key: 'ch',    cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Buy Box %',        key: 'bb',    cls: 'text-right', render: (r) => <BBCell pct={r.buyBoxPct} status={r.bbStatus} /> },
      { label: 'Status',           key: 'bbs',   cls: 'text-center',render: (r) => <BBStatus status={r.bbStatus} /> },
      { label: 'Your Price',       key: 'yp',    cls: 'text-right', render: (r) => <span className="font-medium">{fPr(r.price)}</span> },
      { label: 'Lowest Competitor',key: 'comp',  cls: 'text-right', render: (r) => <span>{fPr(r.competitorPrice)}</span> },
      { label: 'Price Gap',        key: 'gap',   cls: 'text-right', render: (r) => { const g = r.price - r.competitorPrice; return <span className={g > 0 ? 'text-red-500 dark:text-red-400 font-medium' : 'text-green-600 dark:text-green-400 font-medium'}>{g > 0 ? '+' : ''}{fPr(g)}</span>; } },
      { label: 'Revenue',          key: 'rev',   cls: 'text-right', render: (r) => <span>{$c(r.revenue)}</span> },
    ],
    rows: [...SKUS].sort((a, b) => a.buyBoxPct - b.buyBoxPct),
    totals: null,
  };

  /* ─ Return Rate ────────────────────────────────────────────── */
  if (title === 'Return Rate') return {
    summary: [
      { label: 'Overall Return Rate', value: '3.2%' },
      { label: 'Total Returns',       value: '70 units' },
      { label: 'Total Refund Value',  value: $c(4457) },
      { label: 'Net Revenue Impact',  value: $c(124500 - 4457) },
    ],
    cols: [
      { label: 'Product',       key: 'name',      cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',       key: 'ch',        cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Units Sold',    key: 'units',     cls: 'text-right', render: (r) => <span>{fN(r.units)}</span> },
      { label: 'Returns',       key: 'returnQty', cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{r.returnQty}</span> },
      { label: 'Return Rate',   key: 'rr',        cls: 'text-right', render: (r) => { const rr = r.returnQty / r.units * 100; return <span className={rr > 8 ? 'text-red-500 dark:text-red-400 font-semibold' : rr > 4 ? 'text-amber-500 dark:text-amber-400 font-medium' : 'text-green-600 dark:text-green-400 font-medium'}>{fP(rr)}</span>; } },
      { label: 'Refund Value',  key: 'returnVal', cls: 'text-right', render: (r) => <span className="text-red-500 dark:text-red-400">{$c(r.returnVal)}</span> },
      { label: 'Top Reason',    key: 'reason',    cls: 'text-left',  render: (r) => <span className="text-xs text-gray-500 dark:text-slate-400">{r.returnReason}</span> },
    ],
    rows: [...SKUS].sort((a, b) => (b.returnQty / b.units) - (a.returnQty / a.units)),
    totals: { name: 'TOTAL', units: 2180, returnQty: 70, returnVal: 4457 },
  };

  /* ─ New Customers ──────────────────────────────────────────── */
  if (title === 'New Customers') return {
    summary: [
      { label: 'Total New Customers', value: '287' },
      { label: 'Avg First Order AOV', value: $c(124500 / 287) },
      { label: 'Organic Share',       value: '38%' },
      { label: 'CAC (blended)',        value: $c(24800 / 287) },
    ],
    cols: [
      { label: 'Product',           key: 'name',   cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',           key: 'ch',     cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'New Customers',     key: 'nc',     cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{r.newCust}</span> },
      { label: '% of Total',        key: 'pct',    cls: 'text-right', render: (r) => <PctBar pct={(r.newCust / 287 * 100).toFixed(1)} /> },
      { label: 'First Order AOV',   key: 'faov',   cls: 'text-right', render: (r) => <span>{$c(r.revenue / r.newCust)}</span> },
      { label: 'CAC',               key: 'cac',    cls: 'text-right', render: (r) => <span>{$c(r.adSpend / r.newCust)}</span> },
      { label: 'Revenue from New',  key: 'rev',    cls: 'text-right', render: (r) => <span>{$c(r.revenue * 0.38)}</span> },
    ],
    rows: [...SKUS].sort((a, b) => b.newCust - a.newCust),
    totals: { name: 'TOTAL', newCust: 287 },
  };

  /* ─ ROAS ───────────────────────────────────────────────────── */
  if (['ROAS', 'Margin-Adj ROAS'].includes(title)) return {
    summary: [
      { label: 'Portfolio ROAS',  value: '4.2x' },
      { label: 'Total Ad Spend',  value: $c(24962) },
      { label: 'Ad Revenue',      value: $c(124500) },
      { label: 'Blended ACoS',    value: '20.1%' },
    ],
    cols: [
      { label: 'Campaign',       key: 'name',    cls: 'text-left', minW: 200, render: (r) => <CampaignCell name={r.name} sku={r.sku} type={r.type} /> },
      { label: 'Ad Type',        key: 'type',    cls: 'text-center', render: (r) => <AdTypeBadge t={r.type} /> },
      { label: 'Ad Spend',       key: 'spend',   cls: 'text-right', render: (r) => <span>{$c(r.spend)}</span> },
      { label: 'Ad Revenue',     key: 'revenue', cls: 'text-right', render: (r) => <span>{$c(r.revenue)}</span> },
      { label: 'ROAS',           key: 'roas',    cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{fX(r.roas)}</span> },
      { label: 'Impressions',    key: 'imp',     cls: 'text-right', render: (r) => <span>{fN(r.impressions)}</span> },
      { label: 'Conv. Rate',     key: 'cvr',     cls: 'text-right', render: (r) => <span>{fP(r.convRate)}</span> },
      { label: 'ACoS',           key: 'acos',    cls: 'text-right', render: (r) => <span className={r.acos > 15 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>{fP(r.acos)}</span> },
    ],
    rows: [...CAMPAIGNS].sort((a, b) => b.revenue - a.revenue),
    totals: { name: 'TOTAL', spend: 24962, revenue: 124500 },
  };

  /* ─ Total Ad Spend ─────────────────────────────────────────── */
  if (title === 'Total Ad Spend') return {
    summary: [
      { label: 'Total Ad Spend', value: $c(24962) },
      { label: 'Portfolio ROAS', value: '4.2x' },
      { label: 'Total Impressions', value: fN(1562000) },
      { label: 'Avg CPC', value: '$0.38' },
    ],
    cols: [
      { label: 'Campaign',      key: 'name',  cls: 'text-left', minW: 200, render: (r) => <CampaignCell name={r.name} sku={r.sku} type={r.type} /> },
      { label: 'Ad Type',       key: 'type',  cls: 'text-center', render: (r) => <AdTypeBadge t={r.type} /> },
      { label: 'Spend',         key: 'spend', cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{$c(r.spend)}</span> },
      { label: '% of Budget',   key: 'pct',   cls: 'text-right', render: (r) => <PctBar pct={(r.spend / 24962 * 100).toFixed(1)} /> },
      { label: 'Impressions',   key: 'imp',   cls: 'text-right', render: (r) => <span>{fN(r.impressions)}</span> },
      { label: 'Clicks',        key: 'clk',   cls: 'text-right', render: (r) => <span>{fN(r.clicks)}</span> },
      { label: 'CPC',           key: 'cpc',   cls: 'text-right', render: (r) => <span>{fPr(r.cpc)}</span> },
      { label: 'ROAS',          key: 'roas',  cls: 'text-right', render: (r) => <span className={r.roas >= 4 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-amber-500'}>{fX(r.roas)}</span> },
    ],
    rows: [...CAMPAIGNS].sort((a, b) => b.spend - a.spend),
    totals: { name: 'TOTAL', spend: 24962, impressions: 1562000, clicks: 33128 },
  };

  /* ─ CTR / CPC / Impressions / Conv. Rate / TACOS ───────────── */
  if (['CTR', 'CPC', 'Impressions', 'Conv. Rate', 'TACOS'].includes(title)) return {
    summary: [
      { label: 'Total Impressions', value: fN(1562000) },
      { label: 'Total Clicks',      value: fN(33128) },
      { label: 'Blended CTR',       value: '2.1%' },
      { label: 'Avg CPC',           value: '$0.38' },
    ],
    cols: [
      { label: 'Campaign',     key: 'name', cls: 'text-left', minW: 200, render: (r) => <CampaignCell name={r.name} sku={r.sku} type={r.type} /> },
      { label: 'Ad Type',      key: 'type', cls: 'text-center', render: (r) => <AdTypeBadge t={r.type} /> },
      { label: 'Impressions',  key: 'imp',  cls: 'text-right', render: (r) => <span>{fN(r.impressions)}</span> },
      { label: 'Clicks',       key: 'clk',  cls: 'text-right', render: (r) => <span>{fN(r.clicks)}</span> },
      { label: 'CTR',          key: 'ctr',  cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{fP(r.ctr)}</span> },
      { label: 'CPC',          key: 'cpc',  cls: 'text-right', render: (r) => <span>{fPr(r.cpc)}</span> },
      { label: 'Conv. Rate',   key: 'cvr',  cls: 'text-right', render: (r) => <span>{fP(r.convRate)}</span> },
      { label: 'Orders',       key: 'ord',  cls: 'text-right', render: (r) => <span>{r.orders}</span> },
    ],
    rows: [...CAMPAIGNS].sort((a, b) => b.impressions - a.impressions),
    totals: { name: 'TOTAL', impressions: 1562000, clicks: 33128, orders: 412 },
  };

  /* ─ Margin KPIs ────────────────────────────────────────────── */
  if (['CM2 Cross-Ch.', 'CM3 Channel', 'Gross Margin %', 'Contribution %', 'Net Profit', 'COGS'].includes(title)) return {
    summary: [
      { label: 'Total Revenue',   value: $c(124500) },
      { label: 'Total COGS',      value: $c(SKUS.reduce((s, r) => s + r.cogs, 0)) },
      { label: 'Gross Margin',    value: $c(SKUS.reduce((s, r) => s + r.grossMargin, 0)) },
      { label: 'Avg GM%',         value: fP(SKUS.reduce((s, r) => s + r.grossMargin, 0) / 124500 * 100) },
    ],
    cols: [
      { label: 'Product',      key: 'name',        cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',      key: 'ch',          cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Revenue',      key: 'revenue',     cls: 'text-right', render: (r) => <span>{$c(r.revenue)}</span> },
      { label: 'COGS',         key: 'cogs',        cls: 'text-right', render: (r) => <span>{$c(r.cogs)}</span> },
      { label: 'Gross Margin', key: 'gm',          cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{$c(r.grossMargin)}</span> },
      { label: 'GM %',         key: 'gmPct',       cls: 'text-right', render: (r) => <span className={r.gmPct >= 55 ? 'text-green-600 dark:text-green-400 font-medium' : r.gmPct >= 45 ? 'text-amber-500 font-medium' : 'text-red-500 font-medium'}>{fP(r.gmPct)}</span> },
      { label: 'Ad Spend',     key: 'adSpend',     cls: 'text-right', render: (r) => <span>{$c(r.adSpend)}</span> },
      { label: 'Contribution', key: 'cm2',         cls: 'text-right', render: (r) => <span className="font-medium text-green-700 dark:text-green-400">{$c(r.cm2)}</span> },
    ],
    rows: [...SKUS].sort((a, b) => b.grossMargin - a.grossMargin),
    totals: { name: 'TOTAL', revenue: 124500, cogs: SKUS.reduce((s, r) => s + r.cogs, 0), grossMargin: SKUS.reduce((s, r) => s + r.grossMargin, 0) },
  };

  /* ─ Unprofitable SKUs / Pricing Opps ──────────────────────── */
  if (['Unprofitable SKUs', 'Pricing Opps'].includes(title)) return {
    summary: [
      { label: 'SKUs Analysed', value: '10' },
      { label: 'Unprofitable', value: '1' },
      { label: 'Pricing Opportunities', value: '3' },
      { label: 'Est. Uplift', value: '+$8,400' },
    ],
    cols: [
      { label: 'Product',        key: 'name',    cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',        key: 'ch',      cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Current Price',  key: 'price',   cls: 'text-right', render: (r) => <span className="font-medium">{fPr(r.price)}</span> },
      { label: 'Competitor',     key: 'comp',    cls: 'text-right', render: (r) => <span>{fPr(r.competitorPrice)}</span> },
      { label: 'Price Gap',      key: 'gap',     cls: 'text-right', render: (r) => { const g = r.price - r.competitorPrice; return <span className={g > 2 ? 'text-red-500 dark:text-red-400 font-medium' : g < -2 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500'}>{g > 0 ? '+' : ''}{fPr(g)}</span>; } },
      { label: 'GM %',           key: 'gmPct',   cls: 'text-right', render: (r) => <span className={r.gmPct >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>{fP(r.gmPct)}</span> },
      { label: 'Revenue',        key: 'revenue', cls: 'text-right', render: (r) => <span>{$c(r.revenue)}</span> },
    ],
    rows: [...SKUS].sort((a, b) => a.gmPct - b.gmPct),
    totals: null,
  };

  /* ─ Inventory KPIs ─────────────────────────────────────────── */
  if (['Inventory at Cost', 'DOC (Avg)', 'OOS Risk SKUs', 'Overstock Value', 'In-Stock %', 'Inventory Turns', 'Reorder Alerts', 'Inbound POs'].includes(title)) return {
    summary: [
      { label: 'Total SKUs', value: '10' },
      { label: 'Total Inv. Value', value: $c(SKUS.reduce((s, r) => s + r.stock * r.price * 0.43, 0)) },
      { label: 'Avg DOC', value: '8.2 days' },
      { label: 'At Risk SKUs', value: '2' },
    ],
    cols: [
      { label: 'Product',         key: 'name',       cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',         key: 'ch',         cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Units in Stock',  key: 'stock',      cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{fN(r.stock)}</span> },
      { label: 'Cost / Unit',     key: 'costPer',    cls: 'text-right', render: (r) => <span>{fPr(r.price * 0.43)}</span> },
      { label: 'Total Inv. Value',key: 'invVal',     cls: 'text-right', render: (r) => <span>{$c(r.stock * r.price * 0.43)}</span> },
      { label: 'Daily Sales',     key: 'ds',         cls: 'text-right', render: (r) => <span>{r.dailySales.toFixed(1)}/day</span> },
      { label: 'DOC',             key: 'doc',        cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{r.doc.toFixed(1)} days</span> },
      { label: 'Status',          key: 'docStatus',  cls: 'text-center',render: (r) => <DOCStatus s={r.docStatus} /> },
    ],
    rows: [...SKUS].sort((a, b) => a.doc - b.doc),
    totals: null,
  };

  /* ─ Cash: inflow/outflow/balance/net/payout/burn/ar/projection */
  if (['Cash Balance', 'Cash Inflow', 'Net Cash Flow', '30-Day Projection'].includes(title)) return {
    summary: [
      { label: 'Total Settled',   value: $c(SETTLEMENTS.filter(s => s.status === 'Settled').reduce((a, s) => a + s.net, 0)) },
      { label: 'Processing',      value: $c(SETTLEMENTS.filter(s => s.status === 'Processing').reduce((a, s) => a + s.net, 0)) },
      { label: 'Total Fees',      value: $c(SETTLEMENTS.reduce((a, s) => a + s.fees, 0)) },
      { label: 'Total Refunds',   value: $c(SETTLEMENTS.reduce((a, s) => a + s.refunds, 0)) },
    ],
    cols: [
      { label: 'Platform',        key: 'platform', cls: 'text-left',  minW: 120, render: (r) => <ChannelBadge ch={r.platform} /> },
      { label: 'Period',          key: 'period',   cls: 'text-left',  render: (r) => <span className="text-xs text-gray-500 dark:text-slate-400">{r.period}</span> },
      { label: 'Gross Sales',     key: 'gs',       cls: 'text-right', render: (r) => <span className="font-medium">{$c(r.grossSales)}</span> },
      { label: 'Platform Fees',   key: 'fees',     cls: 'text-right', render: (r) => <span className="text-red-500 dark:text-red-400">{$c(r.fees)}</span> },
      { label: 'Ad Fees',         key: 'adFees',   cls: 'text-right', render: (r) => <span className="text-red-500 dark:text-red-400">{$c(r.adFees)}</span> },
      { label: 'Refunds',         key: 'refunds',  cls: 'text-right', render: (r) => <span className="text-red-400 dark:text-red-300">{$c(r.refunds)}</span> },
      { label: 'Net Payout',      key: 'net',      cls: 'text-right', render: (r) => <span className="font-semibold text-green-600 dark:text-green-400">{$c(r.net)}</span> },
      { label: 'Status',          key: 'status',   cls: 'text-center',render: (r) => <SettlementStatus s={r.status} date={r.date} /> },
    ],
    rows: SETTLEMENTS,
    totals: {
      name: 'TOTAL',
      grossSales: SETTLEMENTS.reduce((a, s) => a + s.grossSales, 0),
      fees: SETTLEMENTS.reduce((a, s) => a + s.fees, 0),
      adFees: SETTLEMENTS.reduce((a, s) => a + s.adFees, 0),
      refunds: SETTLEMENTS.reduce((a, s) => a + s.refunds, 0),
      net: SETTLEMENTS.reduce((a, s) => a + s.net, 0),
    },
  };

  if (['Cash Outflow', 'Burn Rate/Day', 'AR Outstanding', 'Payouts Pending'].includes(title)) return {
    summary: [
      { label: 'Total Outflow',   value: $c(OUTFLOWS.reduce((a, r) => a + r.amount, 0)) },
      { label: 'Largest Item',    value: 'Inv. Restock' },
      { label: 'Avg Daily Burn',  value: $c(Math.round(OUTFLOWS.reduce((a, r) => a + r.amount, 0) / 7)) },
      { label: 'vs Prior Period', value: '+6.8%' },
    ],
    cols: [
      { label: 'Category',     key: 'cat',   cls: 'text-left',  minW: 140, render: (r) => <CatBadge cat={r.category} /> },
      { label: 'Description',  key: 'desc',  cls: 'text-left',  minW: 200, render: (r) => <span className="text-xs text-gray-600 dark:text-slate-400">{r.description}</span> },
      { label: 'Amount',       key: 'amt',   cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{$c(r.amount)}</span> },
      { label: '% of Outflow', key: 'pct',   cls: 'text-right', render: (r) => <PctBar pct={(r.amount / OUTFLOWS.reduce((a, x) => a + x.amount, 0) * 100).toFixed(1)} /> },
      { label: 'Date',         key: 'date',  cls: 'text-center',render: (r) => <span className="text-xs text-gray-400 dark:text-slate-500">{r.date}</span> },
      { label: 'Status',       key: 'status',cls: 'text-center',render: (r) => <PaidBadge s={r.status} /> },
    ],
    rows: [...OUTFLOWS].sort((a, b) => b.amount - a.amount),
    totals: { name: 'TOTAL', amount: OUTFLOWS.reduce((a, r) => a + r.amount, 0) },
  };

  /* ─ Default fallback (Total Revenue layout) ───────────────── */
  return {
    summary: [
      { label: 'Total SKUs', value: '10' },
      { label: 'Avg Rev / SKU', value: $c(124500 / 10) },
      { label: 'Total Returns', value: $c(4457) },
      { label: 'Net Settled', value: $c(124500 - 4457) },
    ],
    cols: [
      { label: 'Product',     key: 'name',    cls: 'text-left', minW: 180, render: (r) => <ProductCell name={r.name} sku={r.sku} cat={r.cat} /> },
      { label: 'Channel',     key: 'ch',      cls: 'text-left',  render: (r) => <ChannelBadge ch={r.channel} /> },
      { label: 'Units Sold',  key: 'units',   cls: 'text-right', render: (r) => <span className="font-medium">{fN(r.units)}</span> },
      { label: 'Revenue',     key: 'revenue', cls: 'text-right', render: (r) => <span className="font-semibold text-gray-900 dark:text-slate-100">{$c(r.revenue)}</span> },
      { label: 'Returns',     key: 'retQty',  cls: 'text-right', render: (r) => <ReturnQtyCell qty={r.returnQty} units={r.units} /> },
      { label: 'Net Settled', key: 'settled', cls: 'text-right', render: (r) => <span className="font-semibold text-green-600 dark:text-green-400">{$c(r.netSettled)}</span> },
    ],
    rows: SKUS,
    totals: { name: 'TOTAL', units: 2180, revenue: 124500, returnQty: 70, netSettled: 120043 },
  };
};

/* ── Mini sub-components ───────────────────────────────────────── */
const CHANNEL_COLORS = {
  'Amazon':      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'Shopify':     'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300',
  'TikTok Shop': 'bg-sky-100    dark:bg-sky-900/30    text-sky-700    dark:text-sky-300',
  'Mixed':       'bg-gray-100   dark:bg-slate-800     text-gray-600   dark:text-slate-400',
};

const ChannelBadge = ({ ch }) => (
  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${CHANNEL_COLORS[ch] || CHANNEL_COLORS['Mixed']}`}>{ch}</span>
);

const ProductCell = ({ name, sku, cat }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate leading-tight">{name}</p>
    <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">{sku} · {cat}</p>
  </div>
);

const CampaignCell = ({ name, sku, type: _type }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate leading-tight">{name}</p>
    <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">{sku}</p>
  </div>
);

const ReturnQtyCell = ({ qty, units }) => {
  const rate = qty / units * 100;
  return (
    <span className={rate > 8 ? 'text-red-500 dark:text-red-400 font-semibold' : rate > 4 ? 'text-amber-500 font-medium' : 'text-gray-500 dark:text-slate-400'}>
      {qty}
    </span>
  );
};

const PctBar = ({ pct }) => (
  <div className="flex items-center gap-1.5 justify-end">
    <div className="w-16 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full bg-blue-400 dark:bg-blue-500 rounded-full" style={{ width: `${Math.min(100, +pct)}%` }} />
    </div>
    <span className="text-[10px] text-gray-500 dark:text-slate-400 w-8 text-right">{pct}%</span>
  </div>
);

const BBCell = ({ pct, status }) => (
  <span className={`font-semibold ${status === 'Winning' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{pct}%</span>
);

const BBStatus = ({ status }) => (
  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${status === 'Winning' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{status}</span>
);

const DOCStatus = ({ s }) => {
  const cfg = { Low: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', Healthy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', Excess: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' };
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cfg[s] || cfg.Healthy}`}>{s}</span>;
};

const AD_TYPE = {
  SP: { label: 'Sponsored Products', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  SB: { label: 'Sponsored Brands',   color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  SD: { label: 'Sponsored Display',  color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
  TT: { label: 'TikTok Ads',         color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
  GS: { label: 'Google Shopping',    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
};
const AdTypeBadge = ({ t }) => {
  const c = AD_TYPE[t] || AD_TYPE.SP;
  return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${c.color}`}>{c.label}</span>;
};

const SettlementStatus = ({ s, date }) => (
  <div className="text-center">
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md block mb-0.5 ${s === 'Settled' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>{s}</span>
    <span className="text-[9px] text-gray-400 dark:text-slate-500">{date}</span>
  </div>
);

const PaidBadge = ({ s }) => (
  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${s === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'}`}>{s}</span>
);

const CAT_COLORS = {
  'Inventory Restock':  'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300',
  'Ad Spend':           'bg-purple-100 dark:bg-purple-900/30 text-purple-700  dark:text-purple-300',
  'Fulfillment / FBA':  'bg-orange-100 dark:bg-orange-900/30 text-orange-700  dark:text-orange-300',
  'Platform Fees':      'bg-gray-100   dark:bg-slate-800     text-gray-600    dark:text-slate-400',
  'Returns & Refunds':  'bg-red-100    dark:bg-red-900/30    text-red-600     dark:text-red-400',
  'Shipping & Freight': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700  dark:text-yellow-300',
  'SaaS / Software':    'bg-teal-100   dark:bg-teal-900/30   text-teal-700    dark:text-teal-300',
};
const CatBadge = ({ cat }) => (
  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${CAT_COLORS[cat] || 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>{cat}</span>
);

/* ── Totals row renderer ───────────────────────────────────────── */
const renderTotalCell = (col, totals) => {
  const v = totals[col.key];
  if (col.key === 'name') return <span className="font-bold text-gray-900 dark:text-slate-100 text-[11px] uppercase tracking-wide">Total</span>;
  if (v == null) return null;
  // Use the column's render on a synthetic row built from totals
  const synth = { ...totals, name: 'TOTAL', channel: '', cat: '' };
  try { return col.render(synth); } catch { return null; }
};

/* ── Main Modal ────────────────────────────────────────────────── */
const KPIDetailModal = ({ isOpen, onClose, stat, filterContext = {}, tab: _tab = 'sales' }) => {
  if (!isOpen || !stat) return null;

  const periodLabel = PERIOD_LABELS[filterContext?.dateRange] || 'All Time';
  const { summary, cols, rows, totals } = getTableDef(stat.title);
  const activeFilters = [
    ...(filterContext.categories?.length ? filterContext.categories.map(c => c) : []),
    ...(filterContext.channels?.length   ? filterContext.channels.map(c => c) : []),
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-7 py-6 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{stat.title}</h3>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${stat.isPositive !== false ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
                {stat.change}&nbsp;
                <i className={`fa-solid ${stat.isPositive !== false ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[9px]`} />
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-3xl font-bold text-gray-900 dark:text-slate-100 leading-none">{stat.value}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">{periodLabel}</span>
              {activeFilters.map((f, i) => (
                <span key={i} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-md">{f}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* ── Summary stats ── */}
        <div className="flex gap-0 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
          {summary.map((s, i) => (
            <div key={i} className={`flex-1 px-7 py-5 ${i < summary.length - 1 ? 'border-r border-gray-100 dark:border-slate-800' : ''}`}>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{s.label}</p>
              <p className="text-base font-bold text-gray-900 dark:text-slate-100">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full border-collapse" style={{ minWidth: 640 }}>
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-800/80 backdrop-blur-sm">
              <tr>
                {cols.map((col, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap border-b border-gray-100 dark:border-slate-700 ${col.cls}`}
                    style={col.minW ? { minWidth: col.minW } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  {cols.map((col, ci) => (
                    <td key={ci} className={`px-5 py-3.5 text-xs ${col.cls}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {totals && (
              <tfoot>
                <tr className="bg-gray-50 dark:bg-slate-800/60 border-t-2 border-gray-200 dark:border-slate-700">
                  {cols.map((col, i) => (
                    <td key={i} className={`px-5 py-3.5 text-xs ${col.cls}`}>
                      {renderTotalCell(col, totals)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </BaseModal>
  );
};

export default KPIDetailModal;
