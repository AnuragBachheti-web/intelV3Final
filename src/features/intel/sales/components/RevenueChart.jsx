import React from 'react';
import BaseAreaChart from '../../../../components/common/charts/BaseAreaChart';
import { SEMANTIC_COLORS } from '../../../../utils/chartColors';
import { revenueTrendData } from '../salesData';
import { formatCompactNumber } from '../../../../utils/formatters';

const RevenueChart = ({ darkMode }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Revenue Trend Analysis</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">7-day moving average with predictive forecast</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm font-medium shadow-sm dark:bg-gray-600">Daily</button>
          <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium transition">Weekly</button>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <BaseAreaChart 
          data={revenueTrendData}
          darkMode={darkMode}
          yAxisFormatter={(val) => `$${val/1000}k`}
          tooltipFormatter={(val, name) => [`$${formatCompactNumber(val)}`, name]}
          areas={[
            { key: 'revenue', name: 'Revenue', color: SEMANTIC_COLORS.revenue },
            { key: 'forecast', name: 'Forecast', color: SEMANTIC_COLORS.forecast, strokeWidth: 2, strokeDasharray: "5 5", fill: 'none' }
          ]}
        />
      </div>
    </div>
  );
};

export default RevenueChart;
