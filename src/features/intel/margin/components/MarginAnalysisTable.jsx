import React from 'react';
import DataTable from '../../../../components/common/DataTable';
import { marginAnalysisData } from '../marginData';

const MarginAnalysisTable = ({ onRowClick }) => {
  const columns = [
    { header: 'Product', key: 'title', bold: true, render: (val, row) => (
      <div>
        <p className="font-bold text-gray-900 dark:text-slate-100">{val}</p>
        <p className="text-[10px] font-mono text-gray-400">{row.sku}</p>
      </div>
    )},
    { header: 'Channel', key: 'channel', render: (val) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
        val === 'Amazon' 
          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' 
          : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
      }`}>
        {val}
      </span>
    )},
    { header: 'Revenue', key: 'revenue', align: 'right', bold: true },
    { header: 'COGS', key: 'cogs', align: 'right' },
    { header: 'Ad Spend', key: 'ads', align: 'right' },
    { header: 'CM2', key: 'cm2', align: 'right', render: (val) => <span className="font-mono font-bold text-gray-700 dark:text-slate-300">{val}</span> },
    { header: 'CM3', key: 'cm3', align: 'right', render: (val) => (
      <span className={`font-bold ${val.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{val}</span>
    )},
    { header: 'Gross %', key: 'gross', align: 'right' },
    { header: 'CM2 %', key: 'cm2pct', align: 'right', bold: true }
  ];

  return (
    <DataTable 
      title="Margin Analysis" 
      subtitle="Comprehensive drill-down by product and channel"
      columns={columns}
      data={marginAnalysisData}
      onRowClick={onRowClick}
    />
  );
};

export default MarginAnalysisTable;
