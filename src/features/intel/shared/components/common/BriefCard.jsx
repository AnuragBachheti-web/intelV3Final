import React from 'react';

/**
 * Rich Executive Brief Card (Matches screenshot spec with clean 3-metric row)
 */
const BriefCard = ({ data, isLoading = false }) => {
  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
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
    ? `$${(data.upsideRevenue / 1000).toFixed(1)}K`
    : (data.upsideRevenue || '$89.5K');

  const formattedExposure = typeof data.totalExposure === 'number'
    ? `$${(data.totalExposure / 1000).toFixed(0)}K`
    : (data.totalExposure || '$52K');

  const affectedSkusCount = data.affectedSkusCount || data.signalCount || 14;

  const narrativeLine1 = data.narrativeLine1 ||
    "Autofy clocked ₹18.4L in revenue this month, up 12% MoM, driven largely by mounting accessories, but margin slipped 2.1pp as ad spend outpaced returns.";
  const narrativeLine2 = data.narrativeLine2 ||
    "Three SKUs are flagged at risk, with AF-CABLE-USB losing Buy Box ground to a competitor who undercut price by ₹28.";

  return (
    <div className="bg-white dark:bg-[#030712] border border-gray-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-xs font-sans shadow-sm space-y-3.5">

      {/* ── Header Title ("THE REALIFY BRIEF") ── */}
      <div>
        <span className="text-[10.5px] font-mono font-bold tracking-widest text-gray-500 dark:text-slate-400 uppercase">
          THE BRIEF
        </span>
      </div>

      {/* ── 3 Metrics in single row with vertical dividers (No inner cards) ── */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-slate-800/80">

        {/* 1. Opportunity Projected */}
        <div className="pr-4 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs flex-shrink-0">
            <i className="fa-solid fa-arrow-trend-up text-[11px]" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block">
              OPPORTUNITY PROJECTED
            </span>
            <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block leading-tight mt-0.5">
              {formattedOpportunity}
            </strong>
          </div>
        </div>

        {/* 2. No. of Affected SKUs */}
        <div className="px-4 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs flex-shrink-0">
            <i className="fa-solid fa-clock text-[11px]" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block">
              NO. OF AFFECTED SKUS
            </span>
            <strong className="text-lg font-bold text-gray-900 dark:text-white block leading-tight mt-0.5">
              {affectedSkusCount}
            </strong>
          </div>
        </div>

        {/* 3. Business at Risk */}
        <div className="pl-4 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center text-xs flex-shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-[11px]" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block">
              BUSINESS AT RISK
            </span>
            <strong className="text-lg font-bold text-red-600 dark:text-red-400 block leading-tight mt-0.5">
              {formattedExposure}
            </strong>
          </div>
        </div>

      </div>

      {/* ── 1px Horizontal Divider Line ── */}
      <div className="h-px bg-gray-100 dark:bg-slate-800/80" />

      {/* ── 2-Line Executive Summary ── */}
      <div className="space-y-1 text-[12.5px] text-gray-600 dark:text-slate-300 leading-relaxed font-sans">
        <p>{narrativeLine1}</p>
        <p>{narrativeLine2}</p>
      </div>

    </div>
  );
};

export default React.memo(BriefCard);
