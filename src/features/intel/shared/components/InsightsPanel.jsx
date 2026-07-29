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

const InsightsPanel = ({
  itemViewMode,
  setItemViewMode,
  intelTab = 'sales',
  onOpenSimulateModal,
  onOpenDismissModal,
  onOpenRepriceModal,
  onOpenPlanCaptureModal,
  onToggleInsightPanel,
  expandedInsightId,
  borderless = false
}) => {
  const navigate = useNavigate();

  // Compute total visible cards count
  const visibleCardsCount = INSIGHT_CARDS_DATA.length;

  return (
    <div className={`space-y-5 h-full flex flex-col min-h-0 ${borderless ? 'p-0' : 'rounded-2xl bg-white dark:bg-[#030712] p-4 sm:p-5 border border-gray-200 dark:border-slate-800'}`}>

      {/* Insight Cards Grouped by Section Headings (SS3, SS4, SS5) */}
      <div className="space-y-6 flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {visibleCardsCount === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
            No insights found.
          </div>
        ) : (
          SECTION_DEFINITIONS.map((section) => {

            const sectionCards = INSIGHT_CARDS_DATA.filter(
              (card) => card.sectionKey === section.key
            );

            if (sectionCards.length === 0) return null;

            return (
              <div key={section.key} className="space-y-3">


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
                      onToggleExpand={() => {
                        if (onToggleInsightPanel) {
                          onToggleInsightPanel(card);
                        }
                      }}
                      isExpanded={expandedInsightId === card.id}
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
