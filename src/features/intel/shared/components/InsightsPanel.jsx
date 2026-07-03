import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActionStore } from '../../../../store/useActionStore';
import { INSIGHTS_BY_INTEL_TAB, INSIGHT_BADGE_COLORS, CATEGORY_KEY_MAP } from '../data/intelUiData';
import { getPriorityDotClass, getInsightKeyMetrics } from '../utils/intelUiUtils';

const InsightsPanel = ({
  activeInsightTab,
  setActiveInsightTab,
  itemViewMode,
  sourceRoute,
  setItemViewMode,
  setStepOffset,
  isEmpty = false,
  isCarouselMode = false,
  intelTab = 'sales',
  selectedCategory = 'all',
  noSidePanel = false,
}) => {
  const [, setCarouselIndex] = useState(0);
  const [, setActiveInsightIdx] = useState(null);
  const [, setSelectedSkuId] = useState(null);
  const [, setSelectedInsightIdx] = useState(null);
  const [, setExpandedCardIdx] = useState(null);
  const [, setSelectedStepId] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [insightViewFilter, setInsightViewFilter] = useState('recent');
  const { executedMap } = useActionStore();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const tabInsights = INSIGHTS_BY_INTEL_TAB[intelTab] || INSIGHTS_BY_INTEL_TAB.sales;
  const insightBlocks = tabInsights['item'] || [];

  const [prevActiveInsightTab, setPrevActiveInsightTab] = useState(activeInsightTab);
  if (activeInsightTab !== prevActiveInsightTab) {
    setPrevActiveInsightTab(activeInsightTab);
    setCarouselIndex(0);
    setActiveInsightIdx(!isCarouselMode && !noSidePanel ? 0 : null);
    setSelectedSkuId(null);
    setSelectedInsightIdx(null);
    setExpandedCardIdx(null);
    setSelectedStepId(null);
    setExpandedIdx(null);
  }

  // Auto-activate the insight matching the selected category (without hiding others)
  const [prevCategoryMatchKey, setPrevCategoryMatchKey] = useState(null);
  const categoryMatchKey = `${selectedCategory}|${activeInsightTab}`;
  if (categoryMatchKey !== prevCategoryMatchKey) {
    setPrevCategoryMatchKey(categoryMatchKey);
    if (activeInsightTab === 'Category' && selectedCategory !== 'all') {
      const matcher = CATEGORY_KEY_MAP[selectedCategory];
      if (matcher) {
        const blocks = tabInsights[activeInsightTab.toLowerCase()] || [];
        const idx = blocks.findIndex(b => matcher(b.heading || ''));
        if (idx !== -1) {
          setActiveInsightIdx(idx);
          setCarouselIndex(idx);
          setStepOffset(0);
        }
      }
    }
  }

  // Scroll the newly-activated matching card into view (DOM sync, not derived state)
  useEffect(() => {
    if (activeInsightTab !== 'Category' || selectedCategory === 'all') return;
    const matcher = CATEGORY_KEY_MAP[selectedCategory];
    if (!matcher) return;
    const blocks = tabInsights[activeInsightTab.toLowerCase()] || [];
    const idx = blocks.findIndex(b => matcher(b.heading || ''));
    if (idx !== -1) {
      setTimeout(() => {
        cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [selectedCategory, activeInsightTab, tabInsights]);

  // Auto-switch to Category tab and scroll when top-level category filter changes
  useEffect(() => {
    if (selectedCategory === 'all') return;
    setActiveInsightTab('Category');
    setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
  }, [selectedCategory, setActiveInsightTab]);

  return (
    <div ref={containerRef} className="rounded-xl bg-white dark:bg-[#030712]">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-[#eeeff0] dark:bg-[#030712]" >
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

      {/* View filter tabs */}
      {!isEmpty && (
        <div className="px-4 pt-3 pb-2.5 flex items-center gap-1 border-b border-gray-100 dark:border-slate-800 bg-[#eeeff0] dark:bg-[#030712]">
          {[
            { key: 'recent',   label: 'Most Recent' },
            { key: 'month',    label: 'This Month'  },
            { key: 'executed', label: 'Executed', count: insightBlocks.filter((_, i) => executedMap[`${intelTab}-item-${i}`]).length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setInsightViewFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                insightViewFilter === tab.key
                  ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[9px] flex items-center justify-center flex-shrink-0">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-3 bg-[#eeeff0] dark:bg-[#030712]">
        {!isEmpty && (() => {
          const allWithIdx = insightBlocks.map((b, i) => ({ ...b, originalIdx: i }));
          const displayBlocks = insightViewFilter === 'recent'
            ? allWithIdx.slice(0, 7)
            : insightViewFilter === 'executed'
            ? allWithIdx.filter(b => executedMap[`${intelTab}-item-${b.originalIdx}`])
            : allWithIdx;
          return (
          <div className={itemViewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
            {displayBlocks.length === 0 && insightViewFilter === 'executed' && (
              <p className="text-xs text-gray-400 dark:text-slate-500 py-4 text-center">No executed insights yet.</p>
            )}
            {displayBlocks.map((block, displayIdx) => {
              const idx = block.originalIdx;
              const isExec = !!executedMap[`${intelTab}-item-${idx}`];
              const execAt = executedMap[`${intelTab}-item-${idx}`];
              return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onClick={() => navigate(`/intel/insight/${intelTab}/${idx}`, { state: { insights: insightBlocks, currentIndex: idx, intelTab, insightTab: 'Item', sourceRoute: sourceRoute || '/intel', executed: isExec, executedAt: execAt || null } })}
                className="cursor-pointer rounded-xl border transition-all p-3 border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${INSIGHT_BADGE_COLORS[block.type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>{block.type}</span>
                    {isExec && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[9px] font-bold">
                        <i className="fa-solid fa-circle-check text-[8px]" /> EXECUTED
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">{block.time}</span>
                  </div>
                  {/* {block.steps?.length > 0 && (
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${getPriorityDotClass(block.type)}`} />
                      <span className="text-[9px] font-semibold text-gray-700 dark:text-slate-300">{block.steps.length}</span>
                    </span>
                  )} */}
                </div>
                <h4 className="text-[13px] font-medium leading-snug text-gray-900 dark:text-slate-100 hover:text-brand dark:hover:text-gray-200 transition-colors flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-[9px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">{displayIdx + 1}</span>
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
                {expandedIdx === idx && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <i className="fa-solid fa-chart-line text-[8px]" /> Key Metrics
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {getInsightKeyMetrics(block, idx).map((m, mi) => (
                        <div key={mi} className="p-2 rounded-lg border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                          <p className="text-[9px] text-gray-400 dark:text-slate-500 mb-0.5">{m.label}</p>
                          <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
          );
        })()}
      </div>
    </div>
  );
};

export default InsightsPanel;
