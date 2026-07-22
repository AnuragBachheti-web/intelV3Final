import React from 'react';
import BaseModal from './BaseModal';
import BaseAreaChart from './charts/BaseAreaChart';

const ChartModal = ({ chart, onClose }) => (
  <BaseModal isOpen={!!chart} onClose={onClose}>
    <div
      className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-[1.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{chart?.title}</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{chart?.value}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="h-[480px] p-8">
        {chart && (
          <BaseAreaChart
            data={chart.data}
            yAxisFormatter={chart.fmt}
            tooltipFormatter={(v, n) => [chart.fmt(v), n]}
            areas={[{ key: chart.dataKey, name: chart.title, color: chart.color }]}
          />
        )}
      </div>
    </div>
  </BaseModal>
);

export default ChartModal;
