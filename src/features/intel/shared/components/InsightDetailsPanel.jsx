import React, { useState } from 'react';
import { useAIStore } from '../../../../store/useAIStore';

const InsightDetailsPanel = ({ insight, onClose }) => {
  const [showResearch, setShowResearch] = useState(false);
  const { addAiReference } = useAIStore();

  if (!insight) return null;

  return (
    <div className="h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-y-auto custom-scrollbar flex flex-col shadow-sm">
      {/* Header Block */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white font-serif mb-1">Info</h3>
            <span className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-400 uppercase">
              {insight.tagCategory} <span className="text-gray-400">•</span> {insight.skuCode}
            </span>
            <h2 className="text-[15px] text-gray-900 dark:text-white font-serif leading-snug">
              {insight.headline}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors flex-shrink-0"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>
      </div>

      {/* Content Block */}
      <div className="flex-1 px-5 py-4 bg-[#faf9f7] dark:bg-slate-900/50 space-y-6">

        {/* Revenue Status Section */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 dark:text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Monthly Revenue</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-700 dark:text-slate-300">{insight.monthlyRevenue}</span>
              <span className="uppercase">CONFIDENCE • {insight.confidenceLabel}</span>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4].map(dot => (
                  <span
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full ${dot <= insight.confidenceLevel
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
              style={{ width: `${insight.progressPct}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-2">
            WHY THIS MATTERS TO YOU
          </span>
          <div className="bg-stone-50/70 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 rounded-xl p-4 text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-serif">
            {insight.whyMattersText}
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
                {insight.metrics?.velocity || '22.5'}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
              <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-1">
                THRESHOLD
              </span>
              <span className="text-base font-bold text-gray-900 dark:text-slate-100">
                {insight.metrics?.threshold || '15'}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
              <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-1">
                EXPOSURE/MO
              </span>
              <span className="text-base font-bold text-amber-700 dark:text-amber-400">
                {insight.metrics?.exposureMo || '₹20.2L'}
              </span>
            </div>
          </div>
        </div>

        {/* Realify's Read - What To Do Box */}
        <div className="p-4 bg-[#eff4f9] dark:bg-slate-800/60 rounded-xl border border-blue-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
            REALIFY'S READ – WHAT TO DO
          </span>
          <p className="text-xs text-gray-800 dark:text-slate-200 font-medium">
            Review the pulled data and decide whether to act, watch, or source.
          </p>
        </div>

        <div className="flex gap-2">
          {insight.actionType === 'investigate' && (
            <button
              onClick={() => {
                addAiReference({ title: insight.skuCode, value: insight.headline });
              }}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors shadow-xs text-center"
            >
              Investigate
            </button>
          )}

          <button
            onClick={() => setShowResearch(r => !r)}
            className="flex-1 px-4 py-2 bg-black dark:bg-slate-100 text-white dark:text-gray-900 rounded-xl font-bold text-xs flex justify-center items-center gap-2 hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors shadow-xs"
          >
            <i className="fa-solid fa-magnifying-glass text-xs" />
            <span>{showResearch ? 'Hide Research' : 'Research further'}</span>
          </button>
        </div>

        {/* Research Further Deep-Dive Section */}
        {showResearch && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Realify's Context - Market signal */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-slate-500 block mb-2">
                MARKET SIGNAL (PROTOTYPE)
              </span>
              <p className="text-xs text-gray-600 dark:text-slate-400 italic">
                Simulated data: Competitor (SKU-892) ran a 15% off coupon from 8 AM to 2 PM today,
                temporarily suppressing your velocity.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InsightDetailsPanel;
