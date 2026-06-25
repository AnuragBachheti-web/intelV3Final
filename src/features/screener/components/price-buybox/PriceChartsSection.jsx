import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const defaultPriceTrendData = [
  { day: 'Day 1', yourBrand: 65, techMaster: 63 },
  { day: 'Day 2', yourBrand: 64, techMaster: 61 },
  { day: 'Day 3', yourBrand: 62, techMaster: 59 },
  { day: 'Day 4', yourBrand: 63, techMaster: 58 },
  { day: 'Day 5', yourBrand: 64, techMaster: 59 },
  { day: 'Day 6', yourBrand: 65, techMaster: 60 },
  { day: 'Day 7', yourBrand: 67, techMaster: 59 },
];

const defaultBuyBoxByCategory = [
  { category: 'Electronics', winRate: 75, color: '#2563eb' },
  { category: 'Home & Kitchen', winRate: 68, color: '#7c3aed' },
  { category: 'Sports', winRate: 82, color: '#16a34a' },
  { category: 'Gaming', winRate: 71, color: '#f97316' },
  { category: 'Cameras', winRate: 65, color: '#06b6d4' },
];

const PriceChartsSection = ({
  priceTrendData = defaultPriceTrendData,
  buyBoxByCategory = defaultBuyBoxByCategory,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Price Trend Analysis (7 Days)</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceTrendData} margin={{ top: 10, right: 18, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `$${v}`} />
              <Line type="monotone" dataKey="yourBrand" name="Your Brand" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="techMaster" name="TechMaster Pro" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Buy Box Win Rate by Category</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buyBoxByCategory} margin={{ top: 10, right: 18, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
              <XAxis dataKey="category" axisLine={false} tickLine={false} angle={-22} textAnchor="end" height={60} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="winRate" name="Win Rate">
                {buyBoxByCategory.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default PriceChartsSection;

