import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import StatCard from '../../../components/common/StatCard';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis, LabelList,
} from 'recharts';
import { COLORS, pieData, trendData, matrixData } from '../screenerData';
import ScreenerAlertsPanel from '../components/ScreenerAlertsPanel';
import AnalyticsModal from '../../../components/common/AnalyticsModal';
import ClickToExpand from '../../../components/common/ClickToExpand';
import DeepDiveTabBar from '../../../components/common/DeepDiveTabBar';
import BaseAreaChart from '../../../components/common/charts/BaseAreaChart';
import useModalToggle from '../../../hooks/useModalToggle';

const yourBrandTrend = trendData.map(d => ({ name: d.name, val: d.yourBrand }));

const kpis = [
  {
    title: 'Your Market Share', shortLabel: 'Mkt Share', value: '18.4%', change: '+2.1% vs last month', isPositive: true,
    chartData: yourBrandTrend, chartColor: '#FDA4AF',
    deepDive: {
      title: 'Your Market Share', icon: 'fa-chart-pie',
      cards: [
        { label: 'CURRENT', val: '18.4%', delta: '+2.1%', color: 'text-blue-600' },
        { label: 'PREV MONTH', val: '16.3%', delta: 'Baseline', color: 'text-blue-500' },
        { label: 'RANK', val: '#3', delta: 'of 47', color: 'text-purple-600' },
        { label: 'TARGET', val: '20%', delta: '+1.6% Gap', color: 'text-emerald-600' },
      ],
      tableColumns: [
        { header: 'BRAND', key: 'name', bold: true },
        { header: 'SHARE', key: 'share', align: 'right', bold: true },
        { header: 'RANK', key: 'rank', align: 'right' },
        { header: 'REVENUE', key: 'revenue', align: 'right' },
      ],
      tableData: [
        { name: 'Market Leader', share: '28.7%', rank: '#1', revenue: '$4.3M' },
        { name: 'TechMaster Pro', share: '22.3%', rank: '#2', revenue: '$3.4M' },
        { name: 'Your Brand', share: '18.4%', rank: '#3', revenue: '$2.8M' },
        { name: 'EliteGadgets', share: '14.8%', rank: '#4', revenue: '$2.2M' },
        { name: 'Others', share: '15.8%', rank: '43 brands', revenue: '$2.4M' },
      ],
    },
  },
  {
    title: 'Category Rank', shortLabel: 'Cat Rank', value: '#3', change: '+2 ranks this month', isPositive: true, subtext: 'Out of 47 brands',
    chartData: [{ name: 'Jan', val: 5 }, { name: 'Mar', val: 4 }, { name: 'Jun', val: 4 }, { name: 'Sep', val: 3 }, { name: 'Dec', val: 3 }], chartColor: '#8b5cf6',
    deepDive: {
      title: 'Category Rank', icon: 'fa-ranking-star',
      cards: [
        { label: 'CURRENT', val: '#3', delta: 'Improved', color: 'text-purple-600' },
        { label: 'PREV QTR', val: '#5', delta: 'Last Qtr', color: 'text-purple-500' },
        { label: 'TOTAL', val: '47 brands', delta: 'In Cat.', color: 'text-purple-500' },
        { label: 'TARGET', val: '#2', delta: 'Next Goal', color: 'text-purple-500' },
      ],
      tableColumns: [
        { header: 'BRAND', key: 'name', bold: true },
        { header: 'RANK', key: 'rank', align: 'right', bold: true },
        { header: 'SHARE', key: 'share', align: 'right' },
      ],
      tableData: [
        { name: 'Market Leader', rank: '#1', share: '28.7%' },
        { name: 'TechMaster Pro', rank: '#2', share: '22.3%' },
        { name: 'Your Brand', rank: '#3', share: '18.4%' },
        { name: 'EliteGadgets', rank: '#4', share: '14.8%' },
      ],
    },
  },
  {
    title: 'Revenue Share', shortLabel: 'Revenue', value: '$2.8M', change: '+12% MoM', isPositive: true,
    chartData: [{ name: 'Jan', val: 2.1 }, { name: 'Mar', val: 2.2 }, { name: 'Jun', val: 2.4 }, { name: 'Sep', val: 2.6 }, { name: 'Dec', val: 2.8 }], chartColor: '#10b981',
    deepDive: {
      title: 'Revenue Share', icon: 'fa-dollar-sign',
      cards: [
        { label: 'REVENUE', val: '$2.8M', delta: '+12% MoM', color: 'text-emerald-600' },
        { label: 'CATEGORY', val: '$15.2M', delta: 'Market', color: 'text-emerald-500' },
        { label: 'SHARE %', val: '18.4%', delta: 'Of Cat.', color: 'text-emerald-500' },
        { label: 'FORECAST', val: '$3.1M', delta: 'Next Mo.', color: 'text-emerald-500' },
      ],
      tableColumns: [
        { header: 'CHANNEL', key: 'channel', bold: true },
        { header: 'REVENUE', key: 'revenue', align: 'right', bold: true },
        { header: 'SHARE', key: 'share', align: 'right' },
      ],
      tableData: [
        { channel: 'Amazon US', revenue: '$1.96M', share: '70%' },
        { channel: 'Shopify', revenue: '$560K', share: '20%' },
        { channel: 'Walmart', revenue: '$280K', share: '10%' },
      ],
    },
  },
  {
    title: 'Growth Rate', shortLabel: 'Growth', value: '+15.2%', change: 'Year over year', isPositive: true,
    chartData: yourBrandTrend, chartColor: '#f59e0b',
    deepDive: {
      title: 'Growth Rate', icon: 'fa-chart-line',
      cards: [
        { label: 'YOY', val: '+15.2%', delta: 'Strong', color: 'text-orange-600' },
        { label: 'MOM', val: '+2.1%', delta: 'vs Last Mo.', color: 'text-orange-500' },
        { label: 'BEST MO.', val: 'Nov', delta: '19.2% Share', color: 'text-orange-500' },
        { label: 'MOMENTUM', val: 'Positive', delta: '3 Mos. Up', color: 'text-orange-500' },
      ],
      tableColumns: [
        { header: 'QUARTER', key: 'quarter', bold: true },
        { header: 'GROWTH', key: 'growth', align: 'right', bold: true },
        { header: 'SHARE', key: 'share', align: 'right' },
      ],
      tableData: [
        { quarter: 'Q1 2024', growth: '+12.1%', share: '16.5%' },
        { quarter: 'Q2 2024', growth: '+13.8%', share: '17.2%' },
        { quarter: 'Q3 2024', growth: '+14.9%', share: '18.0%' },
        { quarter: 'Q4 2024', growth: '+15.2%', share: '18.4%' },
      ],
    },
  },
];

