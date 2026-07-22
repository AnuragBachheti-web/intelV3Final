import React from 'react';

const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
      <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{title}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

export default ChartCard;
