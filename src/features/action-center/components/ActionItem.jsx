import React from 'react';

// Pure lookup — no props/state dependency, safe at module level
const getPriorityConfig = (priority) => {
  switch (priority) {
    case 'CRITICAL': return { bg: 'bg-red-600', iconBg: 'bg-red-100', icon: 'text-red-600' };
    case 'HIGH': return { bg: 'bg-orange-600', iconBg: 'bg-orange-100', icon: 'text-orange-600' };
    case 'MEDIUM': return { bg: 'bg-yellow-600', iconBg: 'bg-yellow-100', icon: 'text-yellow-600' };
    default: return { bg: 'bg-blue-600', iconBg: 'bg-blue-100', icon: 'text-blue-600' };
  }
};

const ActionItem = React.memo(({ action, isSelected, onClick, onSimulate }) => {
  const config = getPriorityConfig(action.priority);

  return (
    <div 
      className={`p-5 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer border-l-4 ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/10 border-brand dark:border-gray-500' : 'border-transparent'
      }`}
      onClick={() => onClick(action)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-10 h-10 ${config.iconBg} dark:bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <i className={`fa-solid ${action.category === 'Payments' ? 'fa-file-invoice-dollar' : action.category === 'Collections' ? 'fa-phone' : 'fa-wallet'} ${config.icon}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-[10px] rounded-lg font-bold uppercase tracking-wider">{action.priority}</span>
              <span className="text-xs text-gray-500 dark:text-slate-500 font-medium">{action.actionId}</span>
              <span className="text-xs text-gray-400 dark:text-slate-600">•</span>
              <span className="text-xs text-gray-500 dark:text-slate-500 font-bold">Due: {action.due}</span>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-1">{action.title}</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">{action.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-medium">{action.category}</span>
              <span className={`px-3 py-1 ${action.priority === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30'} rounded-lg text-xs font-medium border`}>
                <i className={`fa-solid ${action.priority === 'CRITICAL' ? 'fa-exclamation-triangle' : 'fa-clock'} mr-1`}></i>
                {action.timeline}
              </span>
              <button
                className="px-3 py-1 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-gray-200 dark:border-slate-700 transition active:scale-95 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulate(action);
                }}
              >
                <i className="fa-solid fa-flask mr-1 text-[10px]"></i>Simulate
              </button>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition flex-shrink-0 pt-1">
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>
      </div>
    </div>
  );
});

export default ActionItem;
