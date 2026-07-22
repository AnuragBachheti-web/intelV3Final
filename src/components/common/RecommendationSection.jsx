import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BADGE_COLORS = {
  'Critical':    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'High Impact': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Urgent':      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Growth':      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Retention':   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'High':        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Medium':      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500',
  'Positive':    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const CARD_BG = {
  'Critical':    'bg-red-50/70 dark:bg-red-900/10',
  'High Impact': 'bg-amber-50/70 dark:bg-amber-900/10',
  'Urgent':      'bg-orange-50/70 dark:bg-orange-900/10',
  'Growth':      'bg-green-50/70 dark:bg-green-900/10',
  'Retention':   'bg-blue-50/70 dark:bg-blue-900/10',
  'High':        'bg-orange-50/70 dark:bg-orange-900/10',
  'Medium':      'bg-yellow-50/70 dark:bg-yellow-900/10',
  'Positive':    'bg-green-50/70 dark:bg-green-900/10',
};

export const RecommendationItem = ({ id, type, title, description, time, stats, icon, bgColor, iconColor, viewMode, isGrid, onSelect, isActive, hideMetadata }) => {
  const mode = viewMode || (isGrid ? 'grid' : 'text');

  if (mode === 'grid') {
    return (
      <motion.div
        layout
        onClick={() => onSelect(id)}
        className={`p-3 border rounded-xl hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2 ${
          isActive
            ? 'bg-blue-50/50 dark:bg-blue-955/10 border-blue-400 dark:border-blue-500 shadow-sm'
            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <i className={`${icon} ${iconColor} text-sm`}></i>
          </div>
          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 text-[9px] rounded-md font-bold uppercase tracking-wider">{type}</span>
        </div>
        <h4 className="font-bold text-gray-900 dark:text-slate-100 text-xs leading-snug">{title}</h4>
        <div className="flex items-center justify-between text-[9px] text-gray-400 dark:text-slate-500 font-mono">
          <span>#REC-{id}</span>
          <span>{time}</span>
        </div>
        <div className="flex flex-col gap-1">
          {(stats || []).slice(0, 2).map((stat, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 rounded-lg px-2 py-1">
              <span className="text-[9px] text-gray-500 dark:text-slate-400 font-medium">{stat.label}</span>
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{stat.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (mode === 'listing') {
    return (
      <motion.div
        layout
        onClick={() => onSelect(id)}
        className={`px-4 py-2.5 hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer border-b border-gray-100 dark:border-slate-800/80 last:border-0 ${
          isActive ? 'bg-blue-50/40 dark:bg-blue-955/10 border-l-4 border-l-blue-600 dark:border-l-blue-500 pl-3' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-6 h-6 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <i className={`${icon} ${iconColor} text-[10px]`}></i>
          </div>
          {!hideMetadata && <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-350 text-[9px] rounded-lg font-bold uppercase tracking-wider flex-shrink-0">{type}</span>}
          {!hideMetadata && <span className="text-[10px] text-gray-500 dark:text-slate-455 font-mono flex-shrink-0">#REC-{id}</span>}
          {!hideMetadata && <span className="text-[10px] text-gray-400 dark:text-slate-600 flex-shrink-0">·</span>}
          {!hideMetadata && <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0">{time}</span>}
          <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-xs truncate flex-1 min-w-0">{title}</h4>
        </div>
      </motion.div>
    );
  }

  const cardBg = CARD_BG[type] || '';
  return (
    <motion.div
      layout
      onClick={() => onSelect(id)}
      className={`p-4 transition-colors cursor-pointer border-b border-gray-100 dark:border-slate-800/80 last:border-0 ${cardBg} ${
        isActive ? 'border-l-2 border-l-blue-500 pl-3.5' : ''
      }`}
    >
      {/* Top row: icon + badge + id | time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <i className={`${icon} ${iconColor} text-[11px]`}></i>
          </div>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${BADGE_COLORS[type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>
            {type}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">#REC-{id}</span>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0">{time}</span>
      </div>
      {/* Title */}
      <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm mb-1 leading-snug">{title}</h4>
      {/* Description */}
      <p className="text-[12px] text-gray-500 dark:text-slate-400 leading-relaxed mb-3">{description}</p>
      {/* Stats */}
      {(stats || []).length > 0 && (
        <div className="flex items-center gap-4">
          {(stats || []).map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <span className="text-[13px] font-bold text-gray-900 dark:text-slate-100">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const RecommendationSection = ({ items, title, subtitle }) => {
  const [viewMode, setViewMode] = useState('text');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const recomms = items || [];
  const displayTitle = title || "AI-Powered Recommendations";
  const displaySubtitle = subtitle || "Smart actions to maximize revenue and optimize operations";

  const tabs = ['All', ...new Set(recomms.map(r => r.category))];

  const filteredRecomms = activeTab === 'All'
    ? recomms
    : recomms.filter(r => r.category === activeTab);

  return (
    <section id="ai-recommendations" className="mb-8 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">{displayTitle}</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">{displaySubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('text')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'text' ? 'bg-brand text-white dark:bg-gray-600' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
              <i className="fa-solid fa-align-left"></i>
            </button>
            <button
              onClick={() => setViewMode('listing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'listing' ? 'bg-brand text-white dark:bg-gray-600' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
              <i className="fa-solid fa-list"></i>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-brand text-white dark:bg-gray-600' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
              <i className="fa-solid fa-grip"></i>
            </button>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm border border-gray-200 dark:border-slate-800 transition shadow-sm text-gray-700 dark:text-slate-300">
            <i className="fa-solid fa-filter mr-2"></i>Filter
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm border border-gray-200 dark:border-slate-800 transition shadow-sm text-gray-700 dark:text-slate-300">
            <i className="fa-solid fa-download mr-2"></i>Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
            <div className="border-b border-gray-200 dark:border-slate-800 overflow-x-auto">
              <div className="flex items-center gap-2 p-4">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab
                      ? 'bg-brand text-white dark:bg-gray-600'
                      : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                      }`}
                  >
                    {tab} {tab === 'All' ? `(${recomms.length})` : `(${recomms.filter(r => r.category === tab).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 p-4' : 'divide-y divide-gray-100 dark:divide-slate-800'}>
              {filteredRecomms.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => setSelectedId(rec.id)}
                  className={`cursor-pointer transition-colors ${selectedId === rec.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <RecommendationItem {...rec} viewMode={viewMode} onSelect={setSelectedId} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="recommendation-detail" className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky sticky-below-header h-fit">
          {!selectedId ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <i className="fa-solid fa-sparkles text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">Recommendation Detail</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium px-4">Select a recommendation to view deep-dive analysis and take immediate action.</p>
            </div>
          ) : (
            <div>
              {recomms.filter(r => r.id === selectedId).map(selected => (
                <div key={selected.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 ${selected.bgColor} rounded-xl flex items-center justify-center`}>
                      <i className={`${selected.icon} ${selected.iconColor} text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-slate-100 text-lg leading-tight">{selected.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">#REC-{selected.id} • {selected.time}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-lightbulb"></i> Analysis Insights
                      </h5>
                      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-800">
                        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                          {selected.details?.rootCause || selected.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {(selected.stats || []).map((stat, idx) => (
                        <div key={idx} className="bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-100/50 dark:border-blue-900/30">
                          <div className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-bold tracking-wider mb-1">{stat.label}</div>
                          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-rocket"></i> Implementation Plan
                      </h5>
                      <div className="bg-green-50/30 dark:bg-green-900/10 rounded-xl p-4 border border-green-100/50 dark:border-green-900/30">
                        <p className="text-sm text-green-900 dark:text-green-300 leading-relaxed font-medium">
                          {selected.details?.resolution || "Ready for deployment via AI-agent automation pipeline."}
                        </p>
                      </div>
                    </div>

                    {selected.details?.risks && (
                      <div>
                        <h5 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-2 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <i className="fa-solid fa-shield-halved"></i> Guardrails & Risks
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic px-1">
                          {selected.details.risks}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                    <button className="w-full py-3 bg-brand hover:bg-brand-hover text-white dark:bg-gray-600 dark:hover:bg-gray-500 rounded-xl font-bold transition shadow-lg shadow-black/10 dark:shadow-gray-700/20 active:scale-[0.98] flex items-center justify-center gap-2">
                      <i className="fa-solid fa-bolt"></i> Execute Recommendation
                    </button>
                    <button className="w-full mt-3 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl font-bold transition hover:bg-gray-50 dark:hover:bg-slate-800">
                      Simulate Impact
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

export default RecommendationSection;
