import React, { useState } from 'react';
import { useAIStore } from '../../../../store/useAIStore';

const InsightCard = ({ card, onSimulate, onReprice, onDismiss, onPlanCapture, onToggleExpand, isExpanded }) => {
  const [showResearch, setShowResearch] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { addAiReference } = useAIStore();

  if (dismissed) return null;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs transition-all duration-300">

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

      {/* Revenue Status Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-slate-500 mb-1">
          <span className="uppercase tracking-wider">YOUR MONTHLY REVENUE ON THIS SKU</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700 dark:text-slate-300">{card.monthlyRevenue}</span>
            <span className="uppercase">CONFIDENCE • {card.confidenceLabel}</span>
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4].map(dot => (
                <span
                  key={dot}
                  className={`w-1.5 h-1.5 rounded-full ${dot <= card.confidenceLevel
                    ? 'bg-gray-800 dark:bg-slate-200'
                    : 'bg-gray-200 dark:bg-slate-700'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Status progress bar */}
        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${card.progressPct}%` }}
          />
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <a
            href={card.amazonUrl || "https://amazon.in"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            View on Amazon
          </a>
          <button
            onClick={onDismiss || (() => setDismissed(true))}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Dismiss
          </button>
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
