import { motion } from 'framer-motion';
import React, { useState } from 'react';

const AnomalyItem = ({ id, type, title, description, time, icon, bgColor, iconColor, isGrid, onSelect }) => {
  return (
    <motion.div 
      layout
      onClick={() => onSelect(id)}
      className={`cursor-pointer transition-all ${
        isGrid 
          ? 'p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:shadow-md' 
          : 'p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 last:border-0'
      }`}
    >
      <div className={`flex ${isGrid ? 'flex-col' : 'items-start gap-3'}`}>
        <div className={`flex items-center gap-3 ${isGrid ? 'mb-4' : ''}`}>
          <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <i className={`${icon} ${iconColor} text-lg`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-[10px] rounded-lg font-bold uppercase tracking-wider">{type}</span>
            {isGrid && <h4 className="font-bold text-gray-900 dark:text-slate-100 mt-2 mb-1 truncate">{title}</h4>}
          </div>
        </div>
        {!isGrid && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">#ANM-{id}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{time}</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">{description}</p>
          </div>
        )}
        {isGrid && <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">{description}</p>}
      </div>
    </motion.div>
  );
};

const AnomalySection = ({ items, title, subtitle }) => {
  const [isGrid, setIsGrid] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const anomalies = items || [];
  const displayTitle = title || "Detected Anomalies";
  const displaySubtitle = subtitle || "AI-powered insights into unusual patterns and trends";

  const filteredAnomalies = activeTab === 'All' 
    ? anomalies 
    : anomalies.filter(anm => anm.category === activeTab);

  const tabs = ['All', ...new Set(anomalies.map(r => r.category))];

  return (
    <section id="anomalies" className="mb-8 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">{displayTitle}</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">{displaySubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setIsGrid(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${!isGrid ? 'bg-brand text-white dark:bg-gray-600' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
              <i className="fa-solid fa-list"></i>
            </button>
            <button 
              onClick={() => setIsGrid(true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isGrid ? 'bg-brand text-white dark:bg-gray-600' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
              <i className="fa-solid fa-grip"></i>
            </button>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm border border-gray-200 dark:border-slate-800 transition shadow-sm text-gray-700 dark:text-slate-300">
            <i className="fa-solid fa-filter mr-2"></i>Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 mt-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
            <div className="border-b border-gray-200 dark:border-slate-800 overflow-x-auto">
              <div className="flex items-center gap-2 p-4">
                {tabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-brand text-white dark:bg-gray-600' 
                        : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    {tab} {tab === 'All' ? `(${anomalies.length})` : `(${anomalies.filter(r => r.category === tab).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className={isGrid ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 p-4' : 'divide-y divide-gray-100 dark:divide-slate-800'}>
              {filteredAnomalies.map(anm => (
                <div 
                  key={anm.id}
                  onClick={() => setSelectedId(anm.id)}
                  className={`cursor-pointer transition-colors ${selectedId === anm.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
                >
                  <AnomalyItem {...anm} isGrid={isGrid} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="anomaly-detail" className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky sticky-below-header h-fit">
          {!selectedId ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <i className="fa-solid fa-mouse-pointer text-2xl text-gray-400"></i>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">Select Anomaly</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium px-4">Choose an anomaly from the list to investigate root causes and suggested resolutions.</p>
            </div>
          ) : (
            <div>
              {anomalies.filter(a => a.id === selectedId).map(selected => (
                <div key={selected.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 ${selected.bgColor} rounded-xl flex items-center justify-center`}>
                      <i className={`${selected.icon} ${selected.iconColor} text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-slate-100 text-lg leading-tight">{selected.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">#ANM-{selected.id} • {selected.time}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-magnifying-glass"></i> Root Cause Analysis
                      </h5>
                      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-800">
                        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                          {selected.details?.rootCause || selected.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-clipboard-check"></i> Recommended Resolution
                      </h5>
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100/50 dark:border-blue-900/30">
                        <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed font-medium">
                          {selected.details?.resolution || "Identifying optimized resolution paths based on historical data..."}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-2 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <i className="fa-solid fa-triangle-exclamation"></i> Associated Risks
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic px-1">
                        {selected.details?.risks || "No significant risks identified for this resolution path."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                    <button className="w-full py-3 bg-brand hover:bg-brand-hover text-white dark:bg-gray-600 dark:hover:bg-gray-500 rounded-xl font-bold transition shadow-lg shadow-black/10 dark:shadow-gray-700/20 active:scale-[0.98]">
                      Apply Resolution Plan
                    </button>
                    <button className="w-full mt-3 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl font-bold transition hover:bg-gray-50 dark:hover:bg-slate-800">
                      View Similar Cases
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnomalySection;
