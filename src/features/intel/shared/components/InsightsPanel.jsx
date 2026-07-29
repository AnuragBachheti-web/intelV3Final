import React from 'react';
import SignalsTable from './common/SignalsTable';
import FilterBar from './common/FilterBar';
import { useIntelFilterStore } from '../../../../store/useIntelFilterStore';
import { SIGNALS_BY_TAB } from '../data/insightsDummyData';

/**
 * Actions panel — a single flat table of every action for the active module.
 *
 * No SKU/Category view toggle and no grouping: the table always loads all
 * SKUs and all categories, ranked by score. The filters in FilterBar are the
 * only way to narrow it, and they all default to "All".
 */
const InsightsPanel = ({
  intelTab = 'sales',
  onOpenSimulateModal,
  onOpenTakeActionModal,
  onSelectInsight,
  expandedInsightId,
  isCollapsed = false,
}) => {
  // Connected to session-persistent filter store
  const {
    marketplace,
    categoryCut,
    priceBand,
    priority,
    statusFilter,
    executedSignalIds,
    markSignalExecuted,
  } = useIntelFilterStore();

  const handleTakeAction = (signal) => {
    markSignalExecuted(signal.id);
    if (onOpenTakeActionModal) {
      onOpenTakeActionModal(signal);
    }
  };

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

    // Status Filter (Executed vs Not Executed)
    if (statusFilter === 'executed') {
      if (!executedSignalIds.includes(s.id)) return false;
    } else if (statusFilter === 'not_executed') {
      if (executedSignalIds.includes(s.id)) return false;
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-card dark:shadow-none rounded-xl overflow-hidden flex flex-col h-full font-sans">

      {/* ── 1. Header & Filter Bar ── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 px-4 py-3 border-b border-gray-100 dark:border-slate-800 space-y-2.5">

        <div className="flex items-baseline gap-2">
          <h3 className="text-[20px] font-bold text-gray-900 dark:text-slate-100 tracking-tight">
            Actions
          </h3>
          <span className="font-mono text-[11.5px] text-gray-400 dark:text-slate-500">
            · {sortedSignals.length} signals
          </span>
        </div>

        {/* Signal Filters Bar */}
        <FilterBar />

      </div>

      {/* ── 2. Scrollable actions table — all signals, flat ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
        {sortedSignals.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 dark:text-slate-500 font-mono">
            No signals match active filters. Try adjusting your search or resetting filters.
          </div>
        ) : (
          <SignalsTable
            signals={sortedSignals}
            selectedId={expandedInsightId}
            onSelect={onSelectInsight}
            onSimulate={onOpenSimulateModal}
            onTakeAction={handleTakeAction}
            isCollapsed={isCollapsed}
            executedSignalIds={executedSignalIds}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(InsightsPanel);
