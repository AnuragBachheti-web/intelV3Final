import React from 'react';

// Slides in below the sticky header once the main KPI card grid scrolls out
// of view, so the key stats stay visible while browsing tables/charts.
const StickyKpiStrip = ({ kpiIsSticky, statsData, onDashboardClick }) => (
  <div
    className="sticky top-[-24px] z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-[#e0e1e2] dark:bg-[#030712] border-b border-gray-100 dark:border-slate-800 overflow-hidden"
    style={{
      maxHeight: kpiIsSticky ? '76px' : '0',
      opacity: kpiIsSticky ? 1 : 0,
      boxShadow: kpiIsSticky ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
      transition: 'max-height 280ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease-out, box-shadow 280ms ease-out',
    }}
  >
    <div className="flex items-center gap-2 py-3 min-w-0">
      <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {statsData.map((stat, idx) => (
          <div key={idx} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-xl">
            <div>
              <p className="text-[9px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide leading-tight mb-0.5">{stat.title}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight">{stat.value}</p>
                <span className={`text-[9px] font-semibold leading-tight ${stat.isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium whitespace-nowrap">AI View</span>
        <button
          onClick={onDashboardClick}
          className="relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full bg-gray-900 dark:bg-slate-100 transition-colors hover:opacity-80"
        >
          <span className="inline-block h-3 w-3 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-4" />
        </button>
        <span className="text-[10px] font-semibold text-gray-900 dark:text-slate-100 whitespace-nowrap">Dashboard</span>
      </div>
    </div>
  </div>
);

export default StickyKpiStrip;
