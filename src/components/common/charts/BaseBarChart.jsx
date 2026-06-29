import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { CHART_CATEGORICAL } from '../../../utils/chartColors';

const BaseBarChart = ({
  data,
  bars, // Array of { key, name, color, stackId }
  xAxisKey = "name",
  height = 300,
  yAxisFormatter = (val) => val,
  tooltipFormatter = (val) => [val, ""],
  layout = "vertical", // "horizontal" or "vertical"
  showGrid = true,
  gridType = "3 3",
  radius = [0, 4, 4, 0],
  margin = { top: 10, right: 30, left: 10, bottom: 5 },
  yDomain,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout={layout}
          margin={margin}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray={gridType} 
              vertical={layout === 'vertical'} 
              horizontal={layout === 'horizontal'}
              stroke="currentColor" 
              className="text-gray-100 dark:text-slate-800" 
            />
          )}
          {layout === 'horizontal' ? (
            <>
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-gray-500 dark:text-slate-400"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-gray-500 dark:text-slate-400"
                tickFormatter={yAxisFormatter}
                domain={yDomain}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-gray-500 dark:text-slate-400"
                tickFormatter={yAxisFormatter}
              />
              <YAxis 
                dataKey={xAxisKey} 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-gray-500 dark:text-slate-400"
                width={100}
              />
            </>
          )}
          <Tooltip
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              borderRadius: '12px',
              border: '1px solid var(--tooltip-border, #e2e8f0)',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '12px'
            }}
            formatter={tooltipFormatter}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
          />
          {bars.map((bar, idx) => (
            <Bar
              key={bar.key || idx}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || CHART_CATEGORICAL[idx % CHART_CATEGORICAL.length]}
              stackId={bar.stackId}
              radius={radius}
              barSize={bar.barSize || 20}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BaseBarChart;
