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
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
        {visibleCardsCount === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-slate-500">
            No insights found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200 dark:border-slate-800">
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Affected Sku</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Impact amount</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
              {INSIGHT_CARDS_DATA.map((card) => {
                const isExpanded = expandedInsightId === card.id;
                return (
                  <tr 
                    key={card.id} 
                    onClick={() => {
                      if (onToggleInsightPanel) onToggleInsightPanel(card);
                    }}
                    className={`cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'}`}
                  >
                    <td className="p-4 align-top w-2/5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{card.headline}</span>
                        {card.headlineHighlight && (
                          <span className="text-xs text-gray-600 dark:text-slate-400">{card.headlineHighlight}</span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-sans tracking-wider text-gray-400 uppercase">{card.tagCategory}</span>
                          <span className="px-1.5 py-0.5 text-[9px] font-sans text-gray-500 bg-gray-100 dark:bg-slate-800 rounded">{card.ruleId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{card.skuCode}</span>
                    </td>
                    <td className="p-4 align-top">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 capitalize">
                        {card.category}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{card.monthlyRevenue}</span>
                    </td>
                    <td className="p-4 align-top text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (card.sectionKey === 'sales') {
                            if (onOpenSimulateModal) onOpenSimulateModal(card);
                            else navigate(`/intel/simulation/${intelTab}`);
                          } else if (card.sectionKey === 'pricing_buybox') {
                            if (onOpenRepriceModal) onOpenRepriceModal(card);
                            else navigate(`/intel/insight/${intelTab}/0`);
                          } else {
                            if (onOpenPlanCaptureModal) onOpenPlanCaptureModal(card);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-sm inline-flex items-center justify-center
                          ${card.sectionKey === 'sales' ? 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700' :
                          card.sectionKey === 'pricing_buybox' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                          'bg-amber-700 text-white hover:bg-amber-800'}`}
                      >
                        {card.sectionKey === 'sales' ? 'Investigate' : 
                         card.sectionKey === 'pricing_buybox' ? 'Reprice / check eligibility' : 
                         'Plan capture'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
