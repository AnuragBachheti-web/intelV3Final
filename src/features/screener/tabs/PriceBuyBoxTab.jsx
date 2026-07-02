import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import StatCard from '../../../components/common/StatCard';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { priceTrendData7d, priceTrendAnalysis7d, buyBoxCategoryData, promoList } from '../screenerData';
import CompetitorsAnalysisSection from '../components/price-buybox/CompetitorsAnalysisSection';
import PriceMonitoringSection from '../components/price-buybox/PriceMonitoringSection';
import ScreenerAlertsPanel from '../components/ScreenerAlertsPanel';
import AnalyticsModal from '../../../components/common/AnalyticsModal';
import ClickToExpand from '../../../components/common/ClickToExpand';
import DeepDiveTabBar from '../../../components/common/DeepDiveTabBar';
import BaseAreaChart from '../../../components/common/charts/BaseAreaChart';
import useModalToggle from '../../../hooks/useModalToggle';

const kpis = [
  {
    title: 'Avg Price Delta', shortLabel: 'Price Delta', value: '-8.3%', change: 'Below market avg', isPositive: false,
    chartData: [{ name: 'Mon', val: -6.2 }, { name: 'Tue', val: -7.1 }, { name: 'Wed', val: -8.3 }, { name: 'Thu', val: -7.8 }, { name: 'Fri', val: -8.3 }], chartColor: '#3b82f6',
    deepDive: {
      title: 'Avg Price Delta', icon: 'fa-arrow-down',
      cards: [
        { label: 'PRICE DELTA', val: '-8.3%', delta: 'vs Market', color: 'text-blue-600' },
        { label: 'YOUR AVG', val: '$64.50', delta: 'Avg SKU', color: 'text-blue-500' },
        { label: 'MKT AVG', val: '$70.20', delta: 'Benchmark', color: 'text-blue-500' },
        { label: 'IMPACT', val: '-$5.70', delta: 'Per Unit', color: 'text-red-500' },
      ],
      tableColumns: [
        { header: 'SKU', key: 'sku', bold: true },
        { header: 'YOUR PRICE', key: 'yours', align: 'right', bold: true },
        { header: 'MKT PRICE', key: 'market', align: 'right' },
        { header: 'DELTA', key: 'delta', align: 'right' },
      ],
      tableData: [
        { sku: 'Wireless Earbuds', yours: '$42.99', market: '$47.99', delta: '-10.4%' },
        { sku: 'USB-C Hub', yours: '$29.99', market: '$32.99', delta: '-9.1%' },
        { sku: 'Smart Watch', yours: '$89.99', market: '$94.99', delta: '-5.3%' },
      ],
    },
  },
  {
    title: 'Buy Box Win Rate', shortLabel: 'Buy Box', value: '72%', change: '+5%', isPositive: true, subtext: 'vs last week',
    chartData: [{ name: 'Mon', val: 68 }, { name: 'Tue', val: 71 }, { name: 'Wed', val: 73 }, { name: 'Thu', val: 70 }, { name: 'Fri', val: 72 }], chartColor: '#6366f1',
    deepDive: {
      title: 'Buy Box Win Rate', icon: 'fa-trophy',
      cards: [
        { label: 'WIN RATE', val: '72%', delta: '+5%', color: 'text-indigo-600' },
        { label: 'PEAK', val: '94.2%', delta: 'Last Wk', color: 'text-indigo-500' },
        { label: 'LOW', val: '72.1%', delta: 'Alert', color: 'text-indigo-500' },
        { label: 'ALERTS', val: '2', delta: 'Active', color: 'text-red-500' },
      ],
      tableColumns: [
        { header: 'SKU', key: 'sku', bold: true },
        { header: 'WIN RATE', key: 'rate', align: 'right', bold: true },
        { header: 'STATUS', key: 'status', align: 'right' },
      ],
      tableData: [
        { sku: 'B09XYZ1234', rate: '92%', status: 'Stable' },
        { sku: 'B09ABC5678', rate: '42%', status: 'Lost' },
        { sku: 'B09DEF9012', rate: '88%', status: 'At Risk' },
      ],
    },
  },
  {
    title: 'Repricing Actions', shortLabel: 'Repricing', value: '24', subtext: 'Pending review', isPositive: false,
    chartData: [{ name: 'Mon', val: 18 }, { name: 'Tue', val: 22 }, { name: 'Wed', val: 19 }, { name: 'Thu', val: 25 }, { name: 'Fri', val: 24 }], chartColor: '#0ea5e9',
    deepDive: {
      title: 'Repricing Actions', icon: 'fa-sync',
      cards: [
        { label: 'PENDING', val: '24', delta: 'Review', color: 'text-sky-600' },
        { label: 'AUTO', val: '12', delta: 'Executed', color: 'text-sky-500' },
        { label: 'MANUAL', val: '8', delta: 'Required', color: 'text-sky-500' },
        { label: 'SAVED', val: '$1,240', delta: 'Revenue', color: 'text-emerald-600' },
      ],
      tableColumns: [
        { header: 'SKU', key: 'sku', bold: true },
        { header: 'ACTION', key: 'action', align: 'right', bold: true },
        { header: 'IMPACT', key: 'impact', align: 'right' },
      ],
      tableData: [
        { sku: 'Wireless Earbuds', action: 'Raise to $44.99', impact: '+$2.00' },
        { sku: 'USB-C Hub', action: 'Match at $29.99', impact: 'No change' },
        { sku: 'Smart Watch', action: 'Drop to $88.99', impact: '-$1.00' },
      ],
    },
  },
  {
    title: 'Price Alerts', shortLabel: 'Alerts', value: '12', change: 'Requires attention', isPositive: false,
    chartData: [{ name: 'Mon', val: 8 }, { name: 'Tue', val: 10 }, { name: 'Wed', val: 9 }, { name: 'Thu', val: 11 }, { name: 'Fri', val: 12 }], chartColor: '#3b82f6',
    deepDive: {
      title: 'Price Alerts', icon: 'fa-bell',
      cards: [
        { label: 'TOTAL', val: '12', delta: 'Active', color: 'text-blue-600' },
        { label: 'CRITICAL', val: '3', delta: 'Urgent', color: 'text-red-600' },
        { label: 'WARNING', val: '5', delta: 'Review', color: 'text-amber-600' },
        { label: 'INFO', val: '4', delta: 'Monitor', color: 'text-blue-500' },
      ],
      tableColumns: [
        { header: 'SKU', key: 'sku', bold: true },
        { header: 'ALERT TYPE', key: 'type', align: 'right', bold: true },
        { header: 'SEVERITY', key: 'severity', align: 'right' },
      ],
      tableData: [
        { sku: 'Wireless Earbuds', type: 'Price Drop', severity: 'Critical' },
        { sku: 'USB-C Hub', type: 'MAP Violation', severity: 'Warning' },
        { sku: 'Smart Watch', type: 'BB Opportunity', severity: 'Info' },
      ],
    },
  },
];

