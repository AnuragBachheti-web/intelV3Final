import React from 'react';
import DataTable from '../../../../components/common/DataTable';

const CampaignPerformanceTable = ({ onRowClick }) => {
  const columns = [
    { 
      header: 'Channel', 
      key: 'channel', 
      render: (val) => {
        const colors = {
          'AMZ': 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
          'Google': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
          'Meta': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
        };
        return <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${colors[val] || 'bg-gray-100 text-gray-600'}`}>{val}</span>;
      }
    },
    { header: 'Campaign', key: 'name', bold: true },
    { header: 'Spend', key: 'spend', align: 'right', render: (val) => <span className="font-mono">{val}</span> },
    { header: 'ROAS', key: 'roas', align: 'right' },
    { 
      header: 'M-ROAS', 
      key: 'mroas', 
      align: 'right', 
      render: (val) => {
        const isLow = parseFloat(val) < 1;
        return <span className={`font-bold ${isLow ? 'text-red-600' : 'text-gray-900 dark:text-slate-100'}`}>{val}</span>;
      }
    },
    { 
      header: 'Badges', 
      key: 'badges', 
      align: 'center', 
      render: (badges) => (
        <div className="flex gap-1 justify-center flex-wrap">
          {badges.map((b, i) => {
            const colors = {
              'margin-killer': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
              'low-roas': 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
              'high-spend': 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
              'underspending': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
              'new-campaign': 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400'
            };
            return <span key={i} className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${colors[b] || 'bg-gray-100 text-gray-600'}`}>{b}</span>;
          })}
        </div>
      )
    },
    { 
      header: 'Action', 
      key: 'action', 
      align: 'center', 
      render: (val) => {
        const colors = {
          'Pause': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
          'Reduce': 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
          'Scale': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
          'Increase': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
        };
        return <span className={`px-2 py-1 text-[10px] font-semibold rounded-lg ${colors[val] || 'bg-gray-100 text-gray-600'}`}>{val}</span>;
      }
    }
  ];

  const data = [
    { channel: 'AMZ', name: 'Kitchen Tools SP', spend: '$1,800', roas: '0.8x', mroas: '0.6x', badges: ['margin-killer', 'low-roas'], action: 'Pause' },
    { channel: 'Meta', name: 'Home Decor DSP', spend: '$2,400', roas: '1.1x', mroas: '0.8x', badges: ['margin-killer', 'high-spend'], action: 'Reduce' },
    { channel: 'Google', name: 'Fitness Gear Search', spend: '$1,200', roas: '1.4x', mroas: '1.1x', badges: ['low-roas'], action: 'Investigate' },
    { channel: 'AMZ', name: 'Pet Bed - Sponsored Products', spend: '$4,200', roas: '11.2x', mroas: '8.6x', badges: ['high-spend'], action: 'Scale' },
    { channel: 'AMZ', name: 'Wireless Audio SP', spend: '$3,400', roas: '7.8x', mroas: '6.0x', badges: [], action: 'Healthy' },
    { channel: 'Google', name: 'Home & Living Shopping', spend: '$2,800', roas: '4.6x', mroas: '3.5x', badges: ['underspending'], action: 'Increase' },
    { channel: 'Meta', name: 'Yoga Lifestyle Audience', spend: '$1,600', roas: '2.8x', mroas: '2.1x', badges: ['new-campaign'], action: 'Monitor' },
  ];

  return (
    <DataTable 
      title="Campaign Performance" 
      subtitle="Sorted by Margin-ROAS ascending · worst performers first"
      columns={columns}
      data={data}
      onRowClick={onRowClick}
    />
  );
};

export default CampaignPerformanceTable;
