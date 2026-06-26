import React, { useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DeepDiveTabBar from '../../components/common/DeepDiveTabBar';
import ClickToExpand from '../../components/common/ClickToExpand';
import DeepDiveModal from '../../components/common/DeepDiveModal';
import StatCard from '../../components/common/StatCard';
import ActionsPanel from '../../components/common/ActionsPanel';
import AnalyticsModal from '../../components/common/AnalyticsModal';
import ChartModal from '../../components/common/ChartModal';
import KPISelectorModal from '../../components/common/KPISelectorModal';
import KPIDetailModal from '../../components/common/KPIDetailModal';
import { useFilterStore } from '../../store/useFilterStore';
// import ActionAlert from '../../components/common/ActionAlert';

const AdSpendTrendChart         = lazy(() => import('./components/AdSpendTrendChart'));
const PlatformPerformanceSection = lazy(() => import('./components/PlatformPerformanceSection'));
const CampaignComparisonSection  = lazy(() => import('./components/CampaignComparisonSection'));
const PlatformDistributionChart  = lazy(() => import('./components/PlatformDistributionChart'));

import CampaignPerformanceTable from './components/CampaignPerformanceTable';
import { WatchlistCard } from '../../components/common/WatchlistSection';
import { salesWatchlistItems } from '../sales-intelligence/salesData';

import {
  adsRecommendations,
  adsAnomalies,
  adsIntel,
} from './adsData';
import IntelSection from '../../components/common/IntelSection';
import BaseAreaChart from '../../components/common/charts/BaseAreaChart';
import { SEMANTIC_COLORS } from '../../utils/chartColors';
import { revenueTrendData } from '../sales-intelligence/salesData';

const AdsIntelligencePage = () => {
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const [kpiDetailModal, setKpiDetailModal] = useState(null);
  const { dateRange } = useFilterStore();
  const [activeModal, setActiveModal] = useState({ isOpen: false, type: null, data: null });
  const [deepDiveTab, setDeepDiveTab] = useState('revenue');
  const [expandedChart, setExpandedChart] = useState(null);
  const [componentModal, setComponentModal] = useState(null);
  const [detailViewMode, setDetailViewMode] = useState('chart');
  const navigate = useNavigate();

  const kpiDetails = {
    "Total Ad Spend": {
      title: "Ad Spend Analysis",
      icon: "fa-money-bill-trend-up",
      color: "#3b82f6",
      summary: "Total ad spend at $24,600 this period (+$2,400). Amazon Ads takes 58% at $14,200, Google at 26% ($6,400), and Meta at 16% ($4,000).",
      cards: [
        { label: 'TOTAL SPEND', val: '$24.6k', delta: '+$2.4k', color: 'text-red-500' },
        { label: 'AMAZON', val: '$14.2k', delta: '+$1.4k', color: 'text-orange-500' },
        { label: 'GOOGLE', val: '$6.4k', delta: '+$600', color: 'text-blue-500' },
        { label: 'META', val: '$4.0k', delta: '+$400', color: 'text-indigo-500' }
      ],
      tableColumns: [
        { header: 'CHANNEL', key: 'ch', bold: true },
        { header: 'SPEND', key: 'spend', align: 'right', bold: true },
        { header: '% OF TOTAL', key: 'share', align: 'right' }
      ],
      tableData: [
        { ch: 'Amazon Ads', spend: '$14,200', share: '58%' },
        { ch: 'Google Ads', spend: '$6,400', share: '26%' },
        { ch: 'Meta Ads', spend: '$4,000', share: '16%' },
        { ch: 'TikTok Ads', spend: '$2,800', share: '11%' },
        { ch: 'Pinterest Ads', spend: '$1,200', share: '5%' },
        { ch: 'YouTube Ads', spend: '$980', share: '4%' },
        { ch: 'Walmart Connect', spend: '$640', share: '3%' },
        { ch: 'Snapchat Ads', spend: '$420', share: '2%' }
      ]
    },
    "ROAS": {
      title: "Return on Ad Spend",
      icon: "fa-chart-line",
      color: "#10b981",
      summary: "Blended ROAS at 5.2x, down 0.4x. Amazon leads at 6.4x while Meta underperforms at 2.1x. Pet Bed SP tops the portfolio at 11.2x.",
      cards: [
        { label: 'BLENDED ROAS', val: '5.2x', delta: '-0.4x', color: 'text-red-500' },
        { label: 'AMAZON ROAS', val: '6.4x', delta: '+0.2x', color: 'text-green-500' },
        { label: 'GOOGLE ROAS', val: '4.2x', delta: 'Stable', color: 'text-gray-500' },
        { label: 'META ROAS', val: '2.1x', delta: '-0.8x', color: 'text-red-500' }
      ],
      tableColumns: [
        { header: 'CAMPAIGN', key: 'name', bold: true },
        { header: 'SPEND', key: 'spend', align: 'right' },
        { header: 'ROAS', key: 'roas', align: 'right', bold: true }
      ],
      tableData: [
        { name: 'Pet Bed SP', spend: '$4,200', roas: '11.2x' },
        { name: 'Spring Launch', spend: '$3,600', roas: '7.4x' },
        { name: 'Top SKUs Boost', spend: '$5,200', roas: '5.8x' },
        { name: 'Retargeting', spend: '$1,800', roas: '4.2x' },
        { name: 'Brand Defense', spend: '$2,200', roas: '3.6x' },
        { name: 'Winter Sale', spend: '$8,400', roas: '2.8x' },
        { name: 'Category Push', spend: '$1,400', roas: '2.1x' },
        { name: 'Home Decor', spend: '$2,400', roas: '1.1x' }
      ]
    },
    "Margin-Adj. ROAS": {
      title: "Margin-Adjusted ROAS",
      icon: "fa-calculator",
      color: "#f59e0b",
      summary: "Margin-adjusted ROAS at 4.1x with 19.3% portfolio contribution margin. $6,200 in wasted spend identified. Recommended optimal bid at $1.42.",
      cards: [
        { label: 'BLENDED M-ROAS', val: '4.1x', delta: '-0.3x', color: 'text-red-500' },
        { label: 'PORTFOLIO CM%', val: '19.3%', delta: 'Stable', color: 'text-blue-500' },
        { label: 'WASTED SPEND', val: '$6,200', delta: 'Critical', color: 'text-red-600' },
        { label: 'OPTIMAL BID', val: '$1.42', delta: 'Recommended', color: 'text-green-500' }
      ],
      tableColumns: [
        { header: 'CAMPAIGN', key: 'name', bold: true },
        { header: 'M-ROAS', key: 'mroas', align: 'right', bold: true },
        { header: 'VERDICT', key: 'verdict', align: 'right' }
      ],
      tableData: [
        { name: 'Pet Bed SP', mroas: '8.6x', verdict: 'Scale' },
        { name: 'Spring Launch', mroas: '5.8x', verdict: 'Scale' },
        { name: 'Electronics SP', mroas: '4.2x', verdict: 'Scale' },
        { name: 'Retargeting', mroas: '3.1x', verdict: 'Monitor' },
        { name: 'Seasonal Sales', mroas: '1.4x', verdict: 'Reduce' },
        { name: 'Home Decor', mroas: '0.8x', verdict: 'Reduce' },
        { name: 'New Categories', mroas: '0.9x', verdict: 'Pause' },
        { name: 'Kitchen Tools', mroas: '0.6x', verdict: 'Pause' }
      ]
    }
  };

  const openKpiModal = (title) => {
    const detail = kpiDetails[title] || kpiDetails["Total Ad Spend"];
    setActiveModal({ isOpen: true, type: 'kpi', data: detail });
  };

  const openCampaignModal = (campaign) => {
    const detail = {
      name: campaign.name,
      icon: "fa-bullhorn",
      cards: [
        { label: 'SPEND', val: campaign.spend, delta: 'Recent', color: 'text-blue-500' },
        { label: 'ROAS', val: campaign.roas, delta: 'Current', color: 'text-green-500' },
        { label: 'M-ROAS', val: campaign.mroas, delta: 'Efficiency', color: 'text-orange-500' },
        { label: 'ACTION', val: campaign.action, delta: 'AI Rec.', color: 'text-indigo-500' }
      ],
      tableColumns: [
        { header: 'METRIC', key: 'm', bold: true },
        { header: 'VALUE', key: 'v', align: 'right', bold: true },
        { header: 'BENCHMARK', key: 'b', align: 'right' }
      ],
      tableData: [
        { m: 'CTR', v: '2.4%', b: '1.8%' },
        { m: 'CPC', v: '$1.24', b: '$1.50' },
        { m: 'CVR', v: '3.1%', b: '2.5%' }
      ]
    };
    setActiveModal({ isOpen: true, type: 'campaign', data: detail });
  };

  const stats = [
    { title: "Total Ad Spend", value: "$124K", change: "+12.4%", trend: "up", isPositive: true, subtext: "vs prior 30 days" },
    { title: "ROAS", value: "4.8x", change: "+18.2%", trend: "up", isPositive: true, subtext: "Blended average" },
    { title: "Average CPC", value: "$2.34", change: "-8.5%", trend: "down", isPositive: true, subtext: "Cost per click" },
    { title: "Conversion Rate", value: "3.2%", change: "+0.8%", trend: "up", isPositive: true, subtext: "Checkout success" },
    { title: "Margin-Adj. ROAS", value: "4.1x", change: "-0.3x", trend: "down", isPositive: false, subtext: "Profitability-aware" },
    { title: "TACOS", value: "14.2%", change: "+0.8%", trend: "up", isPositive: false, subtext: "Ad spend / Total Rev" },
    { title: "TMCOS", value: "19.2%", change: "+1.2%", trend: "up", isPositive: false, subtext: "Ad spend / Total CM" },
    { title: "Wasted Spend", value: "$4.8k", change: "+12%", trend: "up", isPositive: false, subtext: "Low ROAS spend" }
  ];


  const statChartConfigs = [
    { dataKey: 'revenue', data: revenueTrendData, color: SEMANTIC_COLORS.revenue, fmt: v => `$${(v / 1000).toFixed(0)}k` },
    { dataKey: 'val', data: [{ name: 'W1', val: 1800 }, { name: 'W2', val: 2100 }, { name: 'W3', val: 1650 }, { name: 'W4', val: 2400 }, { name: 'W5', val: 2180 }, { name: 'W6', val: 2350 }], color: '#6366f1', fmt: v => `${v}` },
    { dataKey: 'val', data: [{ name: 'W1', val: 340 }, { name: 'W2', val: 380 }, { name: 'W3', val: 290 }, { name: 'W4', val: 420 }, { name: 'W5', val: 390 }, { name: 'W6', val: 450 }], color: '#10b981', fmt: v => `${v}` },
    { dataKey: 'val', data: [{ name: 'W1', val: 285 }, { name: 'W2', val: 298 }, { name: 'W3', val: 310 }, { name: 'W4', val: 302 }, { name: 'W5', val: 318 }, { name: 'W6', val: 325 }], color: '#f59e0b', fmt: v => `$${v}` },
  ];
  const activeStat = stats[selectedStatIdx] || stats[0];
  const activeStatChart = {
    ...(statChartConfigs[selectedStatIdx] || statChartConfigs[0]),
    color: activeStat.isPositive ? '#22c55e' : '#ef4444',
  };
  const activeKpiDetail = kpiDetails[activeStat.title] || kpiDetails["Total Ad Spend"];

  return (
    <DashboardLayout
      title="Intelligence"
      subtitle="Real-time advertising analytics and campaign optimization insights"
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
            {selectedKpiIndices.map((kpiIdx) => {
              const stat = stats[kpiIdx];
              return (
                <StatCard key={kpiIdx} {...stat} onClick={() => { setSelectedStatIdx(kpiIdx); setDeepDiveTab('revenue'); setKpiDetailModal(stat); }} />
              );
            })}
          </div>

          <IntelSection title="Insights" items={adsIntel} />

          <div className="mt-6">
            <CampaignPerformanceTable onRowClick={openCampaignModal} />
          </div>
        </div>

        {/* Deep Dive Panel + Insights List (34%) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Detailed View button */}
            <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-slate-800/60">
              <button
                onClick={() => navigate('/detailed-view/ads')}
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
                      onClick={() => navigate('/product-view', { state: { product: { ...item, name: item.title }, from: '/ads' } })}
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
                    { icon: 'fa-chart-line', title: 'Ad Spend Trends', subtitle: '7-day spending by platform', component: <AdSpendTrendChart /> },
                    { icon: 'fa-chart-pie', title: 'Platform Distribution', subtitle: 'Spend share across channels', component: <PlatformDistributionChart /> },
                    { icon: 'fa-chart-bar', title: 'Platform Performance Analysis', subtitle: 'ROAS & metrics by platform', component: <PlatformPerformanceSection /> },
                    { icon: 'fa-chart-column', title: 'Campaign Performance Comparison', subtitle: 'Key metrics across campaigns', component: <CampaignComparisonSection /> },
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
            items={adsRecommendations}
            anomalies={adsAnomalies}
            onItemSelect={(id) => navigate(`/intel/insight/ads/${id}`)}
          />
        </div>
      </div>
      {/* </div> */}

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={stats}
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
        isOpen={!!kpiDetailModal}
        onClose={() => setKpiDetailModal(null)}
        stat={kpiDetailModal}
        filterContext={{ dateRange }}
        tab="ads"
      />
    </DashboardLayout>
  );
};

export default AdsIntelligencePage;
