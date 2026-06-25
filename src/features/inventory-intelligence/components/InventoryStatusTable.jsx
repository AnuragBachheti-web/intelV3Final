import React from 'react';
import DataTable from '../../../components/common/DataTable';

const InventoryStatusTable = ({ onRowClick }) => {
  const columns = [
    { header: 'Product', key: 'title', bold: true },
    { header: 'Channel', key: 'channel', render: (val) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val === 'Amazon' ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600' : 'bg-green-50 dark:bg-green-950/20 text-green-600'}`}>
        {val}
      </span>
    )},
    { header: 'On-Hand', key: 'onhand', align: 'right', render: (val) => (
      <span className={`font-bold ${parseInt(val) < 50 ? 'text-red-500' : 'text-gray-900 dark:text-slate-100'}`}>{val}</span>
    )},
    { header: 'Inbound', key: 'inbound', align: 'right' },
    { header: 'Velocity 7d', key: 'vel', align: 'right' },
    { header: 'DOC', key: 'doc', align: 'right', render: (val) => (
      <span className={`font-bold ${parseInt(val) < 14 ? 'text-red-500' : parseInt(val) > 180 ? 'text-orange-500' : ''}`}>{val}</span>
    )},
    { header: 'OOS Risk', key: 'risk', align: 'right', render: (val) => (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${parseFloat(val) > 80 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-slate-800 text-gray-600'}`}>
        {val}
      </span>
    )}
  ];

  const data = [
    { title: 'Premium Wireless Headphones', channel: 'Amazon', onhand: '47', inbound: '0', vel: '23/day', doc: '2d', risk: '95%' },
    { title: 'USB-C Hub 7-in-1', channel: 'Amazon', onhand: '82', inbound: '200', vel: '14/day', doc: '6d', risk: '78%' },
    { title: 'Pet Grooming Kit 5-Piece', channel: 'Amazon', onhand: '134', inbound: '0', vel: '11/day', doc: '12d', risk: '62%' },
    { title: 'Organic Pet Food 15lb', channel: 'Shopify', onhand: '890', inbound: '500', vel: '22/day', doc: '40d', risk: '12%' },
    { title: 'Bamboo Cutting Board Set', channel: 'Shopify', onhand: '890', inbound: '0', vel: '4/day', doc: '245d', risk: '0%' },
  ];

  return (
    <DataTable 
      title="Inventory Status" 
      subtitle="247 SKUs · sorted by DOC ascending"
      columns={columns}
      data={data}
      onRowClick={onRowClick}
    />
  );
};

export default InventoryStatusTable;
