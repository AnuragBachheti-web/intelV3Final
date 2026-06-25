import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ACTION_LOG_DATA = [
  {
    id: 1,
    date: 'Oct 24, 2023',
    time: '14:22:05',
    title: 'Reprice Top 8 SKU',
    description: 'Automated Price Elasticity Adjustment',
    icon: 'fa-tag',
    kpiRev: '+$124.5k',
    kpiLtv: '+2.4%',
    revPositive: true,
    ltvPositive: true,
    status: 'EXECUTED',
    action: 'ROLL_BACK',
  },
  {
    id: 2,
    date: 'Oct 24, 2023',
    time: '11:05:41',
    title: 'Ad Spend Reallocation',
    description: 'Cross-channel efficiency rebalance',
    icon: 'fa-chart-bar',
    kpiRev: '+$88.2k',
    kpiLtv: '+1.1%',
    revPositive: true,
    ltvPositive: true,
    status: 'EXECUTED',
    action: 'ROLL_BACK',
  },
  {
    id: 3,
    date: 'Oct 23, 2023',
    time: '09:15:00',
    title: 'Stock Clearance Promo',
    description: 'Inventory reduction strategy (High Risk)',
    icon: 'fa-boxes-stacked',
    kpiRev: '-$12.0k',
    kpiLtv: '-0.5%',
    revPositive: false,
    ltvPositive: false,
    status: 'ROLLED BACK',
    action: 'RESTORE',
  },
  {
    id: 4,
    date: 'Oct 22, 2023',
    time: '17:45:12',
    title: 'Dynamic Pricing Beta',
    description: 'ML-driven real-time price updates',
    icon: 'fa-bolt',
    kpiRev: 'N/A',
    kpiLtv: 'N/A',
    revPositive: null,
    ltvPositive: null,
    status: 'FAILED',
    action: 'RETRY',
  },
];

const STATUS_STYLE = {
  'EXECUTED':    { dot: 'bg-green-500', badge: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' },
  'ROLLED BACK': { dot: 'bg-amber-500', badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' },
  'FAILED':      { dot: 'bg-red-500',   badge: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' },
};

const ActionLogPage = () => {
  const [search, setSearch] = useState('');

  const filtered = ACTION_LOG_DATA.filter(item =>
    !search ||
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Action Log"
      subtitle="Track all simulation events and outcomes"
      showTabs={false}
      filters={null}
      showAIPrompt={false}
    >
      <div className="p-6">
        <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Simulation Events
        </p>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Listing</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-gray-300 dark:focus:border-slate-600 transition-colors w-44"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium">
                <i className="fa-solid fa-sliders text-[10px]" />
                Filter
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium">
                <i className="fa-solid fa-sort text-[10px]" />
                Sort
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">Timestamp</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Event Title</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">KPI Impact (Rev / LTV)</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {filtered.map(item => {
                  const st = STATUS_STYLE[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Timestamp */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-700 dark:text-slate-300 font-medium">{item.date}</div>
                        <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{item.time}</div>
                      </td>
                      {/* Event Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-900 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className={`fa-solid ${item.icon} text-white dark:text-slate-200 text-[11px]`} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.title}</div>
                            <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      {/* KPI Impact */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {item.kpiRev === 'N/A' ? (
                          <>
                            <div className="text-xs text-gray-400 dark:text-slate-500">N/A <span className="text-[10px] font-bold">REV</span></div>
                            <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">N/A <span className="text-[10px] font-bold">LTV</span></div>
                          </>
                        ) : (
                          <>
                            <div className={`text-xs font-semibold ${item.revPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                              {item.kpiRev} <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500">REV</span>
                            </div>
                            <div className={`text-xs font-semibold mt-0.5 ${item.ltvPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                              {item.kpiLtv} <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500">LTV</span>
                            </div>
                          </>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${st?.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st?.dot}`} />
                          {item.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {item.action === 'RESTORE' ? (
                          <button className="px-3 py-1.5 bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-700 dark:hover:bg-slate-200 active:scale-[0.98] transition-all">
                            RESTORE
                          </button>
                        ) : (
                          <button className="px-3 py-1.5 bg-white dark:bg-transparent border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all">
                            {item.action === 'ROLL_BACK' ? 'ROLL BACK' : item.action}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-slate-800">
            <span className="text-xs text-gray-400 dark:text-slate-500">
              Showing 1–{Math.min(10, filtered.length)} of 254 products
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-900 dark:text-slate-100 hover:text-gray-700 dark:hover:text-slate-300 font-semibold transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActionLogPage;
