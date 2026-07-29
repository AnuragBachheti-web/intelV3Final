import React, { useState } from 'react';

/**
 * Margin Waterfall Component — Embedded inside Business Health on the Margin Tab
 * Visual breakdown: Revenue → COGS → CM1 → Fees/Ads/Returns → True Profit per Unit (CM2) → Fixed Costs → Net Profit
 */
const MarginWaterfall = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    { label: 'Gross Revenue', value: '₹1.24Cr', pct: '100%', color: 'bg-blue-600', isPositive: true },
    { label: 'COGS (Product Cost)', value: '-₹42.8L', pct: '34.5%', color: 'bg-red-500', isPositive: false },
    { label: 'CM1 (Gross Profit)', value: '₹81.7L', pct: '65.5%', color: 'bg-emerald-600', isPositive: true },
    { label: 'FBA & Logistics Fees', value: '-₹22.4L', pct: '18.0%', color: 'bg-amber-500', isPositive: false },
    { label: 'Ad Dependency (Spend)', value: '-₹10.4L', pct: '8.4%', color: 'bg-orange-500', isPositive: false },
    { label: 'Returns & Claims', value: '-₹9.5L', pct: '7.6%', color: 'bg-rose-500', isPositive: false },
    { label: 'True Profit per Unit (CM2)', value: '₹39.4L', pct: '31.8%', color: 'bg-emerald-600', isPositive: true, isHighlight: true },
    { label: 'Fixed Overheads & Software', value: '-₹14.8L', pct: '11.9%', color: 'bg-[#64748B]', isPositive: false },
    { label: 'Net Profit', value: '₹24.6L', pct: '19.9%', color: 'bg-blue-700', isPositive: true, isFinal: true },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-ws-line dark:border-slate-800 rounded-[14px] overflow-hidden shadow-card dark:shadow-none font-sans mt-3">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors text-xs font-sans"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-bold uppercase text-gray-900 dark:text-white">
            MARGIN WATERFALL BREAKDOWN
          </span>
          <span className="text-gray-400 dark:text-slate-500 text-[11px]">
            · Static Unit Economics Visual (Revenue → True Profit → Net Profit)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            True Profit: 31.8%
          </span>
          <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 text-[10px]`} />
        </div>
      </button>

      {/* Waterfall Content */}
      {isExpanded && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-ws-hair dark:border-slate-800 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  step.isHighlight
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30'
                    : step.isFinal
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 font-bold'
                    : 'border-ws-hair dark:border-slate-800 bg-white dark:bg-slate-800/40'
                }`}
              >
                <span className="text-[9.5px] font-sans text-gray-400 dark:text-slate-400 block truncate">
                  {step.label}
                </span>
                <strong className={`text-[13.5px] font-sans font-bold block mt-1 ${
                  step.isPositive ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
                }`}>
                  {step.value}
                </strong>
                <span className="text-[10px] font-sans text-gray-500 dark:text-slate-400 block mt-0.5">
                  ({step.pct})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MarginWaterfall);
