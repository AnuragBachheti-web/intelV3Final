import React, { useState } from 'react';

const PRODUCT_ACTIONS_DATA = [
  { sku: 'AF-BC-1001', title: 'Autofy 100% Waterproof Bike Cover', channel: 'Amazon', rev: '₹5,75,360', units: 640, aov: '₹899', bb: '92%', action: 'Conflict Check', actionType: 'danger' },
  { sku: 'AF-CC-2044', title: 'Autofy Car Body Cover, Premium', channel: 'Amazon', rev: '₹3,14,790', units: 210, aov: '₹1,499', bb: '61%', bbDanger: true, action: 'Reprice', actionType: 'warning' },
  { sku: 'AF-CC-2045', title: 'Autofy Car Body Cover, Premium XL', channel: 'Walmart', rev: '₹1,67,895', units: 105, aov: '₹1,599', bb: '58%', bbDanger: true, action: 'Reprice', actionType: 'warning' },
  { sku: 'AF-AW-3010', title: 'Autofy Alloy Wheel Cover Set', channel: 'Shopify', rev: '₹1,87,350', units: 150, aov: '₹1,249', bb: '88%', action: 'Diversify', actionType: 'success' },
  { sku: 'AF-SS-4021', title: 'Autofy Car Sun Shade', channel: 'Amazon', rev: '₹4,09,180', units: 820, aov: '₹499', bb: '95%', action: 'Diversify', actionType: 'success' },
  { sku: 'AF-DM-5032', title: 'Autofy Dashboard Mat 5-Piece', channel: 'Shopify', rev: '₹2,02,710', units: 290, aov: '₹699', bb: '90%', action: 'Diversify', actionType: 'success' },
  { sku: 'AF-SC-6018', title: 'Autofy Seat Cover Set, Leatherette', channel: 'Walmart', rev: '₹2,08,905', units: 95, aov: '₹2,199', bb: '79%', bbDanger: true, action: 'Reprice', actionType: 'warning' },
  { sku: 'AF-CM-7009', title: 'Autofy Car Mats 5D, Full Set', channel: 'Amazon', rev: '₹3,14,825', units: 175, aov: '₹1,799', bb: '86%', action: 'Diversify', actionType: 'success' },
  { sku: 'AF-HL-8071', title: 'Autofy Helmet Lock, Steel', channel: 'Amazon', rev: '₹1,22,590', units: 410, aov: '₹299', bb: '97%', action: 'Diversify', actionType: 'success' },
  { sku: 'AF-TI-9012', title: 'Autofy Digital Tyre Inflator', channel: 'Shopify', rev: '₹1,13,940', units: 60, aov: '₹1,899', bb: '64%', bbDanger: true, action: 'Reprice', actionType: 'warning' },
  { sku: 'AF-BC-1002', title: 'Autofy Bike Cover, XL Scooter', channel: 'Walmart', rev: '₹1,80,310', units: 190, aov: '₹949', bb: '84%', action: 'Conflict Check', actionType: 'danger' },
  { sku: 'AF-WM-3315', title: 'Autofy Windshield Mount', channel: 'Amazon', rev: '₹91,770', units: 230, aov: '₹399', bb: '93%', action: 'Diversify', actionType: 'success' },
];

const ProductActionsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden mt-4">
      <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search SKU or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="p-4">SKU</th>
              <th className="p-4">TITLE</th>
              <th className="p-4">CHANNEL</th>
              <th className="p-4">TOTAL REVENUE</th>
              <th className="p-4">UNITS SOLD</th>
              <th className="p-4">AOV</th>
              <th className="p-4">BUY BOX %</th>
              <th className="p-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
            {PRODUCT_ACTIONS_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.actionType === 'danger' || row.bbDanger ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">{row.sku}</span>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-gray-800 dark:text-slate-200">{row.title}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold
                    ${row.channel === 'Amazon' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      row.channel === 'Shopify' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {row.channel}
                  </span>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-700 dark:text-slate-300">{row.rev}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-slate-400">{row.units}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-slate-400">{row.aov}</td>
                <td className={`p-4 text-sm font-bold ${row.bbDanger ? 'text-red-500' : 'text-gray-700 dark:text-slate-300'}`}>
                  {row.bb}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide
                      ${row.actionType === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        row.actionType === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                      {row.action}
                    </span>
                    <button className="px-2.5 py-1 rounded text-[11px] font-bold tracking-wide border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      Investigate
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center border border-gray-200 dark:border-slate-700 rounded text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <i className="fa-solid fa-chevron-down text-[10px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-400 dark:text-slate-500 flex justify-between items-center bg-gray-50 dark:bg-slate-800/30">
        <span>Showing 12 of 12 SKUs</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
};

export default ProductActionsTable;
