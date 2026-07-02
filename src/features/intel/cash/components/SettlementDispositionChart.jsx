import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { settlementDispositionData } from '../cashData';
import { SEMANTIC_COLORS } from '../../../../utils/chartColors';

// const computeProcessedData = () => {
//   let currentBase = 0;
//   return settlementDispositionData.map((item) => {
//     let start, end;
//     if (item.type === 'absolute' || item.type === 'total') {
//       start = 0;
//       end = Math.abs(item.value);
//       currentBase = end;
//     } else {
//       start = currentBase + item.value;
//       end = currentBase;
//       currentBase = start;
//     }
//     return {
//       ...item,
//       displayValue: [start, end],
//       actualValue: item.value,
//       color: item.type === 'absolute' ? SEMANTIC_COLORS.revenue :
//              item.type === 'total' ? SEMANTIC_COLORS.profit : SEMANTIC_COLORS.expense
//     };
//   });
// };

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl">
//         <p className="text-xs font-bold text-gray-900 dark:text-slate-100 mb-1">{data.name}</p>
//         <p className="text-sm font-mono font-bold" style={{ color: data.color }}>
//           {data.actualValue > 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.actualValue)}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

const SettlementDispositionChart = () => {
  const processedData = computeProcessedData();

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Settlement Disposition</h3>
        <p className="text-sm text-gray-600 dark:text-slate-400">Last completed settlement breakdown</p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={(val) => `$${val/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="displayValue" radius={[4, 4, 0, 0]}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList 
                dataKey="actualValue" 
                position="top" 
                content={(props) => {
                  const { x, y, width, value } = props;
                  return (
                    <text 
                      x={x + width / 2} 
                      y={y - 10} 
                      fill="#64748b" 
                      fontSize={10} 
                      fontWeight="bold" 
                      textAnchor="middle"
                      fontFamily="JetBrains Mono"
                    >
                      {value > 0 ? '+' : ''}{value >= 1000 || value <= -1000 ? `$${(value/1000).toFixed(1)}k` : `$${value}`}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SettlementDispositionChart;
