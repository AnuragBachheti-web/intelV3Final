import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { categoryTurnoverData, categoryDaysData } from '../inventoryData';
import { CHART_CATEGORICAL } from '../../../utils/chartColors';

const CategoryPerformanceSection = ({ darkMode }) => {
  return (
    <section id="category-performance" className="mb-8 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">Category Performance Metrics</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">Inventory health by product category</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Turnover Rate by Category</h4>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTurnoverData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }}
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                      borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px'
                    }}
                  />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoryTurnoverData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_CATEGORICAL[index % CHART_CATEGORICAL.length]} />
                      ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Days of Inventory by Category</h4>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDaysData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }}
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                      borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px'
                    }}
                  />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoryDaysData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_CATEGORICAL[(index + 2) % CHART_CATEGORICAL.length]} />
                      ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPerformanceSection;
