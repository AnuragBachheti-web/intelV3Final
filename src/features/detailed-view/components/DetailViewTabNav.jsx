import React from 'react';
import { DETAIL_VIEW_TABS } from '../detailedViewData';

// Renders the sales/margin/inventory/ads/cash tab strip. Used both as the
// full-size tab row and (compact=true) as the condensed sticky-header nav.
const DetailViewTabNav = ({ intelType, onTabClick, compact = false }) => (
  <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
    {DETAIL_VIEW_TABS.map(tab => (
      <button
        key={tab.key}
        onClick={() => onTabClick(tab.key)}
        className={`flex-shrink-0 ${compact ? 'px-3 py-1 text-[11px] gap-1' : 'px-4 py-1.5 text-sm gap-1.5'} font-medium transition-colors whitespace-nowrap flex items-center border-b-2 -mb-px ${intelType === tab.key
          ? 'border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-100 font-semibold'
          : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
      >
        <i className={`fa-solid ${tab.icon} ${compact ? 'text-[9px]' : 'text-[11px]'}`} />
        {tab.label}
      </button>
    ))}
  </div>
);

export default DetailViewTabNav;
