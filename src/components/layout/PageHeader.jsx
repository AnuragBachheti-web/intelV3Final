import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useFilterStore } from '../../store/useFilterStore';
import SelectInput from '../ui/SelectInput';

const PageHeader = ({ showTabs = true, tabs, filters: customFilters }) => {
  const {
    dateRange, setDateRange,
    country,   setCountry,
    category,  setCategory,
    channel,   setChannel,
  } = useFilterStore();

  const defaultTabs = useMemo(() => [
    { path: '/intel/sales',     label: 'Sales',     icon: 'fa-dollar-sign'   },
    { path: '/intel/margin',    label: 'Margin',    icon: 'fa-chart-line'    },
    { path: '/intel/inventory', label: 'Inventory', icon: 'fa-boxes'         },
    { path: '/intel/ads',       label: 'Ads',       icon: 'fa-bullhorn'      },
    { path: '/intel/cash',      label: 'Cash',      icon: 'fa-money-bill-wave'},
  ], []);

  const activeTabs = tabs || defaultTabs;

  const defaultFilterBar = (
    <div className="flex items-center gap-2 flex-wrap px-4 sm:px-6 py-2.5">
      {[
        {
          value: dateRange, onChange: setDateRange,
          options: [['last-7-days','Last 7 Days'],['last-30-days','Last 30 Days'],['last-90-days','Last 90 Days'],['ytd','Year to Date']],
        },
        {
          value: country, onChange: setCountry,
          options: [['all','All Countries'],['usa','USA'],['uk','UK'],['canada','Canada']],
        },
        {
          value: category, onChange: setCategory,
          options: [['all','All Categories'],['electronics','Electronics'],['home-garden','Home & Garden'],['apparel','Apparel']],
        },
        {
          value: channel, onChange: setChannel,
          options: [['all','All Channels'],['amazon','Amazon'],['shopify','Shopify'],['tiktok-shop','TikTok Shop']],
        },
      ].map((sel, i) => (
        <SelectInput
          key={i}
          value={sel.value}
          onChange={(e) => sel.onChange(e.target.value)}
        >
          {sel.options.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </SelectInput>
      ))}
    </div>
  );

  const filterBar = customFilters !== undefined ? customFilters : (showTabs ? defaultFilterBar : null);

  return (
    <div className="flex-shrink-0 border-b border-gray-200 dark:border-slate-800">
      {showTabs && (
        <div
          id="header-navigation"
          className="flex items-center overflow-x-auto scrollbar-hide px-4 sm:px-6 pt-1 gap-0.5"
        >
          {activeTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end
              className={({ isActive }) =>
                `px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-400 border-brand dark:border-gray-500 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-900/10 font-semibold'
                    : 'text-gray-500 dark:text-slate-400 border-transparent hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-600'
                }`
              }
            >
              <i className={`fa-solid ${tab.icon} mr-1.5 text-[11px]`} />
              {tab.label}
            </NavLink>
          ))}
        </div>
      )}
      {filterBar}
    </div>
  );
};

export default PageHeader;