const OpportunityDetail = ({ id }) => {
  const details = {
    electronics: {
      color: 'blue',
      priority: 'HIGH PRIORITY',
      title: 'Expand Electronics Presence',
      sub: 'Currently #2 with 22.4% share',
      icon: 'fa-laptop',
      stats: [{ l: 'Potential Gain', v: '+3.8%', c: 'blue' }, { l: 'Revenue Impact', v: '+$312K', c: 'green' }, { l: 'Timeline', v: '6 months', c: 'purple' }],
      actions: [
        { h: 'Launch 15 new SKUs in high-demand segments', b: 'Focus on wireless headphones, smart watches, and portable chargers' },
        { h: 'Improve pricing competitiveness by 5%', b: 'Target price-sensitive segments to win market share from competitors' },
        { h: 'Target market leader\'s weak subcategories', b: 'Identify and exploit gaps in gaming accessories and photography equipment' }
      ],
      metrics: [{ l: 'Market Share Target', v: '26.2%', c: 'blue' }, { l: 'New Revenue', v: '$2.15M', c: 'green' }]
    },
    'home-kitchen': {
      color: 'purple',
      priority: 'MEDIUM PRIORITY',
      title: 'Grow Home & Kitchen',
      sub: 'Currently #4 with 16.8% share',
      icon: 'fa-blender',
      stats: [{ l: 'Potential Gain', v: '+2.4%', c: 'purple' }, { l: 'Revenue Impact', v: '+$134K', c: 'green' }, { l: 'Timeline', v: '9 months', c: 'orange' }],
      actions: [
        { h: 'Fill assortment gaps in cookware', b: 'Add premium non-stick sets and cast iron collections' },
        { h: 'Launch seasonal promotions', b: 'Create holiday bundles and back-to-school campaigns' },
        { h: 'Improve product ratings and reviews', b: 'Implement review generation program to boost social proof' }
      ],
      metrics: [{ l: 'Market Share Target', v: '19.2%', c: 'purple' }, { l: 'New Revenue', v: '$1.08M', c: 'green' }]
    },
    sports: {
      color: 'green',
      priority: 'MAINTAIN',
      title: 'Defend Sports Position',
      sub: 'Currently #3 with 19.2% share',
      icon: 'fa-basketball',
      stats: [{ l: 'Share at Risk', v: '-1.2%', c: 'orange' }, { l: 'Competitive Threat', v: 'Medium', c: 'red' }, { l: 'Action Window', v: '3 months', c: 'blue' }],
      actions: [
        { h: 'Monitor competitor pricing closely', b: 'Set up automated alerts for price changes on key SKUs' },
        { h: 'Maintain product availability', b: 'Ensure 99% in-stock rate for top 50 products' },
        { h: 'Strengthen brand positioning', b: 'Invest in content marketing and influencer partnerships' }
      ],
      metrics: [{ l: 'Market Share Target', v: '19.2%+', c: 'green' }, { l: 'Revenue Protect', v: '$730K', c: 'blue' }]
    },
    toys: {
      color: 'orange',
      priority: 'TURNAROUND',
      title: 'Revive Toys & Games',
      sub: 'Currently #6 with 12.3% share',
      icon: 'fa-baby',
      stats: [{ l: 'Current Decline', v: '-3%', c: 'red' }, { l: 'Recovery Potential', v: '+5.2%', c: 'green' }, { l: 'Timeline', v: '12 months', c: 'purple' }],
      actions: [
        { h: 'Expand product portfolio by 40%', b: 'Add trending categories like STEM toys and collectibles' },
        { h: 'Launch aggressive promotions', b: 'Run monthly flash sales and bundle deals to regain momentum' },
        { h: 'Partner with trending brands', b: 'Secure licensing deals with popular franchises and IPs' }
      ],
      metrics: [{ l: 'Market Share Target', v: '17.5%', c: 'orange' }, { l: 'New Revenue', v: '$367K', c: 'green' }]
    }
  }[id];

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 h-full shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 bg-${details.color}-600 text-white rounded-lg text-xs font-bold`}>{details.priority}</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{details.title}</h4>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{details.sub}</p>
        </div>
        <div className={`w-12 h-12 bg-${details.color}-600 rounded-xl flex items-center justify-center shadow-md`}>
          <i className={`fa-solid ${details.icon} text-white text-xl`}></i>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {details.stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-white dark:border-slate-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">{s.l}</p>
            <p className={`text-2xl font-bold text-${s.c}-900 dark:text-${s.c}-400`}>{s.v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 tracking-wider">Key Actions:</p>
          <div className="space-y-2">
            {details.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 border border-gray-100 dark:border-slate-700">
                <i className={`fa-solid ${details.id === 'sports' ? 'fa-shield' : (details.id === 'toys' ? 'fa-wrench' : 'fa-check')} text-${details.color}-600 dark:text-${details.color}-400 text-sm mt-0.5`}></i>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{a.h}</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">{a.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 tracking-wider">Success Metrics:</p>
          <div className="grid grid-cols-2 gap-3">
            {details.metrics.map((m, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-white dark:border-slate-800 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-slate-500">{m.l}</p>
                <p className={`font-bold text-${m.c}-900 dark:text-${m.c}-400`}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button className={`flex-1 px-4 py-3 bg-${details.color}-600 text-white hover:bg-${details.color}-700 rounded-lg transition font-medium shadow-md shadow-${details.color}-500/20`}>
          <i className="fa-solid fa-rocket mr-2"></i>{details.id === 'toys' ? 'Launch Turnaround' : (details.id === 'sports' ? 'Activate Defense' : 'Launch Initiative')}
        </button>
        <button className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-lg transition font-medium">
          <i className="fa-solid fa-download mr-2"></i>Download Plan
        </button>
      </div>
    </div>
  );
};

const positioningQuadrants = [
  { title: 'Stars', sub: 'High Share, High Growth', color: 'indigo', icon: 'fa-star', items: ['Market Leader (28.7% • +22%)', 'TechMaster Pro (22.3% • +18%)'] },
  { title: 'Rising Stars', sub: 'Low Share, High Growth', color: 'blue', icon: 'fa-rocket', items: ['Your Brand (18.4% • +15%)', 'SmartBuy Co (9.2% • +24%)'] },
  { title: 'Cash Cows', sub: 'High Share, Low Growth', color: 'sky', icon: 'fa-coins', items: ['EliteGadgets (14.8% • +5%)', 'ValueMart (11.6% • +3%)'] },
  { title: 'Question Marks', sub: 'Low Share, Low Growth', color: 'slate', icon: 'fa-question', items: ['BudgetTech (5.4% • -2%)', 'Others (10.2% • +1%)'] },
];

const trendsSummaryStats = [
  { label: 'Your Growth', val: '+2.1%', sub: 'vs last year', color: 'blue' },
  { label: 'Best Month', val: 'Nov', sub: '19.2% share', color: 'indigo' },
  { label: 'Momentum', val: 'Positive', sub: '3 months up', color: 'sky' },
  { label: 'Volatility', val: 'Low', sub: '±1.2% variance', color: 'slate' },
];

// Rendered both standalone (chart-positioning modal) and inside the combined "charts" view.
const PositioningMatrixScatter = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
      <XAxis type="number" dataKey="x" name="Market Share" unit="%" label={{ value: 'Market Share (%)', position: 'insideBottom', offset: -10 }} />
      <YAxis type="number" dataKey="y" name="Growth Rate" unit="%" label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }} />
      <ZAxis type="number" dataKey="size" range={[200, 1500]} />
      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Brands" data={matrixData}>
        {matrixData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
        <LabelList dataKey="name" position="top" style={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
      </Scatter>
    </ScatterChart>
  </ResponsiveContainer>
);

const PositioningQuadrantsGrid = () => (
  <div className="grid grid-cols-2 gap-4 mt-4">
    {positioningQuadrants.map((quad, i) => (
      <div key={i} className={`bg-${quad.color}-50 dark:bg-${quad.color}-900/10 border border-${quad.color}-200 dark:border-${quad.color}-800/50 rounded-xl p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <i className={`fa-solid ${quad.icon} text-${quad.color}-600 dark:text-${quad.color}-400`}></i>
          <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">{quad.title}</h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{quad.sub}</p>
        {quad.items.map((item, j) => (
          <div key={j} className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg px-2 py-1.5 mb-1 border border-white dark:border-slate-800">
            <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.split(' (')[0]}</span>
            <span className={`text-xs font-bold text-${quad.color}-600 dark:text-${quad.color}-400`}>{item.split(' (')[1].replace(')', '')}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

// Rendered both standalone (chart-trends modal) and inside the combined "charts" view.
const TrendsLineChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={trendData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
      <RechartsTooltip />
      <Line type="monotone" dataKey="yourBrand" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 3, fill: '#fff', strokeWidth: 2, stroke: '#8B5CF6' }} name="Your Brand" />
      <Line type="monotone" dataKey="leader" stroke="#22D3EE" strokeWidth={2} strokeDasharray="5 5" name="Leader" />
      <Line type="monotone" dataKey="techMaster" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="TechMaster" />
      <Line type="monotone" dataKey="elite" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="EliteGadgets" />
    </LineChart>
  </ResponsiveContainer>
);

const TrendsStatsGrid = () => (
  <div className="grid grid-cols-4 gap-3 mt-4">
    {trendsSummaryStats.map((s, i) => (
      <div key={i} className={`bg-${s.color}-50 dark:bg-${s.color}-900/20 border border-${s.color}-200 dark:border-${s.color}-800 rounded-xl p-3`}>
        <p className={`text-xs text-${s.color}-600 dark:text-${s.color}-400 font-medium mb-1`}>{s.label}</p>
        <p className={`text-xl font-bold text-${s.color}-900 dark:text-${s.color}-100`}>{s.val}</p>
        <p className={`text-xs text-${s.color}-700 dark:text-${s.color}-500 mt-0.5`}>{s.sub}</p>
      </div>
    ))}
  </div>
);

const EXPAND_MODAL_META = {
  distribution: { icon: 'fa-chart-pie', title: 'Market Share Distribution' },
  'by-category': { icon: 'fa-layer-group', title: 'Market Share by Category' },
  movements: { icon: 'fa-arrow-trend-up', title: 'Recent Market Movements' },
  'chart-positioning': { icon: 'fa-circle-dot', title: 'Competitive Positioning Matrix' },
  'chart-trends': { icon: 'fa-chart-line', title: 'Market Share Trends (12 Months)' },
  charts: { icon: 'fa-chart-line', title: 'Charts' },
};

const MarketShareTab = () => {
  const [selectedKpiIdx, setSelectedKpiIdx] = useState(0);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const [mktDiveTab, setMktDiveTab] = useState('kpi');
  const [mktExpandModal, setMktExpandModal] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('electronics');
  const [selectedOpportunity, setSelectedOpportunity] = useState('electronics');
  const [expandedMovement, setExpandedMovement] = useState('competitor-gain');
  const [activeModal, setActiveModal] = useState({ isOpen: false, data: null });

  const selectedKpi = kpis[Math.min(selectedKpiIdx, kpis.length - 1)];
  const expandModalMeta = EXPAND_MODAL_META[mktExpandModal] || EXPAND_MODAL_META.charts;

  const handleDetailedView = () => {
    if (mktDiveTab === 'kpi') {
      setActiveModal({ isOpen: true, data: selectedKpi?.deepDive });
    } else {
      setMktExpandModal(mktDiveTab);
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
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Competitor Expansion</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">TechMaster undercut overnight on key ASINs — draft reprice recommended</p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Share Erosion Alert</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">3 ASINs are 8% below MAP — pricing review needed</p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Gap Emerged</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">Pet Bed SP showing 8.6× M-ROAS — strong scale opportunity</p>
              </div>
            </div>
          </div>

          {/* Mobile alerts */}
          <div className="lg:hidden mb-6">
            <ScreenerAlertsPanel />
          </div>

          {/* Market Share Opportunities */}
          <section id="share-opportunities">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">Market Share Opportunities</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Actionable insights to grow your market position</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  {[
                    { id: 'electronics', label: 'Expand Electronics Presence', sub: 'Currently #2 with 22.4% share', priority: 'HIGH PRIORITY', gain: '+3.8%', rev: '+$312K', color: 'blue' },
                    { id: 'home-kitchen', label: 'Grow Home & Kitchen', sub: 'Currently #4 with 16.8% share', priority: 'MEDIUM PRIORITY', gain: '+2.4%', rev: '+$134K', color: 'indigo' },
                    { id: 'sports', label: 'Defend Sports Position', sub: 'Currently #3 with 19.2% share', priority: 'MAINTAIN', gain: '-1.2%', rev: 'Medium', color: 'sky', type: 'Share at Risk', valColor: 'blue' },
                    { id: 'toys', label: 'Revive Toys & Games', sub: 'Currently #6 with 12.3% share', priority: 'TURNAROUND', gain: '-3%', rev: '+5.2%', color: 'slate', type: 'Current Decline', valColor: 'indigo', revType: 'Potential' },
                  ].map((opp) => (
                    <button
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp.id)}
                      className={`w-full text-left bg-white dark:bg-slate-900 dark:from-${opp.color}-900/10 dark:to-${opp.color}-900/20 border-2 transition-all rounded-xl p-4 hover:shadow-lg ${selectedOpportunity === opp.id ? `border-${opp.color}-400 dark:border-${opp.color}-600 shadow-md` : `border-${opp.color}-200 dark:border-${opp.color}-800/50`
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 bg-${opp.color}-100 text-${opp.color}-700 rounded-lg text-xs font-bold`}>{opp.priority}</span>
                        <i className={`fa-solid fa-chevron-right text-${opp.color}-600`}></i>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">{opp.label}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{opp.sub}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg p-2 shadow-sm border border-white dark:border-slate-800">
                          <p className="text-xs text-gray-500 dark:text-slate-500">{opp.type || 'Potential Gain'}</p>
                          <p className={`font-bold text-${opp.valColor || opp.color}-900 dark:text-${opp.valColor || opp.color}-400`}>{opp.gain}</p>
                        </div>
                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg p-2 shadow-sm border border-white dark:border-slate-800">
                          <p className="text-xs text-gray-500 dark:text-slate-500">{opp.revType || (opp.id === 'sports' ? 'Threat Level' : 'Revenue')}</p>
                          <p className={`font-bold text-${opp.id === 'sports' ? 'red' : 'green'}-900 dark:text-${opp.id === 'sports' ? 'red' : 'green'}-400`}>{opp.rev}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedOpportunity}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <OpportunityDetail id={selectedOpportunity} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
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

            {/* Market Share analysis tabs */}
            <DeepDiveTabBar>
              {[
                { key: 'kpi', label: selectedKpi?.shortLabel || 'Mkt Share' },
                { key: 'distribution', label: 'Distribution' },
                { key: 'by-category', label: 'By Category' },
                { key: 'movements', label: 'Movements' },
                { key: 'charts', label: 'Charts' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setMktDiveTab(key)}
                  className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${
                    mktDiveTab === key
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
                {mktDiveTab === 'kpi' && (
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
                {mktDiveTab === 'distribution' && (
                  <div className="p-3 space-y-2">
                    {[
                      { name: 'Market Leader', value: 28.7, color: '#6366f1' },
                      { name: 'TechMaster Pro', value: 22.3, color: '#3b82f6' },
                      { name: 'Your Brand', value: 18.4, color: '#0ea5e9' },
                      { name: 'EliteGadgets', value: 14.8, color: '#8b5cf6' },
                      { name: 'Others', value: 15.8, color: '#94a3b8' },
                    ].map((b, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">{b.name}</span>
                          <span className="text-xs font-bold ml-2" style={{ color: b.color }}>{b.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {mktDiveTab === 'by-category' && (
                  <div className="p-3 space-y-1.5">
                    {[
                      { label: 'Electronics', share: '22.4%', rank: '#2', trend: '+18%', pos: true },
                      { label: 'Home & Kitchen', share: '16.8%', rank: '#4', trend: '+15%', pos: true },
                      { label: 'Sports & Outdoors', share: '19.2%', rank: '#3', trend: '+8%', pos: true },
                      { label: 'Toys & Games', share: '12.3%', rank: '#6', trend: '-3%', pos: false },
                    ].map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate flex-1">{cat.label}</span>
                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                          <span className="text-xs font-bold text-gray-700 dark:text-slate-200">{cat.share}</span>
                          <span className="text-[9px] px-1 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-bold">{cat.rank}</span>
                          <span className={`text-[10px] font-bold ${cat.pos ? 'text-green-600' : 'text-red-500'}`}>{cat.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {mktDiveTab === 'movements' && (
                  <div className="p-3 space-y-2">
                    {[
                      { title: 'Market Leader gained 2.3% in Electronics', status: 'CRITICAL', color: 'blue', time: '3h ago' },
                      { title: 'You gained 1.8% in Home & Kitchen', status: 'POSITIVE', color: 'indigo', time: '1d ago' },
                      { title: 'MegaTech entered Sports category', status: 'MONITOR', color: 'sky', time: '2d ago' },
                      { title: 'Price war in Electronics accessories', status: 'ACTIVE', color: 'slate', time: '5d ago' },
                    ].map((m, i) => (
                      <div key={i} className={`p-2.5 rounded-r-lg border-l-2 bg-${m.color}-50 dark:bg-${m.color}-900/10 border-${m.color}-400`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] px-1 py-0.5 bg-${m.color}-600 text-white rounded font-bold`}>{m.status}</span>
                          <span className="text-[9px] text-gray-400 dark:text-slate-500">{m.time}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-slate-300 font-medium leading-tight line-clamp-2">{m.title}</p>
                      </div>
                    ))}
                  </div>
                )}
                {mktDiveTab === 'charts' && (
                  <div className="p-3 space-y-2">
                    {[
                      { key: 'chart-positioning', icon: 'fa-circle-dot', title: 'Competitive Positioning Matrix', sub: 'Market share vs growth rate' },
                      { key: 'chart-trends', icon: 'fa-chart-line', title: 'Market Share Trends', sub: '12-month trend analysis' },
                    ].map((chart) => (
                      <button
                        key={chart.key}
                        onClick={() => setMktExpandModal(chart.key)}
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
              {mktDiveTab !== 'kpi' && mktDiveTab !== 'charts' && (
                <button
                  onClick={() => setMktExpandModal(mktDiveTab)}
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

      {/* Market Share Deep-Dive Expand Modal */}
      {mktExpandModal && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setMktExpandModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i className={`fa-solid ${expandModalMeta.icon} text-blue-600 dark:text-blue-400 text-sm`}></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">
                  {expandModalMeta.title}
                </h2>
              </div>
              <button
                onClick={() => setMktExpandModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Distribution */}
              {mktExpandModal === 'distribution' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Breakdown of market share across top competitors</p>
                    <div className="flex items-center gap-2">
                      <select className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200">
                        <option>All Categories</option><option>Electronics</option><option>Home & Kitchen</option><option>Sports</option>
                      </select>
                      <button className="px-3 py-1.5 bg-brand text-white hover:bg-brand-hover dark:bg-gray-600 rounded-xl text-sm font-medium">
                        <i className="fa-solid fa-download mr-1.5"></i>Export
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-[360px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Your Brand', rank: '#3', value: 18.4, products: 370, revenue: '$2.8M', color: 'blue', icon: 'fa-building' },
                        { name: 'Market Leader', rank: '#1', value: 28.7, products: 892, revenue: '$4.3M', color: 'indigo', icon: 'fa-crown' },
                        { name: 'TechMaster Pro', rank: '#2', value: 22.3, products: 542, revenue: '$3.4M', color: 'blue', icon: 'fa-building' },
                        { name: 'EliteGadgets', rank: '#4', value: 14.8, products: 289, revenue: '$2.2M', color: 'indigo', icon: 'fa-building' },
                        { name: 'Others', rank: '43 brands', value: 15.8, products: '1,234', revenue: '$2.4M', color: 'slate', icon: 'fa-ellipsis' },
                      ].map((brand, i) => (
                        <div key={i} className={`bg-gradient-to-r from-${brand.color}-50 to-${brand.color}-100 dark:from-${brand.color}-900/10 dark:to-${brand.color}-900/20 border border-${brand.color}-200 dark:border-${brand.color}-800/50 rounded-xl p-3`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 bg-${brand.color}-600 rounded-lg flex items-center justify-center`}>
                                <i className={`fa-solid ${brand.icon} text-white text-xs`}></i>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{brand.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Rank {brand.rank}</p>
                              </div>
                            </div>
                            <p className={`text-xl font-bold text-${brand.color}-900 dark:text-${brand.color}-400`}>{brand.value}%</p>
                          </div>
                          <div className={`w-full bg-${brand.color}-200 dark:bg-slate-700 rounded-full h-2`}>
                            <div className={`bg-${brand.color}-600 h-2 rounded-full`} style={{ width: `${brand.value}%` }}></div>
                          </div>
                          <p className={`text-xs text-${brand.color}-700 dark:text-${brand.color}-500 mt-1`}>{brand.products} products • {brand.revenue} revenue</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* By Category */}
              {mktExpandModal === 'by-category' && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Your performance across different product categories</p>
                    <button className="px-3 py-1.5 bg-brand text-white hover:bg-brand-hover dark:bg-gray-600 rounded-xl text-sm font-medium">
                      <i className="fa-solid fa-plus mr-1.5"></i>Add Category
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: 'electronics', label: 'Electronics', icon: 'fa-laptop', count: 156, share: '22.4%', rank: '#2', trend: '+18%', color: 'blue' },
                      { id: 'home-kitchen', label: 'Home & Kitchen', icon: 'fa-blender', count: 128, share: '16.8%', rank: '#4', trend: '+15%', color: 'indigo' },
                      { id: 'sports', label: 'Sports & Outdoors', icon: 'fa-basketball', count: 67, share: '19.2%', rank: '#3', trend: '+8%', color: 'blue' },
                      { id: 'toys', label: 'Toys & Games', icon: 'fa-baby', count: 19, share: '12.3%', rank: '#6', trend: '-3%', color: 'indigo' },
                    ].map((cat) => (
                      <div key={cat.id} className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <div
                          onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                          className="bg-gray-50 dark:bg-slate-800/50 p-4 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-10 h-10 bg-${cat.color}-100 dark:bg-${cat.color}-900/30 rounded-lg flex items-center justify-center`}>
                                <i className={`fa-solid ${cat.icon} text-${cat.color}-600 dark:text-${cat.color}-400`}></i>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-slate-100">{cat.label}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{cat.count} products</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-bold text-gray-900 dark:text-slate-100">{cat.share}</p>
                                  <p className="text-xs text-gray-500 font-bold">Share</p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-bold border border-yellow-200 dark:border-yellow-800">{cat.rank}</span>
                                <span className={`px-2 py-1 ${cat.trend.startsWith('+') ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'} rounded-lg text-sm font-bold`}>
                                  <i className={`fa-solid fa-arrow-${cat.trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>{cat.trend}
                                </span>
                              </div>
                            </div>
                            <i className={`fa-solid fa-chevron-${expandedCategory === cat.id ? 'up' : 'down'} text-gray-400 ml-4`}></i>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedCategory === cat.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 overflow-hidden"
                            >
                              <div className="p-5 space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className={`bg-${cat.color}-50 dark:bg-${cat.color}-900/20 rounded-lg p-4`}>
                                    <p className={`text-xs text-${cat.color}-600 dark:text-${cat.color}-400 font-medium mb-1`}>Total Market</p>
                                    <p className={`text-xl font-bold text-${cat.color}-900 dark:text-${cat.color}-100`}>$8.2M</p>
                                  </div>
                                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Your Revenue</p>
                                    <p className="text-xl font-bold text-green-900 dark:text-green-100">$1.84M</p>
                                  </div>
                                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Growth Trend</p>
                                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100">Rising</p>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button className={`flex-1 px-4 py-2 bg-${cat.color}-600 text-white hover:bg-${cat.color}-700 rounded-lg transition text-sm font-medium`}>
                                    <i className="fa-solid fa-chart-line mr-2"></i>View Detailed Analytics
                                  </button>
                                  <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition text-sm font-medium">
                                    <i className="fa-solid fa-lightbulb mr-2"></i>Growth Opportunities
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-lightbulb text-yellow-500"></i>Category Insights
                    </h4>
                    <div className="space-y-2">
                      {[
                        { color: 'blue', text: 'Electronics is your strongest category with 22.4% share and #2 ranking' },
                        { color: 'purple', text: 'Home & Kitchen showing strong growth at +15% with opportunity to improve ranking' },
                        { color: 'orange', text: 'Toys & Games requires attention - declining share and low product count' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <i className={`fa-solid fa-circle text-${item.color}-600 text-[6px] mt-2 flex-shrink-0`}></i>
                          <p className="text-sm text-gray-700 dark:text-slate-300">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Recent Market Movements */}
              {mktExpandModal === 'movements' && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Latest shifts and competitive actions</p>
                    <button className="px-3 py-1.5 bg-brand text-white hover:bg-brand-hover dark:bg-gray-600 rounded-xl text-sm font-medium">
                      <i className="fa-solid fa-bell mr-1.5"></i>Set Alerts
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: 'competitor-gain', title: 'Market Leader gained 2.3% in Electronics', status: 'CRITICAL', time: '3 hours ago', icon: 'fa-arrow-trend-up', color: 'blue', analysis: ['Competitor launched 23 new products in wireless audio segment', 'Aggressive pricing strategy with 15-20% discounts', 'Major marketing campaign with influencer partnerships'], stats: [{ l: 'Share Gained', v: '+2.3%', c: 'blue' }, { l: 'Affected Category', v: 'Electronics', c: 'indigo' }, { l: 'Impact on You', v: '-0.8%', c: 'sky' }] },
                      { id: 'your-gain', title: 'You gained 1.8% in Home & Kitchen', status: 'POSITIVE', time: '1 day ago', icon: 'fa-arrow-trend-up', color: 'indigo', analysis: ['New premium cookware line exceeded sales targets by 40%', 'Improved product ratings from 3.8 to 4.5 stars average', 'Holiday bundle promotion drove 30% increase in orders'], stats: [{ l: 'Share Gained', v: '+1.8%', c: 'indigo' }, { l: 'Revenue Impact', v: '+$101K', c: 'blue' }, { l: 'New Ranking', v: '#4 → #3', c: 'sky' }] },
                      { id: 'new-entrant', title: 'MegaTech entered Sports category', status: 'MONITOR', time: '2 days ago', icon: 'fa-building', color: 'sky', analysis: ['Launched with aggressive pricing 10-15% below market average', 'Strong brand reputation from electronics category', 'Focus on fitness equipment and outdoor gear segments'], stats: [{ l: 'Initial Share', v: '1.2%', c: 'sky' }, { l: 'Product Count', v: '200+ SKUs', c: 'blue' }, { l: 'Threat Level', v: 'Medium', c: 'blue' }] },
                      { id: 'price-war', title: 'Price war in Electronics accessories', status: 'ACTIVE', time: '5 days ago', icon: 'fa-dollar-sign', color: 'slate', analysis: ['Major players cutting prices on cables, chargers, and cases', 'Overall category volume up 35% but margin pressure increasing', 'Opportunity to gain share if margins can be maintained'], stats: [{ l: 'Avg Price Drop', v: '-18%', c: 'blue' }, { l: 'Competitors Involved', v: '7 brands', c: 'indigo' }, { l: 'Volume Impact', v: '+35%', c: 'sky' }] },
                    ].map((move) => (
                      <div key={move.id} className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <div
                          onClick={() => setExpandedMovement(expandedMovement === move.id ? null : move.id)}
                          className={`bg-${move.color}-50 dark:bg-${move.color}-900/10 border-l-4 border-${move.color}-500 p-4 hover:bg-${move.color}-100 dark:hover:bg-${move.color}-900/20 transition cursor-pointer`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-10 h-10 bg-${move.color}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <i className={`fa-solid ${move.icon} text-white`}></i>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-bold text-gray-900 dark:text-slate-100">{move.title}</p>
                                  <span className={`px-2 py-0.5 bg-${move.color}-600 text-white rounded text-[10px] font-bold`}>{move.status}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400">Detected {move.time}</p>
                              </div>
                            </div>
                            <i className={`fa-solid fa-chevron-${expandedMovement === move.id ? 'up' : 'down'} text-gray-400 ml-4`}></i>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedMovement === move.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 overflow-hidden"
                            >
                              <div className="p-5 space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  {move.stats.map((s, idx) => (
                                    <div key={idx} className={`bg-${s.c}-50 dark:bg-${s.c}-900/20 rounded-lg p-4`}>
                                      <p className={`text-xs text-${s.c}-600 dark:text-${s.c}-400 font-medium mb-1`}>{s.l}</p>
                                      <p className={`text-2xl font-bold text-${s.c}-900 dark:text-${s.c}-100`}>{s.v}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Analysis</h4>
                                  <ul className="space-y-2">
                                    {move.analysis.map((a, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <i className={`fa-solid fa-circle text-${move.color}-600 text-[6px] mt-2 flex-shrink-0`}></i>
                                        <span className="text-sm text-gray-700 dark:text-slate-300">{a}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="flex gap-3">
                                  <button className={`flex-1 px-4 py-2 bg-${move.color}-600 text-white hover:bg-${move.color}-700 rounded-lg transition text-sm font-medium`}>
                                    <i className={`fa-solid ${move.id === 'your-gain' ? 'fa-rocket' : 'fa-shield'} mr-2`}></i>
                                    {move.id === 'your-gain' ? 'Replicate Success' : 'Counter Strategy'}
                                  </button>
                                  <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition text-sm font-medium">
                                    <i className="fa-solid fa-chart-line mr-2"></i>View Details
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Individual Chart: Competitive Positioning Matrix */}
              {mktExpandModal === 'chart-positioning' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Market share vs growth rate analysis across all competitors</p>
                  <div className="h-[420px] w-full bg-gray-50 dark:bg-slate-800/30 rounded-xl p-4">
                    <PositioningMatrixScatter />
                  </div>
                  <PositioningQuadrantsGrid />
                </div>
              )}

              {/* Individual Chart: Market Share Trends */}
              {mktExpandModal === 'chart-trends' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Track how market share has evolved over the past 12 months</p>
                  <div className="h-[400px] w-full">
                    <TrendsLineChart />
                  </div>
                  <TrendsStatsGrid />
                </div>
              )}

              {/* Charts (both) */}
              {mktExpandModal === 'charts' && (
                <div className="space-y-8">
                  {/* Competitive Positioning Matrix */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">Competitive Positioning Matrix</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Market share vs growth rate analysis</p>
                    <div className="h-[400px] w-full bg-gray-50 dark:bg-slate-800/30 rounded-xl p-4">
                      <PositioningMatrixScatter />
                    </div>
                    <PositioningQuadrantsGrid />
                  </div>

                  {/* Market Share Trends */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">Market Share Trends (12 Months)</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Track how market share has evolved over the past year</p>
                    <div className="h-[380px] w-full">
                      <TrendsLineChart />
                    </div>
                    <TrendsStatsGrid />
                  </div>
                </div>
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
      />
    </>
  );
};

export default MarketShareTab;
