import React, { useState } from 'react';
import { useAIStore } from '../../../../store/useAIStore';

const InsightCard = ({ card, onSimulate, onReprice, onDismiss, onPlanCapture, onToggleExpand, isExpanded }) => {
  const [showResearch, setShowResearch] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { addAiReference } = useAIStore();

  if (dismissed) return null;

  return (
    <div className={`rounded-2xl border bg-white dark:bg-slate-900/90 p-5 transition-all duration-300 ${isExpanded
        ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40 shadow-lg shadow-blue-100/60 dark:shadow-blue-900/20'
        : 'border-gray-200 dark:border-slate-800 shadow-xs'
      }`}>

      {/* Top Header: SKU / Rule Tag (left), Badges + Expand Arrow (right) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-400 uppercase">
            {card.tagCategory} <span className="text-gray-400">•</span> {card.skuCode}
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-mono text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded bg-stone-50 dark:bg-slate-800">
            {card.ruleId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {card.isActionable && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-800 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-900/40 rounded">
              ACTIONABLE
            </span>
          )}
          {card.actBadge && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/20 rounded">
              {card.actBadge}
            </span>
          )}
          <button
            onClick={onToggleExpand}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors ml-1 ${isExpanded ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            title={isExpanded ? "Close details panel" : "Open details panel"}
          >
            <i className={`fa-solid fa-chevron-right text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Headline */}
      <h4 className="mt-3 text-[14px] font-semibold text-gray-900 dark:text-slate-100 leading-snug font-serif">
        <strong className="font-bold">{card.headline}</strong> {card.headlineHighlight}
      </h4>

      {/* Bottom Action Section */}
      <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Source tags */}
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-400 dark:text-slate-500">
          <span>source</span>
          <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-bold uppercase">
            {card.sourceOwn}
          </span>
          <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-bold uppercase">
            {card.sourceRule}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          <div className="flex items-center gap-1 flex-shrink-0">
            {card.sectionKey === 'pricing_buybox' ? (
              <>
                <div className="relative group flex-shrink-0">
                  <a
                    href={card.amazonUrl || "https://amazon.in"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300 transition-colors"
                  >
                    <i className="fa-brands fa-amazon text-[18px]"></i>
                  </a>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-800 dark:bg-slate-100 text-white dark:text-gray-900 text-[10px] font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                    View on Amazon
                  </div>
                </div>
                <div className="relative group flex-shrink-0">
                  <a
                    href={card.shopifyUrl || "https://shopify.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300 transition-colors"
                  >
                    <i className="fa-brands fa-shopify text-[18px]"></i>
                  </a>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-800 dark:bg-slate-100 text-white dark:text-gray-900 text-[10px] font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                    View on Shopify
                  </div>
                </div>
              </>
            ) : (
              <div className="relative group flex-shrink-0">
                <a
                  href={card.amazonUrl || "https://amazon.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-[30px] h-[30px] text-gray-400 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300 transition-colors"
                >
                  {(card.platform === 'shopify' || card.id % 3 === 0) ? (
                    <i className="fa-brands fa-shopify text-[18px]"></i>
                  ) : (
                    <i className="fa-brands fa-amazon text-[18px]"></i>
                  )}
                </a>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-800 dark:bg-slate-100 text-white dark:text-gray-900 text-[10px] font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                  View on {(card.platform === 'shopify' || card.id % 3 === 0) ? 'Shopify' : 'Amazon'}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onSimulate}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Simulate
          </button>

          {(!card.actionType || card.actionType === 'reprice') && (
            <button
              onClick={onReprice}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              {card.actionLabel || 'Reprice / check eligibility'}
            </button>
          )}

          {card.actionType === 'investigate' && (
            <button
              onClick={() => {
                addAiReference({ title: card.skuCode, value: card.headline });
              }}
              className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              {card.actionLabel}
            </button>
          )}

          {card.actionType === 'plan_capture' && (
            <button
              onClick={onPlanCapture}
              className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              {card.actionLabel}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default InsightCard;
