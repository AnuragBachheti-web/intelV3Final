import React, { useState } from 'react';
import InsightCard from './InsightCard';
import FilterBar from './common/FilterBar';
import { useIntelFilterStore } from '../../../../store/useIntelFilterStore';
import { SIGNALS_BY_TAB } from '../data/insightsDummyData';

const InsightsPanel = ({
  intelTab = 'sales',
  onOpenSimulateModal,
  onOpenTakeActionModal,
  onSelectInsight,
  expandedInsightId,
}) => {
  const [viewMode, setViewMode] = useState('flat'); // 'flat' | 'category'
  const [visibleLimit, setVisibleLimit] = useState(10);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Connected to session-persistent filter store
  const {
    marketplace,
    categoryCut,
    priceBand,
    priority,
  } = useIntelFilterStore();

  const tabKey = intelTab === 'revenue' ? 'sales' : (intelTab || 'sales');
  const rawSignals = SIGNALS_BY_TAB[tabKey] || SIGNALS_BY_TAB.sales;

  // Filter signals based on exposure guardrail (>= 1,000) AND active filters
  const filteredSignals = rawSignals.filter((s) => {
    if ((s.exposure || 0) < 1000) return false;

    // Marketplace Filter
    if (marketplace !== 'all' && (s.sourceOwn || '').toLowerCase() !== marketplace.toLowerCase()) {
      return false;
    }

    // Category Cut Filter
    if (categoryCut !== 'all') {
      const catLower = (s.category || s.tagCategory || '').toLowerCase();
      if (!catLower.includes(categoryCut.toLowerCase())) return false;
    }

    // Priority Filter
    if (priority !== 'all' && s.priority !== priority) return false;

    // Price Band Filter
    if (priceBand === 'under1000' && (s.exposure || 0) >= 100000) return false;
    if (priceBand === 'above5000' && (s.exposure || 0) < 500000) return false;

    return true;
  });

  // Sort signals by Score descending (Prioritization Formula)
  const sortedSignals = [...filteredSignals].sort((a, b) => (b.score || 0) - (a.score || 0));

  // Category View Grouping
  const categoryGroups = sortedSignals.reduce((acc, signal) => {
    const catName = signal.category || 'General Electronics';
    if (!acc[catName]) {
      acc[catName] = {
        name: catName,
        signals: [],
        criticalCount: 0,
        watchCount: 0,
        oppCount: 0,
        totalRevenue: 0,
      };
    }
    acc[catName].signals.push(signal);
    acc[catName].totalRevenue += signal.exposure || 0;
    if (signal.priority === 'HIGH' || signal.urgency === 'HIGH') acc[catName].criticalCount += 1;
    else if (signal.priority === 'MED' || signal.urgency === 'MED') acc[catName].watchCount += 1;
    else acc[catName].oppCount += 1;
    return acc;
  }, {});

  const categoryList = Object.values(categoryGroups);
  const topCategoryName = categoryList[0]?.name;

  const toggleCategoryExpand = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  // Flat View Partitioning (Level 1 max 10 initial signals)
  const limitedSignals = sortedSignals.slice(0, visibleLimit);
  const topFirstAction = limitedSignals.slice(0, 1);
  const alsoImportant = limitedSignals.slice(1, 5);
  const otherSignals = limitedSignals.slice(5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-card dark:shadow-none rounded-xl overflow-hidden flex flex-col h-full font-sans">

      {/* ── 1. Filter Bar & View Mode Toggle (Placed In Original Location Above AI Signals Stream) ── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 px-4 py-3 border-b border-gray-100 dark:border-slate-800 space-y-2.5">
        
        {/* Header & View Mode Switcher */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-[20px] font-bold text-gray-900 dark:text-slate-100 tracking-tight">
              Actions
            </h3>
            <span className="font-mono text-[11.5px] text-gray-400 dark:text-slate-500">
              · {sortedSignals.length} signals
            </span>
          </div>

          {/* Flat View vs Category View Mode Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono font-semibold">
            <button
              onClick={() => setViewMode('flat')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'flat'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-2xs font-bold'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                }`}
            >
              <i className="fa-solid fa-list text-[10px]" />
              <span>Sku</span>
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${viewMode === 'category'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-2xs font-bold'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                }`}
            >
              <i className="fa-solid fa-layer-group text-[10px]" />
              <span>Category</span>
            </button>
          </div>
        </div>

        {/* Signal Filters Bar */}
        <FilterBar />

      </div>

      {/* ── 2. Scrollable Signal Cards Stream ── */}
      <div className="flex-1 p-3.5 overflow-y-auto custom-scrollbar space-y-3.5 bg-white dark:bg-slate-900 text-xs">
        {sortedSignals.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500 font-mono">
            No signals match active filters. Try adjusting your search or resetting filters.
          </div>
        ) : viewMode === 'flat' ? (
          /* ── FLAT VIEW (DEFAULT) ── */
          <>
            {/* RECOMMENDED FIRST ACTION (Top 1) */}
            {topFirstAction.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10.5px] font-mono font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    RECOMMENDED FIRST ACTION
                  </span>
                  <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/40">
                    RANK #1
                  </span>
                </div>
                {topFirstAction.map((signal) => (
                  <InsightCard
                    key={signal.id}
                    card={signal}
                    isSelected={expandedInsightId === signal.id}
                    onSelect={() => onSelectInsight && onSelectInsight(signal)}
                    onSimulate={() => onOpenSimulateModal && onOpenSimulateModal(signal)}
                    onTakeAction={() => onOpenTakeActionModal && onOpenTakeActionModal(signal)}
                  />
                ))}
              </div>
            )}

            {/* ALSO IMPORTANT (Top 2 to 5) */}
            {alsoImportant.length > 0 && (
              <div className="space-y-2 pt-2.5 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10.5px] font-mono font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    ALSO IMPORTANT ({alsoImportant.length})
                  </span>
                  <span className="text-[9.5px] font-mono text-gray-400 dark:text-slate-500">RANKS #2–#5</span>
                </div>
                <div className="space-y-2.5">
                  {alsoImportant.map((signal) => (
                    <InsightCard
                      key={signal.id}
                      card={signal}
                      isSelected={expandedInsightId === signal.id}
                      onSelect={() => onSelectInsight && onSelectInsight(signal)}
                      onSimulate={() => onOpenSimulateModal && onOpenSimulateModal(signal)}
                      onTakeAction={() => onOpenTakeActionModal && onOpenTakeActionModal(signal)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* OTHER SIGNALS (Rest) */}
            {otherSignals.length > 0 && (
              <div className="pt-2.5 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase px-0.5">
                  <span>OTHER SIGNALS ({otherSignals.length})</span>
                </div>
                {otherSignals.map((signal) => (
                  <InsightCard
                    key={signal.id}
                    card={signal}
                    isSelected={expandedInsightId === signal.id}
                    onSelect={() => onSelectInsight && onSelectInsight(signal)}
                    onSimulate={() => onOpenSimulateModal && onOpenSimulateModal(signal)}
                    onTakeAction={() => onOpenTakeActionModal && onOpenTakeActionModal(signal)}
                  />
                ))}
              </div>
            )}

            {/* Level 1: Show N More Pagination */}
            {sortedSignals.length > visibleLimit && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 5)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 transition-colors"
                >
                  Show {sortedSignals.length - visibleLimit} More Signals...
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── CATEGORY VIEW ── */
          <div className="space-y-3">
            {categoryList.map((catGroup) => {
              const isExpanded = expandedCategories[catGroup.name] ?? (catGroup.name === topCategoryName);
              return (
                <div
                  key={catGroup.name}
                  className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                >
                  {/* Category Header Bar */}
                  <div
                    onClick={() => toggleCategoryExpand(catGroup.name)}
                    className="w-full px-3.5 py-3 bg-gray-50/70 dark:bg-slate-800/60 hover:bg-gray-100/70 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <i className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'right'} text-[10px] text-gray-400`} />
                      <h4 className="text-[13px] font-bold text-gray-900 dark:text-white truncate">
                        {catGroup.name}
                      </h4>
                      <span className="text-[11px] font-mono text-gray-400">
                        ({catGroup.signals.length})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {catGroup.criticalCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 rounded text-[9.5px] font-mono font-bold">
                          {catGroup.criticalCount} Critical
                        </span>
                      )}
                      <span className="font-mono text-[11.5px] font-bold text-gray-900 dark:text-white">
                        ₹{(catGroup.totalRevenue / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>

                  {/* Expanded Category Signals */}
                  {isExpanded && (
                    <div className="p-3 space-y-2.5 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                      {catGroup.signals.map((signal) => (
                        <InsightCard
                          key={signal.id}
                          card={signal}
                          isSelected={expandedInsightId === signal.id}
                          onSelect={() => onSelectInsight && onSelectInsight(signal)}
                          onSimulate={() => onOpenSimulateModal && onOpenSimulateModal(signal)}
                          onTakeAction={() => onOpenTakeActionModal && onOpenTakeActionModal(signal)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(InsightsPanel);
