import React from 'react';
import FilterPanel from './FilterPanel';
import { v2DateLabel, v2CatLabel } from '../detailedViewUtils';

// "Filters" button + applied-filter chips + the dropdown panel itself.
// All state/handlers come from useDetailedViewFilters (passed in as `filters`).
const FilterBar = ({ filters }) => {
  const {
    v2FilterOpen, handleOpenV2Filter, filterPanelPos,
    v2FilterRef, filterBtnRef, chanDropRef, chanDropOpen, setChanDropOpen,
    appliedDate, appliedCats, appliedChans, appliedProducts,
    removeAppliedDate, removeAppliedCats, removeAppliedChan, removeAppliedProducts,
    v2ChanLabel,
  } = filters;

  return (
    <div className="relative flex items-center gap-2" ref={v2FilterRef}>
      <button
        ref={filterBtnRef}
        onClick={handleOpenV2Filter}
        className={`flex items-center gap-1.5 px-3 h-7 rounded-xl border transition-all text-xs font-medium ${v2FilterOpen
          ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
          : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
          }`}
      >
        <i className="fa-solid fa-sliders text-[11px]" />
        Filters
      </button>

      {/* Applied-filter chips — desktop only; mobile shows a count in the panel header instead */}
      <div className="hidden sm:flex items-center gap-2">

      {appliedDate !== null && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
          {v2DateLabel(appliedDate)}
          <button onClick={removeAppliedDate} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
            <i className="fa-solid fa-xmark text-[9px]" />
          </button>
        </span>
      )}
      {appliedCats.length === 1 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
          {v2CatLabel(appliedCats[0])}
          <button onClick={removeAppliedCats} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
            <i className="fa-solid fa-xmark text-[9px]" />
          </button>
        </span>
      )}
      {appliedCats.length > 1 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
          {appliedCats.length} Categories
          <button onClick={removeAppliedCats} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
            <i className="fa-solid fa-xmark text-[9px]" />
          </button>
        </span>
      )}
      {appliedChans.length === 1 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
          {v2ChanLabel(appliedChans[0])}
          <button onClick={() => removeAppliedChan(appliedChans[0])} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
            <i className="fa-solid fa-xmark text-[9px]" />
          </button>
        </span>
      )}
      {appliedChans.length > 1 && (
        <div className="relative" ref={chanDropRef}>
          <button onClick={() => setChanDropOpen(o => !o)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm hover:border-gray-300 dark:hover:border-slate-600 transition">
            Channels <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-200 ${chanDropOpen ? 'rotate-180' : ''}`} />
          </button>
          {chanDropOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1.5 min-w-[160px]">
              {appliedChans.map(ch => (
                <div key={ch} className="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300 flex-1 min-w-0">{v2ChanLabel(ch)}</span>
                  <button onClick={() => removeAppliedChan(ch)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
                    <i className="fa-solid fa-xmark text-[9px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {appliedProducts.length > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
          {appliedProducts.length} Product{appliedProducts.length > 1 ? 's' : ''}
          <button onClick={removeAppliedProducts} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
            <i className="fa-solid fa-xmark text-[9px]" />
          </button>
        </span>
      )}

      </div>

      {v2FilterOpen && <FilterPanel filters={filters} style={{ top: filterPanelPos.top, left: filterPanelPos.left, right: filterPanelPos.right }} />}
    </div>
  );
};

export default FilterBar;
