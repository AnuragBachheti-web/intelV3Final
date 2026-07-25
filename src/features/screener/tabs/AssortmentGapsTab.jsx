import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { assortmentCategoryData, assortmentPriorityData, assortmentCompetitorData } from '../screenerData';
import StatCard from '../../../components/common/StatCard';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import ScreenerAlertsPanel from '../components/ScreenerAlertsPanel';
import AnalyticsModal from '../../../components/common/AnalyticsModal';
import ClickToExpand from '../../../components/common/ClickToExpand';
import DeepDiveTabBar from '../../../components/common/DeepDiveTabBar';
import BaseAreaChart from '../../../components/common/charts/BaseAreaChart';
import useModalToggle from '../../../hooks/useModalToggle';

const kpis = [
  {
    title: 'Total Gaps', shortLabel: 'Gaps', value: '127', subtext: 'Across all categories', isPositive: false,
    chartData: [{ name: 'Jan', val: 145 }, { name: 'Mar', val: 138 }, { name: 'Jun', val: 132 }, { name: 'Sep', val: 129 }, { name: 'Dec', val: 127 }], chartColor: '#f97316',
    deepDive: {
      title: 'Total Gaps', icon: 'fa-exclamation-triangle',
      cards: [
        { label: 'TOTAL GAPS', val: '127', delta: 'All Cat.', color: 'text-orange-600' },
        { label: 'HIGH PRI.', val: '43', delta: 'Urgent', color: 'text-red-600' },
        { label: 'MED PRI.', val: '56', delta: 'Review', color: 'text-amber-600' },
        { label: 'LOW PRI.', val: '28', delta: 'Monitor', color: 'text-orange-500' },
      ],
      tableColumns: [
        { header: 'CATEGORY', key: 'cat', bold: true },
        { header: 'GAPS', key: 'gaps', align: 'right', bold: true },
        { header: 'PRIORITY', key: 'priority', align: 'right' },
      ],
      tableData: [
        { cat: 'Electronics', gaps: '48', priority: 'Critical' },
        { cat: 'Home & Kitchen', gaps: '34', priority: 'High' },
        { cat: 'Sports & Outdoors', gaps: '28', priority: 'High' },
        { cat: 'Toys & Games', gaps: '17', priority: 'Medium' },
      ],
    },
  },
  {
    title: 'High Priority', shortLabel: 'Priority', value: '43', change: '+12', isPositive: false, subtext: 'Requires action',
    chartData: [{ name: 'Jan', val: 28 }, { name: 'Mar', val: 33 }, { name: 'Jun', val: 38 }, { name: 'Sep', val: 40 }, { name: 'Dec', val: 43 }], chartColor: '#ef4444',
    deepDive: {
      title: 'High Priority Gaps', icon: 'fa-fire',
      cards: [
        { label: 'HIGH PRI.', val: '43', delta: '+12', color: 'text-red-600' },
        { label: 'IMMEDIATE', val: '28', delta: 'Action Req.', color: 'text-red-500' },
        { label: 'REV. RISK', val: '$892K', delta: 'Annual', color: 'text-red-500' },
        { label: 'AVG SCORE', val: '87/100', delta: 'Priority', color: 'text-red-500' },
      ],
      tableColumns: [
        { header: 'CATEGORY', key: 'cat', bold: true },
        { header: 'COUNT', key: 'count', align: 'right', bold: true },
        { header: 'REV. OPP.', key: 'opp', align: 'right' },
      ],
      tableData: [
        { cat: 'Electronics', count: '18', opp: '$420K' },
        { cat: 'Home & Kitchen', count: '14', opp: '$280K' },
        { cat: 'Sports & Outdoors', count: '11', opp: '$192K' },
      ],
    },
  },
  {
    title: 'Revenue Opp', shortLabel: 'Rev Opp', value: '$1.8M', change: '+15%', isPositive: true, subtext: 'Annual potential',
    chartData: [{ name: 'Jan', val: 1.4 }, { name: 'Mar', val: 1.5 }, { name: 'Jun', val: 1.6 }, { name: 'Sep', val: 1.7 }, { name: 'Dec', val: 1.8 }], chartColor: '#22c55e',
    deepDive: {
      title: 'Revenue Opportunity', icon: 'fa-dollar-sign',
      cards: [
        { label: 'TOTAL OPP.', val: '$1.8M', delta: '+15%', color: 'text-green-600' },
        { label: 'QUICK WINS', val: '$420K', delta: 'Fast Fill', color: 'text-green-500' },
        { label: 'HIGH VALUE', val: '$980K', delta: 'Top 20%', color: 'text-green-500' },
        { label: 'TIMELINE', val: '6 months', delta: 'To Fill', color: 'text-green-500' },
      ],
      tableColumns: [
        { header: 'OPPORTUNITY', key: 'opp', bold: true },
        { header: 'VALUE', key: 'value', align: 'right', bold: true },
        { header: 'EFFORT', key: 'effort', align: 'right' },
      ],
      tableData: [
        { opp: 'Electronics Expansion', value: '$420K', effort: 'Medium' },
        { opp: 'Home & Kitchen', value: '$340K', effort: 'Low' },
        { opp: 'Sports & Outdoors', value: '$280K', effort: 'Medium' },
        { opp: 'Seasonal Products', value: '$760K', effort: 'High' },
      ],
    },
  },
  {
    title: 'Avg Fill Rate', shortLabel: 'Fill Rate', value: '73%', subtext: 'vs cat avg 85%', isPositive: false,
    chartData: [{ name: 'Jan', val: 68 }, { name: 'Mar', val: 70 }, { name: 'Jun', val: 71 }, { name: 'Sep', val: 72 }, { name: 'Dec', val: 73 }], chartColor: '#3b82f6',
    deepDive: {
      title: 'Avg Fill Rate', icon: 'fa-chart-simple',
      cards: [
        { label: 'YOUR RATE', val: '73%', delta: 'vs 85% avg', color: 'text-blue-600' },
        { label: 'CAT AVG', val: '85%', delta: 'Benchmark', color: 'text-blue-500' },
        { label: 'GAP', val: '-12%', delta: 'To Close', color: 'text-red-500' },
        { label: 'BEST CAT.', val: '82%', delta: 'Electronics', color: 'text-blue-500' },
      ],
      tableColumns: [
        { header: 'CATEGORY', key: 'cat', bold: true },
        { header: 'FILL RATE', key: 'rate', align: 'right', bold: true },
        { header: 'BENCHMARK', key: 'bench', align: 'right' },
      ],
      tableData: [
        { cat: 'Electronics', rate: '82%', bench: '88%' },
        { cat: 'Home & Kitchen', rate: '76%', bench: '85%' },
        { cat: 'Sports', rate: '71%', bench: '83%' },
        { cat: 'Toys', rate: '65%', bench: '80%' },
      ],
    },
  },
];

