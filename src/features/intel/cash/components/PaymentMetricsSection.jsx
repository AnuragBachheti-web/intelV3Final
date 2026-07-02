import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { paymentMetricsChartData } from '../cashData';
import { CHART_CATEGORICAL } from '../../../../utils/chartColors';

const MiniChart = ({ data, color, type = 'bar', dataKey = 'v' }) => {
  const chartData = data.map(v => ({ [dataKey]: v }));
  
  return (
    <div className="h-[200px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
              itemStyle={{ color: 'var(--tooltip-text)' }}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px', color: 'var(--tooltip-text)' }}
              itemStyle={{ color: 'var(--tooltip-text)' }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 3, fill: color }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const PaymentMetricsSection = () => {
  return (
    <section id="payment-comparison" className="mb-8 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">Payment & Collection Metrics</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">Key performance indicators across payment categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">Days Sales Outstanding</h4>
            <i className="fa-solid fa-clock" style={{ color: CHART_CATEGORICAL[0] }}></i>
          </div>
          <MiniChart data={paymentMetricsChartData.dso} color={CHART_CATEGORICAL[0]} type="bar" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">Payment Timing</h4>
            <i className="fa-solid fa-calendar-days" style={{ color: CHART_CATEGORICAL[1] }}></i>
          </div>
          <MiniChart data={paymentMetricsChartData.paymentTiming} color={CHART_CATEGORICAL[1]} type="line" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">Collection Rate</h4>
            <i className="fa-solid fa-percent" style={{ color: CHART_CATEGORICAL[2] }}></i>
          </div>
          <MiniChart data={paymentMetricsChartData.collectionRate} color={CHART_CATEGORICAL[2]} type="line" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">Vendor Payments</h4>
            <i className="fa-solid fa-file-invoice-dollar" style={{ color: CHART_CATEGORICAL[3] }}></i>
          </div>
          <MiniChart data={paymentMetricsChartData.vendorPayments} color={CHART_CATEGORICAL[3]} type="bar" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">Payroll Expenses</h4>
            <i className="fa-solid fa-users" style={{ color: CHART_CATEGORICAL[4] }}></i>
          </div>
          <MiniChart data={paymentMetricsChartData.payroll} color={CHART_CATEGORICAL[4]} type="bar" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300">Operating Expenses</h4>
            <i className="fa-solid fa-building" style={{ color: CHART_CATEGORICAL[5] }}></i>
          </div>
          <MiniChart data={paymentMetricsChartData.opex} color={CHART_CATEGORICAL[5]} type="line" />
        </div>
      </div>
    </section>
  );
};

export default PaymentMetricsSection;
