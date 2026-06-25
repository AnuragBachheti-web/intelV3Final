import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';

const PerformanceSection = ({ onProductClick }) => {
  const [isProductGrid, setIsProductGrid] = useState(false);

  const performanceColumns = [
    {
      header: 'Product',
      key: 'name',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-slate-100">{val}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">{row.sku}</p>
        </div>
      )
    },
    {
      header: 'Channel',
      key: 'channel',
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${val === 'Amazon'
              ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            }`}
        >
          {val}
        </span>
      )
    },
    { header: 'Revenue', key: 'revenue', align: 'right', bold: true },
    { header: 'Units', key: 'units', align: 'right' },
    { header: 'Orders', key: 'orders', align: 'right' },
    { header: 'AOV', key: 'aov', align: 'right' },
    {
      header: 'Δ vs Prior',
      key: 'delta',
      align: 'right',
      render: (val) => <span className={`font-semibold ${val.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
    },
    { header: 'BB%', key: 'bb', align: 'right' },
    { header: 'ROAS', key: 'roas', align: 'right' }
  ];

  const performanceData = [
    { name: 'Premium Wireless Headphones', sku: 'B09XYZ1234', channel: 'Amazon', revenue: '$124,500', units: '2,180', orders: '1,845', aov: '$67.48', delta: '+34.2%', bb: '92.1%', roas: '5.8x' },
    { name: 'Smart Home Security Camera', sku: 'B09ABC5678', channel: 'Amazon', revenue: '$98,700', units: '1,410', orders: '1,320', aov: '$74.77', delta: '+28.1%', bb: '89.3%', roas: '4.1x' },
    { name: 'Organic Pet Food 15lb', sku: 'B09DEF9012', channel: 'Shopify', revenue: '$76,340', units: '1,890', orders: '1,540', aov: '$49.57', delta: '+22.5%', bb: '—', roas: '3.6x' },
    { name: 'Ergonomic Office Chair Pro', sku: 'B09GHI3456', channel: 'Amazon', revenue: '$68,900', units: '340', orders: '310', aov: '$222.26', delta: '+19.8%', bb: '94.8%', roas: '6.2x' },
    { name: 'USB-C Hub 7-in-1', sku: 'B09JKL7890', channel: 'Amazon', revenue: '$54,120', units: '1,240', orders: '1,180', aov: '$45.86', delta: '+15.3%', bb: '88.2%', roas: '3.9x' }
  ];

  const renderContent = () => {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Product Performance</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">247 SKUs · Last 30 days · All channels</p>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setIsProductGrid(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${!isProductGrid ? 'bg-brand text-white' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <i className="fa-solid fa-list" />
              </button>
              <button
                onClick={() => setIsProductGrid(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isProductGrid ? 'bg-brand text-white' : 'text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <i className="fa-solid fa-grip" />
              </button>
            </div>
          </div>
        </div>

        {isProductGrid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {performanceData.map((product, idx) => (
              <div
                key={idx}
                onClick={() => onProductClick && onProductClick(product)}
                className="p-5 border rounded-xl hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-slate-100 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">{product.sku}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${product.channel === 'Amazon'
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      }`}
                  >
                    {product.channel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50/30 dark:bg-blue-900/10 rounded-lg p-2 border border-blue-100/50 dark:border-blue-900/30">
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-bold tracking-wider mb-0.5">REVENUE</p>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{product.revenue}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2 border border-gray-100 dark:border-slate-800">
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold tracking-wider mb-0.5">UNITS</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{product.units}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2 border border-gray-100 dark:border-slate-800">
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold tracking-wider mb-0.5">ORDERS</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{product.orders}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2 border border-gray-100 dark:border-slate-800">
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold tracking-wider mb-0.5">AOV</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{product.aov}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-gray-100 dark:border-slate-800 pt-2">
                  <span className={`font-bold ${product.delta.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{product.delta} vs prior</span>
                  <span className="text-gray-500 dark:text-slate-400">
                    BB: <span className="font-semibold text-gray-700 dark:text-slate-300">{product.bb}</span>
                  </span>
                  <span className="text-gray-500 dark:text-slate-400">
                    ROAS: <span className="font-semibold text-gray-700 dark:text-slate-300">{product.roas}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                  {performanceColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`py-3 px-4 font-medium ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                        }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {performanceData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    onClick={() => onProductClick && onProductClick(row)}
                    className="border-b border-gray-100 dark:border-slate-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {performanceColumns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                          }`}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : <span className={col.bold ? 'font-semibold text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'}>{row[col.key]}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <div className="w-full space-y-6 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default PerformanceSection;

