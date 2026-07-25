import React, { useState } from 'react';

const ActivityDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Log');

  if (!isOpen) return null;

  const mockLogs = [
    {
      id: 1,
      type: 'Case / report',
      time: '10:36:07',
      title: 'No settlement shortfall above threshold right now.',
      desc: 'Realify queried your settled orders, found those where the actual deposit fell short of the expected (gross — referral — FBA fees), summed the recoverable gap, and drafted a case body with the real order IDs. Realify does NOT file the case — you open the Case Log and paste. Every figure here comes from your own order/settlement data.',
      labels: ['DRAFT + DEEP-LINK', 'C8']
    },
    {
      id: 2,
      type: 'Dismissed.',
      time: '10:35:21',
      title: 'Dismissed.',
      desc: 'You dismissed this card. Realify removes it from the feed; the underlying condition is re-checked on the next data pull, so if it recurs it will surface again as a new card.',
      labels: ['INTERNAL', 'SALES-08']
    },
    {
      id: 3,
      type: 'Case / report',
      time: '10:35:21',
      title: 'No settlement shortfall above threshold right now.',
      desc: 'Realify queried your settled orders, found those where the actual deposit fell short of the expected (gross — referral — FBA fees), summed the recoverable gap, and drafted a case body with the real order IDs. Realify does NOT file the case — you open the Case Log and paste. Every figure here comes from your own order/settlement data.',
      labels: ['DRAFT + DEEP-LINK', 'C8']
    },
    {
      id: 4,
      type: 'Case / report',
      time: '10:35:17',
      title: 'No settlement shortfall above threshold right now.',
      desc: 'Realify queried your settled orders, found those where the actual deposit fell short of the expected (gross — referral — FBA fees), summed the recoverable gap, and drafted a case body with the real order IDs. Realify does NOT file the case — you open the Case Log and paste. Every figure here comes from your own order/settlement data.',
      labels: ['DRAFT + DEEP-LINK', 'C8']
    }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[99998] transition-opacity"
        onClick={onClose}
      />

      {/* Right-side sliding drawer */}
      <div className="fixed inset-y-0 right-0 w-[440px] max-w-full bg-[#f6f5f3] dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl z-[99999] flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">
              Activity
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Close drawer"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center px-6 gap-6">
            {['Log', 'Sourcing', 'Watchlist'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-[13px] font-semibold transition-colors relative ${
                  activeTab === tab 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
          {activeTab === 'Log' && (
            mockLogs.map(log => (
              <div key={log.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">{log.type}</h3>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono tracking-wide">{log.time}</span>
                </div>
                <p className="text-[13px] text-gray-800 dark:text-slate-200 font-medium mb-3">
                  {log.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                  {log.desc}
                </p>
                <div className="flex items-center gap-2">
                  {log.labels.map((label, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-[9px] font-bold tracking-widest text-[#d59c5e] uppercase">
                        {label}
                      </span>
                      {idx < log.labels.length - 1 && (
                        <span className="text-[#d59c5e] text-[9px]">&middot;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
          {activeTab === 'Sourcing' && (
            <div className="text-sm text-gray-500 dark:text-slate-400 py-4">No sourcing activity yet.</div>
          )}
          {activeTab === 'Watchlist' && (
            <div className="text-sm text-gray-500 dark:text-slate-400 py-4">No watchlist activity yet.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityDrawer;
