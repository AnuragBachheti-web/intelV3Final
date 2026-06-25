import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollableTabs from './ScrollableTabs';

const INTEL_TABS = ['All', 'Critical', 'Opportunity', 'Insight', 'Market', 'Review & Alert'];

const INTEL_TAB_MATCHER = {
  'Critical':       item => item.type === 'CRITICAL',
  'Opportunity':    item => item.type === 'OPPORTUNITY',
  'Insight':        item => item.type === 'INSIGHT',
  'Market':         item => item.type === 'MARKET',
  'Review & Alert': item => item.type === 'REVIEW' || item.type === 'ALERT',
};

const INTEL_BADGE_COLORS = {
  'CRITICAL':    'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  'OPPORTUNITY': 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  'INSIGHT':     'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  'MARKET':      'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  'REVIEW':      'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  'ALERT':       'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
};

const INTEL_TYPE_META = {
  'CRITICAL':    { icon: 'fa-solid fa-triangle-exclamation', bg: 'bg-red-100 dark:bg-red-900/30',       color: 'text-red-600 dark:text-red-400' },
  'OPPORTUNITY': { icon: 'fa-solid fa-arrow-trend-up',       bg: 'bg-green-100 dark:bg-green-900/30',   color: 'text-green-600 dark:text-green-400' },
  'INSIGHT':     { icon: 'fa-solid fa-lightbulb',            bg: 'bg-blue-100 dark:bg-blue-900/30',     color: 'text-blue-600 dark:text-blue-400' },
  'MARKET':      { icon: 'fa-solid fa-chart-line',           bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  'REVIEW':      { icon: 'fa-solid fa-eye',                  bg: 'bg-amber-100 dark:bg-amber-900/30',   color: 'text-amber-600 dark:text-amber-400' },
  'ALERT':       { icon: 'fa-solid fa-bell',                 bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
};

const IntelItem = ({ type, title, description, time, impactValue, impactLabel, severityColor, details, tags }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group border-b border-gray-100 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          {(() => {
            const meta = INTEL_TYPE_META[type] || { icon: 'fa-solid fa-circle', bg: 'bg-gray-100 dark:bg-slate-800', color: 'text-gray-500' };
            return (
              <div className={`w-8 h-8 ${meta.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <i className={`${meta.icon} ${meta.color} text-sm`}></i>
              </div>
            );
          })()}
          <div className="text-left flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${INTEL_BADGE_COLORS[type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>{type}</span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">{time}</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-1 leading-snug">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <div className="text-right hidden sm:block">
            <div className="text-[12px] font-bold text-gray-900 dark:text-slate-100">{impactValue}</div>
            <div className="text-[12px] text-gray-500 dark:text-slate-400">{impactLabel}</div>
          </div>
          <motion.i
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="fa-solid fa-chevron-down text-gray-400"
          ></motion.i>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0 bg-gray-50 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800 pt-5 mt-4">
              <div className="border-l-2 border-gray-200 dark:border-slate-700 pl-4">

                {details.stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {details.stats.map((stat, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="text-xs text-gray-500 dark:text-slate-400 mb-1 font-medium">{stat.label}</div>
                        <div className={`text-2xl font-bold ${stat.color || 'text-gray-900 dark:text-slate-100'}`}>{stat.value}</div>
                        <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">{stat.sub}</div>
                      </div>
                    ))}
                  </div>
                )}

                {details.products && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-700 dark:text-slate-300 tracking-wider mb-2">Key Highlights</div>
                    <div className="space-y-2">
                      {details.products.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-slate-800">
                          <span className="text-gray-700 dark:text-slate-300">{p.name}</span>
                          <span className={`font-bold ${p.trendColor}`}>{p.trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {details.analysisList && (
                  <div className="mb-6">
                    <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Detailed Analysis</h5>
                    <div className="space-y-3">
                      {details.analysisList.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <i className={`${item.icon} mt-1 flex-shrink-0`}></i>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.label}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {details.actions.map((action, idx) => (
                    <button key={idx} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      action.customClass
                        ? action.customClass
                        : action.primary
                        ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white'
                        : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}>
                      <i className={`${action.icon} mr-2`}></i>{action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IntelSection = ({ items, title }) => {
  const [viewMode, setViewMode] = useState('text');
  const [activeTab, setActiveTab] = useState('All');

  const displayItems = items || [];

  const filteredItems = activeTab === 'All'
    ? displayItems
    : displayItems.filter(item => INTEL_TAB_MATCHER[activeTab]?.(item) ?? false);

  const btnClass = (mode) =>
    `px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
      viewMode === mode
        ? 'bg-brand text-white shadow-sm dark:bg-gray-600'
        : 'text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
    }`;

  return (
    <section id="recent-intel" className="mt-4 mb-0 h-full">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {title && (
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base">{title}</h3>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">Latest insights and market updates from the past 24 hours</p>
            </div>
          </div>
        )}

        <ScrollableTabs tabs={INTEL_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3">
              <i className="fa-solid fa-inbox text-gray-400 dark:text-slate-500 text-lg"></i>
            </div>
            <p className="text-sm font-semibold text-gray-400 dark:text-slate-500">No data available</p>
            <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">No items for this filter</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="max-h-[420px] overflow-y-auto custom-scrollbar divide-y divide-gray-50 dark:divide-slate-800/50">
            {filteredItems.map(item => {
              const meta = INTEL_TYPE_META[item.type] || { icon: 'fa-solid fa-circle', bg: 'bg-gray-100 dark:bg-slate-800', color: 'text-gray-500' };
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className={`w-7 h-7 ${meta.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`${meta.icon} ${meta.color} text-[11px]`}></i>
                  </div>
                  <h4 className="flex-1 min-w-0 font-semibold text-gray-900 dark:text-slate-100 text-xs truncate">{item.title}</h4>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0">{item.time}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md flex-shrink-0 ${INTEL_BADGE_COLORS[item.type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {item.type}
                  </span>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2 p-3 max-h-[420px] overflow-y-auto custom-scrollbar">
            {filteredItems.map(item => {
              const meta = INTEL_TYPE_META[item.type] || { icon: 'fa-solid fa-circle', bg: 'bg-gray-100 dark:bg-slate-800', color: 'text-gray-500' };
              return (
                <div
                  key={item.id}
                  className="p-3 border border-gray-100 dark:border-slate-800 rounded-xl hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 ${meta.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${meta.icon} ${meta.color} text-[11px]`}></i>
                    </div>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${INTEL_BADGE_COLORS[item.type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {item.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 text-xs leading-snug mb-2">{item.title}</h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.impactValue}</div>
                      {item.impactLabel && <div className="text-[9px] text-gray-400 dark:text-slate-500">{item.impactLabel}</div>}
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto custom-scrollbar divide-y divide-gray-100 dark:divide-slate-800">
            {filteredItems.map(item => (
              <IntelItem key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default IntelSection;
