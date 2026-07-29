import React from 'react';

/**
 * Rich Executive Brief Card (Master Prompt v7)
 * Header: THE BRIEF
 * Top Row: 3 Metric Callouts (Green Opportunity, Blue SKU Count, Red Risk)
 * Divider Line
 * Bottom Row: 2-sentence plain-English executive summary
 */
const BriefCard = ({ data, isLoading = false }) => {
  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-ws-line dark:border-slate-800 rounded-[14px] p-4 flex flex-col gap-3 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    );
  }

  const formattedOpportunity = typeof data.upsideRevenue === 'number'
    ? `₹${(data.upsideRevenue / 100000).toFixed(2)}L`
    : (data.upsideRevenue || '₹8.95L');

  const formattedExposure = typeof data.totalExposure === 'number'
    ? `₹${(data.totalExposure / 100000).toFixed(2)}L`
    : (data.totalExposure || '₹4.82L');

  const monitoredSkus = data.monitoredSkus || data.signalCount || 128;

  const narrativeText = data.narrative ||
    "Competitor price reduction of 18–22% across 14 top SKUs has eroded Buy Box win rates by 24%. Dynamic repricing to ₹8,499 and restocking 350 FBA units will protect market share and recover ₹4.82L in at-risk revenue.";

  return (
    <div className="bg-white dark:bg-slate-900 border border-ws-line dark:border-slate-800 rounded-[14px] p-4 sm:p-5 text-xs font-sans shadow-card dark:shadow-none space-y-4">
      
      {/* ── Header Title ("THE BRIEF") & System Status Badge ── */}
      <div className="flex items-center justify-between border-b border-ws-hair dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            THE BRIEF
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded">
          {monitoredSkus} SKUs MONITORED
        </span>
      </div>

      {/* ── 3 Metric Callouts ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* 1. Opportunity Projected (Green) */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
            🟢
          </div>
          <div>
            <span className="text-[9.5px] font-mono font-bold text-gray-500 dark:text-slate-400 uppercase block">
              OPPORTUNITY PROJECTED
            </span>
            <strong className="text-base font-mono font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
              {formattedOpportunity}
            </strong>
          </div>
        </div>

        {/* 2. No. of Affected SKUs (Blue / Count) */}
        <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
            🔵
          </div>
          <div>
            <span className="text-[9.5px] font-mono font-bold text-gray-500 dark:text-slate-400 uppercase block">
              AFFECTED SKUs / SIGNALS
            </span>
            <strong className="text-base font-mono font-bold text-gray-900 dark:text-white block mt-0.5">
              {monitoredSkus} SKUs
            </strong>
          </div>
        </div>

        {/* 3. Business at Risk (Red) */}
        <div className="bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
            🔴
          </div>
          <div>
            <span className="text-[9.5px] font-mono font-bold text-gray-500 dark:text-slate-400 uppercase block">
              BUSINESS AT RISK
            </span>
            <strong className="text-base font-mono font-bold text-red-600 dark:text-red-400 block mt-0.5">
              {formattedExposure}
            </strong>
          </div>
        </div>

      </div>

      {/* ── 1px Horizontal Divider Line ── */}
      <div className="h-px bg-ws-hair dark:bg-slate-800" />

      {/* ── 2-Line Executive Summary ── */}
      <p className="text-[13px] text-gray-700 dark:text-slate-200 font-sans leading-relaxed">
        {narrativeText}
      </p>

    </div>
  );
};

export default React.memo(BriefCard);