const gapDetails = {
  'wireless-headphones': {
    priority: 'CRITICAL',
    title: 'Wireless Headphones Gap',
    category: 'Electronics',
    description: '12 products missing in Electronics category',
    icon: 'fa-headphones',
    color: 'red',
    metrics: [
      { label: 'Revenue Potential', val: '$180K', color: 'green' },
      { label: 'Missing SKUs', val: '12', color: 'red' },
      { label: 'Avg Demand', val: 'High', color: 'blue' }
    ],
    subtypes: [
      { name: 'Premium Over-Ear Models ($150-300)', desc: 'Competitors have 8-12 SKUs, high demand segment', val: '$85K' },
      { name: 'Sports/Running Earbuds ($50-100)', desc: 'Growing segment, competitors have 5-8 options', val: '$60K' },
      { name: 'Budget True Wireless ($30-60)', desc: 'High volume potential, price-sensitive buyers', val: '$35K' }
    ]
  },
  'smart-watches': {
    priority: 'CRITICAL',
    title: 'Smart Watches Gap',
    category: 'Electronics',
    description: '9 products missing in Electronics category',
    icon: 'fa-stopwatch',
    color: 'orange',
    metrics: [
      { label: 'Revenue Potential', val: '$220K', color: 'green' },
      { label: 'Missing SKUs', val: '9', color: 'orange' },
      { label: 'Avg Demand', val: 'Very High', color: 'blue' }
    ],
    subtypes: [
      { name: 'Fitness Smart Watches ($200-400)', desc: 'High-demand fitness tracking features', val: '$110K' },
      { name: 'Budget Smart Bands ($40-80)', desc: 'Entry-level market with high volume', val: '$75K' },
      { name: 'Kids Smart Watches ($50-100)', desc: 'Growing niche with GPS features', val: '$35K' }
    ]
  },
  'cookware': {
    priority: 'HIGH',
    title: 'Premium Cookware Gap',
    category: 'Home & Kitchen',
    description: '8 products missing in Home & Kitchen',
    icon: 'fa-utensils',
    color: 'purple',
    metrics: [
      { label: 'Revenue Potential', val: '$165K', color: 'green' },
      { label: 'Missing SKUs', val: '8', color: 'purple' },
      { label: 'Avg Demand', val: 'High', color: 'blue' }
    ],
    subtypes: [
      { name: 'Non-Stick Cookware Sets ($100-200)', desc: 'Complete sets with 10-12 pieces', val: '$80K' },
      { name: 'Cast Iron Collections ($80-150)', desc: 'Dutch ovens and skillets', val: '$55K' },
      { name: 'Specialty Pans ($40-90)', desc: 'Woks, grill pans, crepe makers', val: '$30K' }
    ]
  },
  'yoga': {
    priority: 'HIGH',
    title: 'Yoga & Pilates Gap',
    category: 'Sports',
    description: '9 products missing in Sports',
    icon: 'fa-spa',
    color: 'green',
    metrics: [
      { label: 'Revenue Potential', val: '$145K', color: 'green' },
      { label: 'Missing SKUs', val: '9', color: 'green' },
      { label: 'Avg Demand', val: 'Growing', color: 'blue' }
    ],
    subtypes: [
      { name: 'Premium Yoga Mats ($40-80)', desc: 'Eco-friendly, extra thick options', val: '$60K' },
      { name: 'Pilates Equipment ($50-120)', desc: 'Rings, balls, resistance bands', val: '$50K' },
      { name: 'Yoga Blocks & Props ($20-45)', desc: 'Straps, bolsters, meditation cushions', val: '$35K' }
    ]
  }
};

