import React, { useState } from 'react';
import { RecommendationItem } from './RecommendationSection';
import ScrollableTabs from './ScrollableTabs';

const CATEGORY_META = {
  'Critical':     { icon: 'fa-solid fa-triangle-exclamation', bg: 'bg-red-100 dark:bg-red-900/30',    color: 'text-red-600' },
  'High Impact':  { icon: 'fa-solid fa-bolt',                 bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600' },
  'Urgent':       { icon: 'fa-solid fa-circle-exclamation',   bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600' },
  'Growth':       { icon: 'fa-solid fa-arrow-trend-up',       bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600' },
  'Retention':    { icon: 'fa-solid fa-rotate',               bg: 'bg-blue-100 dark:bg-blue-900/30',   color: 'text-blue-600' },
  'High':         { icon: 'fa-solid fa-chevron-up',           bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-500' },
  'Medium':       { icon: 'fa-solid fa-minus',                bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600' },
  'Positive':     { icon: 'fa-solid fa-check',                bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600' },
};

const CATEGORY_TO_TAB = {
  'High Impact': 'HIGH',
  'High':        'HIGH',
  'Urgent':      'INFO',
  'Growth':      'INFO',
  'Critical':    'INFO',
  'Retention':   'INFO',
  'Info':        'INFO',
  'Positive':    'INFO',
  'Medium':      'MEDIUM',
  'Low':         'LOW',
};

const BADGE_COLORS = {
  'HIGH':   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'MEDIUM': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'LOW':    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500',
  'INFO':   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const TAB_ICON_COLORS = {
  'HIGH':   { bg: 'bg-red-100 dark:bg-red-900/30',    color: 'text-red-600 dark:text-red-400' },
  'MEDIUM': { bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
  'LOW':    { bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
  'INFO':   { bg: 'bg-green-100 dark:bg-green-900/30',  color: 'text-green-600 dark:text-green-400' },
};

const FIXED_TABS = ['All', 'Info', 'High', 'Medium', 'Low'];

const TAB_MATCHER = {
  'High':   cat => cat === 'High Impact' || cat === 'High',
  'Medium': cat => cat === 'Medium',
  'Info':   cat => ['Info', 'Urgent', 'Growth', 'Critical', 'Retention'].includes(cat),
  'Low':    cat => cat === 'Low',
};

const ActionsPanel = ({
  items = [],
  anomalies = [],
  onItemSelect,
  title = 'Actions',
  subtitle = 'Click to view deep-dive',
}) => {
  const [viewMode, setViewMode] = useState('text');
  const [activeTab, setActiveTab] = useState('All');

  const filterByTab = (tab, source) => {
    if (tab === 'All') return source;
    const match = TAB_MATCHER[tab];
    return match ? source.filter(r => match(r.category)) : source;
  };

  const filteredItems = filterByTab(activeTab, items);
  const filteredAnomalies = filterByTab(activeTab, anomalies);
  const handleSelect = onItemSelect || (() => {});

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base">{title}</h3>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
          <button
            onClick={() => setViewMode('text')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'text' ? 'bg-brand text-white shadow-sm dark:bg-gray-600' : 'text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
          >
            <i className="fa-solid fa-align-left"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-brand text-white shadow-sm dark:bg-gray-600' : 'text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
          >
            <i className="fa-solid fa-list"></i>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-brand text-white shadow-sm dark:bg-gray-600' : 'text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
          >
            <i className="fa-solid fa-grip"></i>
          </button>
        </div>
      </div>

      <ScrollableTabs tabs={FIXED_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {(() => {
        const allFiltered = [...filteredItems, ...filteredAnomalies];
        if (allFiltered.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3">
                <i className="fa-solid fa-inbox text-gray-400 dark:text-slate-500 text-lg"></i>
              </div>
              <p className="text-sm font-semibold text-gray-400 dark:text-slate-500">No data available</p>
              <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">No items for this filter</p>
            </div>
          );
        }
        return null;
      })()}
      {[...filteredItems, ...filteredAnomalies].length > 0 && viewMode === 'list' ? (
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar divide-y divide-gray-50 dark:divide-slate-800/50">
          {[...filteredItems, ...filteredAnomalies].map(item => {
            const tabGroup = CATEGORY_TO_TAB[item.category] || 'INFO';
            const iconStyle = TAB_ICON_COLORS[tabGroup] || {};
            const icon = item.icon || 'fa-solid fa-circle';
            const bg = iconStyle.bg || item.bgColor || 'bg-gray-100 dark:bg-slate-800';
            const color = iconStyle.color || item.iconColor || 'text-gray-600';
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`${icon} ${color} text-[11px]`}></i>
                </div>
                <h4 className="flex-1 min-w-0 font-semibold text-gray-900 dark:text-slate-100 text-xs truncate">{item.title}</h4>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0">{item.time}</span>
              </div>
            );
          })}
        </div>
      ) : [...filteredItems, ...filteredAnomalies].length > 0 ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-2 p-3 bg-white dark:bg-slate-900' : 'bg-white dark:bg-slate-900'} max-h-[420px] overflow-y-auto custom-scrollbar`}>
          {filteredItems.map(rec => {
            const tabGroup = CATEGORY_TO_TAB[rec.category] || 'INFO';
            const iconStyle = TAB_ICON_COLORS[tabGroup] || {};
            return (
              <RecommendationItem
                key={rec.id}
                {...rec}
                bgColor={iconStyle.bg || rec.bgColor}
                iconColor={iconStyle.color || rec.iconColor}
                type={tabGroup}
                viewMode={viewMode}
                onSelect={handleSelect}
                isActive={false}
              />
            );
          })}
          {filteredAnomalies.map(rec => {
            const tabGroup = CATEGORY_TO_TAB[rec.category] || 'INFO';
            const iconStyle = TAB_ICON_COLORS[tabGroup] || {};
            return (
              <RecommendationItem
                key={`anom-${rec.id}`}
                {...rec}
                bgColor={iconStyle.bg || rec.bgColor}
                iconColor={iconStyle.color || rec.iconColor}
                type={tabGroup}
                viewMode={viewMode}
                onSelect={handleSelect}
                isActive={false}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ActionsPanel;
