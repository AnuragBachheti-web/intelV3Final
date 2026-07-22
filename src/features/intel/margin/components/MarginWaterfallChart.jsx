import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SEMANTIC_COLORS } from '../../../../utils/chartColors';
import { formatCompactCurrency } from '../../../../utils/formatters';

const MarginWaterfallChart = () => {
  const data = [
    { name: 'Revenue', value: 128400, color: '#CBD5E1' },
    { name: 'COGS', value: -72800, color: '#94A3B8' },
    { name: 'Fees', value: -24400, color: '#94A3B8' },
    { name: 'Ad Spend', value: -8200, color: '#B0BCCC' },
    { name: 'CM3', value: 23000, color: '#475569' },
  ];

  // Waterfall transform: calculate the 'base' for the floating bars
  let current = 0;
  const waterfallData = data.map((item) => {
    if (item.name === 'CM3' || item.name === 'Revenue') {
      // These are 'Total' style bars
      current = (item.name === 'Revenue' ? item.value : current);
      return {
        ...item,
        displayValue: Math.abs(item.value),
        base: 0,
      };
    } else {
      const prev = current;
      current += item.value;
      return {
        ...item,
        displayValue: Math.abs(item.value),
        base: item.value < 0 ? current : prev,
      };
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">CM Waterfall</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">Revenue cascade to CM3</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }} stackOffset="sign">
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={formatCompactCurrency} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload.find(p => p.dataKey === 'displayValue')?.payload;
                  if (!item) return null;
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2 border border-gray-100 dark:border-slate-700 rounded-lg shadow-lg text-xs font-bold">
                      <p className="text-gray-500 dark:text-slate-400 mb-1 tracking-wider">{item.name}</p>
                      <p className={item.value < 0 ? 'text-red-500' : 'text-green-500'}>
                        {item.value < 0 ? '-' : ''}${Math.abs(item.value).toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* The base bar (transparent) */}
            <Bar dataKey="base" stackId="a" fill="transparent" />
            {/* The actual visible bar */}
            <Bar dataKey="displayValue" stackId="a" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarginWaterfallChart;