const AssortmentGapsTab = () => {
  const [selectedKpiIdx, setSelectedKpiIdx] = useState(0);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const [assortmentDiveTab, setAssortmentDiveTab] = useState('kpi');
  const [assortmentExpandModal, setAssortmentExpandModal] = useState(null);
  const [activeModal, setActiveModal] = useState({ isOpen: false, data: null });
  const [selectedGap, setSelectedGap] = useState('wireless-headphones');

  const selectedKpi = kpis[Math.min(selectedKpiIdx, kpis.length - 1)];

  const handleDetailedView = () => {
    if (assortmentDiveTab === 'kpi') {
      setActiveModal({ isOpen: true, data: selectedKpi?.deepDive });
    } else {
      setAssortmentExpandModal(assortmentDiveTab);
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
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Launch USB-C Hub line</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">Est. $340K monthly revenue opportunity</p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Expand Smart Home range</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">12 competitor SKUs with no match in your catalog</p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Bundle accessories</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">Cross-sell opportunity with existing catalog</p>
              </div>
            </div>
          </div>

          {/* Mobile alerts */}
          <div className="lg:hidden mb-6">
            <ScreenerAlertsPanel />
          </div>

          {/* Priority Gap Actions */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Priority Gap Actions</h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  {Object.keys(gapDetails).map((key) => {
                    const gap = gapDetails[key];
                    const isActive = selectedGap === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedGap(key)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden ${
                          isActive
                            ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 z-10'
                            : 'bg-gray-50/50 dark:bg-slate-800/30 border-transparent hover:bg-white dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${gap.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>
                            {gap.priority}
                          </span>
                          <i className={`fa-solid fa-chevron-right text-sm transition-transform ${isActive ? 'translate-x-1 text-blue-500' : 'text-gray-300'}`}></i>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">{gap.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">{gap.description}</p>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-gray-100 dark:border-slate-700 shadow-inner">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Rev</p>
                            <p className="text-sm font-bold text-green-600">{gap.metrics[0].val}</p>
                          </div>
                          <div className="flex-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-gray-100 dark:border-slate-700 shadow-inner">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Demand</p>
                            <p className="text-sm font-bold text-blue-600">{gap.metrics[2].val}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedGap}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`h-full bg-gradient-to-br from-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-50 to-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-100 dark:from-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-900/10 dark:to-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-900/20 border-2 border-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-200 dark:border-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-800 rounded-3xl p-8 shadow-inner`}
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <span className="px-3 py-1 bg-white/80 dark:bg-slate-900/80 text-gray-900 dark:text-slate-100 rounded-lg text-xs font-black tracking-widest border border-current opacity-60 mb-3 inline-block uppercase italic">
                            Strategic Insight
                          </span>
                          <h4 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight leading-tight">{gapDetails[selectedGap].title}</h4>
                          <p className="text-gray-600 dark:text-slate-400 mt-2 font-medium">{gapDetails[selectedGap].description}</p>
                        </div>
                        <div className={`w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl border border-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-200`}>
                          <i className={`fa-solid ${gapDetails[selectedGap].icon} text-3xl text-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-600`}></i>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {gapDetails[selectedGap].metrics.map((m, i) => (
                          <div key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-white dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className={`text-2xl font-black text-${m.color}-700 dark:text-${m.color}-400`}>{m.val}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 mb-8">
                        <p className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-widest opacity-60">Missing Segments:</p>
                        <div className="space-y-3">
                          {gapDetails[selectedGap].subtypes.map((type, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 rounded-2xl p-4 border border-white/50 dark:border-slate-800/50 hover:bg-white/60 transition-colors">
                              <div className={`w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-${gapDetails[selectedGap].color === 'red' ? 'red' : 'orange'}-600`}>
                                <i className="fa-solid fa-layer-group"></i>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-black text-gray-900 dark:text-slate-200">{type.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">{type.desc}</p>
                              </div>
                              <span className="text-lg font-black text-green-700 dark:text-green-400">{type.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button className="flex-1 px-6 py-4 bg-zinc-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl transition font-black tracking-widest active:scale-95 shadow-xl shadow-zinc-900/20">
                          ADD TO SOURCING
                        </button>
                        <button className="px-6 py-4 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 rounded-2xl transition font-black border border-gray-200 dark:border-slate-800 active:scale-95">
                          <i className="fa-solid fa-download"></i>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </section>
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

            {/* Assortment Gaps deep dive tabs */}
            <DeepDiveTabBar>
              {[
                { key: 'kpi', label: selectedKpi?.shortLabel || 'Gaps' },
                { key: 'gap-summary', label: 'Summary' },
                { key: 'top-gap-categories', label: 'Top Categories' },
                { key: 'gap-distribution', label: 'Distribution' },
                { key: 'gaps-by-category', label: 'By Category' },
                { key: 'competitor-comparison', label: 'Competitors' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setAssortmentDiveTab(key)}
                  className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${
                    assortmentDiveTab === key
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
                {assortmentDiveTab === 'kpi' && (
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
                {assortmentDiveTab === 'gap-summary' && (
                  <div className="p-3 space-y-1.5">
                    {[
                      { label: 'Total Gaps Found', sub: 'Across all categories', val: '127', colorClass: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Critical Priority', sub: 'Immediate action needed', val: '43', colorClass: 'text-indigo-600 dark:text-indigo-400' },
                      { label: 'Revenue Potential', sub: 'If all gaps filled', val: '$2.4M', colorClass: 'text-sky-600 dark:text-sky-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">{item.label}</p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{item.sub}</p>
                        </div>
                        <span className={`text-xs font-bold ml-2 shrink-0 ${item.colorClass}`}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                )}
                {assortmentDiveTab === 'top-gap-categories' && (
                  <div className="p-3 space-y-1.5">
                    {[
                      { icon: 'fa-laptop', label: 'Electronics', sub: '48 missing SKUs', badge: 'Critical', colorClass: 'text-blue-600 dark:text-blue-400', badgeC: 'text-red-600 dark:text-red-400' },
                      { icon: 'fa-blender', label: 'Home & Kitchen', sub: '34 missing SKUs', badge: 'High', colorClass: 'text-indigo-600 dark:text-indigo-400', badgeC: 'text-orange-600 dark:text-orange-400' },
                      { icon: 'fa-basketball', label: 'Sports & Outdoors', sub: '28 missing SKUs', badge: 'High', colorClass: 'text-sky-600 dark:text-sky-400', badgeC: 'text-orange-600 dark:text-orange-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <i className={`fa-solid ${item.icon} text-xs ${item.colorClass} shrink-0`}></i>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">{item.label}</p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{item.sub}</p>
                        </div>
                        <span className={`text-[10px] font-bold ${item.badgeC} shrink-0`}>{item.badge}</span>
                      </div>
                    ))}
                  </div>
                )}
                {assortmentDiveTab === 'gap-distribution' && (
                  <div className="p-3 space-y-2">
                    {[
                      { label: 'Critical', value: 43, sub: '$780K opp.', color: '#F43F5E' },
                      { label: 'High Priority', value: 51, sub: '$620K opp.', color: '#F97316' },
                      { label: 'Medium Priority', value: 23, sub: '$280K opp.', color: '#F59E0B' },
                      { label: 'Low Priority', value: 10, sub: '$120K opp.', color: '#3B82F6' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                          <span className="text-xs font-bold ml-2" style={{ color: item.color }}>{item.value} gaps</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${(item.value / 51) * 100}%`, backgroundColor: item.color }}></div>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                )}
                {assortmentDiveTab === 'gaps-by-category' && (
                  <div className="p-3 space-y-1.5">
                    {[
                      { icon: 'fa-laptop', label: 'Electronics', gaps: 48, opportunity: '$680K', status: 'CRITICAL', statusColor: 'text-red-600 dark:text-red-400' },
                      { icon: 'fa-blender', label: 'Home & Kitchen', gaps: 34, opportunity: '$520K', status: 'HIGH', statusColor: 'text-orange-600 dark:text-orange-400' },
                      { icon: 'fa-basketball', label: 'Sports & Outdoors', gaps: 28, opportunity: '$380K', status: 'MEDIUM', statusColor: 'text-amber-600 dark:text-amber-400' },
                      { icon: 'fa-baby', label: 'Toys & Games', gaps: 17, opportunity: '$220K', status: 'LOW', statusColor: 'text-blue-600 dark:text-blue-400' },
                    ].map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <i className={`fa-solid ${cat.icon} text-gray-500 dark:text-slate-400 text-xs shrink-0`}></i>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">{cat.label}</p>
                            <p className={`text-[10px] font-bold ${cat.statusColor}`}>{cat.gaps} gaps • {cat.status}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 ml-2">{cat.opportunity}</span>
                      </div>
                    ))}
                  </div>
                )}
                {assortmentDiveTab === 'competitor-comparison' && (
                  <div className="p-3 space-y-1.5">
                    {[
                      { label: 'Your Brand', val: 370, icon: 'fa-building', color: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Market Leader', val: 892, icon: 'fa-crown', color: 'text-red-600 dark:text-red-400' },
                      { label: 'TechMaster Pro', val: 542, icon: 'fa-microchip', color: 'text-purple-600 dark:text-purple-400' },
                      { label: 'EliteGadgets', val: 289, icon: 'fa-shield-halved', color: 'text-green-600 dark:text-green-400' },
                    ].map((brand, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <i className={`fa-solid ${brand.icon} text-xs ${brand.color}`}></i>
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{brand.label}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${brand.color}`}>{brand.val}</span>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500">SKUs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {assortmentDiveTab !== 'kpi' && (
                <button
                  onClick={() => setAssortmentExpandModal(assortmentDiveTab)}
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

      {/* Assortment Gaps Deep-Dive Expand Modal */}
      {assortmentExpandModal && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setAssortmentExpandModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <i className={`fa-solid ${
                    assortmentExpandModal === 'gap-distribution' ? 'fa-chart-pie' :
                    assortmentExpandModal === 'gaps-by-category' ? 'fa-layer-group' :
                    assortmentExpandModal === 'gap-summary' ? 'fa-bolt' :
                    assortmentExpandModal === 'top-gap-categories' ? 'fa-ranking-star' :
                    'fa-users'
                  } text-purple-600 dark:text-purple-400 text-sm`}></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">
                  {assortmentExpandModal === 'gap-distribution' ? 'Assortment Gap Distribution' :
                   assortmentExpandModal === 'gaps-by-category' ? 'Gaps by Category' :
                   assortmentExpandModal === 'gap-summary' ? 'Gap Summary' :
                   assortmentExpandModal === 'top-gap-categories' ? 'Top Gap Categories' :
                   'Competitor Assortment Comparison'}
                </h2>
              </div>
              <button
                onClick={() => setAssortmentExpandModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {assortmentExpandModal === 'gap-distribution' && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-4">Gaps by Category</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={assortmentCategoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }} />
                            <Bar dataKey="gaps" radius={[4, 4, 0, 0]} barSize={40}>
                              {assortmentCategoryData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-4">Priority Distribution</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={assortmentPriorityData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {assortmentPriorityData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Critical Gaps', val: 43, sub: '$780K opp.', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800', labelC: 'text-red-600 dark:text-red-400', valC: 'text-red-900 dark:text-red-100', subC: 'text-red-700 dark:text-red-500' },
                      { label: 'High Priority', val: 51, sub: '$620K opp.', bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-200 dark:border-orange-800', labelC: 'text-orange-600 dark:text-orange-400', valC: 'text-orange-900 dark:text-orange-100', subC: 'text-orange-700 dark:text-orange-500' },
                      { label: 'Medium Priority', val: 23, sub: '$280K opp.', bg: 'bg-yellow-50 dark:bg-yellow-900/10', border: 'border-yellow-200 dark:border-yellow-800', labelC: 'text-yellow-600 dark:text-yellow-400', valC: 'text-yellow-900 dark:text-yellow-100', subC: 'text-yellow-700 dark:text-yellow-500' },
                      { label: 'Low Priority', val: 10, sub: '$120K opp.', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-800', labelC: 'text-blue-600 dark:text-blue-400', valC: 'text-blue-900 dark:text-blue-100', subC: 'text-blue-700 dark:text-blue-500' },
                    ].map((item, i) => (
                      <div key={i} className={`${item.bg} border ${item.border} rounded-xl p-4`}>
                        <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${item.labelC}`}>{item.label}</p>
                        <p className={`text-2xl font-bold ${item.valC}`}>{item.val}</p>
                        <p className={`text-xs mt-1 font-medium ${item.subC}`}>{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {assortmentExpandModal === 'gaps-by-category' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                    {[
                      { icon: 'fa-laptop', label: 'Electronics', gaps: 48, coverage: '38%', status: 'CRITICAL', opportunity: '$680K', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800', statC: 'text-red-600 dark:text-red-400' },
                      { icon: 'fa-blender', label: 'Home & Kitchen', gaps: 34, coverage: '62%', status: 'HIGH', opportunity: '$520K', bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-200 dark:border-orange-800', statC: 'text-orange-600 dark:text-orange-400' },
                      { icon: 'fa-basketball', label: 'Sports & Outdoors', gaps: 28, coverage: '71%', status: 'MEDIUM', opportunity: '$380K', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800', statC: 'text-amber-600 dark:text-amber-400' },
                      { icon: 'fa-baby', label: 'Toys & Games', gaps: 17, coverage: '89%', status: 'LOW', opportunity: '$220K', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-800', statC: 'text-blue-600 dark:text-blue-400' },
                    ].map((cat, i) => (
                      <div key={i} className={`${cat.bg} border ${cat.border} rounded-2xl p-5`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                            <i className={`fa-solid ${cat.icon} ${cat.statC} text-base`}></i>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-slate-100 text-sm">{cat.label}</p>
                            <span className={`text-[10px] font-black tracking-widest ${cat.statC}`}>{cat.status}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500 dark:text-slate-400">Missing SKUs</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{cat.gaps}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500 dark:text-slate-400">Coverage</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{cat.coverage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500 dark:text-slate-400">Opportunity</span>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">{cat.opportunity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-4">Gaps by Volume</h3>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assortmentCategoryData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={110} />
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }} />
                          <Bar dataKey="gaps" radius={[0, 4, 4, 0]} barSize={28}>
                            {assortmentCategoryData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {assortmentExpandModal === 'competitor-comparison' && (
                <>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">SKU Count by Brand & Category</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">See how your product range compares to key competitors</p>
                    <div className="h-[360px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assortmentCompetitorData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <RechartsTooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '12px', color: 'var(--tooltip-text)', padding: '12px' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Bar dataKey="yourBrand" name="Your Brand" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="marketLeader" name="Market Leader" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="techMaster" name="TechMaster Pro" fill="#10B981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="eliteGadgets" name="EliteGadgets" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Your Brand', val: 370, icon: 'fa-building', bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20', border: 'border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-600', valC: 'text-blue-600 dark:text-blue-400' },
                      { label: 'Market Leader', val: 892, icon: 'fa-crown', bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-900/20', border: 'border-red-200 dark:border-red-800', iconBg: 'bg-red-600', valC: 'text-red-600 dark:text-red-400' },
                      { label: 'TechMaster Pro', val: 542, icon: 'fa-microchip', bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20', border: 'border-purple-200 dark:border-purple-800', iconBg: 'bg-purple-600', valC: 'text-purple-600 dark:text-purple-400' },
                      { label: 'EliteGadgets', val: 289, icon: 'fa-shield-halved', bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20', border: 'border-green-200 dark:border-green-800', iconBg: 'bg-green-600', valC: 'text-green-600 dark:text-green-400' },
                    ].map((brand, i) => (
                      <div key={i} className={`${brand.bg} border ${brand.border} rounded-2xl p-5 shadow-sm`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 ${brand.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                            <i className={`fa-solid ${brand.icon} text-white`}></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">{brand.label}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total SKUs</p>
                          </div>
                        </div>
                        <p className={`text-3xl font-black ${brand.valC}`}>{brand.val}</p>
                        <div className="mt-3 bg-white/80 dark:bg-slate-900/80 rounded-lg p-2 border border-white dark:border-slate-800 shadow-sm">
                          <span className="text-xs font-bold text-gray-600 dark:text-slate-400">Coverage: </span>
                          <span className={`text-xs font-black ${brand.valC}`}>{Math.round(brand.val / 9.5)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {assortmentExpandModal === 'gap-summary' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Total Gaps Found', sub: 'Across all categories', val: '127', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-800', labelC: 'text-blue-600 dark:text-blue-400', valC: 'text-blue-900 dark:text-blue-100' },
                      { label: 'Critical Priority', sub: 'Immediate action needed', val: '43', bg: 'bg-indigo-50 dark:bg-indigo-900/10', border: 'border-indigo-200 dark:border-indigo-800', labelC: 'text-indigo-600 dark:text-indigo-400', valC: 'text-indigo-900 dark:text-indigo-100' },
                      { label: 'Revenue Potential', sub: 'If all gaps filled', val: '$2.4M', bg: 'bg-sky-50 dark:bg-sky-900/10', border: 'border-sky-200 dark:border-sky-800', labelC: 'text-sky-600 dark:text-sky-400', valC: 'text-sky-900 dark:text-sky-100' },
                    ].map((item, i) => (
                      <div key={i} className={`${item.bg} border ${item.border} rounded-2xl p-6`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${item.labelC}`}>{item.label}</p>
                        <p className={`text-4xl font-black ${item.valC} mb-1`}>{item.val}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Gap Priority Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Critical', value: 43, sub: '$780K opp.', color: '#F43F5E', pct: 34 },
                        { label: 'High Priority', value: 51, sub: '$620K opp.', color: '#F97316', pct: 40 },
                        { label: 'Medium Priority', value: 23, sub: '$280K opp.', color: '#F59E0B', pct: 18 },
                        { label: 'Low Priority', value: 10, sub: '$120K opp.', color: '#3B82F6', pct: 8 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value} gaps</span>
                              <span className="text-xs text-gray-400 dark:text-slate-500">{item.sub}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {assortmentExpandModal === 'top-gap-categories' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { icon: 'fa-laptop', label: 'Electronics', gaps: 48, sub: '48 missing SKUs', status: 'CRITICAL', opportunity: '$680K', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800', statC: 'text-red-600 dark:text-red-400' },
                      { icon: 'fa-blender', label: 'Home & Kitchen', gaps: 34, sub: '34 missing SKUs', status: 'HIGH', opportunity: '$520K', bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-200 dark:border-orange-800', statC: 'text-orange-600 dark:text-orange-400' },
                      { icon: 'fa-basketball', label: 'Sports & Outdoors', gaps: 28, sub: '28 missing SKUs', status: 'HIGH', opportunity: '$380K', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800', statC: 'text-amber-600 dark:text-amber-400' },
                    ].map((cat, i) => (
                      <div key={i} className={`${cat.bg} border ${cat.border} rounded-2xl p-6`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                            <i className={`fa-solid ${cat.icon} ${cat.statC} text-base`}></i>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-slate-100">{cat.label}</p>
                            <span className={`text-[10px] font-black tracking-widest ${cat.statC}`}>{cat.status}</span>
                          </div>
                        </div>
                        <p className={`text-3xl font-black ${cat.statC} mb-1`}>{cat.gaps}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{cat.sub}</p>
                        <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-2 border border-white dark:border-slate-800">
                          <span className="text-xs text-gray-500 dark:text-slate-400">Revenue opportunity: </span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">{cat.opportunity}</span>
                        </div>
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
      />
    </>
  );
};

export default AssortmentGapsTab;
