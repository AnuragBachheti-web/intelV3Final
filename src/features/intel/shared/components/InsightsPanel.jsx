import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InsightCard from './InsightCard';
import {
  INSIGHT_CARDS_DATA,
  INSIGHT_FAMILY_FILTERS,
  INSIGHTS_FEED_METRICS,
} from '../data/insightsDummyData';

const SECTION_DEFINITIONS = [
  { key: 'sales', title: 'Sales', dotColor: 'bg-emerald-500', textDotColor: 'text-emerald-500' },
  { key: 'pricing_buybox', title: 'Pricing & Buy Box', dotColor: 'bg-blue-500', textDotColor: 'text-blue-500' },
  { key: 'demand', title: 'Demand', dotColor: 'bg-emerald-500', textDotColor: 'text-emerald-500' },
  { key: 'opportunity', title: 'Opportunity', dotColor: 'bg-amber-500', textDotColor: 'text-amber-500' },
  { key: 'news_risk', title: 'News & Risk', dotColor: 'bg-red-500', textDotColor: 'text-red-500' },
];

const matchesFilter = (sectionKey, filterKey) => {
  if (filterKey === 'all') return true;
  if (filterKey === 'competitive') return sectionKey === 'pricing_buybox';
  if (filterKey === 'demand') return sectionKey === 'sales' || sectionKey === 'demand';
  if (filterKey === 'opportunity') return sectionKey === 'opportunity';
  if (filterKey === 'news_risk') return sectionKey === 'news_risk';
  return true;
};

const InsightsPanel = ({
  itemViewMode,
  setItemViewMode,
  intelTab = 'sales',
  onOpenSimulateModal,
  onOpenDismissModal,
  onOpenRepriceModal,
  onOpenPlanCaptureModal
}) => {
  const [activeFamilyFilter, setActiveFamilyFilter] = useState('all');
  const [newSinceYesterday, setNewSinceYesterday] = useState(false);
  const navigate = useNavigate();

  // Compute total visible cards count
  const visibleCardsCount = INSIGHT_CARDS_DATA.filter(card =>
    matchesFilter(card.sectionKey, activeFamilyFilter)
  ).length;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#030712] p-4 sm:p-5 border border-gray-200 dark:border-slate-800 space-y-5 mt-4">

      {/* Header Section (SS2, SS3, SS4) */}
      <div className="space-y-3 pb-3 border-b border-gray-100 dark:border-slate-800">

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 font-serif">
              Intelligence feed
            </h3>
            <span className="text-xs font-mono text-gray-400 dark:text-slate-500">
              • {visibleCardsCount} insights & {INSIGHTS_FEED_METRICS.totalSignals} signals
            </span>
          </div>

          {/* List/Grid View mode toggles */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {setItemViewMode && (
              <>
                <button
                  onClick={() => setItemViewMode('list')}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${itemViewMode === 'list'
                    ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
                    : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  title="List view"
                >
                  <i className="fa-solid fa-list text-xs" />
                </button>
                <button
                  onClick={() => setItemViewMode('grid')}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${itemViewMode === 'grid'
                    ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
                    : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  title="Grid view"
                >
                  <i className="fa-solid fa-grip text-xs" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Tabs + Toggle Switch row (SS2, SS3) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Family Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {INSIGHT_FAMILY_FILTERS.map((filter) => {
              const isActive = activeFamilyFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFamilyFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${isActive
                    ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {filter.dotColor && (
                    <span className={`w-2 h-2 rounded-full ${filter.dotColor}`} />
                  )}
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* "New since yesterday" Toggle switch (right side) */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
            <button
              onClick={() => setNewSinceYesterday(o => !o)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${newSinceYesterday ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-700'
                }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${newSinceYesterday ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
              />
            </button>
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
              New since yesterday
            </span>
          </div>
        </div>

      </div>

      {/* Insight Cards Grouped by Section Headings (SS3, SS4, SS5) */}
      <div className="space-y-6">
        {visibleCardsCount === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
            No insights found for this filter.
          </div>
        ) : (
          SECTION_DEFINITIONS.map((section) => {
            if (!matchesFilter(section.key, activeFamilyFilter)) return null;

            const sectionCards = INSIGHT_CARDS_DATA.filter(
              (card) => card.sectionKey === section.key
            );

            if (sectionCards.length === 0) return null;

            return (
              <div key={section.key} className="space-y-3">
                {/* Section Subheading with Count Badge & Timeline Indicator Dot (SS3, SS4, SS5) */}
                <div className="flex items-center gap-2.5 pb-1">
                  <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${section.dotColor} shadow-xs flex-shrink-0`} />
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100 font-serif tracking-tight">
                    {section.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-gray-200/60 dark:border-slate-700/60 font-mono">
                    {sectionCards.length}
                  </span>
                </div>

                {/* Section Cards */}
                <div className={itemViewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
                  {sectionCards.map((card) => (
                    <InsightCard
                      key={card.id}
                      card={card}
                      onSimulate={() => {
                        if (onOpenSimulateModal) {
                          onOpenSimulateModal(card);
                        } else {
                          navigate(`/intel/simulation/${intelTab}`);
                        }
                      }}
                      onReprice={() => {
                        if (onOpenRepriceModal) {
                          onOpenRepriceModal(card);
                        } else {
                          navigate(`/intel/insight/${intelTab}/0`);
                        }
                      }}
                      onDismiss={() => {
                        if (onOpenDismissModal) {
                          onOpenDismissModal(card);
                        }
                      }}
                      onPlanCapture={() => {
                        if (onOpenPlanCaptureModal) {
                          onOpenPlanCaptureModal(card);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default InsightsPanel;
