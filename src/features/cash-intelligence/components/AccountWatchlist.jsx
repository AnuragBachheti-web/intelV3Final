import React from 'react';

const AccountWatchlist = ({ watchlist, title, actionButtons }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{title || "Account Watchlist"}</h3>
        {actionButtons && (
          <div className="flex items-center gap-2">
            {actionButtons}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {watchlist.map((item, idx) => (
          <div key={idx} className={`p-4 bg-gradient-to-br ${item.bgGradient} rounded-xl border ${item.borderColor}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <i className={`fa-solid ${item.icon} text-2xl ${item.iconColor}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">{item.title}</h4>
                  <span className={`px-2 py-1 ${item.statusColor} text-xs rounded-lg font-bold shadow-sm flex-shrink-0 ml-2`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-400">{item.account}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Balance</p>
                <p className={`text-lg font-bold ${item.status === 'LOW' ? 'text-cb-900' : item.status === 'HEALTHY' ? 'text-cb-600' : 'text-cb-700'}`}>
                  {item.balance}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{item.trendLabel}</p>
                <p className={`text-lg font-bold ${item.trendColor}`}>{item.trend}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div className={`h-full ${item.progressColor} rounded-full`} style={{ width: `${item.progress}%` }}></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">{item.message}</p>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
        <i className="fa-solid fa-plus mr-2"></i>Add Account
      </button>
    </div>
  );
};

export default AccountWatchlist;
