import React, { useState, useEffect, useRef, useMemo } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import KPISelectorModal from '../../components/common/KPISelectorModal';
import KPIDetailModal from '../../components/common/KPIDetailModal';
import { salesWatchlistItems } from '../sales-intelligence/salesData';
import { useFilterStore } from '../../store/useFilterStore';
import apiClient from '../../api/client';
import {
  INTEL_TABS,
  INSIGHT_TABS,
  STATS_BY_TAB,
  INSIGHTS_DATA,
  ITEM_SKU_DATA,
  STEPS_BY_INSIGHT_TAB,
  MARGIN_INSIGHTS_DATA,
  MARGIN_STEPS_BY_INSIGHT_TAB,
  INVENTORY_INSIGHTS_DATA,
  INVENTORY_STEPS_BY_INSIGHT_TAB,
  ADS_INSIGHTS_DATA,
  ADS_STEPS_BY_INSIGHT_TAB,
  CASH_INSIGHTS_DATA,
  CASH_STEPS_BY_INSIGHT_TAB,
  STEP_SLOT,
  STEPS_VISIBLE,
} from './intelData';

const INSIGHTS_BY_INTEL_TAB = {
  sales: INSIGHTS_DATA,
  margin: MARGIN_INSIGHTS_DATA,
  inventory: INVENTORY_INSIGHTS_DATA,
  ads: ADS_INSIGHTS_DATA,
  cash: CASH_INSIGHTS_DATA,
};
const STEPS_BY_INTEL_TAB = {
  sales: STEPS_BY_INSIGHT_TAB,
  margin: MARGIN_STEPS_BY_INSIGHT_TAB,
  inventory: INVENTORY_STEPS_BY_INSIGHT_TAB,
  ads: ADS_STEPS_BY_INSIGHT_TAB,
  cash: CASH_STEPS_BY_INSIGHT_TAB,
};

/* ─── Presentation mappings ──────────────────────────────────────────────── */

