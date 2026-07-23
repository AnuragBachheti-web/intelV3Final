import React, { useState } from 'react';

const InsightCard = ({ card, onSimulate, onReprice }) => {
  const [expanded, setExpanded] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [askPrompt, setAskPrompt] = useState('');

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
            onClick={() => setExpanded(o => !o)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ml-1"
            title={expanded ? "Collapse card" : "Expand card"}
          >
            <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
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
                  className={`w-1.5 h-1.5 rounded-full ${
                    dot <= card.confidenceLevel
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

      {/* Expanded Content Section (SS3 & SS2) */}
      {expanded && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-2">
              WHY THIS MATTERS TO YOU
            </span>
            <div className="bg-stone-50/70 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded-xl p-4 text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-serif">
              {card.whyMattersText}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-2">
              THE NUMBERS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-1">
                  VELOCITY
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {card.metrics?.velocity || '22.5'}
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-1">
                  THRESHOLD
                </span>
                <span className="text-base font-bold text-gray-900 dark:text-slate-100">
                  {card.metrics?.threshold || '15'}
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-1">
                  EXPOSURE/MO
                </span>
                <span className="text-base font-bold text-amber-700 dark:text-amber-400">
                  {card.metrics?.exposureMo || '₹20.2L'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowResearch(r => !r)}
              className="mt-3 px-4 py-2 bg-black dark:bg-slate-100 text-white dark:text-gray-900 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors shadow-xs"
            >
              <i className="fa-solid fa-magnifying-glass text-xs" />
              <span>{showResearch ? 'Hide Research' : 'Research further'}</span>
            </button>
          </div>

          {/* Research Further Deep-Dive Section (SS2 - Requirement 2) */}
          {showResearch && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              
              {/* 1. Price - 30 Days Line Chart Card */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>PRICE – 30 DAYS</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300">+0.7%</span>
                </div>
                <div className="h-16 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 50" preserveAspectRatio="none">
                    <path
                      d="M 0 35 Q 30 42 60 30 T 120 38 T 180 20 T 240 32 T 300 12 T 360 25 T 400 28"
                      fill="none"
                      stroke="#4a6582"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 2. BSR - 30 Days (Lower = Better) Line Chart Card */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>BSR – 30 DAYS (LOWER = BETTER)</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300">#14,277</span>
                </div>
                <div className="h-16 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 50" preserveAspectRatio="none">
                    <path
                      d="M 0 38 Q 40 28 80 22 T 160 35 T 220 18 T 280 32 T 340 15 T 400 10"
                      fill="none"
                      stroke="#5f8c63"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 3. Realify's Read - What To Do Box */}
              <div className="p-4 bg-[#eff4f9] dark:bg-slate-800/60 rounded-xl border border-blue-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                  REALIFY'S READ – WHAT TO DO
                </span>
                <p className="text-xs text-gray-800 dark:text-slate-200 font-medium">
                  Review the pulled data and decide whether to act, watch, or source.
                </p>
              </div>

              {/* 4. Ask Prompt Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={askPrompt}
                  onChange={(e) => setAskPrompt(e.target.value)}
                  placeholder="Ask about this card... e.g. which SKU should I source first?"
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-800 dark:text-slate-100 outline-none focus:border-blue-500 transition-all placeholder:text-gray-400"
                />
                <button className="px-5 py-2.5 bg-[#3a5d7c] hover:bg-[#2d4962] text-white font-bold text-xs rounded-xl transition-colors shadow-xs">
                  Ask
                </button>
              </div>

            </div>
          )}
        </div>
      )}

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
            onClick={() => setDismissed(true)}
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
          <button
            onClick={onReprice}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Reprice
          </button>
        </div>
      </div>

    </div>
  );
};

export default InsightCard;
