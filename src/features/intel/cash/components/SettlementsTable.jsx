import React from 'react';
import DataTable from '../../../../components/common/DataTable';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import { settlementsData } from '../cashData';

const SettlementsTable = () => {
  const columns = [
    { header: 'Date', key: 'date', bold: true },
    { header: 'Marketplace', key: 'marketplace' },
    { 
      header: 'Gross', 
      key: 'gross', 
      align: 'right', 
      className: 'font-mono' 
    },
    { 
      header: 'Total Fees', 
      key: 'fees', 
      align: 'right', 
      className: 'font-mono text-gray-500' 
    },
    { 
      header: 'Net', 
      key: 'net', 
      align: 'right', 
      bold: true,
      className: 'font-mono' 
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'Processing' ? 'processing' : 'primary'}>
          {val}
        </Badge>
      )
    },
    { 
      header: 'Reconciliation', 
      key: 'reconciliation',
      align: 'center',
      render: (val) => {
        const isWarning = val.includes('⚠');
        return (
          <span className={`text-xs font-semibold ${isWarning ? 'text-cb-800' : 'text-cb-600'}`}>
            {val}
          </span>
        );
      }
    },
    {
      header: 'Action',
      key: 'action',
      align: 'center',
      render: (val) => (
        <Button variant={val === 'Dispute' ? 'primary' : 'secondary'} size="sm" className="!py-1 !px-3 !text-[10px]">
          {val}
        </Button>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Settlements</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">Settlement history over selected window</p>
        </div>
      </div>
      <DataTable 
        columns={columns}
        data={settlementsData}
      />
    </div>
  );
};

export default SettlementsTable;
