import React, { useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import DeepDiveTabBar from '../../../../components/common/DeepDiveTabBar';
import ClickToExpand from '../../../../components/common/ClickToExpand';
import ActionsPanel from '../../../../components/common/ActionsPanel';
import BaseAreaChart from '../../../../components/common/charts/BaseAreaChart';
const MarginTrendChart       = lazy(() => import('./MarginTrendChart'));
const MarginWaterfallChart   = lazy(() => import('./MarginWaterfallChart'));
const FeeForensics           = lazy(() => import('./FeeForensics'));
const MarginDistributionChart = lazy(() => import('./MarginDistributionChart'));
import {
  marginRecommendations,
  marginAnomalies,
} from '../marginData';
import { WatchlistCard } from '../../../../components/common/WatchlistSection';
import { salesWatchlistItems } from '../../sales/salesData';

const kpiDetails = {
  "CM2 (Cross-Channel)": {
    title: "Contribution Margin 2", icon: "fa-chart-area",
    summary: "Contribution margin 2 at $18,450 (14.2%), up 5.2%. Ad spend of $12,400 generating $12.40 net profit per unit across channels.",
    cards: [
      { label: 'TOTAL CM2', val: '$18,450', delta: '+5.2%', color: 'text-indigo-600' },
      { label: 'CM2 %', val: '14.2%', delta: '+0.8%', color: 'text-indigo-500' },
      { label: 'AD SPEND', val: '$12,400', delta: '+1.2%', color: 'text-red-500' },
      { label: 'PROFIT/UNIT', val: '$12.4', delta: '+$1.2', color: 'text-indigo-500' }
    ],
    tableColumns: [
      { header: 'CHANNEL', key: 'chan', bold: true },
      { header: 'CM2 PROFIT', key: 'cm2', align: 'right', bold: true },
      { header: 'CM2 %', key: 'pct', align: 'right' }
    ],
    tableData: [
      { chan: 'Amazon US', cm2: '$12,400', pct: '15.2%' },
      { chan: 'Shopify Store', cm2: '$4,800', pct: '12.8%' },
      { chan: 'TikTok Shop', cm2: '$1,250', pct: '9.4%' },
      { chan: 'Walmart', cm2: '$1,100', pct: '8.2%' },
      { chan: 'Google Shopping', cm2: '$840', pct: '6.8%' },
      { chan: 'eBay', cm2: '$620', pct: '5.4%' },
      { chan: 'B2B Wholesale', cm2: '$480', pct: '4.1%' },
      { chan: 'Direct Store', cm2: '$360', pct: '3.2%' }
    ]
  },
  "CM%": {
    title: "Contribution Margin %", icon: "fa-percent",
    summary: "Average CM% at 28.4% (+2.1%), with Electronics leading at 42.1% and Apparel trailing at 12.4% against a 30% target.",
    cards: [
      { label: 'AVG CM%', val: '28.4%', delta: '+2.1%', color: 'text-emerald-600' },
      { label: 'BEST CAT', val: '42.1%', delta: 'Electronics', color: 'text-emerald-500' },
      { label: 'WORST CAT', val: '12.4%', delta: 'Apparel', color: 'text-red-500' },
      { label: 'TARGET', val: '30.0%', delta: '-1.6%', color: 'text-gray-500' }
    ],
    tableColumns: [
      { header: 'CATEGORY', key: 'cat', bold: true },
      { header: 'CM %', key: 'pct', align: 'right', bold: true },
      { header: 'REVENUE', key: 'rev', align: 'right' }
    ],
    tableData: [
      { cat: 'Electronics', pct: '42.1%', rev: '$48k' },
      { cat: 'Home & Garden', pct: '31.4%', rev: '$32k' },
      { cat: 'Apparel', pct: '12.4%', rev: '$28k' },
      { cat: 'Pet Supplies', pct: '28.6%', rev: '$24k' },
      { cat: 'Kitchen', pct: '22.4%', rev: '$18k' },
      { cat: 'Sports', pct: '18.1%', rev: '$14k' },
      { cat: 'Beauty & Health', pct: '34.2%', rev: '$12k' },
      { cat: 'Books & Media', pct: '8.4%', rev: '$8k' }
    ]
  },
  "Unprofitable SKUs": {
    title: "Unprofitable SKUs", icon: "fa-triangle-exclamation",
    summary: "12 unprofitable SKUs causing -$1,240 in margin loss over 30 days with $3,400 in wasted ad spend. Recovery potential estimated at $2,800.",
    cards: [
      { label: 'UNPROFITABLE', val: '12', delta: '-2', color: 'text-red-600' },
      { label: 'LOST MARGIN', val: '-$1,240', delta: 'Last 30d', color: 'text-red-500' },
      { label: 'AD WASTE', val: '$3,400', delta: 'On these SKUs', color: 'text-red-500' },
      { label: 'RECOVERY POT.', val: '$2,800', delta: 'High', color: 'text-green-500' }
    ],
    tableColumns: [
      { header: 'SKU', key: 'sku', bold: true },
      { header: 'LOSS', key: 'loss', align: 'right', color: 'text-red-600' },
      { header: 'AD SPEND', key: 'ads', align: 'right' }
    ],
    tableData: [
      { sku: 'APP-TS-ORG-01', loss: '-$420', ads: '$1,200' },
      { sku: 'PET-BED-LG-2', loss: '-$380', ads: '$1,050' },
      { sku: 'HME-LMP-04', loss: '-$280', ads: '$850' },
      { sku: 'KTC-KNF-SET3', loss: '-$240', ads: '$720' },
      { sku: 'SPT-YOG-MAT1', loss: '-$190', ads: '$580' },
      { sku: 'HME-VAS-DEC4', loss: '-$145', ads: '$440' },
      { sku: 'ELC-CBL-09', loss: '-$140', ads: '$400' },
      { sku: 'ELC-BAT-PWR5', loss: '-$98', ads: '$310' }
    ]
  },
  "Pricing Opportunities": {
    title: "Pricing Opportunities", icon: "fa-wand-magic-sparkles",
    summary: "27 underpriced SKUs identified with +$24,800 total opportunity at 92% AI confidence. Average recommended price increase of 4.2%.",
    cards: [
      { label: 'POTENTIAL', val: '+$24,800', delta: 'High', color: 'text-blue-600' },
      { label: 'SKU COUNT', val: '27', delta: 'Underpriced', color: 'text-blue-500' },
      { label: 'AVG INCREASE', val: '4.2%', delta: '+1.5%', color: 'text-blue-500' },
      { label: 'CONFIDENCE', val: '92%', delta: 'AI Match', color: 'text-blue-500' }
    ],
    tableColumns: [
      { header: 'PRODUCT', key: 'prod', bold: true },
      { header: 'OPT. PRICE', key: 'price', align: 'right', color: 'text-green-600' },
      { header: 'GAIN', key: 'gain', align: 'right' }
    ],
    tableData: [
      { prod: 'Premium Headphones', price: '$314.99', gain: '+$1,240' },
      { prod: 'Smart Watch S5', price: '$204.99', gain: '+$850' },
      { prod: 'Office Chair X', price: '$459.99', gain: '+$620' },
      { prod: 'Wireless Earbuds Pro', price: '$129.99', gain: '+$480' },
      { prod: 'Standing Desk Mat', price: '$89.99', gain: '+$340' },
      { prod: 'USB-C Charger 65W', price: '$49.99', gain: '+$260' },
      { prod: 'Laptop Sleeve 15in', price: '$34.99', gain: '+$180' },
      { prod: 'Phone Holder Car', price: '$24.99', gain: '+$120' }
    ]
  },
  "CM2 (USD)": {
    title: "CM2 (USD)", icon: "fa-dollar-sign",
    summary: "CM2 value at $124,500, up $12k this period. Per-order margin at $14.20 with monthly goal 83% achieved and healthy 3.4x LTV/CAC.",
    cards: [
      { label: 'CM2 VALUE', val: '$124,500', delta: '+$12k', color: 'text-green-600' },
      { label: 'PER ORDER', val: '$14.2', delta: '+$1.4', color: 'text-green-500' },
      { label: 'MONTHLY GOAL', val: '$150k', delta: '83%', color: 'text-blue-500' },
      { label: 'LTV/CAC', val: '3.4x', delta: 'Healthy', color: 'text-green-500' }
    ],
    tableColumns: [
      { header: 'MONTH', key: 'mon', bold: true },
      { header: 'CM2 USD', key: 'usd', align: 'right', bold: true },
      { header: 'GROWTH', key: 'gro', align: 'right' }
    ],
    tableData: [
      { mon: 'October 2024', usd: '$124,500', gro: '+8.2%' },
      { mon: 'September 2024', usd: '$115,000', gro: '+4.5%' },
      { mon: 'August 2024', usd: '$110,000', gro: '+12%' },
      { mon: 'July 2024', usd: '$98,200', gro: '+6.1%' },
      { mon: 'June 2024', usd: '$92,500', gro: '+14.2%' },
      { mon: 'May 2024', usd: '$81,000', gro: '+8.4%' },
      { mon: 'April 2024', usd: '$74,800', gro: '+3.2%' },
      { mon: 'March 2024', usd: '$72,400', gro: '+1.8%' }
    ]
  },
  "CM3 Channel": {
    title: "CM3 Channel", icon: "fa-sitemap",
    summary: "Channel CM3 at 12.4% with $8,400 in fixed costs and 4.2% variable fees. Net cash flow of $42k remains positive overall.",
    cards: [
      { label: 'CHANNEL CM3', val: '12.4%', delta: '-0.4%', color: 'text-red-500' },
      { label: 'FIXED COST', val: '$8,400', delta: 'Stable', color: 'text-blue-500' },
      { label: 'VAR. FEE', val: '4.2%', delta: '+0.2%', color: 'text-red-500' },
      { label: 'NET FLOW', val: '$42k', delta: 'Positive', color: 'text-green-500' }
    ],
    tableColumns: [
      { header: 'EXPENSE', key: 'exp', bold: true },
      { header: 'ALLOCATION', key: 'all', align: 'right', bold: true },
      { header: 'IMPACT', key: 'imp', align: 'right' }
    ],
    tableData: [
      { exp: 'Warehouse Labor', all: '$4,200', imp: '-2.4%' },
      { exp: 'Platform Fees', all: '$3,600', imp: '-1.8%' },
      { exp: 'Storage Fees', all: '$2,400', imp: '-1.2%' },
      { exp: 'Customer Support', all: '$2,100', imp: '-1.1%' },
      { exp: 'Packaging Supply', all: '$1,800', imp: '-0.8%' },
      { exp: 'Merchant Fees', all: '$1,440', imp: '-0.7%' },
      { exp: 'Return Processing', all: '$1,200', imp: '-0.6%' },
      { exp: 'Software Tools', all: '$840', imp: '-0.4%' }
    ]
  },
  "CM3 Cross-Ch": {
    title: "CM3 Cross-Channel", icon: "fa-layer-group",
    summary: "Cross-channel CM3 at 11.8% across $842k omni-channel revenue (+14%). Blended CAC improved to $18.40 with 64% net retention.",
    cards: [
      { label: 'CROSS-CH CM3', val: '11.8%', delta: 'Healthy', color: 'text-blue-600' },
      { label: 'OMNI REVENUE', val: '$842k', delta: '+14%', color: 'text-green-500' },
      { label: 'BLENDED CAC', val: '$18.4', delta: '-$2.1', color: 'text-green-500' },
      { label: 'NET RETAIN', val: '64%', delta: '+2%', color: 'text-blue-500' }
    ],
    tableColumns: [
      { header: 'PLATFORM', key: 'plat', bold: true },
      { header: 'CM3 VALUE', key: 'val', align: 'right', bold: true },
      { header: 'ROI', key: 'roi', align: 'right' }
    ],
    tableData: [
      { plat: 'Direct Shopify', val: '16.8%', roi: '6.4x' },
      { plat: 'Amazon Global', val: '14.2%', roi: '4.2x' },
      { plat: 'TikTok Shop', val: '12.8%', roi: '3.8x' },
      { plat: 'Google Shopping', val: '10.4%', roi: '2.8x' },
      { plat: 'Meta Commerce', val: '9.1%', roi: '2.4x' },
      { plat: 'Wholesale B2B', val: '8.4%', roi: '2.1x' },
      { plat: 'eBay Marketplace', val: '7.2%', roi: '1.9x' },
      { plat: 'Walmart Connect', val: '6.8%', roi: '1.6x' }
    ]
  },
  "Gross Margin %": {
    title: "Gross Margin %", icon: "fa-percent",
    summary: "Gross margin at 42.3% (+1.4%), generating $54,200 gross profit. COGS improved to 57.7% with $131.50 profit per order.",
    cards: [
      { label: 'GROSS MARGIN %', val: '42.3%', delta: '+1.4%', color: 'text-green-600' },
      { label: 'GROSS PROFIT', val: '$54,200', delta: '+$4.2k', color: 'text-green-500' },
      { label: 'COGS RATIO', val: '57.7%', delta: '-1.2%', color: 'text-green-500' },
      { label: 'PROFIT/ORDER', val: '$131.5', delta: '+$12', color: 'text-green-500' }
    ],
    tableColumns: [
      { header: 'CATEGORY', key: 'cat', bold: true },
      { header: 'MARGIN %', key: 'pct', align: 'right', bold: true },
      { header: 'REVENUE', key: 'rev', align: 'right' }
    ],
    tableData: [
      { cat: 'Electronics', pct: '52.1%', rev: '$48,200' },
      { cat: 'Beauty & Health', pct: '48.6%', rev: '$12,600' },
      { cat: 'Pet Supplies', pct: '44.2%', rev: '$24,800' },
      { cat: 'Home & Garden', pct: '38.7%', rev: '$32,400' },
      { cat: 'Kitchen', pct: '36.8%', rev: '$18,400' },
      { cat: 'Sports & Outdoor', pct: '32.1%', rev: '$14,200' },
      { cat: 'Apparel', pct: '28.4%', rev: '$28,600' },
      { cat: 'Books & Media', pct: '22.4%', rev: '$8,400' }
    ]
  },
  "Contribution %": {
    title: "Contribution %", icon: "fa-scale-balanced",
    summary: "Contribution percentage at 19.4% (+2.1%), with break-even reached at $42k. Operating efficiency at 84%, up 5% vs prior period.",
    cards: [
      { label: 'CONTRIBUTION %', val: '19.4%', delta: '+2.1%', color: 'text-green-600' },
      { label: 'OPEX OFFSET', val: '12.4%', delta: 'Target', color: 'text-blue-500' },
      { label: 'BREAK-EVEN', val: '$42k', delta: 'Reached', color: 'text-green-500' },
      { label: 'EFFICIENCY', val: '84%', delta: '+5%', color: 'text-green-500' }
    ],
    tableColumns: [
      { header: 'COST TYPE', key: 'type', bold: true },
      { header: 'VALUE %', key: 'pct', align: 'right', bold: true },
      { header: 'STATUS', key: 'stat', align: 'right' }
    ],
    tableData: [
      { type: 'Variable Ads', pct: '14.2%', stat: 'Review' },
      { type: 'Direct Labor', pct: '8.4%', stat: 'Optimized' },
      { type: 'Overhead Alloc.', pct: '4.6%', stat: 'Review' },
      { type: 'Shipment Var', pct: '4.1%', stat: 'Healthy' },
      { type: 'COGS Variance', pct: '3.4%', stat: 'Monitor' },
      { type: 'Platform Royalty', pct: '6.2%', stat: 'Healthy' },
      { type: 'Return Losses', pct: '2.8%', stat: 'Review' },
      { type: 'Packaging Cost', pct: '1.9%', stat: 'Optimized' }
    ]
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const marginPanelWatchlistItems = [
  { title: 'Yoga Mat Pro', sku: 'YM-STR-42', impact: '-$142.00', positive: false, action: 'Reprice' },
  { title: 'LED Desk Lamp', sku: 'LED-DK-7', impact: '-$98.00', positive: false, action: 'Investigate' },
  { title: 'Phone Case Ultra', sku: 'PH-CASE-X', impact: '-$84.00', positive: false, action: 'Reprice' },
  { title: 'Water Bottle', sku: 'SS-BTL-V2', impact: '+$12.00', positive: true, action: 'Reprice' },
];
const _marginWatchlistItems = marginPanelWatchlistItems;

const deepDiveTabList = [
  { label: 'Details', key: 'revenue' },
  { label: 'Watchlist', key: 'sku' },
  { label: 'Channel Mix', key: 'channel-mix' },
  { label: 'Charts', key: 'charts' },
];

const chartCards = [
  { key: 'waterfall', title: 'CM Waterfall', subtitle: 'Cost breakdown by margin layer', icon: 'fa-bars-staggered' },
  { key: 'trend', title: 'Margin Trend', subtitle: '7-day gross margin analysis', icon: 'fa-chart-line' },
  { key: 'fees', title: 'Channel Fee Analysis', subtitle: 'Platform & fulfillment fees', icon: 'fa-file-invoice-dollar' },
  { key: 'distribution', title: 'Margin Distribution', subtitle: 'Margin range by product', icon: 'fa-chart-pie' },
];

const getChartComponent = (key) => {
  if (key === 'waterfall') return <MarginWaterfallChart />;
  if (key === 'trend') return <MarginTrendChart />;
  if (key === 'fees') return <FeeForensics />;
  if (key === 'distribution') return <MarginDistributionChart />;
  return null;
};

const MarginDeepDivePanel = ({ deepDiveTab, setDeepDiveTab, activeStat, activeStatChart, setActiveModal, setComponentModal, onProductClick }) => {
  const navigate = useNavigate();
  const [detailViewMode, setDetailViewMode] = useState('chart');

  const getKpiDetail = (title) => {
    const key = title in kpiDetails ? title : "Gross Margin %";
    return kpiDetails[key];
  };

  const openKpiModal = (title) => {
    const detail = getKpiDetail(title);
    setActiveModal({ isOpen: true, type: 'kpi', data: detail });
  };

  const activeKpiDetail = getKpiDetail(activeStat.title);

  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-slate-800/60">
          <button
            onClick={() => navigate('/detailed-view/margin')}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400 hover:text-brand dark:hover:text-gray-200 transition-colors group"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
            Detailed View
          </button>
        </div>

        <DeepDiveTabBar>
          {deepDiveTabList.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setDeepDiveTab(key)}
              className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${
                deepDiveTab === key
                  ? 'border-brand text-brand dark:text-gray-400 dark:border-gray-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </DeepDiveTabBar>

        <div className="h-[290px] flex flex-col overflow-hidden">
          {deepDiveTab === 'revenue' && (
            <div
              className={`flex-1 flex flex-col p-4 ${detailViewMode === 'chart' ? 'cursor-pointer group' : 'cursor-default'}`}
              onClick={detailViewMode === 'chart' ? () => openKpiModal(activeStat.title) : undefined}
            >
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{activeStat.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{activeStat.value}</span>
                  <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 rounded-md p-0.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setDetailViewMode('chart')} className={`w-5 h-5 rounded flex items-center justify-center transition-all ${detailViewMode === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400'}`}>
                      <i className="fa-solid fa-chart-area text-[9px]"></i>
                    </button>
                    <button onClick={() => setDetailViewMode('text')} className={`w-5 h-5 rounded flex items-center justify-center transition-all ${detailViewMode === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400'}`}>
                      <i className="fa-solid fa-list text-[9px]"></i>
                    </button>
                  </div>
                </div>
              </div>
              {detailViewMode === 'chart' && (
                <>
                  <div className="h-[200px] w-full pointer-events-none overflow-hidden">
                    <BaseAreaChart
                      data={activeStatChart.data}
                      yAxisFormatter={activeStatChart.fmt}
                      tooltipFormatter={(v, n) => [activeStatChart.fmt(v), n]}
                      areas={[{ key: activeStatChart.dataKey, name: activeStat.title, color: activeStatChart.color }]}
                    />
                  </div>
                  <ClickToExpand />
                </>
              )}
              {detailViewMode === 'text' && (
                <div className="flex-1 overflow-y-auto px-1 pt-0.5">
                  <p className="text-[11px] leading-relaxed text-gray-500 dark:text-slate-400 mb-3">{activeKpiDetail?.summary}</p>
                  <div className="space-y-1">
                    {activeKpiDetail?.tableData?.map((row, idx) => {
                      const vals = Object.values(row).slice(0, 3);
                      return (
                        <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/40 last:border-0">
                          <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate flex-1">{vals[0]}</span>
                          <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 ml-3">{vals[1]}</span>
                          {vals[2] && <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1.5">{vals[2]}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {deepDiveTab === 'sku' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {salesWatchlistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                  onClick={() => onProductClick({ ...item, name: item.title })}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-200 dark:border-slate-700">
                      <i className="fa-solid fa-box text-gray-400 text-[10px]"></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">{item.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{item.velocity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deepDiveTab === 'channel-mix' && (
            <div
              className="flex-1 flex flex-col p-4 cursor-pointer group"
              onClick={() => setActiveModal({
                isOpen: true, type: 'kpi', data: {
                  title: "Channel Mix", icon: "fa-users-viewfinder", chartType: 'donut',
                  donutSegments: [
                    { label: 'Online Store', color: '#0A52E7', value: '45%', amount: '$56,025', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
                    { label: 'Retail', color: '#1D63FF', value: '30%', amount: '$37,350', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' },
                    { label: 'Marketplace', color: '#2E4CB9', value: '25%', amount: '$31,125', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
                  ],
                  cards: [
                    { label: 'ONLINE STORE', val: '45%', delta: '+2.1%', color: 'text-blue-600' },
                    { label: 'RETAIL', val: '30%', delta: '-0.5%', color: 'text-indigo-600' },
                    { label: 'MARKETPLACE', val: '25%', delta: '+1.2%', color: 'text-blue-500' },
                    { label: 'TOTAL REVENUE', val: '$124,500', delta: '+12.4%', color: 'text-emerald-600' }
                  ],
                  tableColumns: [
                    { header: 'CHANNEL', key: 'channel', bold: true },
                    { header: 'REVENUE', key: 'revenue', align: 'right', bold: true },
                    { header: 'SHARE', key: 'share', align: 'right' },
                    { header: 'ORDERS', key: 'orders', align: 'right' },
                    { header: 'GROWTH', key: 'growth', align: 'right' }
                  ],
                  tableData: [
                    { channel: 'Online Store', revenue: '$56,025', share: '45%', orders: '185', growth: '+2.1%' },
                    { channel: 'Retail', revenue: '$37,350', share: '30%', orders: '124', growth: '-0.5%' },
                    { channel: 'Marketplace', revenue: '$31,125', share: '25%', orders: '103', growth: '+1.2%' }
                  ]
                }
              })}
            >
              <div className="flex items-center justify-center mb-2 pointer-events-none">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="44" fill="none" stroke="currentColor" strokeWidth="18" className="text-gray-100 dark:text-slate-800"></circle>
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#0A52E7" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="69.1"></circle>
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#1D63FF" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="152.0"></circle>
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#2E4CB9" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="221.1"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-lg font-bold text-gray-900 dark:text-slate-100">100%</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-medium">Total Sales</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 pointer-events-none">
                {[
                  { label: 'Online Store', color: 'bg-cb-700', value: '45%', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
                  { label: 'Retail', color: 'bg-cb-600', value: '30%', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' },
                  { label: 'Marketplace', color: 'bg-cb-500', value: '25%', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between py-1.5 px-3 rounded-xl border ${item.bgColor} ${item.borderColor}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${item.color} rounded-full shadow-sm`}></div>
                      <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{item.value}</span>
                  </div>
                ))}
              </div>
              <ClickToExpand className="mt-auto pt-3" />
            </div>
          )}

          {deepDiveTab === 'charts' && (
            <div className="flex-1 flex flex-col p-3 gap-1.5 overflow-y-auto">
              {chartCards.map(chart => (
                <div
                  key={chart.key}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all group flex-shrink-0"
                  onClick={() => setComponentModal({ title: chart.title, subtitle: chart.subtitle, component: getChartComponent(chart.key) })}
                >
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${chart.icon} text-blue-500 text-xs`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{chart.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">{chart.subtitle}</p>
                  </div>
                  <i className="fa-solid fa-expand text-[10px] text-gray-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0"></i>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ActionsPanel
        items={marginRecommendations}
        anomalies={marginAnomalies}
        onItemSelect={(id) => navigate(`/intel/insight/margin/${id}`)}
      />
    </div>
  );
};

export default MarginDeepDivePanel;
