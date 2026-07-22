import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend 
} from 'recharts';
import { inventoryTrendData } from '../inventoryData';
import { CHART_CATEGORICAL } from '../../../../utils/chartColors';

const InventoryTrendChart = ({ darkMode }) => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Inventory Level Trends</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">7-day stock levels by category</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm font-medium shadow-sm dark:bg-gray-600">Daily</button>
          <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium transition">Weekly</button>
          <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium transition">Monthly</button>
        </div>
      </div>
      
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={inventoryTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CATEGORICAL[0]} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={CHART_CATEGORICAL[0]} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CATEGORICAL[1]} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={CHART_CATEGORICAL[1]} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CATEGORICAL[2]} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={CHART_CATEGORICAL[2]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                borderRadius: '12px',
                color: darkMode ? '#f1f5f9' : '#0f172a'
              }} 
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Area 
              type="monotone" 
              dataKey="electronics" 
              name="Electronics"
              stroke={CHART_CATEGORICAL[0]} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorElec)" 
            />
            <Area 
              type="monotone" 
              dataKey="apparel" 
              name="Apparel"
              stroke={CHART_CATEGORICAL[1]} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorApp)" 
            />
            <Area 
              type="monotone" 
              dataKey="home" 
              name="Home & Garden"
              stroke={CHART_CATEGORICAL[2]} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHome)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryTrendChart;