const INSIGHT_TYPE_META = {
  CRITICAL: { icon: 'fa-solid fa-triangle-exclamation', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  OPPORTUNITY: { icon: 'fa-solid fa-arrow-trend-up', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  INSIGHT: { icon: 'fa-solid fa-lightbulb', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  MARKET: { icon: 'fa-solid fa-chart-line', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  REVIEW: { icon: 'fa-solid fa-eye', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  ALERT: { icon: 'fa-solid fa-bell', bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
};

const INSIGHT_BADGE_COLORS = {
  CRITICAL: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  OPPORTUNITY: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  INSIGHT: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  MARKET: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  REVIEW: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  ALERT: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
};

const STEP_TYPE_META = {
  CRITICAL: { icon: 'fa-solid fa-triangle-exclamation', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  HIGH: { icon: 'fa-solid fa-bolt', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  OPPORTUNITY: { icon: 'fa-solid fa-arrow-trend-up', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  INSIGHT: { icon: 'fa-solid fa-lightbulb', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  MARKET: { icon: 'fa-solid fa-chart-line', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  PAYMENT: { icon: 'fa-solid fa-file-invoice-dollar', bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
};

const INVENTORY_STATUS_STYLE = {
  critical: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500' },
  low: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-500' },
  healthy: { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-green-500' },
  excess: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-500' },
};

/* ─── ItemTabContent ─────────────────────────────────────────────────────── */

const ITEM_SUB_TABS = [
  { key: 'revenue', label: 'Top SKUs by Revenue' },
  { key: 'movers', label: 'Top Movers' },
  { key: 'decliners', label: 'Bottom Movers' },
];

const ItemTabContent = ({ selectedSkuId, setSelectedSkuId, noSidePanel = false, intelTab = 'sales', viewMode = 'list', itemSubTab, setItemSubTab, sourceRoute }) => {
  const navigate = useNavigate();
  const { summary, revenueLeaders, topMovers, bottomMovers, deepDive } = ITEM_SKU_DATA;

  const handleSkuClick = (sku) => {
    if (noSidePanel) {
      const insight = makeItemInsight(sku);
      navigate(`/intel/insight/${intelTab}/0`, {
        state: {
          insights: [insight],
          currentIndex: 0,
          intelTab,
          insightTab: 'Item',
          itemSubTab,
          itemName: sku.name,
          sourceRoute: sourceRoute || '/intel',
        },
      });
    } else {
      setSelectedSkuId(sku.sku);
    }
  };

  const summaryCards = [
    { label: 'Active SKUs', value: summary.activeSkus.value, sub: `${summary.activeSkus.change} this week`, subColor: 'text-green-600 dark:text-green-400' },
    { label: 'Top Revenue SKU', value: summary.topRevenueSku.value, sub: summary.topRevenueSku.name, subColor: 'text-gray-500 dark:text-slate-400' },
    { label: 'Fastest Growing', value: summary.fastestGrowing.value, sub: summary.fastestGrowing.name, subColor: 'text-green-600 dark:text-green-400' },
    { label: 'Largest Declining', value: summary.largestDeclining.value, sub: summary.largestDeclining.name, subColor: 'text-red-500 dark:text-red-400' },
  ];

  const rowClass = (sku) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${selectedSkuId === sku
      ? 'border-brand/30 dark:border-gray-500 bg-blue-50/40 dark:bg-slate-800/60'
      : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900/50'
    }`;

  const nameClass = (sku) =>
    `text-sm font-semibold truncate ${selectedSkuId === sku ? 'text-brand dark:text-gray-200' : 'text-gray-800 dark:text-slate-200'}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary KPI cards */}
      <div className="flex gap-2.5">
        {summaryCards.map((card, i) => (
          <div key={i} className="flex-1 min-w-0 p-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/30">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">{card.label}</p>
            <p className="text-base font-bold text-gray-900 dark:text-slate-100">{card.value}</p>
            <p className={`text-[10px] mt-0.5 truncate ${card.subColor}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
        <div className="flex gap-0.5">
          {ITEM_SUB_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setItemSubTab(tab.key)}
              className={`px-3 py-2 text-[12px] font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                itemSubTab === tab.key
                  ? 'text-gray-900 dark:text-slate-100 border-gray-900 dark:border-slate-300 font-semibold'
                  : 'text-gray-400 dark:text-slate-500 border-transparent hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate('/products')}
          className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 px-3 py-1 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 transition-all mb-1"
        >
          <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
          View All Products
        </button>
      </div>

      {/* Top SKUs by Revenue */}
      {itemSubTab === 'revenue' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1'}>
          {revenueLeaders.map(sku => (
            <div key={sku.id} onClick={() => handleSkuClick(sku)} className={rowClass(sku.sku)}>
              <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">{sku.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={nameClass(sku.sku)}>{sku.name}</p>
                <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed mt-1">
                  Generated {sku.revenue} across {sku.units.toLocaleString()} units with {sku.growth} week-over-week growth. Buy Box retention at {sku.bb}.
                </p>
                {deepDive[sku.sku]?.keyInsight && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed mt-0.5">{deepDive[sku.sku].keyInsight}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/product-view', { state: { product: { name: sku.name, sku: sku.sku }, from: sourceRoute || '/intel', fromState: { restoreInsightTab: 'Item', restoreItemSubTab: itemSubTab } } }); }}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-200 transition-colors text-[10px] font-semibold"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" />
                Product
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Top Movers */}
      {itemSubTab === 'movers' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1'}>
          {topMovers.map(sku => (
            <div key={sku.id} onClick={() => handleSkuClick(sku)} className={rowClass(sku.sku)}>
              <div className="w-5 h-5 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-green-600 dark:text-green-400">{sku.rank || sku.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={nameClass(sku.sku)}>{sku.name}</p>
                <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed mt-1">
                  Growing {sku.growth} week-over-week, driven by {sku.driver}. Revenue this period: {sku.revenue}.
                </p>
                {deepDive[sku.sku]?.keyInsight && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed mt-0.5">{deepDive[sku.sku].keyInsight}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/product-view', { state: { product: { name: sku.name, sku: sku.sku }, from: sourceRoute || '/intel', fromState: { restoreInsightTab: 'Item', restoreItemSubTab: itemSubTab } } }); }}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-200 transition-colors text-[10px] font-semibold"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" />
                Product
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Movers */}
      {itemSubTab === 'decliners' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1'}>
          {bottomMovers.map(sku => (
            <div key={sku.id} onClick={() => handleSkuClick(sku)} className={rowClass(sku.sku)}>
              <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-red-500 dark:text-red-400">{sku.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={nameClass(sku.sku)}>{sku.name}</p>
                <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed mt-1">
                  Declined {sku.decline} this period, attributed to {sku.driver}. Revenue: {sku.revenue}.
                </p>
                {deepDive[sku.sku]?.keyInsight && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed mt-0.5">{deepDive[sku.sku].keyInsight}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/product-view', { state: { product: { name: sku.name, sku: sku.sku }, from: sourceRoute || '/intel', fromState: { restoreInsightTab: 'Item', restoreItemSubTab: itemSubTab } } }); }}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-200 transition-colors text-[10px] font-semibold"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" />
                Product
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── ItemDeepDivePanel ──────────────────────────────────────────────────── */

/* ─── Tiny SVG sparkline ─────────────────────────────────────────────────── */
const MiniSparkline = ({ data, color = '#94a3b8', label }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 96, H = 36;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`)
    .join(' ');
  const area = `M ${pts.split(' ')[0]} L ${pts} L ${W},${H} L 0,${H} Z`;
  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {label && (
        <text
          x={W / 2}
          y={9}
          textAnchor="middle"
          fontSize={8.5}
          fontWeight="700"
          fill={color}
          opacity="0.9"
          style={{ userSelect: 'none' }}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

const SPARK_COLORS = {
  revenue: '#6366f1', growth: '#10b981', buybox: '#f59e0b', inventory: '#8b5cf6',
};
const SPARK_FALLBACK = {
  revenue:   [18.2, 20.1, 19.4, 22.6, 21.8, 23.9, 24.8],
  growth:    [6.2, 7.8, 8.4, 9.1, 10.6, 11.8, 12.4],
  buybox:    [86, 90, 88, 91, 89, 93, 92],
  inventory: [38, 35, 33, 31, 29, 28, 28],
};

const makeItemInsight = (skuData) => {
  const dd = ITEM_SKU_DATA.deepDive[skuData.sku] || null;
  return {
    heading: skuData.name,
    body: dd?.keyInsight || 'This SKU shows notable performance signals. Review the recommended actions below to optimise results.',
    type: 'INSIGHT',
    time: '2 min ago',
    steps: (dd?.actions || []).map((action, i) => ({
      id: i + 1,
      title: action.title,
      sub: action.sub,
      type: action.type,
    })),
  };
};

const parseMetricValue = (key, val) => {
  if (!val || val === 'chart →') return null;
  if (key === 'revenue') {
    const n = parseFloat(val.replace(/[$,]/g, ''));
    return isNaN(n) ? null : n > 1000 ? +(n / 1000).toFixed(2) : n;
  }
  if (key === 'growth') {
    const n = parseFloat(val.replace(/[^-\d.]/g, ''));
    return isNaN(n) ? null : Math.abs(n);
  }
  const m = val.match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

const makeSpark = (endVal) => {
  const r = [0.72, 0.78, 0.76, 0.83, 0.87, 0.93, 1.0];
  return r.map(x => +(endVal * x).toFixed(2));
};

const ItemDeepDivePanel = ({ selectedSkuId, onNavigate: _onNavigate, viewMode = 'grid', intelTab = 'sales', itemSubTab = 'revenue' }) => {
  const dd = selectedSkuId ? (ITEM_SKU_DATA.deepDive[selectedSkuId] || null) : null;
  const _def = ITEM_SKU_DATA.deepDive.default;
  const navigateDive = useNavigate();
  const [selectedActionIdx, setSelectedActionIdx] = useState(null);
  const [activeMetric, setActiveMetric] = useState('revenue');

  useEffect(() => {
    if (selectedSkuId && ITEM_SKU_DATA.deepDive[selectedSkuId]) {
      setSelectedActionIdx(0);
    } else {
      setSelectedActionIdx(null);
    }
    setActiveMetric('revenue');
  }, [selectedSkuId]);

  if (!dd) {
    return (
      <div className="w-[480px] flex-shrink-0 p-4 flex flex-col bg-white dark:bg-slate-900/20">
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <i className="fa-solid fa-hand-pointer text-gray-300 dark:text-slate-600 text-sm" />
          </div>
          <p className="text-xs text-gray-300 dark:text-slate-600 leading-relaxed text-center">Select a SKU to view its deep-dive</p>
        </div>
      </div>
    );
  }

  const inv = INVENTORY_STATUS_STYLE[dd.inventoryStatus] || INVENTORY_STATUS_STYLE.healthy;
  const growthPos = !dd.growth.startsWith('-');
  const selectedAction = selectedActionIdx !== null ? dd.actions[selectedActionIdx] : null;

  const METRICS = [
    { key: 'revenue',   label: 'Revenue',   value: dd.revenue,   valueClass: 'text-gray-900 dark:text-slate-100' },
    { key: 'growth',    label: 'Growth',    value: dd.growth,    valueClass: growthPos ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' },
    { key: 'buybox',    label: 'Buy Box',   value: dd.bb,        valueClass: dd.bb?.toLowerCase().includes('win') || dd.bb?.replace('%','') >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' },
    { key: 'inventory', label: 'Inventory', value: dd.inventory, valueClass: inv.text },
  ];

  const rawVals = { revenue: dd.revenue, growth: dd.growth, buybox: dd.bb, inventory: dd.inventory };
  const sparkVal = parseMetricValue(activeMetric, rawVals[activeMetric]);
  const spark = {
    data: sparkVal !== null && sparkVal > 0 ? makeSpark(sparkVal) : SPARK_FALLBACK[activeMetric],
    color: SPARK_COLORS[activeMetric],
  };

  return (
    <div className="w-[480px] flex-shrink-0 p-4 flex flex-col bg-white dark:bg-slate-900/20 gap-3 overflow-y-auto max-h-[720px] custom-scrollbar">

      <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug">{dd.name}</p>

      {/* Metrics — clickable with sparkline chart */}
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-0.5 text-[12px] text-black dark:text-slate-200 min-w-0 flex-1">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`flex items-center gap-1 text-left rounded-md px-1.5 py-0.5 transition-colors w-full ${
                activeMetric === m.key
                  ? 'bg-gray-100 dark:bg-slate-800'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className={`flex-shrink-0 transition-all ${activeMetric === m.key ? 'text-gray-500 dark:text-slate-400' : 'text-gray-400 dark:text-slate-600'}`}>•</span>
              <span className="flex-shrink-0">{m.label}:</span>
              {activeMetric === m.key ? (
                <span className="text-[10px] text-gray-400 dark:text-slate-500 italic font-normal">chart →</span>
              ) : (
                <span className={`font-medium truncate ${m.valueClass}`}>{m.value}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 100, height: 72 }}>
          <MiniSparkline data={spark.data} color={spark.color} label={METRICS.find(m => m.key === activeMetric)?.value} />
        </div>
      </div>

      {/* Recommended Actions — list or grid based on viewMode */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Recommended Actions</p>
        <div className={viewMode === 'list' ? 'flex flex-col gap-1.5' : 'grid grid-cols-3 gap-2'}>
          {dd.actions.map((action, i) => {
            const priority = getStepPriority(action.type);
            const isSelected = i === selectedActionIdx;
            return (
              <button
                key={i}
                onClick={() => setSelectedActionIdx(isSelected ? null : i)}
                className={`text-left p-3 rounded-xl border transition-all flex gap-2 ${
                  viewMode === 'list' ? 'flex-row items-start' : 'flex-col'
                } ${isSelected
                  ? 'border-brand/30 dark:border-gray-500 bg-blue-50/40 dark:bg-slate-800/60'
                  : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900/50'
                  }`}
              >
                <span className={`flex-shrink-0 self-start px-1.5 py-0.5 text-[9px] font-semibold rounded-md whitespace-nowrap ${priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  priority === 'Medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}>{priority}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-gray-800 dark:text-slate-200 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: viewMode === 'list' ? 1 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {action.title}
                  </p>
                  {action.sub && viewMode === 'list' && (
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-snug truncate mt-0.5">
                      {action.sub}
                    </p>
                  )}
                  {action.sub && viewMode !== 'list' && (
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {action.sub}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action detail — shown when an action is selected */}
        {selectedAction && (() => {
          const meta = STEP_TYPE_META[selectedAction.type] || STEP_TYPE_META.INSIGHT;
          const typeLabel = selectedAction.type === 'HIGH' ? 'HIGH IMPACT' : selectedAction.type;
          return (
            <div className="mt-3 border-t border-gray-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md ${meta.bg} ${meta.color}`}>
                  {typeLabel}
                </span>
                <span className="text-[9px] text-gray-400">·</span>
                <span className="text-[9px] text-gray-400 dark:text-slate-500">5 min ago</span>
              </div>
              <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 leading-snug">
                {selectedAction.title}
              </h5>
              <div className="mb-3">
                <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <i className="fa-solid fa-lightbulb text-[8px]" /> Analysis Insights
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 leading-relaxed">
                  {dd.keyInsight}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <i className="fa-solid fa-chart-line text-[8px]" /> Key Metrics
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Revenue', value: dd.revenue, color: 'text-green-600 dark:text-green-400' },
                    { label: 'Growth', value: dd.growth, color: growthPos ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400' },
                  ].map((m, i) => (
                    <div key={i} className="p-2 rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/30">
                      <p className="text-[9px] text-gray-400 dark:text-slate-500 mb-0.5">{m.label}</p>
                      <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Open Full Analysis */}
      <button
        onClick={() => {
          const insight = {
            heading: dd.name,
            body: dd.keyInsight || 'This SKU shows notable performance signals. Review the recommended actions below to optimise results.',
            type: 'INSIGHT',
            time: '2 min ago',
            steps: dd.actions.map((action, i) => ({ id: i + 1, title: action.title, sub: action.sub, type: action.type })),
          };
          navigateDive(`/intel/insight/${intelTab}/0`, {
            state: {
              insights: [insight],
              currentIndex: 0,
              intelTab,
              insightTab: 'Item',
              itemSubTab,
              sourceRoute: '/intel',
              initialStepId: selectedActionIdx !== null ? selectedActionIdx + 1 : 1,
            },
          });
        }}
        className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        Open Full Analysis <i className="fa-solid fa-arrow-right text-[10px]" />
      </button>
    </div>
  );
};

/* ─── ActionDetailPanel ─────────────────────────────────────────────────── */

const ActionDetailPanel = ({ step, onView }) => {
  if (!step) return null;
  const meta = STEP_TYPE_META[step.type] || STEP_TYPE_META.INSIGHT;
  const typeLabel = step.type === 'HIGH' ? 'HIGH IMPACT' : step.type;

  return (
    <div className="mt-3 border-t border-gray-100 dark:border-slate-800 pt-3">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md ${meta.bg} ${meta.color}`}>
            {typeLabel}
          </span>
          <span className="text-[9px] text-gray-400">·</span>
          <span className="text-[9px] text-gray-400 dark:text-slate-500">#REC-{8000 + step.id * 47}</span>
          <span className="text-[9px] text-gray-400">·</span>
          <span className="text-[9px] text-gray-400 dark:text-slate-500">5 min ago</span>
        </div>
        <button
          onClick={onView}
          className="flex-shrink-0 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-[10px] font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" /> View
        </button>
      </div>
      <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 leading-snug">
        {step.title}
      </h5>
      <div className="mb-3">
        <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <i className="fa-solid fa-lightbulb text-[8px]" /> Analysis Insights
        </p>
        <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 leading-relaxed">
          {step.sub}
        </p>
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <i className="fa-solid fa-chart-line text-[8px]" /> Key Metrics
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Est. Revenue', value: '+$8,200', positive: true },
            { label: 'Confidence', value: '87%', neutral: true },
          ].map((m, i) => (
            <div key={i} className="p-2 rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/30">
              <p className="text-[9px] text-gray-400 dark:text-slate-500 mb-0.5">{m.label}</p>
              <p className={`text-sm font-bold ${m.positive ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPriorityDotClass = (type) => {
  if (type === 'CRITICAL') return 'bg-red-500';
  if (['HIGH', 'OPPORTUNITY', 'ALERT', 'REVIEW'].includes(type)) return 'bg-amber-400';
  if (type === 'MARKET') return 'bg-purple-500';
  return 'bg-blue-500';
};

const getStepPriority = (type) => {
  if (type === 'CRITICAL' || type === 'HIGH') return 'High';
  if (type === 'OPPORTUNITY' || type === 'INSIGHT') return 'Medium';
  return 'Low';
};

/* ─── InsightsPanel ──────────────────────────────────────────────────────── */

const CATEGORY_KEY_MAP = {
  'electronics':   (h) => h.toLowerCase().includes('electronics'),
  'home-garden':   (h) => h.toLowerCase().includes('home & garden') || h.toLowerCase().includes('home and garden'),
  'apparel':       (h) => h.toLowerCase().includes('apparel'),
  'pet-suppliers': (h) => h.toLowerCase().includes('pet'),
};

const InsightsPanel = ({
  activeInsightTab,
  setActiveInsightTab,
  itemViewMode,
  sourceRoute,
  setItemViewMode,
  stepOffset,
  setStepOffset,
  isEmpty = false,
  isCarouselMode = false,
  onProductClick: _onProductClick,
  onStepClick: _onStepClick,
  showDetailedView: _showDetailedView = false,
  onDetailedView: _onDetailedView,
  intelTab = 'sales',
  selectedCategory = 'all',
  noSidePanel = false,
  initialItemSubTab = null,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeInsightIdx, setActiveInsightIdx] = useState(null);
  const [_selectedSkuId, setSelectedSkuId] = useState(null);
  const [selectedInsightIdx, setSelectedInsightIdx] = useState(null);
  const [_expandedCardIdx, setExpandedCardIdx] = useState(null);
  const [_selectedStepId, setSelectedStepId] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [_itemSubTab, setItemSubTab] = useState('revenue');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  // Memoized: re-derived only when the active intelligence tab changes
  const tabInsights   = useMemo(() => INSIGHTS_BY_INTEL_TAB[intelTab] || INSIGHTS_BY_INTEL_TAB.sales, [intelTab]);
  const insightBlocks = useMemo(() => tabInsights['item'] || [], [tabInsights]);
  const effectiveInsightIdx = isCarouselMode ? selectedInsightIdx : activeInsightIdx;
  const activeStepBlock = useMemo(
    () => effectiveInsightIdx !== null ? (insightBlocks[effectiveInsightIdx] || null) : null,
    [effectiveInsightIdx, insightBlocks]
  );
  const tabStepsData = useMemo(() => STEPS_BY_INTEL_TAB[intelTab] || STEPS_BY_INTEL_TAB.sales, [intelTab]);
  const steps = useMemo(
    () => (activeStepBlock?.steps?.length ? activeStepBlock.steps : null)
      || tabStepsData[activeInsightTab]
      || tabStepsData['Overall'],
    [activeStepBlock, tabStepsData, activeInsightTab]
  );
  const _canStepUp   = useMemo(() => stepOffset > 0, [stepOffset]);
  const _canStepDown = useMemo(() => stepOffset + STEPS_VISIBLE < steps.length, [stepOffset, steps]);

  const currentCarouselBlock = isCarouselMode ? (insightBlocks[carouselIndex] || null) : null;
  const _currentCarouselMeta = currentCarouselBlock
    ? (INSIGHT_TYPE_META[currentCarouselBlock.type] || INSIGHT_TYPE_META.INSIGHT)
    : null;

  useEffect(() => {
    setCarouselIndex(0);
    setActiveInsightIdx(!isCarouselMode && !noSidePanel ? 0 : null);
    setSelectedSkuId(null);
    setSelectedInsightIdx(null);
    setExpandedCardIdx(null);
    setSelectedStepId(null);
    setExpandedIdx(null);
  }, [activeInsightTab]);

  // Auto-activate the insight matching the selected category (without hiding others)
  useEffect(() => {
    if (activeInsightTab !== 'Category' || selectedCategory === 'all') return;
    const matcher = CATEGORY_KEY_MAP[selectedCategory];
    if (!matcher) return;
    const blocks = tabInsights[activeInsightTab.toLowerCase()] || [];
    const idx = blocks.findIndex(b => matcher(b.heading || ''));
    if (idx !== -1) {
      setActiveInsightIdx(idx);
      setCarouselIndex(idx);
      setStepOffset(0);
      setTimeout(() => {
        cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [selectedCategory, activeInsightTab]);

  // Auto-switch to Category tab and scroll when top-level category filter changes
  useEffect(() => {
    if (selectedCategory === 'all') return;
    setActiveInsightTab('Category');
    setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
  }, [selectedCategory]);

  // Restore item sub-tab (revenue/movers/decliners) when navigating back
  useEffect(() => {
    if (initialItemSubTab) setItemSubTab(initialItemSubTab);
  }, [initialItemSubTab]);

  // Auto-select first action card when active insight changes (normal mode only)
  useEffect(() => {
    if (isCarouselMode || activeInsightTab === 'Item') return;
    const block = insightBlocks[activeInsightIdx];
    if (!block) return;
    const effectiveSteps = (block?.steps?.length ? block.steps : null)
      || tabStepsData[activeInsightTab]
      || tabStepsData['Overall'];
    const toShow = activeInsightIdx === 0
      ? ['High', 'Medium', 'Low'].map(p => effectiveSteps.find(s => getStepPriority(s.type) === p)).filter(Boolean)
      : effectiveSteps.slice(0, 7);
    setSelectedStepId(toShow[0]?.id ?? null);
  }, [activeInsightIdx, activeInsightTab, intelTab]);

  return (
    <div ref={containerRef} className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#030712]">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
              {isCarouselMode ? 'Insights V2' : 'Insights'}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Latest intelligence and market updates from the past 24 hours
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setItemViewMode('list')}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors
                ${itemViewMode === 'list'
                  ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
                  : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                }`}
            >
              <i className="fa-solid fa-list text-[10px]" />
            </button>
            <button
              onClick={() => setItemViewMode('grid')}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors
                ${itemViewMode === 'grid'
                  ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
                  : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                }`}
            >
              <i className="fa-solid fa-grip text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {!isEmpty && (
          <div className={itemViewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
            {insightBlocks.map((block, idx) => (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onClick={() => navigate(`/intel/insight/${intelTab}/${idx}`, { state: { insights: insightBlocks, currentIndex: idx, intelTab, insightTab: 'Item', sourceRoute: sourceRoute || '/intel' } })}
                className="cursor-pointer rounded-xl border transition-all p-3 border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${INSIGHT_BADGE_COLORS[block.type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>{block.type}</span>
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">{block.time}</span>
                  </div>
                  {block.steps?.length > 0 && (
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${getPriorityDotClass(block.type)}`} />
                      <span className="text-[9px] font-semibold text-gray-700 dark:text-slate-300">{block.steps.length}</span>
                    </span>
                  )}
                </div>
                <h4 className="text-[13px] font-medium leading-snug text-gray-900 dark:text-slate-100 hover:text-brand dark:hover:text-gray-200 transition-colors flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-[9px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">{idx + 1}</span>
                  <span className="truncate">{block.heading}</span>
                </h4>
                <p
                  className="text-[13px] opacity-70 text-gray-600 dark:text-slate-400 leading-relaxed text-justify"
                  style={expandedIdx === idx ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {block.body}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedIdx(expandedIdx === idx ? null : idx); }}
                  className="text-[11px] font-semibold text-brand dark:text-gray-400 hover:underline mt-0.5 block"
                >
                  {expandedIdx === idx ? 'View Less.' : 'View More.'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── IntelPage ─────────────────────────────────────────────────────────── */

const TAB_TO_ROUTE = {
  sales: '/sales',
  margin: '/margin',
  inventory: '/inventory',
  ads: '/ads',
  cash: '/cash',
};

const V2_FULL_TAB_TO_ROUTE = {
  sales: '/intel/sales',
  margin: '/intel/margin',
  inventory: '/intel/inventory',
  ads: '/intel/ads',
  cash: '/intel/cash',
};

const ROUTE_TO_TAB = {
  '/sales': 'sales',
  '/margin': 'margin',
  '/inventory': 'inventory',
  '/ads': 'ads',
  '/cash': 'cash',
  '/intel': 'sales',
  '/intel/sales': 'sales',
  '/intel/margin': 'margin',
  '/intel/inventory': 'inventory',
  '/intel/ads': 'ads',
  '/intel/cash': 'cash',
};

/* ── Module-level filter option arrays (never change — no need to recreate per render) ── */
const V2_DATE_OPTS = [
  ['last-7-days',  'Last 7 Days'],
  ['last-30-days', 'Last 30 Days'],
  ['last-90-days', 'Last 90 Days'],
  ['ytd',          'Year to Date'],
];
const V2_CAT_OPTS = [
  ['all',           'All Categories'],
  ['electronics',   'Electronics'],
  ['home-garden',   'Home & Garden'],
  ['apparel',       'Apparel'],
  ['pet-suppliers', 'Pet Suppliers'],
];
const V2_CAT_RECENT = [['electronics','Electronics'],['apparel','Apparel'],['home-garden','Home & Garden']];
const V2_CAT_GRID   = [['electronics','Electronics'],['apparel','Apparel'],['home-garden','Home & Garden'],['pet-suppliers','Pet Suppliers'],['all','All Categories']];
const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ── Pure utility functions (no state deps — safe at module level) ── */
const isSameDay = (a, b) => !!(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
const isInRange = (date, start, end) => {
  if (!start || !end) return false;
  const d = date.getTime(), s = Math.min(start.getTime(), end.getTime()), e = Math.max(start.getTime(), end.getTime());
  return d > s && d < e;
};
const formatCalDate = (d) => !d ? '' : `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getFullYear()}`;
const _getDurLabel = (key) => ({ 'last-7-days': '7 days', 'last-30-days': '30 days', 'last-90-days': '90 days', 'ytd': 'YTD' }[key] || '30 days');
const quickToRange = (key) => {
  const end = new Date(); end.setHours(23,59,59,999);
  const start = new Date(end);
  if (key === 'last-7-days')       start.setDate(start.getDate() - 6);
  else if (key === 'last-30-days') start.setDate(start.getDate() - 29);
  else if (key === 'last-90-days') start.setDate(start.getDate() - 89);
  else if (key === 'ytd')          { start.setMonth(0); start.setDate(1); }
  else                             start.setDate(start.getDate() - 29);
  start.setHours(0,0,0,0);
  return { start, end };
};
const v2DateLabel = (v) => V2_DATE_OPTS.find(([k]) => k === v)?.[1] || v;
const v2CatLabel  = (v) => V2_CAT_OPTS.find(([k]) => k === v)?.[1] || v;

const IntelPage = ({ defaultTab = 'sales', fullWidthInsights = false }) => {
  const location = useLocation();
  const activeIntelTab = ROUTE_TO_TAB[location.pathname] || defaultTab;

  const [loading, setLoading] = useState(true);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3, 4, 5]);
  const [kpiDetailModal, setKpiDetailModal] = useState(null);

  // Insights section 1
  const [activeInsightTab, setActiveInsightTab] = useState('Overall');
  const [itemViewMode, setItemViewMode] = useState('list');
  const [stepOffset, setStepOffset] = useState(0);
  const [restoreItemSubTab, setRestoreItemSubTab] = useState(null);

  // Insights section 2
  const [activeInsightTab2, setActiveInsightTab2] = useState('Overall');
  const [itemViewMode2, setItemViewMode2] = useState('list');
  const [stepOffset2, setStepOffset2] = useState(0);

  // Scroll-aware header + sticky KPI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [kpiIsSticky, setKpiIsSticky] = useState(false);
  const [compactFilterOpen, setCompactFilterOpen] = useState(false);
  const kpiSectionRef = useRef(null);
  const compactFilterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const [_compactExpandedFilter, _setCompactExpandedFilter] = useState(null);
  const [filterPanelPos, setFilterPanelPos] = useState({ top: 64, right: 24 });

  /* ── V2 filter panel ── */
  const [v2FilterOpen,  setV2FilterOpen]  = useState(false);
  const [v2Section,     setV2Section]     = useState('date');
  const [pendingDate,   setPendingDate]   = useState(() => {
    const d = useFilterStore.getState().dateRange;
    return (d && d !== 'all') ? d : 'last-7-days';
  });
  const [pendingCats,   setPendingCats]   = useState([]);
  const [pendingChans,  setPendingChans]  = useState([]);
  const [appliedDate,   setAppliedDate]   = useState(() => {
    const d = useFilterStore.getState().dateRange;
    return (d && d !== 'all') ? d : null;
  });
  const [appliedCats,   setAppliedCats]   = useState([]);
  const [appliedChans,  setAppliedChans]  = useState([]);
  const [chanDropOpen,  setChanDropOpen]  = useState(false);
  const [pendingRangeStart, setPendingRangeStart] = useState(null);
  const [pendingRangeEnd,   setPendingRangeEnd]   = useState(null);
  const [hoverDay,      setHoverDay]      = useState(null);
  const [calViewYear,   setCalViewYear]   = useState(() => new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());
  const [calViewMonth,  setCalViewMonth]  = useState(() => new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1);
  const [durOpen,       setDurOpen]       = useState(false);
  const v2FilterRef = useRef(null);
  const chanDropRef  = useRef(null);
  const durRef       = useRef(null);

  const { dateRange, setDateRange, category, setCategory, channel, setChannel } = useFilterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (category !== 'all') {
      setActiveInsightTab('Category');
    }
  }, [category]);

  useEffect(() => {
    if (location.state?.restoreInsightTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveInsightTab(location.state.restoreInsightTab);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRestoreItemSubTab(location.state?.restoreItemSubTab || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Parsed once per mount — localStorage value doesn't change during component lifetime
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
  const fetchedRef = React.useRef(false);

  // Scroll detection — collapses search bar and shows Intel tabs in header
  useEffect(() => {
    const el = document.querySelector('.dashboard-main-content');
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 30);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Close compact filter dropdown when user scrolls back up
  useEffect(() => {
    if (!isScrolled) setCompactFilterOpen(false);
  }, [isScrolled]);

  // KPI sticky — triggers when KPI section is < 28% visible in scroll container
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
  useClickOutside(v2FilterRef, v2FilterOpen, () => setV2FilterOpen(false), compactFilterRef);
  useClickOutside(chanDropRef, chanDropOpen, () => setChanDropOpen(false));
  useClickOutside(durRef, durOpen, () => setDurOpen(false));

  const openProductModal = (product) => {
    const watchlistItem = salesWatchlistItems.find(
      item => item.title?.toLowerCase() === product.name?.toLowerCase()
    ) || null;

    navigate('/product-view', {
      state: {
        from: '/intel',
        product: {
          name: product.name,
          icon: 'fa-box',
          image: watchlistItem?.image || null,
          description: `${product.name} is a key product driving your sales performance. Review channel distribution, margin contribution, and inventory health below.`,
          kpiGroups: [
            {
              label: 'Sales',
              color: 'text-blue-600 dark:text-blue-400',
              bgColor: 'bg-blue-50 dark:bg-blue-900/10',
              kpis: [
                { label: 'Total Revenue', value: product.revenue },
                { label: 'Units Sold', value: product.units },
                { label: 'Avg Price', value: product.aov },
                { label: 'Buy Box %', value: product.bb },
              ],
            },
            {
              label: 'Margin',
              color: 'text-emerald-600 dark:text-emerald-400',
              bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
              kpis: [
                { label: 'Margin %', value: '34.2%' },
                { label: 'CM2 Profit', value: '$42.8K' },
                { label: 'Revenue', value: product.revenue },
                { label: 'Units', value: product.units },
              ],
            },
            {
              label: 'Inventory',
              color: 'text-amber-600 dark:text-amber-400',
              bgColor: 'bg-amber-50 dark:bg-amber-900/10',
              kpis: [
                { label: 'On-Hand', value: watchlistItem?.stock || '—' },
                { label: 'DOC', value: '12.3' },
                { label: 'Velocity', value: watchlistItem?.velocity || '—' },
                { label: 'Reorder Qty', value: '200' },
              ],
            },
          ],
          insights: [
            `Revenue at ${product.revenue} — primarily driven by Amazon US channel`,
            `Buy Box at ${product.bb} — monitor competitor pricing to maintain position`,
            watchlistItem?.subtext || 'Review inventory levels to avoid stockouts',
          ],
          watchlistItem: watchlistItem || {
            title: product.name,
            sku: product.sku || 'N/A',
            stock: '—',
            velocity: null,
            image: null,
            status: null,
            statusColor: 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700',
            progress: 50,
            progressColor: 'bg-gray-400',
            subtext: 'No watchlist data available',
          },
        },
      },
    });
  };

  useEffect(() => {
    const fetchIntel = async () => {
      if (fetchedRef.current) return;
      const shop = localStorage.getItem('active_shop');
      const platform = localStorage.getItem('active_platform') || 'shopify';
      if (shop) {
        fetchedRef.current = true;
        try {
          await apiClient.get(`/${platform}/sales-intelligence`);
        } catch (error) {
          console.error('Failed to fetch intelligence data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchIntel();
  }, []);

  const activeStats = STATS_BY_TAB[activeIntelTab] || STATS_BY_TAB.sales;

  const handleStepClick = (stepId) => {
    navigate(`/intel/insight/sales/${stepId}`);
  };

  // Compact header center — Intel tabs + single filter icon, shown when scrolled
  // Options arrays are module-level constants; only value/onChange depend on state
  const _compactFilterOptions = useMemo(() => [
    { label: 'Date Range', value: dateRange, onChange: setDateRange, options: V2_DATE_OPTS },
    { label: 'Category',   value: category,  onChange: setCategory,  options: V2_CAT_OPTS  },
    { label: 'Channel',    value: channel,   onChange: setChannel,   options: channelOptions },
  ], [dateRange, category, channel, channelOptions, setDateRange, setCategory, setChannel]);

  const compactHeaderCenter = isScrolled ? (
    <div className="flex items-center gap-0.5">
      {INTEL_TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => { navigate((fullWidthInsights ? V2_FULL_TAB_TO_ROUTE : TAB_TO_ROUTE)[tab.key]); setStepOffset(0); }}
          className={`px-3 py-1 text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 border-b-2 -mb-px
            ${activeIntelTab === tab.key
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

  const compactFilterElement = isScrolled ? (
    <div className="flex items-center gap-1.5" ref={compactFilterRef}>
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
    </div>
  ) : null;

  /* ── V2 filter helpers — channel-specific (depend on memoized channelOptions) ── */
  // V2_DATE_OPTS, V2_CAT_OPTS, V2_CAT_RECENT, V2_CAT_GRID, CAL_MONTHS are module-level constants above
  // isSameDay, isInRange, formatCalDate, getDurLabel, quickToRange are module-level pure functions above
  // v2DateLabel, v2CatLabel are module-level functions above
  const v2ChanList   = useMemo(() => channelOptions.filter(([v]) => v !== 'all'), [channelOptions]);
  const v2ChanRecent = useMemo(() => v2ChanList.slice(0, 2), [v2ChanList]);
  const v2ChanGrid   = useMemo(() => [...v2ChanList, ['all-chans','All Channels']], [v2ChanList]);
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
    const firstDay    = new Date(year, month, 1).getDay();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    const todayRef = new Date(); todayRef.setHours(0,0,0,0);
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

  function handleOpenV2Filter() {
    // Compute where to anchor the panel (below whichever trigger button is visible)
    const triggerEl = isScrolled ? compactFilterRef.current : filterBtnRef.current;
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      setFilterPanelPos({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
    }
    setPendingDate(appliedDate);
    setPendingCats([...appliedCats]);
    setPendingChans([...appliedChans]);
    setV2Section('date');
    if (appliedDate) {
      const r = quickToRange(appliedDate === 'custom' ? 'last-30-days' : appliedDate);
      setPendingRangeStart(r.start);
      setPendingRangeEnd(r.end);
      const sm = r.start.getMonth();
      setCalViewMonth(sm === 0 ? 11 : sm - 1);
      setCalViewYear(sm === 0 ? r.start.getFullYear() - 1 : r.start.getFullYear());
    } else {
      setPendingRangeStart(null);
      setPendingRangeEnd(null);
      const now = new Date();
      setCalViewMonth(now.getMonth() === 0 ? 11 : now.getMonth() - 1);
      setCalViewYear(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
    }
    setV2FilterOpen(true);
  }
  const handleApplyV2Filter = () => {
    setAppliedDate(pendingDate);
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

  return (
    <DashboardLayout
      title="Intelligence"
      subtitle="Real-time sales analytics"
      showSearch={true}
      showTabs={false}
      aiPromptFullWidth={true}
      searchCollapsed={isScrolled}
      headerCenterElement={compactHeaderCenter}
      customRightElement={compactFilterElement}
    >
      {/* Sticky compact KPI strip — smoothly slides in when KPI section scrolls out of view */}
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
            {selectedKpiIndices.map(idx => {
              const stat = activeStats[idx] || activeStats[0];
              return (
                <div
                  key={idx}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-xl"
                >
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide leading-tight mb-0.5">{stat.title}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight">{stat.value}</p>
                      <span className={`text-[9px] font-semibold leading-tight ${stat.isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium whitespace-nowrap">AI View</span>
            <button
              onClick={() => navigate(`/detailed-view/${activeIntelTab}`, { state: { from: '/intel' } })}
              className="relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full bg-gray-300 dark:bg-slate-600 transition-colors hover:bg-gray-400 dark:hover:bg-slate-500"
            >
              <span className="inline-block h-3 w-3 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-0.5" />
            </button>
            <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400 whitespace-nowrap">Dashboard</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">

        {/* Intel tabs (left) + Filter dropdowns (right) */}
        <div className="flex items-center justify-between -mt-2 pb-4">
          <div className="flex items-center gap-0.5">
            {INTEL_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { navigate((fullWidthInsights ? V2_FULL_TAB_TO_ROUTE : TAB_TO_ROUTE)[tab.key]); setStepOffset(0); }}
                className={`px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-px
                  ${activeIntelTab === tab.key
                    ? 'border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                  }`}
              >
                <i className={`fa-solid ${tab.icon} text-[11px]`} />
                {tab.label}
              </button>
            ))}
          </div>
          {/* V2 filter — search icon + filter icon + chips + panel */}
          <div className="relative flex items-center gap-2" ref={v2FilterRef}>

            {/* Filter button */}
            <button
              ref={filterBtnRef}
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

            {/* Date chip — visible only when a date filter is applied */}
            {appliedDate !== null && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
                {v2DateLabel(appliedDate)}
                <button
                  onClick={() => { setAppliedDate(null); setDateRange(null); }}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition"
                >
                  <i className="fa-solid fa-xmark text-[9px]" />
                </button>
              </span>
            )}

            {/* Category chips — only if specific categories selected */}
            {appliedCats.length === 1 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
                {v2CatLabel(appliedCats[0])}
                <button
                  onClick={() => { setAppliedCats([]); setCategory('all'); }}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition"
                >
                  <i className="fa-solid fa-xmark text-[9px]" />
                </button>
              </span>
            )}
            {appliedCats.length > 1 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
                {appliedCats.length} Categories
                <button
                  onClick={() => { setAppliedCats([]); setCategory('all'); }}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition"
                >
                  <i className="fa-solid fa-xmark text-[9px]" />
                </button>
              </span>
            )}

            {/* Channel chip — single name or "Channels ▾" dropdown */}
            {appliedChans.length === 1 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
                {v2ChanLabel(appliedChans[0])}
                <button
                  onClick={() => removeAppliedChan(appliedChans[0])}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition"
                >
                  <i className="fa-solid fa-xmark text-[9px]" />
                </button>
              </span>
            )}
            {appliedChans.length > 1 && (
              <div className="relative" ref={chanDropRef}>
                <button
                  onClick={() => setChanDropOpen(o => !o)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm hover:border-gray-300 dark:hover:border-slate-600 transition"
                >
                  Channels
                  <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-200 ${chanDropOpen ? 'rotate-180' : ''}`} />
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

            {/* Filter panel — vertical sidebar + content (fixed so it works from both header and content) */}
            {v2FilterOpen && (
              <div
                className="fixed bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-[9999] w-[580px] overflow-hidden"
                style={{ top: filterPanelPos.top, right: filterPanelPos.right }}
              >

                <div className="flex" style={{ minHeight: '380px' }}>

                  {/* LEFT: Vertical nav */}
                  <div className="w-[155px] flex-shrink-0 border-r border-gray-100 dark:border-slate-800 p-3 flex flex-col gap-1">
                    {[
                      { key: 'date',     label: 'Select Date' },
                      { key: 'channel',  label: 'All Channels' },
                      { key: 'category', label: 'All Categories' },
                    ].map(sec => (
                      <button
                        key={sec.key}
                        onClick={() => setV2Section(sec.key)}
                        className={`flex items-center gap-2 w-full text-left px-2.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                          v2Section === sec.key
                            ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          v2Section === sec.key ? 'border-white dark:border-gray-900' : 'border-gray-300 dark:border-slate-600'
                        }`}>
                          {v2Section === sec.key && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900" />}
                        </span>
                        {sec.label}
                      </button>
                    ))}
                  </div>

                  {/* RIGHT: Section content */}
                  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                    {/* ── Date section ── */}
                    {v2Section === 'date' && (
                      <div className="flex-1 flex flex-col p-4 gap-2">
                        {/* Quick filter pills */}
                        <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-gray-100 dark:border-slate-800">
                          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Quick Filters</span>
                          {[['last-7-days','Last 7 Days'],['last-30-days','Last 30 Days'],['last-90-days','Last 90 Days']].map(([val, lbl]) => (
                            <button key={val}
                              onClick={() => { const r = quickToRange(val); setPendingRangeStart(r.start); setPendingRangeEnd(r.end); setPendingDate(val); }}
                              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                                pendingDate === val
                                  ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100'
                                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                              }`}>
                              {lbl}
                            </button>
                          ))}
                        </div>

                        {/* Dual calendar */}
                        <div className="flex gap-3 flex-1">
                          {renderCalMonth(calViewYear, calViewMonth, true, false)}
                          <div className="w-px bg-gray-100 dark:bg-slate-800 self-stretch flex-shrink-0" />
                          {renderCalMonth(calRightY, calRightM, false, true)}
                        </div>

                        {/* Bottom: duration dropdown + date range display */}
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

                    {/* ── Category section ── */}
                    {v2Section === 'category' && (
                      <div className="flex-1 flex flex-col p-4 gap-5">
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Recent Used</p>
                          <div className="flex flex-wrap gap-1.5">
                            {V2_CAT_RECENT.map(([val, lbl]) => {
                              const isSel = pendingCats.includes(val);
                              return (
                                <button key={val} onClick={() => togglePendingCat(val)}
                                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                    isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                                  }`}>{lbl}</button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">All Categories</p>
                          <div className="flex flex-wrap gap-1.5">
                            {V2_CAT_GRID.map(([val, lbl]) => {
                              const isSel = val === 'all' ? pendingCats.length === 0 : pendingCats.includes(val);
                              return (
                                <button key={val} onClick={() => togglePendingCat(val)}
                                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                    isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                                  }`}>{lbl}</button>
                              );
                            })}
                          </div>
                        </div>
                        {pendingCats.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
                            {pendingCats.map(cat => (
                              <span key={cat} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300">
                                {v2CatLabel(cat)}
                                <button onClick={() => togglePendingCat(cat)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">
                                  <i className="fa-solid fa-xmark text-[9px]" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Channel section ── */}
                    {v2Section === 'channel' && (
                      <div className="flex-1 flex flex-col p-4 gap-5">
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">Recent Used</p>
                          <div className="flex flex-wrap gap-1.5">
                            {v2ChanRecent.map(([val, lbl]) => {
                              const isSel = pendingChans.includes(val);
                              return (
                                <button key={val} onClick={() => togglePendingChan(val)}
                                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                    isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                                  }`}>{lbl}</button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">All Channels</p>
                          <div className="flex flex-wrap gap-1.5">
                            {v2ChanGrid.map(([val, lbl]) => {
                              const isSel = val === 'all-chans' ? pendingChans.length === 0 : pendingChans.includes(val);
                              return (
                                <button key={val}
                                  onClick={() => val === 'all-chans' ? setPendingChans([]) : togglePendingChan(val)}
                                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                    isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                                  }`}>{lbl}</button>
                              );
                            })}
                          </div>
                        </div>
                        {pendingChans.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
                            {pendingChans.map(ch => (
                              <span key={ch} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300">
                                {v2ChanLabel(ch)}
                                <button onClick={() => togglePendingChan(ch)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">
                                  <i className="fa-solid fa-xmark text-[9px]" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
                  <button
                    onClick={() => setV2FilterOpen(false)}
                    className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyV2Filter}
                    className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition"
                  >
                    Update
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Customise KPIs (left) + Dashboard View toggle (right) */}
        <div className="flex items-center justify-between -mt-2">
          <button
            onClick={() => setIsKpiSelectorOpen(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
          >
            <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
              <i className="fa-solid fa-plus text-[8px]" />
            </span>
            Customise KPIs
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">AI View</span>
            <button
              onClick={() => navigate(`/detailed-view/${activeIntelTab}`, { state: { selectedKpiIndices, from: '/intel' } })}
              className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-gray-300 dark:bg-slate-600 transition-colors hover:bg-gray-400 dark:hover:bg-slate-500"
            >
              <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-0.5" />
            </button>
            <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Dashboard View</span>
          </div>
        </div>

        {/* 6 stat cards */}
        <div ref={kpiSectionRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 -mt-2">
          {selectedKpiIndices.map(idx => {
            const stat = activeStats[idx] || activeStats[0];
            return (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                isPositive={stat.isPositive}
                loading={loading}
                onClick={() => setKpiDetailModal(stat)}
              />
            );
          })}
        </div>

        {/* Insights section 1 */}
        <InsightsPanel
          activeInsightTab={activeInsightTab}
          setActiveInsightTab={setActiveInsightTab}
          itemViewMode={itemViewMode}
          setItemViewMode={setItemViewMode}
          stepOffset={stepOffset}
          setStepOffset={setStepOffset}
          onProductClick={openProductModal}
          onStepClick={handleStepClick}
          showDetailedView={true}
          onDetailedView={() => navigate(`/detailed-view/${activeIntelTab}`, { state: { selectedKpiIndices, from: '/intel' } })}
          intelTab={activeIntelTab}
          selectedCategory={category}
          noSidePanel={fullWidthInsights}
          initialItemSubTab={restoreItemSubTab}
          sourceRoute={location.pathname}
        />

        {/* Insights section 2 — carousel mode (commented out) */}
        {false && (
          <InsightsPanel
            activeInsightTab={activeInsightTab2}
            setActiveInsightTab={setActiveInsightTab2}
            itemViewMode={itemViewMode2}
            setItemViewMode={setItemViewMode2}
            stepOffset={stepOffset2}
            setStepOffset={setStepOffset2}
            isCarouselMode={true}
            onProductClick={openProductModal}
            onStepClick={handleStepClick}
            intelTab={activeIntelTab}
          />
        )}

      </div>

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={activeStats}
        selectedIndices={selectedKpiIndices}
        onSave={(indices) => { setSelectedKpiIndices(indices); }}
      />

      <KPIDetailModal
        isOpen={!!kpiDetailModal}
        onClose={() => setKpiDetailModal(null)}
        stat={kpiDetailModal}
        filterContext={{ dateRange: appliedDate, categories: appliedCats, channels: appliedChans }}
        tab={activeIntelTab}
      />
    </DashboardLayout>
  );
};

export default IntelPage;
