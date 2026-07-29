import React, { useState } from 'react';
import { useIntelFilterStore } from '../../../../../store/useIntelFilterStore';

/**
 * FilterBar — Single Row + Inline Expandable Second Row (Master Prompt v5)
 * 
 * Rules:
 * [14D 30D 60D 90D]   [Channel ▾]   [Category ▾]   [More filters ⌄]
 * 
 * Clicking More filters expands INLINE directly beneath the filter bar
 * (Priority Tier, Price Band, Brand, Performance Tier), pushing signal list down naturally.
 * ZERO popups/modals. 100% continuous flat surface.
 */
const FilterBar = () => {
  const [isInlineExpanded, setIsInlineExpanded] = useState(false);

  const {
    timeRange,
    marketplace,
    categoryCut,
    brand,
    priceBand,
    priority,
    performanceTier,
    subCategory,
    setTimeRange,
    setMarketplace,
    setCategoryCut,
    setBrand,
    setPriceBand,
    setPriority,
    setPerformanceTier,
    setSubCategory,
    resetAdvancedFilters,
  } = useIntelFilterStore();

  const activeChips = [];
  if (brand !== 'all') activeChips.push({ label: `Brand: ${brand}`, key: 'brand', clear: () => setBrand('all') });
  if (priceBand !== 'all') activeChips.push({ label: `Price: ${priceBand}`, key: 'priceBand', clear: () => setPriceBand('all') });
  if (priority !== 'all') activeChips.push({ label: `Priority: ${priority}`, key: 'priority', clear: () => setPriority('all') });
  if (performanceTier !== 'all') activeChips.push({ label: `Tier: ${performanceTier}`, key: 'performanceTier', clear: () => setPerformanceTier('all') });
  if (subCategory !== 'all') activeChips.push({ label: `Subcat: ${subCategory}`, key: 'subCategory', clear: () => setSubCategory('all') });

  return (
    <div className="space-y-2">
      {/* ── 1. Single Horizontal Flex Row ── */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide py-0.5">
        <div className="flex items-center gap-2 flex-shrink-0 text-xs">
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg font-mono text-[11px] flex-shrink-0">
            {['14D', '30D', '60D', '90D'].map((tr) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeRange === tr
                    ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-bold shadow-2xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          {/* Channel Selector */}
          <select
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-[11.5px] font-medium text-gray-800 dark:text-slate-200 focus:outline-none flex-shrink-0"
          >
            <option value="all">Channel ▾ (All)</option>
            <option value="amazon">Amazon.in / FBA</option>
            <option value="walmart">Walmart Fulfillment</option>
            <option value="shopify">Shopify Direct</option>
          </select>

          {/* Category Selector */}
          <select
            value={categoryCut}
            onChange={(e) => setCategoryCut(e.target.value)}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-[11.5px] font-medium text-gray-800 dark:text-slate-200 focus:outline-none flex-shrink-0"
          >
            <option value="all">Category ▾ (All)</option>
            <option value="electronics">Electronics</option>
            <option value="home-garden">Home &amp; Garden</option>
            <option value="apparel">Apparel</option>
            <option value="pet">Pet Supplies</option>
            <option value="operations">Operations &amp; Finance</option>
          </select>

        </div>

        {/* Inline Expand Button Toggle */}
        <button
          onClick={() => setIsInlineExpanded(!isInlineExpanded)}
          className={`flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border rounded-lg text-[11.5px] font-semibold transition-colors flex-shrink-0 ${
            isInlineExpanded || activeChips.length > 0
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50'
              : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50'
          }`}
        >
          <i className="fa-solid fa-sliders text-[10px]" />
          <span>More filters</span>
          <i className={`fa-solid fa-chevron-${isInlineExpanded ? 'up' : 'down'} text-[10px]`} />
          {activeChips.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      {/* ── 2. INLINE EXPANDED SECOND ROW (NO POPUPS / MODALS) ── */}
      {isInlineExpanded && (
        <div className="pt-2 pb-1 px-3 bg-gray-50/80 dark:bg-slate-800/50 border border-ws-hair dark:border-slate-700 rounded-xl space-y-2 text-xs font-sans animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Priority Tier */}
            <div>
              <label className="text-[9.5px] font-mono text-gray-500 uppercase block mb-0.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-[11px] font-medium"
              >
                <option value="all">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MED">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Price Band */}
            <div>
              <label className="text-[9.5px] font-mono text-gray-500 uppercase block mb-0.5">Price Band</label>
              <select
                value={priceBand}
                onChange={(e) => setPriceBand(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-[11px] font-medium"
              >
                <option value="all">All Prices</option>
                <option value="under1000">Under ₹1,000</option>
                <option value="above5000">Above ₹5,000</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="text-[9.5px] font-mono text-gray-500 uppercase block mb-0.5">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-[11px] font-medium"
              >
                <option value="all">All Brands</option>
                <option value="Autofy">Autofy Pro</option>
                <option value="Realify">Realify Select</option>
              </select>
            </div>

            {/* Performance Tier */}
            <div>
              <label className="text-[9.5px] font-mono text-gray-500 uppercase block mb-0.5">Performance</label>
              <select
                value={performanceTier}
                onChange={(e) => setPerformanceTier(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-[11px] font-medium"
              >
                <option value="all">All Tiers</option>
                <option value="top20">Top 20%</option>
                <option value="bottom20">Bottom 20%</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              onClick={resetAdvancedFilters}
              className="text-[10.5px] font-semibold text-gray-500 hover:text-gray-900 underline"
            >
              Reset inline filters
            </button>
          </div>
        </div>
      )}

      {/* ── Active Removable Chips Row ── */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 uppercase font-semibold">Active:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-[10.5px] font-mono font-semibold"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.clear}
                className="hover:text-red-600 font-bold ml-0.5 text-[11px]"
                title="Remove filter"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterBar);
