import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryRightSidebar = ({
  quickFilters,
  modules,
  mostUsedSearches,
  activeFilter = 'all',
  onFilterChange,
  bookmarkCount,
}) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (key) =>
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside
      id="right-sidebar"
      className="hidden xl:flex flex-col w-72 bg-[#f8f9fc] dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 self-stretch shrink-0 z-10 transition-colors duration-300"
    >
      {/* Quick Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800">
        <h2 className="font-medium text-gray-900 dark:text-slate-100 mb-3">Quick Filters</h2>
        <div className="space-y-2">
          {quickFilters.map((filter) => {
            const isActive = filter.id === activeFilter;
            const count = filter.id === 'bookmarked' && bookmarkCount !== undefined
              ? bookmarkCount
              : filter.count;
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange && onFilterChange(filter.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                    : 'hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-sm text-gray-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <i className={`fa-solid ${filter.icon}`}></i>
                  {filter.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gray-100 dark:bg-slate-800'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modules */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800">
        <h2 className="font-medium text-gray-900 dark:text-slate-100 mb-3">Modules</h2>
        <div className="space-y-4">
          {(modules || []).map((mod) => {
            const modKey = mod.key || mod.name.toLowerCase();
            const isCollapsed = !!collapsed[modKey];
            return (
              <div key={mod.name}>
                {/* Module heading row */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <i className={`fa-solid ${mod.icon} text-[10px] text-gray-400 dark:text-slate-500`} />
                  {/* Clicking the label navigates to filtered history */}
                  <button
                    onClick={() => navigate('/history', { state: { moduleFilter: modKey } })}
                    className="flex-1 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {mod.name}
                  </button>
                  {/* Arrow toggles collapse */}
                  <button
                    onClick={() => toggleCollapse(modKey)}
                    className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <i className={`fa-solid fa-chevron-${isCollapsed ? 'down' : 'up'} text-[8px]`} />
                  </button>
                </div>

                {/* Collapsible search list */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pl-3">
                    {mod.searches.map((s, i) => {
                      const text   = typeof s === 'string' ? s : s.text;
                      const chatId = typeof s === 'object' ? s.chatId : null;
                      return (
                        <button
                          key={i}
                          onClick={() =>
                            navigate('/history', {
                              state: { chatId, moduleFilter: modKey },
                            })
                          }
                          className="w-full text-left text-[11px] text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 py-0.5 truncate transition-colors"
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Used Searches */}
      <div className="flex-1 overflow-y-auto p-4 hide-scroll">
        <h2 className="font-medium text-gray-900 dark:text-slate-100 mb-3">Most Used Searches</h2>
        <div className="space-y-2">
          {mostUsedSearches.map((search, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-2">{search.title}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400">Used {search.count} times</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-[#f8f9fc] dark:bg-slate-900">
        <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 rounded-lg p-2.5 text-sm font-medium transition-colors shadow-sm text-gray-700 dark:text-slate-300">
          <i className="fa-solid fa-download"></i>
          <span>Export History</span>
        </button>
      </div>
    </aside>
  );
};

export default HistoryRightSidebar;
