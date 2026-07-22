import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_SEQUENTIAL } from '../../../../utils/chartColors';

const DOCDistributionChart = () => {
  const data = [
    { name: '< 14d', count: 8 },
    { name: '14-60d', count: 24 },
    { name: '60-180d', count: 22 },
    { name: '> 180d', count: 16 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">DOC Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">SKU count by days of cover bucket</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <button className="px-3 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-md shadow-sm text-xs font-bold">By SKU</button>
          <button className="px-3 py-1 text-gray-500 dark:text-slate-400 text-xs font-bold">By $ Value</button>
        </div>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2 border border-gray-100 dark:border-slate-700 rounded-lg shadow-lg text-xs font-bold">
                      <p className="text-gray-500 dark:text-slate-400 mb-1 tracking-wider">{payload[0].payload.name}</p>
                      <p className="text-gray-900 dark:text-slate-100">{payload[0].value} SKUs</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_SEQUENTIAL[index % CHART_SEQUENTIAL.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DOCDistributionChart;
