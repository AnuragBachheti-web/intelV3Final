import React from 'react';

// Small icon-only filter trigger shown in the sticky/compact header once the
// page has scrolled past the full <FilterBar>. Shares state via `filters`.
const CompactFilterButton = ({ filters }) => {
  const { v2FilterOpen, handleOpenV2Filter, compactFilterRef } = filters;
  return (
    <div className="relative" ref={compactFilterRef}>
      <button
        onClick={handleOpenV2Filter}
        className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all ${
          v2FilterOpen
            ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
            : 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <i className="fa-solid fa-sliders text-[10px]" />
      </button>
    </div>
  );
};

export default CompactFilterButton;
