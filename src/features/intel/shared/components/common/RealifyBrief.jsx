import React from "react";

const RealifyBrief = () => {
  return (
    <div className="mb-5 bg-white dark:bg-[#030712] border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header Strip */}
      <div className="px-4 py-2 bg-gray-50/80 dark:bg-slate-800/30 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-slate-400">The Realify Brief</span>
        </div>
        <span className="text-[9px] font-mono text-gray-400 dark:text-slate-500 uppercase tracking-wider">Live System Analysis</span>
      </div>

      {/* Metrics Row */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Primary Metric */}
        <div className="flex items-center gap-4 min-w-max">
          <div className="w-1 h-10 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
          <div>
            <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-0.5">Total Recoverable</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">£482,750</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-slate-800"></div>

        {/* Detailed Breakdown */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 text-[11px] text-gray-600 dark:text-slate-400">

          <div className="flex flex-col gap-1">
            <span className="uppercase text-[9px] font-bold text-gray-400 tracking-wider">Opportunity</span>
            <div className="flex items-center justify-between">
              <span>Confirmed</span>
              <strong className="text-gray-900 dark:text-white">£431k</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated</span>
              <strong className="text-gray-900 dark:text-white">£52k</strong>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="uppercase text-[9px] font-bold text-gray-400 tracking-wider">Upside Target</span>
            <div className="flex items-center justify-between">
              <span>Revenue</span>
              <strong className="text-gray-900 dark:text-white">£895k</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Margin</span>
              <strong className="text-gray-900 dark:text-white">£275k</strong>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="uppercase text-[9px] font-bold text-gray-400 tracking-wider">Scope</span>
            <div className="flex items-center justify-between">
              <span>Active SKUs</span>
              <strong className="text-gray-900 dark:text-white">128</strong>
            </div>
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-500 font-medium">
              <span>Top 12 Focus</span>
              <span>76%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="uppercase text-[9px] font-bold text-gray-400 tracking-wider">Identified Signals</span>
            <div className="flex items-center justify-between">
              <span>Stock Risks</span>
              <strong className="text-amber-600 dark:text-amber-500">14</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Ads & Threats</span>
              <strong className="text-blue-600 dark:text-blue-400">36</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RealifyBrief;