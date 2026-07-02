import React, { useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/common/StatCard';
import DeepDiveTabBar from '../../../components/common/DeepDiveTabBar';
import ClickToExpand from '../../../components/common/ClickToExpand';
import DeepDiveModal from '../../../components/common/DeepDiveModal';
import ActionsPanel from '../../../components/common/ActionsPanel';

import {
  cashStats, cashRecommendations, cashAnomalies, cashIntel,
} from './cashData';
import IntelSection from '../../../components/common/IntelSection';
import BaseAreaChart from '../../../components/common/charts/BaseAreaChart';
import { SEMANTIC_COLORS } from '../../../utils/chartColors';
import { revenueTrendData } from '../sales/salesData';

// import ActionAlert from '../../../components/common/ActionAlert';
import SettlementsTable from './components/SettlementsTable';
const SettlementDispositionChart = lazy(() => import('./components/SettlementDispositionChart'));
const CashFlowTrendSection       = lazy(() => import('./components/CashFlowTrendSection'));
const CashDistributionSection    = lazy(() => import('./components/CashDistributionSection'));
const PaymentMetricsSection      = lazy(() => import('./components/PaymentMetricsSection'));
const FeesBreakdownContent       = lazy(() => import('./components/CashInsightsGrid').then(m => ({ default: m.FeesBreakdownContent })));
const WorkingCapitalContent      = lazy(() => import('./components/CashInsightsGrid').then(m => ({ default: m.WorkingCapitalContent })));
import { WatchlistCard } from '../../../components/common/WatchlistSection';
import { salesWatchlistItems } from '../sales/salesData';

import AnalyticsModal from '../../../components/common/AnalyticsModal';
import ChartModal from '../../../components/common/ChartModal';
import KPISelectorModal from '../../../components/common/KPISelectorModal';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import useProductNavigation from '../../../hooks/useProductNavigation';
import useModalToggle from '../../../hooks/useModalToggle';

const CashIntelligencePage = () => {
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);
  const [activeModal, setActiveModal] = useState({ isOpen: false, type: null, data: null });
  const [deepDiveTab, setDeepDiveTab] = useState('revenue');
  const [expandedChart, setExpandedChart] = useState(null);
  const [componentModal, setComponentModal] = useState(null);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const [detailViewMode, setDetailViewMode] = useState('chart');
  const navigate = useNavigate();
  const { goToProduct } = useProductNavigation();

  const kpiDetails = {
    "Total Cash Balance": {
      title: "Cash Balance Analysis",
      icon: "fa-building-columns",
      summary: "Total liquidity at $286K across 4 accounts. Operating at $42.8K (-12%), savings at $186K (+4.5%), and payroll fully funded at $57.2K.",
      cards: [
        { label: 'OPERATING', val: '$42.8K', delta: '-12%', color: 'text-cb-900' },
        { label: 'SAVINGS', val: '$186K', delta: '+4.5%', color: 'text-cb-600' },
        { label: 'PAYROLL', val: '$57.2K', delta: 'Funded', color: 'text-cb-700' },
        { label: 'TAX RESERVE', val: '$12.4K', delta: 'Stable', color: 'text-cb-200' }
      ],
      tableColumns: [
        { header: 'ACCOUNT', key: 'name', bold: true },
        { header: 'BALANCE', key: 'bal', align: 'right', bold: true },
        { header: 'TREND', key: 'trend', align: 'right' }
      ],
      tableData: [
        { name: 'Chase Operating', bal: '$42,800', trend: '▼ 12%' },
        { name: 'High-Yield Savings', bal: '$186,000', trend: '▲ 4.5%' },
        { name: 'Payroll Reserve', bal: '$57,200', trend: 'Stable' },
        { name: 'Tax Reserve Fund', bal: '$12,400', trend: 'Stable' },
        { name: 'Mercury Checking', bal: '$8,200', trend: '▲ 2%' },
        { name: 'Stripe Reserve', bal: '$6,800', trend: '▼ 4%' },
        { name: 'PayPal Balance', bal: '$4,400', trend: '▲ 8%' },
        { name: 'Emergency Fund', bal: '$24,000', trend: 'Stable' }
      ]
    },
    "Cash Inflow": {
      title: "Cash Inflow Analysis",
      icon: "fa-arrow-right-to-bracket",
      summary: "Total inflow of $142K (+12%). Amazon US settlements lead at 59.3% ($84,200) with Shopify growing fastest at +15% ($32,400).",
      cards: [
        { label: 'TOTAL INFLOW', val: '$142K', delta: '+12%', color: 'text-cb-600' },
        { label: 'AMAZON', val: '$98.2K', delta: '+8%', color: 'text-cb-700' },
        { label: 'SHOPIFY', val: '$32.4K', delta: '+15%', color: 'text-cb-400' },
        { label: 'OTHER', val: '$11.4K', delta: '+2%', color: 'text-cb-200' }
      ],
      tableColumns: [
        { header: 'SOURCE', key: 'src', bold: true },
        { header: 'AMOUNT', key: 'amt', align: 'right', bold: true },
        { header: 'SHARE', key: 'share', align: 'right' }
      ],
      tableData: [
        { src: 'Amazon US Settlement', amt: '$84,200', share: '59.3%' },
        { src: 'Shopify Payments', amt: '$32,400', share: '22.8%' },
        { src: 'Amazon EU Settlement', amt: '$14,000', share: '9.8%' },
        { src: 'Walmart Settlement', amt: '$8,400', share: '5.9%' },
        { src: 'TikTok Shop Payout', amt: '$4,200', share: '3.0%' },
        { src: 'B2B Collections', amt: '$3,600', share: '2.5%' },
        { src: 'Wholesale Orders', amt: '$2,800', share: '2.0%' },
        { src: 'Other Receivables', amt: '$11,400', share: '8.1%' }
      ]
    },
    "Cash Outflow": {
      title: "Cash Outflow Analysis",
      icon: "fa-arrow-right-from-bracket",
      summary: "Total outflows at $118K (-5%). Ad spend remains largest at $63,520 (+12%), while inventory PO payments decreased 8% to $32,100.",
      cards: [
        { label: 'TOTAL OUTFLOW', val: '$118K', delta: '-5%', color: 'text-cb-400' },
        { label: 'AD SPEND', val: '$63.5K', delta: '+12%', color: 'text-cb-500' },
        { label: 'COGS/PO', val: '$32.1K', delta: '-8%', color: 'text-cb-700' },
        { label: 'FEES', val: '$22.4K', delta: '+2%', color: 'text-cb-200' }
      ],
      tableColumns: [
        { header: 'CATEGORY', key: 'cat', bold: true },
        { header: 'AMOUNT', key: 'amt', align: 'right', bold: true },
        { header: 'TREND', key: 'trend', align: 'right' }
      ],
      tableData: [
        { cat: 'Advertising (All)', amt: '$63,520', trend: '▲ 12%' },
        { cat: 'Inventory (PO)', amt: '$32,100', trend: '▼ 8%' },
        { cat: 'Payroll & Labor', amt: '$24,800', trend: 'Stable' },
        { cat: 'Marketplace Fees', amt: '$14,800', trend: '▲ 4%' },
        { cat: 'Tax Payments', amt: '$8,400', trend: 'Stable' },
        { cat: 'Shipping & Logistics', amt: '$7,580', trend: '▲ 2%' },
        { cat: 'Software & Tools', amt: '$4,200', trend: '▲ 8%' },
        { cat: 'Returns Processing', amt: '$3,600', trend: '▲ 4%' }
      ]
    },
    "Net Cash Flow": {
      title: "Net Cash Flow Analysis",
      icon: "fa-chart-line",
      summary: "Net cash position is +$24K, up 38% vs prior period. Strong sales payouts of $98K offset by $72K vendor payments and $42K payroll.",
      cards: [
        { label: 'INFLOW', val: '$142K', delta: '+12%', color: 'text-cb-600' },
        { label: 'OUTFLOW', val: '$118K', delta: '-5%', color: 'text-cb-400' },
        { label: 'NET FLOW', val: '$24K', delta: '+38%', color: 'text-cb-700' },
        { label: 'PROJECTION', val: '+$18K', delta: 'Next 30d', color: 'text-cb-200' }
      ],
      tableColumns: [
        { header: 'CATEGORY', key: 'cat', bold: true },
        { header: 'AMOUNT', key: 'amt', align: 'right', bold: true },
        { header: 'IMPACT', key: 'impact', align: 'right' }
      ],
      tableData: [
        { cat: 'Sales Payouts', amt: '$98,000', impact: 'Positive' },
        { cat: 'B2B Collections', amt: '+$6,800', impact: 'Positive' },
        { cat: 'Interest Income', amt: '+$1,200', impact: 'Positive' },
        { cat: 'Vendor Payments', amt: '-$72,000', impact: 'Negative' },
        { cat: 'Ad Spend Costs', amt: '-$24,600', impact: 'Negative' },
        { cat: 'Marketplace Fees', amt: '-$14,800', impact: 'Negative' },
        { cat: 'Returns & Refunds', amt: '-$8,400', impact: 'Negative' },
        { cat: 'Payroll', amt: '-$42,000', impact: 'Neutral' }
      ]
    },
    "Payouts Pending": {
      title: "Pending Payout Analysis",
      icon: "fa-clock-rotate-left",
      summary: "Total $24,800 in pending marketplace payouts. Amazon US releases $14,200 in 3 days, Shopify $6,800 in 1 day, Walmart $3,800 in 5 days.",
      cards: [
        { label: 'AMAZON', val: '$14.2K', delta: '3 days', color: 'text-cb-700' },
        { label: 'SHOPIFY', val: '$6.8K', delta: '1 day', color: 'text-cb-600' },
        { label: 'WALMART', val: '$3.8K', delta: '5 days', color: 'text-cb-400' },
        { label: 'TOTAL', val: '$24.8K', delta: 'Pending', color: 'text-cb-700' }
      ],
      tableColumns: [
        { header: 'MARKETPLACE', key: 'mp', bold: true },
        { header: 'EXPECTED', key: 'exp', align: 'right', bold: true },
        { header: 'DATE', key: 'date', align: 'right' }
      ],
      tableData: [
        { mp: 'Amazon US', exp: '$14,200', date: 'May 14' },
        { mp: 'Shopify Payments', exp: '$6,800', date: 'May 12' },
        { mp: 'Amazon CA', exp: '$2,400', date: 'May 18' },
        { mp: 'TikTok Shop', exp: '$1,800', date: 'May 13' },
        { mp: 'Walmart', exp: '$3,800', date: 'May 16' },
        { mp: 'eBay Payments', exp: '$1,200', date: 'May 15' },
        { mp: 'Target.com', exp: '$840', date: 'May 20' },
        { mp: 'Walmart CA', exp: '$620', date: 'May 19' }
      ]
    }
  };

  const openKpiModal = (title) => {
    const detail = kpiDetails[title] || kpiDetails["Total Cash Balance"];
    setActiveModal({ isOpen: true, type: 'kpi', data: detail });
  };

  const statChartConfigs = [
    { dataKey: 'revenue', data: revenueTrendData, color: SEMANTIC_COLORS.revenue, fmt: v => `$${(v/1000).toFixed(0)}k` },
    { dataKey: 'val', data: [{ name: 'W1', val: 1800 }, { name: 'W2', val: 2100 }, { name: 'W3', val: 1650 }, { name: 'W4', val: 2400 }, { name: 'W5', val: 2180 }, { name: 'W6', val: 2350 }], color: '#6366f1', fmt: v => `${v}` },
    { dataKey: 'val', data: [{ name: 'W1', val: 340 }, { name: 'W2', val: 380 }, { name: 'W3', val: 290 }, { name: 'W4', val: 420 }, { name: 'W5', val: 390 }, { name: 'W6', val: 450 }], color: '#10b981', fmt: v => `${v}` },
    { dataKey: 'val', data: [{ name: 'W1', val: 285 }, { name: 'W2', val: 298 }, { name: 'W3', val: 310 }, { name: 'W4', val: 302 }, { name: 'W5', val: 318 }, { name: 'W6', val: 325 }], color: '#f59e0b', fmt: v => `$${v}` },
  ];
  const activeStat = cashStats[selectedStatIdx] || cashStats[0];
  const activeStatChart = {
    ...(statChartConfigs[selectedStatIdx] || statChartConfigs[0]),
    color: activeStat.isPositive ? '#22c55e' : '#ef4444',
  };
  const activeKpiDetail = kpiDetails[activeStat.title] || kpiDetails["Total Cash Balance"];

  return (
    <DashboardLayout
      title="Intelligence"
      subtitle="Real-time cash flow analytics and liquidity management"
      showSearch={true}
    >
      {/* Top Row: Stats Cards (66%) + Deep Dive Panel (34%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">

        {/* Stats Cards (66%) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-start mb-3">
            <button
              onClick={() => setIsKpiSelectorOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
            >
              <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                <i className="fa-solid fa-plus text-[8px]"></i>
              </span>
              Customise KPIs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-2">
            {selectedKpiIndices.map((kpiIdx) => (
              <StatCard
                key={kpiIdx}
                {...cashStats[kpiIdx]}
                onClick={() => { setSelectedStatIdx(kpiIdx); setDeepDiveTab('revenue'); kpiDetailModal.open(cashStats[kpiIdx]); }}
              />
            ))}
          </div>

          <IntelSection title="Insights" items={cashIntel} />

          <div className="mt-6">
            <SettlementsTable />
          </div>

        </div>

        {/* Deep Dive Panel + Insights List (34%) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Detailed View button */}
            <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-slate-800/60">
              <button
                onClick={() => navigate('/detailed-view/cash', { state: { selectedKpiIndices } })}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400 hover:text-brand dark:hover:text-gray-200 transition-colors group"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                Detailed View
              </button>
            </div>
            <DeepDiveTabBar>
              {[
                { label: 'Details', key: 'revenue' },
                { label: 'Watchlist', key: 'sku' },
                { label: 'Channel Mix', key: 'channel-mix' },
                { label: 'Charts', key: 'charts' },
              ].map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => setDeepDiveTab(key)}
                  className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${deepDiveTab === key
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
                    onClick={() => goToProduct({ ...item, name: item.title }, '/cash')}
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
                onClick={() => setActiveModal({ isOpen: true, type: 'kpi', data: { title: "Channel Mix", icon: "fa-users-viewfinder", chartType: 'donut', donutSegments: [{ label: 'Online Store', color: '#0A52E7', value: '45%', amount: '$56,025', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' }, { label: 'Retail', color: '#1D63FF', value: '30%', amount: '$37,350', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' }, { label: 'Marketplace', color: '#2E4CB9', value: '25%', amount: '$31,125', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' }], cards: [{ label: 'ONLINE STORE', val: '45%', delta: '+2.1%', color: 'text-blue-600' }, { label: 'RETAIL', val: '30%', delta: '-0.5%', color: 'text-indigo-600' }, { label: 'MARKETPLACE', val: '25%', delta: '+1.2%', color: 'text-blue-500' }, { label: 'TOTAL REVENUE', val: '$124,500', delta: '+12.4%', color: 'text-emerald-600' }], tableColumns: [{ header: 'CHANNEL', key: 'channel', bold: true }, { header: 'REVENUE', key: 'revenue', align: 'right', bold: true }, { header: 'SHARE', key: 'share', align: 'right' }, { header: 'ORDERS', key: 'orders', align: 'right' }, { header: 'GROWTH', key: 'growth', align: 'right' }], tableData: [{ channel: 'Online Store', revenue: '$56,025', share: '45%', orders: '185', growth: '+2.1%' }, { channel: 'Retail', revenue: '$37,350', share: '30%', orders: '124', growth: '-0.5%' }, { channel: 'Marketplace', revenue: '$31,125', share: '25%', orders: '103', growth: '+1.2%' }] } })}
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
                <ClickToExpand />
              </div>
            )}

            {deepDiveTab === 'charts' && (
              <div className="flex-1 flex flex-col p-3 gap-1.5 overflow-y-auto">
                {[
                  { icon: 'fa-chart-pie', title: 'Settlement Disposition', subtitle: 'Breakdown of settlement categories', component: <SettlementDispositionChart /> },
                  { icon: 'fa-chart-bar', title: 'Cash Distribution', subtitle: 'Distribution of cash across accounts', component: <CashDistributionSection /> },
                  { icon: 'fa-chart-line', title: 'Cash Flow Trends', subtitle: '7-day inflow vs outflow trends', component: <CashFlowTrendSection /> },
                  { icon: 'fa-circle-dollar-to-slot', title: 'Payment & Collection Metrics', subtitle: 'DSO, timing & payment performance', component: <PaymentMetricsSection /> },
                  { icon: 'fa-receipt', title: 'Fees Breakdown (30d)', subtitle: 'Fee distribution across categories', component: <FeesBreakdownContent /> },
                  { icon: 'fa-arrow-trend-up', title: 'Working Capital Trend', subtitle: 'Monthly working capital changes', component: <WorkingCapitalContent /> },
                ].map((chart, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all group flex-shrink-0"
                    onClick={() => setComponentModal({ title: chart.title, subtitle: chart.subtitle, component: chart.component })}
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

          {/* Insights List — below deep dive */}
          <ActionsPanel
            items={cashRecommendations}
            anomalies={cashAnomalies}
            onItemSelect={(id) => navigate(`/intel/insight/cash/${id}`)}
          />
        </div>
      </div>

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={cashStats}
        selectedIndices={selectedKpiIndices}
        onSave={setSelectedKpiIndices}
      />
      {/* Global Analytics Modal */}
      <AnalyticsModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ ...activeModal, isOpen: false })}
        data={activeModal.data}
      />
      <ChartModal chart={expandedChart} onClose={() => setExpandedChart(null)} />

      <DeepDiveModal modal={componentModal} onClose={() => setComponentModal(null)} />
      <KPIDetailModal
        isOpen={kpiDetailModal.isOpen}
        onClose={kpiDetailModal.close}
        stat={kpiDetailModal.data}
        filterContext={{ dateRange }}
        tab="cash"
      />
    </DashboardLayout>
  );
};

export default CashIntelligencePage;