const PriceBuyBoxTab = () => {
  const [selectedKpiIdx, setSelectedKpiIdx] = useState(0);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const [priceDiveTab, setPriceDiveTab] = useState('kpi');
  const [priceExpandModal, setPriceExpandModal] = useState(null);
  const [activePromo, setActivePromo] = useState(1);
  const [activeModal, setActiveModal] = useState({ isOpen: false, data: null });

  const selectedKpi = kpis[Math.min(selectedKpiIdx, kpis.length - 1)];

  const handleDetailedView = () => {
    if (priceDiveTab === 'kpi') {
      setActiveModal({ isOpen: true, data: selectedKpi?.deepDive });
    } else if (priceDiveTab === 'charts') {
      setPriceExpandModal('price-chart-trend7d');
    } else {
      setPriceExpandModal(priceDiveTab);
    }
  };

  return (
    <>
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-14">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <StatCard
                key={idx}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                subtext={kpi.subtext}
                isPositive={kpi.isPositive !== false}
                onClick={() => { setSelectedKpiIdx(idx); kpiDetailModal.open(kpi); }}
              />
            ))}
          </div>

          {/* Insights */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-5">
            <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Insights</h4>
            <div className="space-y-2.5">
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Price Drop Detected</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">TechMaster dropped Wireless Earbuds to $42.99 (-12%)</p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Buy Box Lost</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">USB-C Hub: competitor undercutting at $27.99 — match or hold position</p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">MAP Compliance</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">3 ASINs need immediate price adjustment to stay compliant</p>
              </div>
            </div>
          </div>

          {/* Mobile alerts (xl:hidden for price tab) */}
          <div className="xl:hidden mb-6">
            <ScreenerAlertsPanel />
          </div>

          {/* Tab content */}
          <div className="space-y-6">
            <CompetitorsAnalysisSection />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Deep dive panel */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-slate-800/60">
              <button
                onClick={handleDetailedView}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400 hover:text-brand dark:hover:text-gray-200 transition-colors group"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                Detailed View
              </button>
            </div>

            {/* Price & Buy Box deep dive tabs */}
            <DeepDiveTabBar>
              {[
                { key: 'kpi', label: selectedKpi?.shortLabel || 'Price Delta' },
                { key: 'pricing-landscape', label: 'Landscape' },
                { key: 'price-distribution', label: 'Distribution' },
                { key: 'promotions', label: 'Promotions' },
                { key: 'price-monitoring', label: 'Monitoring' },
                { key: 'charts', label: 'Charts' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPriceDiveTab(key)}
                  className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${
                    priceDiveTab === key
                      ? 'border-brand text-brand dark:text-gray-400 dark:border-gray-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </DeepDiveTabBar>
            <div className="flex flex-col" style={{ height: 290 }}>
              <div className="flex-1 overflow-y-auto">
                {priceDiveTab === 'kpi' && (
                  <div
                    className="h-full flex flex-col p-4 cursor-pointer group"
                    onClick={() => setActiveModal({ isOpen: true, data: selectedKpi?.deepDive })}
                  >
                    <div className="flex items-center justify-between px-1 mb-2">
                      <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{selectedKpi?.title}</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{selectedKpi?.value}</span>
                    </div>
                    <div className="h-[180px] w-full pointer-events-none overflow-hidden">
                      <BaseAreaChart
                        data={selectedKpi?.chartData || []}
                        height={180}
                        areas={[{ key: 'val', name: selectedKpi?.title, color: selectedKpi?.chartColor || '#3b82f6' }]}
                        yAxisFormatter={(v) => `${v}`}
                        tooltipFormatter={(v, n) => [`${v}`, n]}
                      />
                    </div>
                    <ClickToExpand />
                  </div>
                )}
                {priceDiveTab === 'pricing-landscape' && (
                  <div className="p-3 space-y-1.5">
                    {[
                      { label: 'Market Avg Price', value: '$67.84', sub: '2,456 products', colorClass: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Price Volatility', value: 'Medium', sub: '±12% weekly', colorClass: 'text-purple-600 dark:text-purple-400' },
                      { label: 'Your Position', value: '2nd', sub: 'of 47 competitors', colorClass: 'text-green-600 dark:text-green-400' },
                      { label: 'Avg Discount', value: '18%', sub: 'Across category', colorClass: 'text-orange-600 dark:text-orange-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500">{item.sub}</p>
                        </div>
                        <span className={`text-xs font-bold ${item.colorClass}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {priceDiveTab === 'price-distribution' && (
                  <div className="p-3 space-y-2">
                    {[
                      { label: 'Budget ($0-$30)', pct: 42, color: '#2563eb' },
                      { label: 'Mid-Range ($30-$80)', pct: 35, color: '#7c3aed' },
                      { label: 'Premium ($80-$150)', pct: 18, color: '#ea580c' },
                      { label: 'Luxury ($150+)', pct: 5, color: '#16a34a' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">{item.label}</span>
                          <span className="text-xs font-bold ml-2" style={{ color: item.color }}>{item.pct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {priceDiveTab === 'promotions' && (
                  <div className="p-3 space-y-2">
                    {promoList.map((promo) => (
                      <div key={promo.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                        <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
                          <i className={`fa-solid ${promo.icon} text-blue-500 dark:text-blue-400 text-xs`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{promo.title}</p>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{promo.type} • {promo.status}</p>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 shrink-0">{promo.avgDiscount}</span>
                      </div>
                    ))}
                  </div>
                )}
                {priceDiveTab === 'price-monitoring' && (
                  <div className="p-3 space-y-2">
                    {[
                      { name: 'Wireless Headphones', price: '$62.99', status: 'Buy Box', dotColor: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
                      { name: 'USB-C Fast Charger', price: '$24.99', status: 'Lost BB', dotColor: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' },
                      { name: 'Mech Gaming Keyboard', price: '$89.99', status: 'Buy Box', dotColor: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
                      { name: '4K Action Camera', price: '$149.99', status: 'Price Alert', dotColor: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotColor}`}></span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{item.name}</p>
                          <p className={`text-[10px] font-medium ${item.textColor}`}>{item.status}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-slate-300 shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                {priceDiveTab === 'charts' && (
                  <div className="p-3 space-y-2">
                    {[
                      { key: 'price-chart-trend7d', icon: 'fa-chart-line', title: '7 Day Price Trend', sub: 'Your price vs market & competitors' },
                      { key: 'price-chart-trend', icon: 'fa-chart-area', title: 'Price Trend Analysis', sub: '7-day brand comparison' },
                      { key: 'price-chart-buybox', icon: 'fa-trophy', title: 'Buy Box Win Rate', sub: 'Win rate by category' },
                    ].map((chart) => (
                      <button
                        key={chart.key}
                        onClick={() => setPriceExpandModal(chart.key)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
                          <i className={`fa-solid ${chart.icon} text-blue-500 dark:text-blue-400 text-xs`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 leading-tight">{chart.title}</p>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">{chart.sub}</p>
                        </div>
                        <i className="fa-solid fa-expand text-[10px] text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 shrink-0"></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {priceDiveTab !== 'kpi' && priceDiveTab !== 'charts' && (
                <button
                  onClick={() => setPriceExpandModal(priceDiveTab)}
                  className="flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-gray-400 hover:text-gray-700 dark:text-slate-500 dark:hover:text-gray-300 transition-colors border-t border-gray-100 dark:border-slate-800 shrink-0"
                >
                  <i className="fa-solid fa-expand text-[9px]"></i>
                  Click to expand
                </button>
              )}
            </div>
          </div>

          {/* Alerts panel */}
          <ScreenerAlertsPanel compact className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-4" />
        </div>
      </div>

      {/* Modals */}
      <AnalyticsModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ isOpen: false, data: null })}
        data={activeModal.data}
      />

      {/* Price & Buy Box Deep-Dive Expand Modal */}
      {priceExpandModal && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setPriceExpandModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i className={`fa-solid ${
                    priceExpandModal === 'pricing-landscape' ? 'fa-tags' :
                    priceExpandModal === 'price-distribution' ? 'fa-chart-pie' :
                    priceExpandModal === 'promotions' ? 'fa-gift' :
                    priceExpandModal === 'price-monitoring' ? 'fa-eye' :
                    priceExpandModal === 'price-chart-trend7d' ? 'fa-chart-line' :
                    priceExpandModal === 'price-chart-trend' ? 'fa-chart-area' :
                    'fa-trophy'
                  } text-blue-600 dark:text-blue-400 text-sm`}></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">
                  {priceExpandModal === 'pricing-landscape' ? 'Pricing Landscape Summary' :
                   priceExpandModal === 'price-distribution' ? 'Price Distribution Analysis' :
                   priceExpandModal === 'promotions' ? 'Active Promotions & Deals' :
                   priceExpandModal === 'price-monitoring' ? 'Price Monitoring' :
                   priceExpandModal === 'price-chart-trend7d' ? '7-Day Price Trends' :
                   priceExpandModal === 'price-chart-trend' ? 'Price Trend Analysis' :
                   'Buy Box Win Rate by Category'}
                </h2>
              </div>
              <button
                onClick={() => setPriceExpandModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Pricing Landscape Summary */}
              {priceExpandModal === 'pricing-landscape' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Overview of market pricing dynamics and competitive positioning</p>
                    <button className="px-3 py-1.5 bg-brand text-white hover:bg-brand-hover dark:bg-gray-600 rounded-xl text-sm font-medium">
                      <i className="fa-solid fa-download mr-1.5"></i>Export Report
                    </button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: 'fa-dollar-sign', label: 'Market Avg Price', value: '$67.84', sub: 'Across 2,456 products', color: 'blue' },
                      { icon: 'fa-chart-line', label: 'Price Volatility', value: 'Medium', sub: '±12% weekly variance', color: 'purple' },
                      { icon: 'fa-trophy', label: 'Your Position', value: '2nd', sub: 'Out of 47 competitors', color: 'green' },
                      { icon: 'fa-percent', label: 'Discount Rate', value: '18%', sub: 'Avg across category', color: 'orange' },
                    ].map((item, i) => (
                      <div key={i} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-900/20 dark:to-${item.color}-800/20 border border-${item.color}-200 dark:border-${item.color}-800 rounded-xl p-4`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 bg-${item.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <i className={`fa-solid ${item.icon} text-white`}></i>
                          </div>
                          <div>
                            <p className={`text-xs text-${item.color}-600 dark:text-${item.color}-400 font-medium`}>{item.label}</p>
                            <p className={`text-2xl font-bold text-${item.color}-900 dark:text-${item.color}-100`}>{item.value}</p>
                          </div>
                        </div>
                        <p className={`text-xs text-${item.color}-700 dark:text-${item.color}-300`}>{item.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-lightbulb text-yellow-500"></i>Key Insights
                    </h4>
                    <div className="space-y-2">
                      {[
                        { color: 'blue', text: 'Your average pricing is 8.3% below market, creating strong competitive advantage' },
                        { color: 'purple', text: 'Price wars detected in Electronics — 5 competitors dropped prices by 15%+ this week' },
                        { color: 'green', text: 'Premium segment ($100+) showing 22% growth opportunity with limited competition' },
                      ].map((ins, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <i className={`fa-solid fa-circle text-${ins.color}-600 text-xs mt-1 flex-shrink-0`}></i>
                          <p className="text-sm text-gray-700 dark:text-slate-300">{ins.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Price Distribution Analysis */}
              {priceExpandModal === 'price-distribution' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">How your products are distributed across price ranges</p>
                    <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100">
                      <option>All Categories</option><option>Electronics</option><option>Home & Kitchen</option><option>Sports</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[
                            { name: 'Budget ($0-$30)', value: 42 },
                            { name: 'Mid-Range ($30-$80)', value: 35 },
                            { name: 'Premium ($80-$150)', value: 18 },
                            { name: 'Luxury ($150+)', value: 5 },
                          ]} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value">
                            {['#2563eb', '#7c3aed', '#ea580c', '#16a34a'].map((color, i) => (
                              <Cell key={i} fill={color} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(val) => `${val}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Budget ($0-$30)', pct: 42, bgColor: 'bg-blue-600', textColor: 'text-blue-600 dark:text-blue-400', products: 156, avg: '$24.50' },
                        { label: 'Mid-Range ($30-$80)', pct: 35, bgColor: 'bg-purple-600', textColor: 'text-purple-600 dark:text-purple-400', products: 128, avg: '$54.80' },
                        { label: 'Premium ($80-$150)', pct: 18, bgColor: 'bg-orange-600', textColor: 'text-orange-600 dark:text-orange-400', products: 67, avg: '$112.30' },
                        { label: 'Luxury ($150+)', pct: 5, bgColor: 'bg-green-600', textColor: 'text-green-600 dark:text-green-400', products: 19, avg: '$224.90' },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.label}</p>
                            <p className={`text-lg font-bold ${item.textColor}`}>{item.pct}%</p>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                            <div className={`${item.bgColor} h-2 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-slate-400">{item.products} products • Avg: {item.avg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Active Promotions & Deals */}
              {priceExpandModal === 'promotions' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Current promotional campaigns and their performance</p>
                    <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl text-sm font-medium">
                      <i className="fa-solid fa-plus mr-2"></i>Create Promotion
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
                    <div className="lg:col-span-4 border-r border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
                      <div className="divide-y divide-gray-200 dark:divide-slate-800">
                        {promoList.map(promo => (
                          <div
                            key={promo.id}
                            onClick={() => setActivePromo(promo.id)}
                            className={`p-4 cursor-pointer transition-all ${activePromo === promo.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-blue-600' : 'hover:bg-white/60 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className={`fa-solid ${promo.icon} text-blue-600`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-gray-900 dark:text-slate-100 truncate">{promo.title}</p>
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{promo.type}</p>
                                  <span className="text-xs font-medium text-green-600 flex-shrink-0">{promo.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-8 p-6 bg-white dark:bg-slate-900">
                      {promoList.filter(p => p.id === activePromo).map(promo => (
                        <div key={promo.id}>
                          <div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center dark:bg-gray-600 flex-shrink-0">
                                <i className={`fa-solid ${promo.icon} text-white text-lg`}></i>
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-slate-100">{promo.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">{promo.type} • {promo.status}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm text-center">
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Avg Discount</p>
                                <p className="text-2xl font-bold text-blue-600">{promo.avgDiscount}</p>
                              </div>
                              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm text-center">
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{promo.sales}</p>
                              </div>
                              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm text-center">
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Conversion</p>
                                <p className="text-2xl font-bold text-green-600">{promo.conversion}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button className="flex-1 px-4 py-2.5 bg-brand hover:bg-brand-hover text-white dark:bg-gray-600 rounded-xl text-sm font-medium transition">
                              <i className="fa-solid fa-pen mr-2"></i>Edit Promotion
                            </button>
                            <button className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-medium transition">
                              <i className="fa-solid fa-chart-bar mr-2"></i>Analytics
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Price Monitoring */}
              {priceExpandModal === 'price-monitoring' && <PriceMonitoringSection />}

              {/* 7-Day Price Trends */}
              {priceExpandModal === 'price-chart-trend7d' && (
                <>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Track price movements and competitor activity over the past week</p>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceTrendData7d} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                        <RechartsTooltip formatter={(val) => `$${val}`} />
                        <Legend />
                        <Line type="monotone" dataKey="yourPrice" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#fff', strokeWidth: 2, stroke: '#2563eb' }} name="Your Price" />
                        <Line type="monotone" dataKey="marketAvg" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Market Avg" />
                        <Line type="monotone" dataKey="competitor" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" name="Competitor" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Avg Price Change', val: '-2.4%', sub: 'Last 7 days', color: 'blue' },
                      { label: 'Price Updates', val: '47', sub: 'Across portfolio', color: 'purple' },
                      { label: 'Lowest Price Day', val: 'Wed', sub: '$62.30 avg', color: 'green' },
                      { label: 'Highest Price Day', val: 'Mon', sub: '$68.50 avg', color: 'orange' },
                    ].map((s, i) => (
                      <div key={i} className={`bg-${s.color}-50 dark:bg-${s.color}-900/20 border border-${s.color}-200 dark:border-${s.color}-800 rounded-xl p-4`}>
                        <p className={`text-xs text-${s.color}-600 dark:text-${s.color}-400 font-medium mb-1`}>{s.label}</p>
                        <p className={`text-2xl font-bold text-${s.color}-900 dark:text-${s.color}-100`}>{s.val}</p>
                        <p className={`text-xs text-${s.color}-700 dark:text-${s.color}-300 mt-1`}>{s.sub}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Price Trend Analysis */}
              {priceExpandModal === 'price-chart-trend' && (
                <>
                  <p className="text-sm text-gray-600 dark:text-slate-400">7-day price comparison between your brand and top competitors</p>
                  <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceTrendAnalysis7d} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip formatter={(v) => `$${v}`} />
                        <Legend />
                        <Line type="monotone" dataKey="yourBrand" name="Your Brand" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#2563eb' }} />
                        <Line type="monotone" dataKey="techMaster" name="TechMaster Pro" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}

              {/* Buy Box Win Rate by Category */}
              {priceExpandModal === 'price-chart-buybox' && (
                <>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Buy Box win rate performance across product categories</p>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={buyBoxCategoryData} margin={{ top: 10, right: 18, left: 10, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
                        <XAxis dataKey="category" axisLine={false} tickLine={false} angle={-22} textAnchor="end" height={60} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <RechartsTooltip formatter={(v) => `${v}%`} />
                        <Bar dataKey="winRate" name="Win Rate">
                          {buyBoxCategoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {buyBoxCategoryData.map((item, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{item.category}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-slate-100" style={{ color: item.color }}>{item.winRate}%</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      , document.body)}
      <KPIDetailModal
        isOpen={kpiDetailModal.isOpen}
        onClose={kpiDetailModal.close}
        stat={kpiDetailModal.data}
        filterContext={{ dateRange }}
        tab="sales"
      />
    </>
  );
};

export default PriceBuyBoxTab;
