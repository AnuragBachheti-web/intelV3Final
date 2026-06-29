import React, { lazy, Suspense, useState, useEffect, useRef, useMemo } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useFilterStore } from '../../store/useFilterStore';
import { Treemap, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import KPISelectorModal from '../../components/common/KPISelectorModal';
import KPIDetailModal from '../../components/common/KPIDetailModal';
import BaseAreaChart from '../../components/common/charts/BaseAreaChart';
import BaseBarChart from '../../components/common/charts/BaseBarChart';
import BaseLineChart from '../../components/common/charts/BaseLineChart';
import { SEMANTIC_COLORS } from '../../utils/chartColors';
import { revenueTrendData } from '../sales-intelligence/salesData';

// Margin charts — lazy: only loaded when intelType === 'margin'
const MarginWaterfallChart    = lazy(() => import('../margin-intelligence/components/MarginWaterfallChart'));
const MarginTrendChart        = lazy(() => import('../margin-intelligence/components/MarginTrendChart'));
const FeeForensics            = lazy(() => import('../margin-intelligence/components/FeeForensics'));
const MarginDistributionChart = lazy(() => import('../margin-intelligence/components/MarginDistributionChart'));

// Inventory charts — lazy: only loaded when intelType === 'inventory'
const InventoryTrendChart     = lazy(() => import('../inventory-intelligence/components/InventoryTrendChart'));
const StockStatusChart        = lazy(() => import('../inventory-intelligence/components/StockStatusChart'));
const DOCDistributionChart    = lazy(() => import('../inventory-intelligence/components/DOCDistributionChart'));
const ForecastActualChart     = lazy(() => import('../inventory-intelligence/components/ForecastActualChart'));

// Ads charts — lazy: only loaded when intelType === 'ads'
const AdSpendTrendChart         = lazy(() => import('../ads-intelligence/components/AdSpendTrendChart'));
const PlatformDistributionChart = lazy(() => import('../ads-intelligence/components/PlatformDistributionChart'));

// Cash charts — lazy: only loaded when intelType === 'cash'
const CashFlowTrendSection   = lazy(() => import('../cash-intelligence/components/CashFlowTrendSection'));
const CashDistributionSection = lazy(() => import('../cash-intelligence/components/CashDistributionSection'));

// Sales tables
import PerformanceSection from '../sales-intelligence/components/PerformanceSection';

// Margin tables
import MarginAnalysisTable from '../margin-intelligence/components/MarginAnalysisTable';
import BleedingMarginTable from '../margin-intelligence/components/BleedingMarginTable';
import {
  unprofitableSKUs,
  adSpendImpact,
  cogsCompressions,
  returnsImpact,
} from '../margin-intelligence/marginData';

// Inventory tables
import ReorderRecommendationsTable from '../inventory-intelligence/components/ReorderRecommendationsTable';
import InventoryStatusTable from '../inventory-intelligence/components/InventoryStatusTable';
import WarehouseSection from '../inventory-intelligence/components/WarehouseSection';

// Ads tables
import CampaignPerformanceTable from '../ads-intelligence/components/CampaignPerformanceTable';
import PlatformPerformanceSection from '../ads-intelligence/components/PlatformPerformanceSection';

// Cash tables
import CashFlowTable from '../cash-intelligence/components/CashFlowTable';
import TransactionAnalysisSection from '../cash-intelligence/components/TransactionAnalysisSection';
import { UpcomingDepositsContent } from '../cash-intelligence/components/CashInsightsGrid';
import { cashStats } from '../cash-intelligence/cashData';

// ─── Static stats data per intel type ─────────────────────────────────────────

const STATS_DATA = {
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

// ─── Product Heatmap ──────────────────────────────────────────────────────────

const PRODUCT_HEATMAP_DATA = [
  { name: 'Smart Hub Pro',      abbr: 'SHP',  category: 'Electronics',    size: 24800, change: 12.4,  revenue: '$24,800', margin: '32.1%', units: 412, roas: '4.8x', doc: 28,  adSpend: '$850',  cashFlow: '+$6.2k' },
  { name: 'LED Strip 5m',       abbr: 'LS5',  category: 'Electronics',    size: 18600, change: 8.2,   revenue: '$18,600', margin: '28.4%', units: 820, roas: '3.9x', doc: 45,  adSpend: '$620',  cashFlow: '+$4.8k' },
  { name: 'Wireless Charger',   abbr: 'WCH',  category: 'Electronics',    size: 15200, change: -3.1,  revenue: '$15,200', margin: '24.8%', units: 304, roas: '2.8x', doc: 62,  adSpend: '$540',  cashFlow: '+$2.1k' },
  { name: 'Smart Plug 4-Pack',  abbr: 'SP4',  category: 'Electronics',    size: 12400, change: 5.7,   revenue: '$12,400', margin: '38.2%', units: 248, roas: '5.2x', doc: 34,  adSpend: '$310',  cashFlow: '+$3.8k' },
  { name: 'Air Purifier XL',    abbr: 'APX',  category: 'Home & Garden',  size: 11800, change: -8.4,  revenue: '$11,800', margin: '18.6%', units: 98,  roas: '2.1x', doc: 88,  adSpend: '$760',  cashFlow: '-$0.4k' },
  { name: 'Bamboo Organizer',   abbr: 'BOG',  category: 'Home & Garden',  size: 9800,  change: 18.2,  revenue: '$9,800',  margin: '42.4%', units: 490, roas: '6.1x', doc: 22,  adSpend: '$180',  cashFlow: '+$3.2k' },
  { name: 'Yoga Mat Pro',       abbr: 'YMP',  category: 'Apparel',        size: 8400,  change: 22.8,  revenue: '$8,400',  margin: '45.8%', units: 280, roas: '7.2x', doc: 18,  adSpend: '$140',  cashFlow: '+$2.8k' },
  { name: 'Plant Grow Light',   abbr: 'PGL',  category: 'Home & Garden',  size: 7600,  change: 0.3,   revenue: '$7,600',  margin: '29.4%', units: 152, roas: '3.4x', doc: 52,  adSpend: '$290',  cashFlow: '+$1.4k' },
  { name: 'Stainless Tumbler',  abbr: 'STT',  category: 'Apparel',        size: 6900,  change: -12.8, revenue: '$6,900',  margin: '22.1%', units: 345, roas: '2.3x', doc: 95,  adSpend: '$420',  cashFlow: '-$0.8k' },
  { name: 'Resistance Bands',   abbr: 'RBX',  category: 'Apparel',        size: 6200,  change: 15.6,  revenue: '$6,200',  margin: '48.2%', units: 620, roas: '8.4x', doc: 15,  adSpend: '$90',   cashFlow: '+$2.2k' },
  { name: 'Smart Scale BT',     abbr: 'SSB',  category: 'Electronics',    size: 5800,  change: 4.1,   revenue: '$5,800',  margin: '31.8%', units: 116, roas: '4.1x', doc: 38,  adSpend: '$210',  cashFlow: '+$1.1k' },
  { name: 'Cat Tree Deluxe',    abbr: 'CTD',  category: 'Pet Suppliers',  size: 5400,  change: -5.8,  revenue: '$5,400',  margin: '26.4%', units: 60,  roas: '2.6x', doc: 74,  adSpend: '$280',  cashFlow: '+$0.6k' },
  { name: 'Foam Roller Set',    abbr: 'FRS',  category: 'Apparel',        size: 4900,  change: 9.4,   revenue: '$4,900',  margin: '44.2%', units: 245, roas: '6.8x', doc: 24,  adSpend: '$100',  cashFlow: '+$1.6k' },
  { name: 'Cabinet Organizer',  abbr: 'COG',  category: 'Home & Garden',  size: 4400,  change: 7.2,   revenue: '$4,400',  margin: '36.8%', units: 220, roas: '5.6x', doc: 30,  adSpend: '$120',  cashFlow: '+$1.2k' },
  { name: 'Pet Water Fountain', abbr: 'PWF',  category: 'Pet Suppliers',  size: 3800,  change: 28.4,  revenue: '$3,800',  margin: '52.4%', units: 190, roas: '9.2x', doc: 12,  adSpend: '$60',   cashFlow: '+$1.4k' },
  { name: 'Aromatherapy Diffuser', abbr: 'ARD', category: 'Home & Garden', size: 3200, change: -18.2, revenue: '$3,200',  margin: '14.8%', units: 128, roas: '1.8x', doc: 112, adSpend: '$390',  cashFlow: '-$1.2k' },
  { name: 'Luggage Lock Set',   abbr: 'LLS',  category: 'Apparel',        size: 2800,  change: 2.1,   revenue: '$2,800',  margin: '38.4%', units: 280, roas: '5.1x', doc: 42,  adSpend: '$75',   cashFlow: '+$0.8k' },
  { name: 'Phone Holder Car',   abbr: 'PHC',  category: 'Electronics',    size: 2400,  change: 6.8,   revenue: '$2,400',  margin: '40.2%', units: 240, roas: '5.8x', doc: 28,  adSpend: '$65',   cashFlow: '+$0.7k' },
  { name: 'Dog Chew Toy Pack',  abbr: 'DCT',  category: 'Pet Suppliers',  size: 2100,  change: 11.4,  revenue: '$2,100',  margin: '58.2%', units: 420, roas: '10.4x', doc: 10, adSpend: '$30',   cashFlow: '+$0.9k' },
];

const getHeatColor = (change) => {
  if (change >= 25)  return '#000000';
  if (change >= 18)  return '#111827';
  if (change >= 12)  return '#1f2937';
  if (change >= 7)   return '#374151';
  if (change >= 3)   return '#4b5563';
  if (change >= 0)   return '#9ca3af';
  if (change >= -3)  return '#d1d5db';
  if (change >= -8)  return '#e5e7eb';
  if (change >= -14) return '#f3f4f6';
  return '#f9fafb';
};

const INTEL_METRIC = {
  sales:     { label: 'Revenue',   valueKey: 'revenue',  secondary: 'units',    secondaryLabel: 'Units' },
  margin:    { label: 'Revenue',   valueKey: 'revenue',  secondary: 'margin',   secondaryLabel: 'Margin' },
  inventory: { label: 'Revenue',   valueKey: 'revenue',  secondary: 'doc',      secondaryLabel: 'DOC (days)' },
  ads:       { label: 'Revenue',   valueKey: 'revenue',  secondary: 'roas',     secondaryLabel: 'ROAS' },
  cash:      { label: 'Revenue',   valueKey: 'revenue',  secondary: 'cashFlow', secondaryLabel: 'Cash Flow' },
};

const ProductHeatmap = ({ intelType }) => {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const [_heatMode, _setHeatMode] = useState('sku');
  const containerRef = useRef(null);
  const metric = INTEL_METRIC[intelType] || INTEL_METRIC.sales;

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const renderContent = (props) => {
    const { x, y, width, height, name, change, abbr } = props;
    if (!name || width < 8 || height < 8) return null;
    const bg = getHeatColor(change ?? 0);
    const textFill = (change ?? 0) < 3 ? '#1e293b' : '#ffffff';
    const fontSize = Math.min(12, Math.max(8, width / 6));
    return (
      <g
        onMouseEnter={() => setHovered(props)}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={x + 1} y={y + 1}
          width={Math.max(0, width - 2)} height={Math.max(0, height - 2)}
          fill={bg} rx={4}
        />
        {width > 38 && height > 24 && (
          <text
            x={x + 6} y={y + height / 2 + (height > 38 ? -7 : 4)}
            fill={textFill} fontSize={fontSize} fontWeight="700"
            textAnchor="start" dominantBaseline="middle"
          >
            {abbr}
          </text>
        )}
        {width > 44 && height > 38 && (
          <text
            x={x + 6} y={y + height / 2 + 9}
            fill={textFill} fontSize={Math.max(8, fontSize - 2)}
            textAnchor="start" dominantBaseline="middle"
          >
            {change > 0 ? '+' : ''}{change}%
          </text>
        )}
      </g>
    );
  };

  // eslint-disable-next-line react-hooks/refs
  const tooltipRight = mousePos.x > (containerRef.current?.offsetWidth ?? 600) / 2;
  const LEGEND_STOPS = ['#f9fafb','#f3f4f6','#e5e7eb','#d1d5db','#9ca3af','#4b5563','#374151','#1f2937','#111827','#000000'];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Margin Distribution</h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">SKU count by margin bucket</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setHeatMode('sku')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${heatMode === 'sku' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}
            >By SKU</button>
            <button
              onClick={() => setHeatMode('rev')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${heatMode === 'rev' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}
            >% of Rev</button>
          </div> */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
          >
            <i className={`fa-solid ${expanded ? 'fa-compress' : 'fa-expand'} text-[10px]`} />
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <ResponsiveContainer width="100%" height={expanded ? 520 : 300}>
          <Treemap
            data={PRODUCT_HEATMAP_DATA}
            dataKey="size"
            aspectRatio={expanded ? 4 / 3 : 16 / 9}
            content={renderContent}
          />
        </ResponsiveContainer>

        {hovered && (
          <div
            className="absolute z-50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-3 w-52 pointer-events-none"
            style={{
              left: tooltipRight ? mousePos.x - 216 : mousePos.x + 14,
              top: Math.max(0, mousePos.y - 70),
            }}
          >
            <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
              {hovered.category}
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight mb-2">
              {hovered.name}
            </p>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <p className="text-[9px] text-gray-400 dark:text-slate-500 mb-0.5">{metric.label}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-slate-100">{hovered[metric.valueKey]}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <p className="text-[9px] text-gray-400 dark:text-slate-500 mb-0.5">{metric.secondaryLabel}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-slate-100">{hovered[metric.secondary]}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-bold ${hovered.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
              >
                {hovered.change > 0 ? '↑' : '↓'} {Math.abs(hovered.change)}%
              </span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">vs last period</span>
            </div>
          </div>
        )}
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[10px] text-gray-400 dark:text-slate-500">Low</span>
        {LEGEND_STOPS.map((c, i) => (
          <div key={i} className="w-5 h-2 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[10px] text-gray-400 dark:text-slate-500">High</span>
      </div>
    </div>
  );
};

const PAGE_TITLES = { sales: 'Sales', margin: 'Margin', inventory: 'Inventory', ads: 'Ads', cash: 'Cash' };
const BACK_ROUTES = { sales: '/sales', margin: '/margin', inventory: '/inventory', ads: '/ads', cash: '/cash' };

// ─── KPI mini-card strip ───────────────────────────────────────────────────────

const KpiMiniCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-800"
        >
          <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 truncate">
            {stat.title}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-slate-100 leading-none">{stat.value}</p>
          <p className={`text-xs font-semibold mt-1.5 ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {stat.isPositive ? '↑' : '↓'} {stat.change}
          </p>
          {stat.subtext && (
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">{stat.subtext}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Channel Mix widget ────────────────────────────────────────────────────────

const CHANNEL_MIX_DATA = [
  { label: 'Online Store', pct: 1.0, amount: '$124,400', color: '#0A52E7', dot: 'bg-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-900/50' },
];

const ChannelMixWidget = () => {
  const C = 2 * Math.PI * 44;
  let cumulative = 0;
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 h-[380px] flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 flex-shrink-0">Channel Mix</h3>
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="44" fill="none" stroke="currentColor" strokeWidth="18" className="text-gray-100 dark:text-slate-800" />
            {CHANNEL_MIX_DATA.map((ch) => {
              const offset = cumulative;
              // eslint-disable-next-line react-hooks/immutability
              cumulative += ch.pct;
              return (
                <circle
                  key={ch.label}
                  cx="56" cy="56" r="44"
                  fill="none"
                  stroke={ch.color}
                  strokeWidth="18"
                  strokeDasharray={`${ch.pct * C} ${(1 - ch.pct) * C}`}
                  strokeDashoffset={`${-offset * C}`}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-lg font-bold text-gray-900 dark:text-slate-100">100%</p>
            <p className="text-[9px] text-gray-500 dark:text-slate-400 font-medium">Total Sales</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {CHANNEL_MIX_DATA.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl border bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 ${item.dot} rounded-full flex-shrink-0`}></div>
              <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{Math.round(item.pct * 100)}%</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1.5">{item.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Chart card wrapper ────────────────────────────────────────────────────────

const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
      <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{title}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

// ─── Charts per intel type (right column) ─────────────────────────────────────

const SalesCharts = () => {
  const ordersTrend = [{ name: 'W1', orders: 340 }, { name: 'W2', orders: 380 }, { name: 'W3', orders: 290 }, { name: 'W4', orders: 420 }, { name: 'W5', orders: 390 }, { name: 'W6', orders: 450 }];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Orders Trend">
        <div className="h-[140px]">
          <BaseBarChart
            data={ordersTrend}
            bars={[{ key: 'orders', name: 'Orders Trend', color: '#22c55e' }]}
            yAxisFormatter={v => `${v}`}
            tooltipFormatter={(v, n) => [v, n]}
            layout="horizontal"
            height={140}
            yDomain={[240, 'auto']}
          />
        </div>
      </ChartCard>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Buy Box % — by Product</p>
        </div>
        <div className="overflow-auto max-h-[300px]">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 whitespace-nowrap">Product</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 whitespace-nowrap">BB%</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 whitespace-nowrap">Gap vs Comp</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {BB_DATA.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/40 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-slate-100 max-w-[160px] truncate">{r.name}</td>
                  <td className="px-4 py-2.5 text-xs"><BBDonut value={`${r.bb}%`} /></td>
                  <td className={`px-4 py-2.5 text-xs ${r.status !== 'Won' ? 'font-semibold text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-slate-500'}`}>{r.gap}</td>
                  <td className="px-4 py-2.5 text-xs"><span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase ${bbStatusColor(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MarginCharts = () => (
  <div className="space-y-4">
    <MarginWaterfallChart />
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
      <MarginTrendChart />
    </div>
    <FeeForensics />
    <MarginDistributionChart />
  </div>
);

const InventoryCharts = () => (
  <div className="space-y-4">
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4">
        <InventoryTrendChart />
      </div>
    </div>
    <StockStatusChart />
    <DOCDistributionChart />
    <ForecastActualChart />
  </div>
);

const AdsCharts = () => (
  <div className="space-y-4">
    <ChartCard title="Ad Spend Trend"><div className="h-[160px]"><AdSpendTrendChart /></div></ChartCard>
    <PlatformDistributionChart />
  </div>
);

const CashCharts = () => (
  <div className="space-y-4">
    <CashFlowTrendSection />
    <CashDistributionSection />
  </div>
);

const CHARTS_MAP = { sales: SalesCharts, margin: MarginCharts, inventory: InventoryCharts, ads: AdsCharts, cash: CashCharts };

// ─── Inline data table (for margin sub-tables) ────────────────────────────────

const SectionHeading = ({ title }) => (
  <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 mt-4 first:mt-0">{title}</h4>
);

// ─── Tables per intel type (left 66%) ─────────────────────────────────────────

const salesTopMovers = [
  { name: 'Premium Wireless Headphones', sku: 'B09XYZ1234', revenue: '$124,500', change: '+34.2%' },
  { name: 'Smart Home Security Camera', sku: 'B09ABC5678', revenue: '$98,700', change: '+28.1%' },
  { name: 'Organic Pet Food 15lb', sku: 'B09DEF9012', revenue: '$76,340', change: '+22.5%' },
  { name: 'Ergonomic Office Chair Pro', sku: 'B09GHI3456', revenue: '$68,900', change: '+19.8%' },
  { name: 'USB-C Hub 7-in-1', sku: 'B09JKL7890', revenue: '$54,120', change: '+15.3%' },
];

const salesBottomMovers = [
  { name: 'Portable Charger X 20000mAh', sku: 'B09MNO1234', revenue: '$8,420', change: '-42.1%' },
  { name: 'Bamboo Cutting Board Set', sku: 'B09PQR5678', revenue: '$5,670', change: '-38.7%' },
  { name: 'Yoga Mat Eco Premium', sku: 'B09STU9012', revenue: '$4,230', change: '-31.4%' },
  { name: 'LED Desk Lamp Smart', sku: 'B09VWX3456', revenue: '$3,890', change: '-28.9%' },
  { name: 'Kitchen Timer Digital 3-Pack', sku: 'B09YZA7890', revenue: '$2,140', change: '-25.3%' },
];

const BBDonut = ({ value }) => {
  const pct = parseInt(value, 10);
  const frac = Math.min(pct, 100) / 100;
  const r = 13;
  const circ = 2 * Math.PI * r;
  const color = pct >= 70 ? '#22c55e' : pct >= 30 ? '#f97316' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center w-9 h-9">
      <svg width="36" height="36" viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3.5" className="dark:stroke-slate-700" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${frac * circ} ${(1 - frac) * circ}`}
          strokeLinecap="round" />
      </svg>
      <span className="relative text-[8px] font-bold text-gray-700 dark:text-slate-200 leading-none">{pct}%</span>
    </div>
  );
};

const BB_DATA = [
  { sku: 'SKU-005', name: 'Organic Pet Food 15lb',      bb: 96, competitor: '—',        yourPrice: '$42.99',  compPrice: '—',       gap: '—',       status: 'Won'    },
  { sku: 'SKU-003', name: 'Stainless Water Bottle',     bb: 94, competitor: '—',        yourPrice: '$18.99',  compPrice: '—',       gap: '—',       status: 'Won'    },
  { sku: 'SKU-008', name: 'Bamboo Cutting Board Set',   bb: 91, competitor: '—',        yourPrice: '$34.99',  compPrice: '—',       gap: '—',       status: 'Won'    },
  { sku: 'SKU-002', name: 'Wireless Earbuds Pro',       bb: 88, competitor: 'SoundCo',  yourPrice: '$79.99',  compPrice: '$76.99',  gap: '+$3.00',  status: 'Won'    },
  { sku: 'SKU-004', name: 'Yoga Mat Premium',           bb: 84, competitor: '—',        yourPrice: '$54.99',  compPrice: '—',       gap: '—',       status: 'Won'    },
  { sku: 'SKU-007', name: 'Ergonomic Chair Cushion',    bb: 78, competitor: 'ComfortZ', yourPrice: '$52.00',  compPrice: '$49.99',  gap: '+$2.01',  status: 'At Risk'},
  { sku: 'SKU-009', name: 'Running Shoes Pro',          bb: 72, competitor: 'RunFast',  yourPrice: '$124.99', compPrice: '$119.99', gap: '+$5.00',  status: 'At Risk'},
  { sku: 'SKU-001', name: 'Smart Home Security Camera', bb: 71, competitor: 'SecurePro',yourPrice: '$89.99',  compPrice: '$74.99',  gap: '+$15.00', status: 'At Risk'},
  { sku: 'SKU-010', name: 'Portable Bluetooth Speaker', bb: 58, competitor: 'AudioMax', yourPrice: '$89.99',  compPrice: '$84.99',  gap: '+$5.00',  status: 'Lost'   },
  { sku: 'SKU-006', name: 'Desk Organizer Premium',     bb: 41, competitor: 'OfficePro',yourPrice: '$32.99',  compPrice: '$24.99',  gap: '+$8.00',  status: 'Lost'   },
];
const AOV_CHART_DATA = [
  { name: 'W1', aov: 285 }, { name: 'W2', aov: 298 }, { name: 'W3', aov: 310 },
  { name: 'W4', aov: 302 }, { name: 'W5', aov: 318 }, { name: 'W6', aov: 325 },
];
const bbStatusColor = (s) => s === 'Won' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : s === 'At Risk' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';

const SalesTables = () => {
  // KPI 1 - Total Revenue table
  const revenueData = [
    { sku: 'SKU-001', name: 'Smart Home Security Camera',  channel: 'Amazon',   units: 312, price: '$89.99', revenue: '$28,077', returns: 18,  net: '$26,457' },
    { sku: 'SKU-002', name: 'Wireless Earbuds Pro',        channel: 'Shopify',  units: 284, price: '$79.99', revenue: '$22,717', returns: 9,   net: '$21,997' },
    { sku: 'SKU-004', name: 'Yoga Mat Premium',            channel: 'Amazon',   units: 198, price: '$54.99', revenue: '$10,888', returns: 12,  net: '$10,228' },
    { sku: 'SKU-005', name: 'Organic Pet Food 15lb',       channel: 'TikTok',   units: 420, price: '$42.99', revenue: '$18,056', returns: 5,   net: '$17,841' },
    { sku: 'SKU-008', name: 'Bamboo Cutting Board Set',    channel: 'Google',   units: 246, price: '$34.99', revenue: '$8,607',  returns: 0,   net: '$8,607'  },
    { sku: 'SKU-009', name: 'Running Shoes Pro',           channel: 'Amazon',   units: 168, price: '$124.99',revenue: '$20,999', returns: 21,  net: '$18,374' },
    { sku: 'SKU-006', name: 'Desk Organizer Premium',      channel: 'Amazon',   units: 145, price: '$32.99', revenue: '$4,784',  returns: 4,   net: '$4,652'  },
    { sku: 'SKU-007', name: 'Ergonomic Chair Cushion',     channel: 'Shopify',  units: 204, price: '$52.00', revenue: '$10,608', returns: 7,   net: '$10,244' },
    { sku: 'SKU-003', name: 'Stainless Water Bottle',      channel: 'eBay',     units: 156, price: '$18.99', revenue: '$2,962',  returns: 3,   net: '$2,905'  },
    { sku: 'SKU-010', name: 'Portable Bluetooth Speaker',  channel: 'Amazon',   units: 47,  price: '$89.99', revenue: '$4,230',  returns: 2,   net: '$4,050'  },
  ];
  // KPI 2 - Units Sold table
  const unitsData = [
    { sku: 'SKU-005', name: 'Organic Pet Food 15lb',      amazon: 180, shopify: 80,  tiktok: 160, ebay: 0,   google: 0,   total: 420 },
    { sku: 'SKU-001', name: 'Smart Home Security Camera', amazon: 280, shopify: 0,   tiktok: 0,   ebay: 32,  google: 0,   total: 312 },
    { sku: 'SKU-002', name: 'Wireless Earbuds Pro',       amazon: 0,   shopify: 220, tiktok: 0,   ebay: 64,  google: 0,   total: 284 },
    { sku: 'SKU-008', name: 'Bamboo Cutting Board Set',   amazon: 0,   shopify: 40,  tiktok: 0,   ebay: 0,   google: 206, total: 246 },
    { sku: 'SKU-007', name: 'Ergonomic Chair Cushion',    amazon: 80,  shopify: 124, tiktok: 0,   ebay: 0,   google: 0,   total: 204 },
    { sku: 'SKU-004', name: 'Yoga Mat Premium',           amazon: 160, shopify: 0,   tiktok: 38,  ebay: 0,   google: 0,   total: 198 },
    { sku: 'SKU-009', name: 'Running Shoes Pro',          amazon: 168, shopify: 0,   tiktok: 0,   ebay: 0,   google: 0,   total: 168 },
    { sku: 'SKU-003', name: 'Stainless Water Bottle',     amazon: 60,  shopify: 0,   tiktok: 0,   ebay: 96,  google: 0,   total: 156 },
    { sku: 'SKU-006', name: 'Desk Organizer Premium',     amazon: 145, shopify: 0,   tiktok: 0,   ebay: 0,   google: 0,   total: 145 },
    { sku: 'SKU-010', name: 'Portable Bluetooth Speaker', amazon: 47,  shopify: 0,   tiktok: 0,   ebay: 0,   google: 0,   total: 47  },
  ];
  // KPI 3 - Total Orders table
  const ordersData = [
    { channel: 'Amazon',           orders: 198, units: 1238, aov: '$302', revenue: '$59,796', pct: '48.1%' },
    { channel: 'Shopify',          orders: 86,  units: 464,  aov: '$298', revenue: '$25,628', pct: '20.6%' },
    { channel: 'TikTok Shop',      orders: 62,  units: 198,  aov: '$291', revenue: '$18,042', pct: '14.5%' },
    { channel: 'eBay',             orders: 42,  units: 192,  aov: '$273', revenue: '$11,466', pct: '9.2%'  },
    { channel: 'Google Shopping',  orders: 24,  units: 206,  aov: '$359', revenue: '$8,616',  pct: '6.9%'  },
    { channel: 'Walmart',          orders: 0,   units: 0,    aov: '—',    revenue: '—',        pct: '0%'    },
  ];
  // KPI 4 - Avg Order Value table
  const aovData = [
    { sku: 'SKU-009', name: 'Running Shoes Pro',          price: '$124.99', orders: 168, aov: '$124.99', vsAvg: '+$23', pctVsAvg: '+22.6%', positive: true  },
    { sku: 'SKU-001', name: 'Smart Home Security Camera', price: '$89.99',  orders: 312, aov: '$89.99',  vsAvg: '-$12', pctVsAvg: '-11.8%', positive: false },
    { sku: 'SKU-010', name: 'Portable Bluetooth Speaker', price: '$89.99',  orders: 47,  aov: '$89.99',  vsAvg: '-$12', pctVsAvg: '-11.8%', positive: false },
    { sku: 'SKU-002', name: 'Wireless Earbuds Pro',       price: '$79.99',  orders: 284, aov: '$79.99',  vsAvg: '-$22', pctVsAvg: '-21.6%', positive: false },
    { sku: 'SKU-007', name: 'Ergonomic Chair Cushion',    price: '$52.00',  orders: 204, aov: '$52.00',  vsAvg: '-$50', pctVsAvg: '-49.0%', positive: false },
    { sku: 'SKU-004', name: 'Yoga Mat Premium',           price: '$54.99',  orders: 198, aov: '$54.99',  vsAvg: '-$47', pctVsAvg: '-46.1%', positive: false },
    { sku: 'SKU-005', name: 'Organic Pet Food 15lb',      price: '$42.99',  orders: 420, aov: '$42.99',  vsAvg: '-$59', pctVsAvg: '-57.8%', positive: false },
    { sku: 'SKU-006', name: 'Desk Organizer Premium',     price: '$32.99',  orders: 145, aov: '$32.99',  vsAvg: '-$69', pctVsAvg: '-67.7%', positive: false },
    { sku: 'SKU-008', name: 'Bamboo Cutting Board Set',   price: '$34.99',  orders: 246, aov: '$34.99',  vsAvg: '-$67', pctVsAvg: '-65.7%', positive: false },
    { sku: 'SKU-003', name: 'Stainless Water Bottle',     price: '$18.99',  orders: 156, aov: '$18.99',  vsAvg: '-$83', pctVsAvg: '-81.4%', positive: false },
  ];
  // KPI 6 - ROAS table
  const roasData = [
    { campaign: 'Organic Pet Food — TikTok Spark',      type: 'Spark Ads',   spend: '$150',   revenue: '$2,504', roas: '16.7×', acos: '6.0%',  impressions: '84,000',  status: 'Scale'  },
    { campaign: 'Bamboo Board — Google Shopping',        type: 'Shopping',    spend: '$210',   revenue: '$3,510', roas: '16.7×', acos: '6.0%',  impressions: '42,000',  status: 'Scale'  },
    { campaign: 'Wireless Earbuds — Sponsored Products', type: 'SP',          spend: '$620',   revenue: '$5,127', roas: '8.3×',  acos: '12.1%', impressions: '186,000', status: 'Healthy'},
    { campaign: 'Security Camera — Sponsored Products',  type: 'SP',          spend: '$1,400', revenue: '$12,500',roas: '8.9×',  acos: '11.2%', impressions: '420,000', status: 'Review' },
    { campaign: 'Yoga Mat — Google PMax',                type: 'PMax',        spend: '$380',   revenue: '$2,090', roas: '5.5×',  acos: '18.2%', impressions: '95,000',  status: 'Healthy'},
    { campaign: 'Running Shoes — Sponsored Products',    type: 'SP',          spend: '$920',   revenue: '$1,288', roas: '1.4×',  acos: '71.4%', impressions: '276,000', status: 'Pause'  },
  ];

  const roasStatusColor = (s) => s === 'Scale' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : s === 'Healthy' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : s === 'Review' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';

  const TableWrap = ({ children, scrollable }) => (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className={scrollable ? 'overflow-auto max-h-[300px]' : 'overflow-x-auto'}>{children}</div>
    </div>
  );
  const TH = ({ children }) => <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 whitespace-nowrap">{children}</th>;
  const TD = ({ children, className = '' }) => <td className={`px-4 py-2.5 text-xs ${className}`}>{children}</td>;
  const TR = ({ children }) => <tr className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/40 dark:hover:bg-slate-800/20 transition-colors">{children}</tr>;
  const thead = (cols) => <thead className="sticky top-0 z-10"><tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">{cols.map(c => <TH key={c}>{c}</TH>)}</tr></thead>;

  // ── Product card carousel (Total Revenue) ──────────────────────────────────
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const STEP = 252;
    let timer;
    const checkArrows = () => {
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    const tick = () => {
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: STEP, behavior: 'smooth' });
      }
    };
    const start = () => { timer = setInterval(tick, 3000); };
    const stop = () => clearInterval(timer);
    start();
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);
    el.addEventListener('scroll', checkArrows);
    checkArrows();
    return () => {
      stop();
      el.removeEventListener('mouseenter', stop);
      el.removeEventListener('mouseleave', start);
      el.removeEventListener('scroll', checkArrows);
    };
  }, []);
  const scrollCarousel = (dir) => carouselRef.current?.scrollBy({ left: dir * 252, behavior: 'smooth' });
  const CHAN_STYLE = {
    Amazon: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400' },
    Shopify: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
    TikTok: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
    Google: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' },
    eBay: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
  };
  const SPARKLINE_DATA = [
    [20,25,18,30,24,35,28],[30,28,22,25,20,18,15],[18,22,26,20,28,24,32],
    [28,22,30,18,26,20,24],[14,20,25,18,30,26,34],[34,28,22,30,20,24,18],
    [20,22,24,26,28,30,32],[32,28,24,20,22,18,16],[20,30,16,28,22,32,25],[25,18,28,20,14,22,18],
  ];
  const CARD_COLORS = ['bg-violet-50','bg-sky-50','bg-emerald-50','bg-amber-50','bg-rose-50','bg-indigo-50','bg-teal-50','bg-orange-50','bg-cyan-50','bg-pink-50'];
  const ProductSparkline = ({ idx }) => {
    const raw = SPARKLINE_DATA[idx % SPARKLINE_DATA.length];
    const positive = raw[raw.length - 1] >= raw[0];
    const min = Math.min(...raw), max = Math.max(...raw), range = max - min || 1;
    const W = 80, H = 28;
    const pts = raw.map((v, i) => `${(i / (raw.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`).join(' ');
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
        <polyline points={pts} stroke={positive ? '#22c55e' : '#ef4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-5">

      {/* ── Total Revenue ── */}
      <div>
        <SectionHeading title="Total Revenue — by Product" />
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scrollCarousel(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-sm flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors -ml-3"
            >
              <i className="fa-solid fa-chevron-left text-[10px]" />
            </button>
          )}
          <div ref={carouselRef} className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {revenueData.map((r, i) => {
              const chanStyle = CHAN_STYLE[r.channel] || { bg: 'bg-gray-100', text: 'text-gray-600' };
              return (
                <div key={i} className="flex-shrink-0 w-[240px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <div className={`w-10 h-10 rounded-xl ${CARD_COLORS[i % CARD_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-bold text-gray-500">{r.name[0]}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight line-clamp-2 flex-1 min-w-0">{r.name}</p>
                  </div>
                  <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full ${chanStyle.bg} ${chanStyle.text}`}>{r.channel}</span>
                  <div className="grid grid-cols-3 gap-x-1">
                    <div><p className="text-[9px] text-gray-400 dark:text-slate-500">Units</p><p className="text-[11px] font-semibold text-gray-800 dark:text-slate-200">{r.units}</p></div>
                    <div><p className="text-[9px] text-gray-400 dark:text-slate-500">Price</p><p className="text-[11px] font-semibold text-gray-800 dark:text-slate-200">{r.price}</p></div>
                    <div><p className="text-[9px] text-gray-400 dark:text-slate-500">Revenue</p><p className="text-[11px] font-semibold text-gray-800 dark:text-slate-200 truncate">{r.revenue}</p></div>
                  </div>
                  <div className="flex items-end justify-between mt-auto pt-1.5 border-t border-gray-50 dark:border-slate-800">
                    <div>
                      <p className="text-[9px] text-gray-400 dark:text-slate-500">Net</p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">{r.net}</p>
                    </div>
                    <ProductSparkline idx={i} />
                  </div>
                </div>
              );
            })}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scrollCarousel(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-sm flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors -mr-3"
            >
              <i className="fa-solid fa-chevron-right text-[10px]" />
            </button>
          )}
        </div>
      </div>

      {/* ── Units Sold + Total Orders side by side ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="min-w-0">
          <SectionHeading title="Units Sold — by Channel" />
          <TableWrap scrollable>
            <table className="w-full">
              {thead(['SKU', 'Product', 'Top Channel', 'Units', 'Total'])}
              <tbody>
                {unitsData.map((r, i) => {
                  const chMap = { amazon: r.amazon, shopify: r.shopify, tiktok: r.tiktok, ebay: r.ebay, google: r.google };
                  const topCh = Object.entries(chMap).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <TR key={i}>
                      <TD className="font-mono text-gray-400 dark:text-slate-500">{r.sku}</TD>
                      <TD className="font-semibold text-gray-900 dark:text-slate-100 max-w-[130px] truncate">{r.name}</TD>
                      <TD className="text-gray-500 dark:text-slate-400 capitalize">{topCh[0]}</TD>
                      <TD className="text-gray-700 dark:text-slate-300">{topCh[1].toLocaleString()}</TD>
                      <TD className="font-bold text-gray-900 dark:text-slate-100">{r.total.toLocaleString()}</TD>
                    </TR>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        </div>
        <div className="min-w-0">
          <SectionHeading title="Total Orders — by Channel" />
          <TableWrap scrollable>
            <table className="w-full">
              {thead(['Channel', 'Orders', 'Units', 'AOV', 'Revenue', '% of Total'])}
              <tbody>
                {ordersData.map((r, i) => (
                  <TR key={i}>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{r.channel}</TD>
                    <TD className="text-gray-700 dark:text-slate-300">{r.orders > 0 ? r.orders : '—'}</TD>
                    <TD className="text-gray-700 dark:text-slate-300">{r.units > 0 ? r.units.toLocaleString() : '—'}</TD>
                    <TD className="text-gray-700 dark:text-slate-300">{r.aov}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{r.revenue}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden min-w-[40px]">
                          <div className="h-full bg-gray-700 dark:bg-slate-300 rounded-full" style={{ width: r.pct }} />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 whitespace-nowrap">{r.pct}</span>
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
      </div>

      {/* ── AOV table + AOV trend chart side by side ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="min-w-0">
          <SectionHeading title="Avg Order Value — by Product" />
          <TableWrap scrollable>
            <table className="w-full">
              {thead(['SKU', 'Product', 'Orders', 'AOV', 'vs Avg ($302)', '±%'])}
              <tbody>
                {aovData.map((r, i) => (
                  <TR key={i}>
                    <TD className="font-mono text-gray-400 dark:text-slate-500">{r.sku}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100 max-w-[130px] truncate">{r.name}</TD>
                    <TD className="text-gray-600 dark:text-slate-400">{r.orders}</TD>
                    <TD className="font-bold text-gray-900 dark:text-slate-100">{r.aov}</TD>
                    <TD className={r.positive ? 'font-semibold text-green-600 dark:text-green-400' : 'font-semibold text-red-500 dark:text-red-400'}>{r.vsAvg}</TD>
                    <TD className={r.positive ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'}>{r.pctVsAvg}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
        <div className="min-w-0">
          <SectionHeading title="Avg Order Value — Trend" />
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3">
            <div className="h-[276px]">
              <BaseLineChart
                data={AOV_CHART_DATA}
                lines={[{ key: 'aov', name: 'Avg Order Value', color: '#22c55e' }]}
                yAxisFormatter={v => `$${v}`}
                tooltipFormatter={(v, n) => [`$${v}`, n]}
                height={276}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ROAS / Campaign Performance ── */}
      <div>
        <SectionHeading title="ROAS — Campaign Performance" />
        <TableWrap scrollable>
          <table className="w-full">
            {thead(['Campaign', 'Type', 'Spend', 'Revenue', 'ROAS', 'ACoS', 'Impressions', 'Status'])}
            <tbody>
              {roasData.map((r, i) => (
                <TR key={i}>
                  <TD className="font-semibold text-gray-900 dark:text-slate-100 max-w-[200px] truncate">{r.campaign}</TD>
                  <TD><span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded text-[9px] font-mono">{r.type}</span></TD>
                  <TD className="text-gray-700 dark:text-slate-300">{r.spend}</TD>
                  <TD className="font-semibold text-gray-900 dark:text-slate-100">{r.revenue}</TD>
                  <TD className={parseFloat(r.roas) >= 5 ? 'font-bold text-green-600 dark:text-green-400' : parseFloat(r.roas) >= 3 ? 'font-bold text-amber-600 dark:text-amber-400' : 'font-bold text-red-500 dark:text-red-400'}>{r.roas}</TD>
                  <TD className={parseFloat(r.acos) <= 15 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>{r.acos}</TD>
                  <TD className="text-gray-500 dark:text-slate-400">{r.impressions}</TD>
                  <TD><span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase ${roasStatusColor(r.status)}`}>{r.status}</span></TD>
                </TR>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </div>

      {/* ── Top / Bottom Movers (keep existing) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="min-w-0">
          <SectionHeading title="Top Movers (Revenue)" />
          <TableWrap>
            <table className="w-full">
              {thead(['#', 'Product', 'SKU', 'Revenue', 'Change'])}
              <tbody>
                {salesTopMovers.map((item, i) => (
                  <TR key={i}>
                    <TD className="font-bold text-gray-400 dark:text-slate-500">{i + 1}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{item.name}</TD>
                    <TD className="font-mono text-[10px] text-gray-500 dark:text-slate-400">{item.sku}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{item.revenue}</TD>
                    <TD className="font-bold text-green-600">{item.change}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
        <div className="min-w-0">
          <SectionHeading title="Bottom Movers (Revenue)" />
          <TableWrap>
            <table className="w-full">
              {thead(['#', 'Product', 'SKU', 'Revenue', 'Change'])}
              <tbody>
                {salesBottomMovers.map((item, i) => (
                  <TR key={i}>
                    <TD className="font-bold text-red-400">{i + 1}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{item.name}</TD>
                    <TD className="font-mono text-[10px] text-gray-500 dark:text-slate-400">{item.sku}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{item.revenue}</TD>
                    <TD className="font-bold text-red-500">{item.change}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
      </div>

    </div>
  );
};

const MarginTables = () => (
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-3 mt-0">
        <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">Bleeding Margin SKUs</h4>
        <span className="text-[11px] text-gray-400 dark:text-slate-500">Sorted by $ at risk descending</span>
      </div>
      <BleedingMarginTable onRowClick={() => {}} hideTitleBar />
    </div>
    <div>
      <SectionHeading title="Unprofitable SKUs" />
      <div className="space-y-2">
        {unprofitableSKUs.map((sku, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{sku.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{sku.sku} · {sku.channel}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{sku.loss}</p>
              <p className="text-xs text-gray-400">{sku.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <SectionHeading title="Ad Spend Impact on Margin" />
      <div className="space-y-2">
        {adSpendImpact.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 font-bold">Ad spend: {item.spend}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{item.impact}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.erosion}</p>
              <p className="text-xs text-gray-400">erosion</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <SectionHeading title="COGS Compressions" />
      <div className="space-y-2">
        {cogsCompressions.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{item.trend}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-red-500">{item.increase}</p>
              <p className="text-xs text-gray-400">{item.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <SectionHeading title="Returns Impact" />
      <div className="space-y-2">
        {returnsImpact.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{item.meta}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-red-600">{item.loss}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MarginDashboardGrid = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
    {/* 1. Margin Trend Chart */}
    <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
        <MarginTrendChart />
      </div>
    </Suspense>
    {/* 2. Fee Forensics */}
    <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
      <FeeForensics />
    </Suspense>
    {/* 3. Unprofitable SKUs */}
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Unprofitable SKUs</p>
      <div className="space-y-2">
        {unprofitableSKUs.map((sku, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{sku.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{sku.sku} · {sku.channel}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{sku.loss}</p>
              <p className="text-xs text-gray-400">{sku.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* 4. Ad Spend Impact on Margin */}
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Ad Spend Impact on Margin</p>
      <div className="space-y-2">
        {adSpendImpact.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 font-bold">Ad spend: {item.spend}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{item.impact}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.erosion}</p>
              <p className="text-xs text-gray-400">erosion</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* 5. COGS Compressions */}
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">COGS Compressions</p>
      <div className="space-y-2">
        {cogsCompressions.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{item.trend}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-red-500">{item.increase}</p>
              <p className="text-xs text-gray-400">{item.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* 6. Returns Impact */}
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-3">Returns Impact</p>
      <div className="space-y-2">
        {returnsImpact.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{item.meta}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-red-600">{item.loss}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* 7. Margin Distribution Chart */}
    <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
      <MarginDistributionChart />
    </Suspense>
  </div>
);

const InventoryTables = () => (
  <div className="space-y-6">
    <div>
      <SectionHeading title="Reorder Recommendations" />
      <ReorderRecommendationsTable />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <div>
        <SectionHeading title="Recommended PO Drafts" />
        <div className="space-y-3">
          {[
            { title: 'Premium Wireless Headphones', vendor: 'TechSource', lt: '14d', qty: '500 units', value: '$18,400', status: 'Critical' },
            { title: 'USB-C Hub 7-in-1', vendor: 'ComponentPro', lt: '21d', qty: '300 units', value: '$12,200', status: 'High' },
            { title: 'Pet Grooming Kit 5-Piece', vendor: 'PetSupplies Co', lt: '10d', qty: '200 units', value: '$8,600', status: 'Medium' },
          ].map((po, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{po.title}</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">{po.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p className="text-gray-400">Vendor</p><p className="font-semibold text-gray-800 dark:text-slate-200">{po.vendor}</p></div>
                <div><p className="text-gray-400">Qty</p><p className="font-semibold text-gray-800 dark:text-slate-200">{po.qty}</p></div>
                <div><p className="text-gray-400">Value</p><p className="font-semibold text-gray-800 dark:text-slate-200">{po.value}</p></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Lead time: {po.lt}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionHeading title="Overstock (DOC>180d)" />
        <div className="space-y-3">
          {[
            { title: 'Bamboo Cutting Board Set', doc: '245d', units: '890', value: '$42,720', action: 'Liquidate', sub: 'Tied up capital · DOC critical' },
            { title: 'Kitchen Timer Digital 3-Pack', doc: '210d', units: '1,420', value: '$28,400', action: 'Discount', sub: 'Slow moving · consider bundle' },
            { title: 'Winter Coats (Old Season)', doc: '195d', units: '320', value: '$22,400', action: 'Bundle', sub: 'Seasonal overhang · offload' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.title}</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">{item.action}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-500 mb-2">{item.sub}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p className="text-gray-400">DOC</p><p className="font-bold text-gray-800 dark:text-slate-200">{item.doc}</p></div>
                <div><p className="text-gray-400">Units</p><p className="font-semibold text-gray-800 dark:text-slate-200">{item.units}</p></div>
                <div><p className="text-gray-400">Tied Capital</p><p className="font-bold text-gray-800 dark:text-slate-200">{item.value}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div>
      <SectionHeading title="Warehouse Distribution" />
      <WarehouseSection />
    </div>
  </div>
);

const AdsTables = () => {
  const campaignData = [
    { campaign: 'Security Camera — SP',         type: 'SP',       spend: '$1,400', revenue: '$12,500', roas: '8.9×', acos: '11.2%', impressions: '420,000', clicks: '4,200', ctr: '1.0%', cpc: '$0.33', convRate: '7.4%', status: 'Review'  },
    { campaign: 'Earbuds — Sponsored Products', type: 'SP',       spend: '$620',   revenue: '$5,127',  roas: '8.3×', acos: '12.1%', impressions: '186,000', clicks: '2,480', ctr: '1.3%', cpc: '$0.25', convRate: '4.6%', status: 'Healthy' },
    { campaign: 'Pet Food — TikTok Spark',      type: 'TikTok',   spend: '$150',   revenue: '$2,504',  roas: '16.7×',acos: '6.0%',  impressions: '84,000',  clicks: '1,680', ctr: '2.0%', cpc: '$0.09', convRate: '14.9%',status: 'Scale'   },
    { campaign: 'Bamboo Board — Google Shop',   type: 'Shopping', spend: '$210',   revenue: '$3,510',  roas: '16.7×',acos: '6.0%',  impressions: '42,000',  clicks: '840',   ctr: '2.0%', cpc: '$0.25', convRate: '29.3%',status: 'Scale'   },
    { campaign: 'Yoga Mat — Google PMax',       type: 'PMax',     spend: '$380',   revenue: '$2,090',  roas: '5.5×', acos: '18.2%', impressions: '95,000',  clicks: '950',   ctr: '1.0%', cpc: '$0.40', convRate: '8.4%', status: 'Healthy' },
    { campaign: 'Running Shoes — SP',           type: 'SP',       spend: '$920',   revenue: '$1,288',  roas: '1.4×', acos: '71.4%', impressions: '276,000', clicks: '2,760', ctr: '1.0%', cpc: '$0.33', convRate: '2.2%', status: 'Pause'   },
    { campaign: 'Chair Cushion — SP',           type: 'SP',       spend: '$340',   revenue: '$1,428',  roas: '4.2×', acos: '23.8%', impressions: '102,000', clicks: '1,020', ctr: '1.0%', cpc: '$0.33', convRate: '3.8%', status: 'Healthy' },
    { campaign: 'Desk Organizer — SP',          type: 'SP',       spend: '$180',   revenue: '$432',    roas: '2.4×', acos: '41.7%', impressions: '72,000',  clicks: '720',   ctr: '1.0%', cpc: '$0.25', convRate: '2.8%', status: 'Review'  },
  ];
  const platformData = [
    { platform: 'Amazon Sponsored Products', spend: '$3,460', revenue: '$20,775', roas: '6.0×', acos: '16.7%', campaigns: 5, skus: 8  },
    { platform: 'TikTok Shop Spark Ads',     spend: '$150',   revenue: '$2,504',  roas: '16.7×',acos: '6.0%',  campaigns: 1, skus: 1  },
    { platform: 'Google Shopping / PMax',    spend: '$590',   revenue: '$5,600',  roas: '9.5×', acos: '10.5%', campaigns: 2, skus: 3  },
  ];

  const statusColor = (s) => s === 'Scale' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : s === 'Healthy' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : s === 'Review' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';

  const TableWrap = ({ children, scrollable }) => (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className={scrollable ? 'overflow-auto max-h-[300px]' : 'overflow-x-auto'}>{children}</div>
    </div>
  );
  const TH = ({ children }) => <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 whitespace-nowrap">{children}</th>;
  const TD = ({ children, className = '' }) => <td className={`px-4 py-2.5 text-xs ${className}`}>{children}</td>;
  const TR = ({ children }) => <tr className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/40 dark:hover:bg-slate-800/20 transition-colors">{children}</tr>;
  const thead = (cols) => <thead className="sticky top-0 z-10"><tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">{cols.map(c => <TH key={c}>{c}</TH>)}</tr></thead>;

  return (
    <div className="space-y-5">
      <div>
        <SectionHeading title="Campaign Performance — ROAS, ACoS, CTR" />
        <TableWrap scrollable>
          <table className="w-full">
            {thead(['Campaign', 'Type', 'Spend', 'Revenue', 'ROAS', 'ACoS', 'Conv %', 'Status'])}
            <tbody>
              {campaignData.map((r, i) => (
                <TR key={i}>
                  <TD className="font-semibold text-gray-900 dark:text-slate-100 max-w-[200px] truncate">{r.campaign}</TD>
                  <TD><span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded text-[9px] font-mono">{r.type}</span></TD>
                  <TD className="text-gray-700 dark:text-slate-300">{r.spend}</TD>
                  <TD className="font-semibold text-gray-900 dark:text-slate-100">{r.revenue}</TD>
                  <TD className={parseFloat(r.roas) >= 8 ? 'font-bold text-green-600 dark:text-green-400' : parseFloat(r.roas) >= 4 ? 'font-bold text-amber-600 dark:text-amber-400' : 'font-bold text-red-500 dark:text-red-400'}>{r.roas}</TD>
                  <TD className={parseFloat(r.acos) <= 15 ? 'text-green-600 dark:text-green-400' : parseFloat(r.acos) <= 25 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}>{r.acos}</TD>
                  <TD className="text-gray-600 dark:text-slate-400">{r.convRate}</TD>
                  <TD><span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase ${statusColor(r.status)}`}>{r.status}</span></TD>
                </TR>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </div>
      {/* ── Platform Distribution + Platform Performance Summary 50-50 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
          <div>
            <SectionHeading title="Platform Distribution" />
            <PlatformDistributionChart />
          </div>
        </Suspense>
        <div>
          <SectionHeading title="Platform Performance Summary" />
          <TableWrap>
            <table className="w-full">
              {thead(['Platform', 'Total Spend', 'Revenue', 'ROAS', 'ACoS', 'Campaigns', 'Active SKUs'])}
              <tbody>
                {platformData.map((r, i) => (
                  <TR key={i}>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{r.platform}</TD>
                    <TD className="text-gray-700 dark:text-slate-300">{r.spend}</TD>
                    <TD className="font-semibold text-gray-900 dark:text-slate-100">{r.revenue}</TD>
                    <TD className="font-bold text-green-600 dark:text-green-400">{r.roas}</TD>
                    <TD className={parseFloat(r.acos) <= 12 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>{r.acos}</TD>
                    <TD className="text-gray-600 dark:text-slate-400">{r.campaigns}</TD>
                    <TD className="text-gray-600 dark:text-slate-400">{r.skus}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
      </div>
      <div>
        <SectionHeading title="Channel Distribution" />
        <PlatformPerformanceSection />
      </div>
    </div>
  );
};

const CashPageTables = () => (
  <div className="space-y-6">
    {/* ── Cash Distribution + Upcoming Deposits 50-50 ── */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
        <div>
          <SectionHeading title="Cash Distribution" />
          <CashDistributionSection />
        </div>
      </Suspense>
      <div>
        <SectionHeading title="Upcoming Deposits" />
        <UpcomingDepositsContent />
      </div>
    </div>
    <div>
      <SectionHeading title="Transaction Categories" />
      <TransactionAnalysisSection />
    </div>
  </div>
);

const TABLES_MAP = { sales: SalesTables, margin: MarginTables, inventory: InventoryTables, ads: AdsTables, cash: CashPageTables };

// ─── Dashboard tab list ────────────────────────────────────────────────────────

const DETAIL_VIEW_TABS = [
  { key: 'sales',     label: 'Sales',     icon: 'fa-dollar-sign'    },
  { key: 'margin',    label: 'Margin',    icon: 'fa-chart-line'     },
  { key: 'inventory', label: 'Inventory', icon: 'fa-boxes'          },
  { key: 'ads',       label: 'Ads',       icon: 'fa-bullhorn'       },
  { key: 'cash',      label: 'Cash',      icon: 'fa-money-bill-wave'},
];

// ─── Filter option arrays — never change, defined once at module level ────────

const V2_DATE_OPTS  = [['last-7-days','Last 7 Days'],['last-30-days','Last 30 Days'],['last-90-days','Last 90 Days'],['ytd','Year to Date']];
const V2_CAT_OPTS   = [['all','All Categories'],['electronics','Electronics'],['home-garden','Home & Garden'],['apparel','Apparel'],['pet-suppliers','Pet Suppliers']];
const V2_CAT_RECENT = [['electronics','Electronics'],['apparel','Apparel'],['home-garden','Home & Garden']];
const V2_CAT_GRID   = [['electronics','Electronics'],['apparel','Apparel'],['home-garden','Home & Garden'],['pet-suppliers','Pet Suppliers'],['all','All Categories']];
const CAL_MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Pure utility functions — no state/props deps, safe at module level
const isSameDay = (a, b) => !!(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
const isInRange = (date, start, end) => {
  if (!start || !end) return false;
  const d = date.getTime(), s = Math.min(start.getTime(), end.getTime()), e = Math.max(start.getTime(), end.getTime());
  return d > s && d < e;
};
const formatCalDate = (d) => !d ? '' : `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getFullYear()}`;
const _getDurLabel  = (key) => ({ 'last-7-days': '7 days', 'last-30-days': '30 days', 'last-90-days': '90 days', 'ytd': 'YTD' }[key] || '30 days');
const quickToRange  = (key) => {
  const end = new Date(); end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  if (key === 'last-7-days') start.setDate(start.getDate() - 6);
  else if (key === 'last-30-days') start.setDate(start.getDate() - 29);
  else if (key === 'last-90-days') start.setDate(start.getDate() - 89);
  else if (key === 'ytd') { start.setMonth(0); start.setDate(1); }
  else start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  return { start, end };
};
const v2DateLabel = (v) => V2_DATE_OPTS.find(([k]) => k === v)?.[1] || v;
const v2CatLabel  = (v) => V2_CAT_OPTS.find(([k]) => k === v)?.[1] || v;

// ─── Main page ─────────────────────────────────────────────────────────────────

const DetailedViewPage = () => {
  const { intelType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [kpiIsSticky, setKpiIsSticky] = useState(false);
  const kpiSectionRef = useRef(null);
  const compactFilterRef = useRef(null);
  const [compactFilterOpen, setCompactFilterOpen] = useState(false);
  const [compactExpandedFilter, setCompactExpandedFilter] = useState(null);

  /* ── V2 filter panel state ── */
  const [v2FilterOpen, setV2FilterOpen] = useState(false);
  const [v2Section, setV2Section] = useState('date');
  const [pendingDate, setPendingDate] = useState(null);
  const [pendingCats, setPendingCats] = useState([]);
  const [pendingChans, setPendingChans] = useState([]);
  const [appliedDate, setAppliedDate] = useState(() => localStorage.getItem('dv_filter_date') || null);
  const [appliedCats, setAppliedCats] = useState([]);
  const [appliedChans, setAppliedChans] = useState([]);
  const [chanDropOpen, setChanDropOpen] = useState(false);
  const [pendingRangeStart, setPendingRangeStart] = useState(null);
  const [pendingRangeEnd, setPendingRangeEnd] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);
  const [calViewYear, setCalViewYear] = useState(() => new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(() => new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1);
  const [durOpen, setDurOpen] = useState(false);
  const v2FilterRef = useRef(null);
  const chanDropRef = useRef(null);
  const durRef = useRef(null);

  const { dateRange, setDateRange, category, setCategory, channel, setChannel } = useFilterStore();

  const [selectedKpiIndices, setSelectedKpiIndices] = useState(location.state?.selectedKpiIndices || [0, 1, 2, 3, 4, 5]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const [kpiDetailModal, setKpiDetailModal] = useState(null);
  const statsData = intelType === 'cash' ? cashStats : (STATS_DATA[intelType] || STATS_DATA.sales);
  const pageTitle = PAGE_TITLES[intelType] || 'Sales';
  const backRoute = location.state?.from || BACK_ROUTES[intelType] || '/intel';

  const ChartsComponent = CHARTS_MAP[intelType] || SalesCharts;
  const TablesComponent = TABLES_MAP[intelType] || SalesTables;

  // Scroll detection — shows tabs in sticky header, collapses search bar
  useEffect(() => {
    const el = document.querySelector('.dashboard-main-content');
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 30);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Close compact filter when scrolling back to top
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isScrolled) setCompactFilterOpen(false);
  }, [isScrolled]);

  // KPI sticky — triggers when KPI section < 28% visible
  useEffect(() => {
    const scrollEl = document.querySelector('.dashboard-main-content');
    const target = kpiSectionRef.current;
    if (!scrollEl || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setKpiIsSticky(entry.intersectionRatio < 0.28),
      { root: scrollEl, threshold: [0, 0.1, 0.25, 0.28, 0.5, 1.0] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Single document listener per dropdown — hook attaches only while open, cleans up on close
  useClickOutside(compactFilterRef, compactFilterOpen, () => setCompactFilterOpen(false));
  useClickOutside(v2FilterRef, v2FilterOpen, () => setV2FilterOpen(false));
  useClickOutside(chanDropRef, chanDropOpen, () => setChanDropOpen(false));
  useClickOutside(durRef, durOpen, () => setDurOpen(false));

  // Restore persisted date filter to store on mount
  useEffect(() => {
    const saved = localStorage.getItem('dv_filter_date');
    if (saved) setDateRange(saved);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Filter helpers — dynamic values only (static arrays/pure fns are module-level) ── */
  // localStorage read once per mount — value doesn't change during component lifetime
  const activePlatforms = useMemo(
    () => JSON.parse(localStorage.getItem('active_platforms') || '["shopify","amazon","tiktok"]'),
    []
  );
  const channelOptions = useMemo(() => [
    ['all', 'All Channels'],
    ...(activePlatforms.includes('amazon') ? [['amazon', 'Amazon']] : []),
    ...(activePlatforms.includes('shopify') ? [['shopify', 'Shopify']] : []),
    ...(activePlatforms.includes('tiktok') ? [['tiktok-shop', 'TikTok Shop']] : []),
  ], [activePlatforms]);

  // V2_DATE_OPTS, V2_CAT_OPTS, V2_CAT_RECENT, V2_CAT_GRID, CAL_MONTHS → module-level constants above
  // isSameDay, isInRange, formatCalDate, getDurLabel, quickToRange, v2DateLabel, v2CatLabel → module-level pure functions above
  const v2ChanList   = useMemo(() => channelOptions.filter(([v]) => v !== 'all'), [channelOptions]);
  const v2ChanRecent = useMemo(() => v2ChanList.slice(0, 2), [v2ChanList]);
  const v2ChanGrid   = useMemo(() => [...v2ChanList, ['all-chans', 'All Channels']], [v2ChanList]);
  const v2ChanLabel  = (v) => channelOptions.find(([k]) => k === v)?.[1] || v;
  const prevCalMonth = () => {
    if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear(y => y - 1); }
    else setCalViewMonth(m => m - 1);
  };
  const nextCalMonth = () => {
    if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear(y => y + 1); }
    else setCalViewMonth(m => m + 1);
  };
  const handleDateClick = (date) => {
    if (!pendingRangeStart || pendingRangeEnd) {
      setPendingRangeStart(date); setPendingRangeEnd(null); setPendingDate('custom');
    } else {
      if (date < pendingRangeStart) { setPendingRangeEnd(pendingRangeStart); setPendingRangeStart(date); }
      else setPendingRangeEnd(date);
      setPendingDate('custom');
    }
  };
  const calRightM = (calViewMonth + 1) % 12;
  const calRightY = calViewMonth === 11 ? calViewYear + 1 : calViewYear;
  const renderCalMonth = (year, month, showPrev, showNext) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    const todayRef = new Date(); todayRef.setHours(0, 0, 0, 0);
    const effectiveEnd = pendingRangeEnd || (pendingRangeStart && !pendingRangeEnd ? hoverDay : null);
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2 px-0.5">
          {showPrev ? (
            <button onClick={prevCalMonth} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition">
              <i className="fa-solid fa-chevron-left text-[9px]" />
            </button>
          ) : <span className="w-6" />}
          <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
            {CAL_MONTHS[month]} <span className="text-gray-400 dark:text-slate-500 font-normal">{year}</span>
          </span>
          {showNext ? (
            <button onClick={nextCalMonth} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition">
              <i className="fa-solid fa-chevron-right text-[9px]" />
            </button>
          ) : <span className="w-6" />}
        </div>
        <div className="grid grid-cols-7 mb-0.5">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-gray-400 dark:text-slate-500 py-0.5">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="aspect-square" />;
            const isStart = isSameDay(date, pendingRangeStart);
            const isEnd   = isSameDay(date, pendingRangeEnd);
            const inRange = isInRange(date, pendingRangeStart, effectiveEnd);
            const isToday = isSameDay(date, todayRef);
            return (
              <div key={i} className="aspect-square flex items-center justify-center">
                <button
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => { if (pendingRangeStart && !pendingRangeEnd) setHoverDay(date); }}
                  onMouseLeave={() => setHoverDay(null)}
                  className={`w-6 h-6 flex items-center justify-center text-[11px] rounded-full transition-all ${
                    isStart || isEnd
                      ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 font-bold'
                      : inRange
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                      : isToday
                      ? 'ring-1 ring-gray-400 dark:ring-slate-500 text-gray-900 dark:text-slate-100 font-semibold'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleOpenV2Filter = () => {
    setPendingDate(appliedDate);
    setPendingCats([...appliedCats]);
    setPendingChans([...appliedChans]);
    setV2Section('date');
    if (appliedDate) {
      const r = quickToRange(appliedDate === 'custom' ? 'last-30-days' : appliedDate);
      setPendingRangeStart(r.start); setPendingRangeEnd(r.end);
      const sm = r.start.getMonth();
      setCalViewMonth(sm === 0 ? 11 : sm - 1);
      setCalViewYear(sm === 0 ? r.start.getFullYear() - 1 : r.start.getFullYear());
    } else {
      setPendingRangeStart(null); setPendingRangeEnd(null);
      const now = new Date();
      setCalViewMonth(now.getMonth() === 0 ? 11 : now.getMonth() - 1);
      setCalViewYear(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
    }
    setV2FilterOpen(true);
  };
  const handleApplyV2Filter = () => {
    setAppliedDate(pendingDate);
    if (pendingDate) localStorage.setItem('dv_filter_date', pendingDate);
    else localStorage.removeItem('dv_filter_date');
    setAppliedCats([...pendingCats]);
    setAppliedChans([...pendingChans]);
    setDateRange(pendingDate);
    setCategory(pendingCats.length === 1 ? pendingCats[0] : 'all');
    setChannel(pendingChans.length === 1 ? pendingChans[0] : 'all');
    setV2FilterOpen(false);
  };
  const togglePendingCat = (cat) => {
    if (cat === 'all') { setPendingCats([]); return; }
    setPendingCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const togglePendingChan = (ch) =>
    setPendingChans(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  const removeAppliedChan = (ch) => {
    const next = appliedChans.filter(c => c !== ch);
    setAppliedChans(next);
    setChannel(next.length === 1 ? next[0] : 'all');
  };

  /* ── Compact filter (scrolled header) ── */
  const compactFilterOptions = [
    { label: 'Date Range', value: dateRange, onChange: setDateRange, options: [['last-7-days','Last 7 Days'],['last-30-days','Last 30 Days'],['last-90-days','Last 90 Days'],['ytd','Year to Date']] },
    { label: 'Category',   value: category,  onChange: setCategory,  options: [['all','All Categories'],['electronics','Electronics'],['home-garden','Home & Garden'],['apparel','Apparel'],['pet-suppliers','Pet Suppliers']] },
    { label: 'Channel',    value: channel,   onChange: setChannel,   options: channelOptions },
  ];

  const compactFilterElement = isScrolled ? (
    <div className="relative" ref={compactFilterRef}>
      <button
        onClick={() => setCompactFilterOpen(o => !o)}
        className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all ${compactFilterOpen
          ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
          : 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <i className="fa-solid fa-sliders text-[10px]" />
      </button>
      {compactFilterOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-[9999]">
          <div className="flex flex-col min-w-[168px] rounded-xl overflow-hidden">
            {compactFilterOptions.map((sel, i) => {
              const currentLabel = sel.options.find(([val]) => val === sel.value)?.[1] || sel.options[0][1];
              const isExpanded = compactExpandedFilter === i;
              return (
                <button key={i} onClick={() => setCompactExpandedFilter(isExpanded ? null : i)}
                  className={`flex items-center justify-between px-3.5 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors ${i > 0 ? 'border-t border-gray-100 dark:border-slate-800' : ''} ${isExpanded ? 'bg-gray-50 dark:bg-slate-800/40' : ''}`}
                >
                  <span className={`text-xs font-medium ${isExpanded ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'}`}>{currentLabel}</span>
                  <i className={`fa-solid fa-chevron-right text-[9px] ml-2 transition-transform ${isExpanded ? 'text-brand dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`} />
                </button>
              );
            })}
          </div>
          {compactExpandedFilter !== null && (
            <div className="absolute top-0 left-full ml-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-[10000] py-1.5 px-1.5 min-w-[152px]">
              {compactFilterOptions[compactExpandedFilter].options.map(([val, label]) => {
                const isSelected = compactFilterOptions[compactExpandedFilter].value === val;
                return (
                  <button key={val}
                    onClick={() => { compactFilterOptions[compactExpandedFilter].onChange(val); setCompactExpandedFilter(null); setCompactFilterOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors mt-0.5 first:mt-0 ${
                      isSelected ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 font-semibold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;

  /* ── Sticky compact header center (tabs when scrolled) ── */
  const compactHeaderCenter = isScrolled ? (
    <div className="flex items-center gap-0.5">
      {DETAIL_VIEW_TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => navigate(`/detailed-view/${tab.key}`, { state: { from: backRoute } })}
          className={`px-3 py-1 text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 border-b-2 -mb-px ${
            intelType === tab.key
              ? 'border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-100 font-semibold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <i className={`fa-solid ${tab.icon} text-[9px]`} />
          {tab.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <DashboardLayout
      title="Intelligence"
      subtitle={`${pageTitle} — Detailed View`}
      showTabs={false}
      filters={null}
      showSearch={true}
      searchCollapsed={isScrolled}
      headerCenterElement={compactHeaderCenter}
      customRightElement={compactFilterElement}
    >
      {/* Sticky compact KPI strip — slides in when KPI section scrolls out */}
      <div
        className="sticky top-[-24px] z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-[#e0e1e2] dark:bg-[#030712] border-b border-gray-100 dark:border-slate-800 overflow-hidden"
        style={{
          maxHeight: kpiIsSticky ? '76px' : '0',
          opacity: kpiIsSticky ? 1 : 0,
          boxShadow: kpiIsSticky ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
          transition: 'max-height 280ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease-out, box-shadow 280ms ease-out',
        }}
      >
        <div className="flex items-center gap-2 py-3 min-w-0">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {statsData.map((stat, idx) => (
              <div key={idx} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-xl">
                <div>
                  <p className="text-[9px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide leading-tight mb-0.5">{stat.title}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight">{stat.value}</p>
                    <span className={`text-[9px] font-semibold leading-tight ${stat.isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Toggle in sticky strip — ON state (Dashboard View active) */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium whitespace-nowrap">AI View</span>
            <button
              onClick={() => navigate(backRoute)}
              className="relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full bg-gray-900 dark:bg-slate-100 transition-colors hover:opacity-80"
            >
              <span className="inline-block h-3 w-3 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-4" />
            </button>
            <span className="text-[10px] font-semibold text-gray-900 dark:text-slate-100 whitespace-nowrap">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Tab nav (left) + Filter button (right) */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-0.5">
          {DETAIL_VIEW_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => navigate(`/detailed-view/${tab.key}`, { state: { from: backRoute } })}
              className={`px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-px ${
                intelType === tab.key
                  ? 'border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-100 font-semibold'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-[11px]`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter button + chips + panel */}
        <div className="relative flex items-center gap-2" ref={v2FilterRef}>
          <button
            onClick={handleOpenV2Filter}
            className={`flex items-center gap-1.5 px-3 h-7 rounded-xl border transition-all text-xs font-medium ${
              v2FilterOpen
                ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <i className="fa-solid fa-sliders text-[11px]" />
            Filters
          </button>

          {appliedDate !== null && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
              {v2DateLabel(appliedDate)}
              <button onClick={() => { setAppliedDate(null); setDateRange(null); localStorage.removeItem('dv_filter_date'); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
                <i className="fa-solid fa-xmark text-[9px]" />
              </button>
            </span>
          )}
          {appliedCats.length === 1 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
              {v2CatLabel(appliedCats[0])}
              <button onClick={() => { setAppliedCats([]); setCategory('all'); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
                <i className="fa-solid fa-xmark text-[9px]" />
              </button>
            </span>
          )}
          {appliedCats.length > 1 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
              {appliedCats.length} Categories
              <button onClick={() => { setAppliedCats([]); setCategory('all'); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
                <i className="fa-solid fa-xmark text-[9px]" />
              </button>
            </span>
          )}
          {appliedChans.length === 1 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
              {v2ChanLabel(appliedChans[0])}
              <button onClick={() => removeAppliedChan(appliedChans[0])} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
                <i className="fa-solid fa-xmark text-[9px]" />
              </button>
            </span>
          )}
          {appliedChans.length > 1 && (
            <div className="relative" ref={chanDropRef}>
              <button onClick={() => setChanDropOpen(o => !o)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm hover:border-gray-300 dark:hover:border-slate-600 transition">
                Channels <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-200 ${chanDropOpen ? 'rotate-180' : ''}`} />
              </button>
              {chanDropOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1.5 min-w-[160px]">
                  {appliedChans.map(ch => (
                    <div key={ch} className="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                      <span className="text-xs font-medium text-gray-700 dark:text-slate-300 flex-1 min-w-0">{v2ChanLabel(ch)}</span>
                      <button onClick={() => removeAppliedChan(ch)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
                        <i className="fa-solid fa-xmark text-[9px]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Full filter panel */}
          {v2FilterOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-[9999] w-[580px] overflow-hidden">
              <div className="flex" style={{ minHeight: '380px' }}>
                <div className="w-[155px] flex-shrink-0 border-r border-gray-100 dark:border-slate-800 p-3 flex flex-col gap-1">
                  {[{ key: 'date', label: 'Select Date' }, { key: 'channel', label: 'All Channels' }, { key: 'category', label: 'All Categories' }].map(sec => (
                    <button key={sec.key} onClick={() => setV2Section(sec.key)}
                      className={`flex items-center gap-2 w-full text-left px-2.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        v2Section === sec.key ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${v2Section === sec.key ? 'border-white dark:border-gray-900' : 'border-gray-300 dark:border-slate-600'}`}>
                        {v2Section === sec.key && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900" />}
                      </span>
                      {sec.label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {v2Section === 'date' && (
                    <div className="flex-1 flex flex-col p-4 gap-2">
                      <div className="flex items-center gap-2 flex-wrap mb-8">
                        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Quick Filters</span>
                        {[['last-7-days','Last 7 Days'],['last-30-days','Last 30 Days'],['last-90-days','Last 90 Days']].map(([val, lbl]) => (
                          <button key={val}
                            onClick={() => { const r = quickToRange(val); setPendingRangeStart(r.start); setPendingRangeEnd(r.end); setPendingDate(val); }}
                            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${pendingDate === val ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                            {lbl}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3 flex-1">
                        {renderCalMonth(calViewYear, calViewMonth, true, false)}
                        <div className="w-px bg-gray-100 dark:bg-slate-800 self-stretch flex-shrink-0" />
                        {renderCalMonth(calRightY, calRightM, false, true)}
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                        <div className="relative" ref={durRef}>
                        </div>
                        {pendingRangeStart && (
                          <span className="text-[11px] text-gray-600 dark:text-slate-400">
                            {formatCalDate(pendingRangeStart)}{pendingRangeEnd ? ` — ${formatCalDate(pendingRangeEnd)}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {v2Section === 'category' && (
                    <div className="flex-1 flex flex-col p-4 gap-5">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Recent Used</p>
                        <div className="flex flex-wrap gap-1.5">
                          {V2_CAT_RECENT.map(([val, lbl]) => {
                            const isSel = pendingCats.includes(val);
                            return <button key={val} onClick={() => togglePendingCat(val)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>{lbl}</button>;
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">All Categories</p>
                        <div className="flex flex-wrap gap-1.5">
                          {V2_CAT_GRID.map(([val, lbl]) => {
                            const isSel = val === 'all' ? pendingCats.length === 0 : pendingCats.includes(val);
                            return <button key={val} onClick={() => togglePendingCat(val)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>{lbl}</button>;
                          })}
                        </div>
                      </div>
                      {pendingCats.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
                          {pendingCats.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300">
                              {v2CatLabel(cat)} <button onClick={() => togglePendingCat(cat)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition"><i className="fa-solid fa-xmark text-[9px]" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {v2Section === 'channel' && (
                    <div className="flex-1 flex flex-col p-4 gap-5">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Recent Used</p>
                        <div className="flex flex-wrap gap-1.5">
                          {v2ChanRecent.map(([val, lbl]) => {
                            const isSel = pendingChans.includes(val);
                            return <button key={val} onClick={() => togglePendingChan(val)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>{lbl}</button>;
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">All Channels</p>
                        <div className="flex flex-wrap gap-1.5">
                          {v2ChanGrid.map(([val, lbl]) => {
                            const isSel = val === 'all-chans' ? pendingChans.length === 0 : pendingChans.includes(val);
                            return <button key={val} onClick={() => val === 'all-chans' ? setPendingChans([]) : togglePendingChan(val)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>{lbl}</button>;
                          })}
                        </div>
                      </div>
                      {pendingChans.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
                          {pendingChans.map(ch => (
                            <span key={ch} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300">
                              {v2ChanLabel(ch)} <button onClick={() => togglePendingChan(ch)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition"><i className="fa-solid fa-xmark text-[9px]" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 pb-4 pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
                <button onClick={() => setV2FilterOpen(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
                <button onClick={handleApplyV2Filter} className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition">Update</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle row — Customize KPIs (left) + Dashboard toggle (right) */}
      <div className="flex items-center justify-between mt-0 mb-3">
        <button
          onClick={() => setIsKpiSelectorOpen(true)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
        >
          <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
            <i className="fa-solid fa-plus text-[8px]" />
          </span>
          Customise KPIs
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">AI View</span>
          <button
            onClick={() => navigate(backRoute)}
            className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-gray-900 dark:bg-slate-100 transition-colors hover:opacity-80"
          >
            <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-4" />
          </button>
          <span className="text-xs font-semibold text-gray-900 dark:text-slate-100">Dashboard View</span>
        </div>
      </div>

      {/* KPI cards — 6 StatCards matching AI View style */}
      <div ref={kpiSectionRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {selectedKpiIndices.map(idx => {
          const stat = statsData[idx] || statsData[0];
          return (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
              subtext={stat.subtext}
              onClick={() => setKpiDetailModal(stat)}
            />
          );
        })}
      </div>

      {/* Main dashboard content */}
      <div className="space-y-4">

        {/* Row 1: For margin — BleedingMarginSKUs + ChannelMix. For others — primary trend chart + ChannelMix */}
        {intelType === 'margin' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">Bleeding Margin SKUs</h4>
                <span className="text-[11px] text-gray-400 dark:text-slate-500">Sorted by $ at risk descending</span>
              </div>
              <BleedingMarginTable onRowClick={() => {}} hideTitleBar />
            </div>
            <div><ChannelMixWidget /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
            <div className="lg:col-span-2 flex flex-col">
              {intelType === 'sales' && (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200">Revenue Trend</p>
                  </div>
                  <div className="p-3">
                    <BaseAreaChart
                      data={revenueTrendData}
                      yAxisFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                      tooltipFormatter={(v, n) => [`$${(v / 1000).toFixed(0)}k`, n]}
                      areas={[{ key: 'revenue', name: 'Revenue Trend', color: '#22c55e' }]}
                      height={308}
                    />
                  </div>
                </div>
              )}
              {intelType === 'inventory' && (
                <Suspense fallback={<div className="min-h-[200px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="flex-1 min-h-0 p-4"><InventoryTrendChart /></div>
                  </div>
                </Suspense>
              )}
              {intelType === 'ads' && (
                <Suspense fallback={<div className="min-h-[200px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                      <p className="text-xs font-bold text-gray-800 dark:text-slate-200">Ad Spend Trend</p>
                    </div>
                    <div className="flex-1 min-h-0 p-3"><AdSpendTrendChart /></div>
                  </div>
                </Suspense>
              )}
              {intelType === 'cash' && (
                <Suspense fallback={<div className="min-h-[200px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
                  <div className="h-full"><CashFlowTrendSection /></div>
                </Suspense>
              )}
            </div>
            <div>
              <ChannelMixWidget />
            </div>
          </div>
        )}

        {/* Row 2: Product heatmap */}
        <div className="bg-white dark:bg-[#030712] border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
          <ProductHeatmap intelType={intelType} />
        </div>

        {/* Row 3: Secondary charts — sales-specific or remaining inventory/ads/cash charts */}
        {intelType === 'sales' && <SalesCharts />}
        {intelType === 'inventory' && (
          <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <StockStatusChart />
              <DOCDistributionChart />
              <ForecastActualChart />
            </div>
          </Suspense>
        )}

        {/* Row 4: KPI detail tables / Margin 50-50 grid */}
        {intelType === 'margin' ? <MarginDashboardGrid /> : <TablesComponent />}
      </div>

      {/* Full-width Cash Flow table (below grid so all columns are visible) */}
      {intelType === 'cash' && (
        <div className="mt-6">
          <SectionHeading title="Cash Flow" />
          <CashFlowTable />
        </div>
      )}

      <KPIDetailModal
        isOpen={!!kpiDetailModal}
        onClose={() => setKpiDetailModal(null)}
        stat={kpiDetailModal}
        filterContext={{ dateRange: appliedDate, categories: appliedCats, channels: appliedChans }}
        tab={intelType}
      />

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={statsData}
        selectedIndices={selectedKpiIndices}
        onSave={(indices) => { setSelectedKpiIndices(indices); }}
      />

    </DashboardLayout>
  );
};

export default DetailedViewPage;
