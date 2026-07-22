import React, { useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import DeepDiveTabBar from '../../../../components/common/DeepDiveTabBar';
import ClickToExpand from '../../../../components/common/ClickToExpand';
import ActionsPanel from '../../../../components/common/ActionsPanel';
import BaseAreaChart from '../../../../components/common/charts/BaseAreaChart';
const DOCDistributionChart      = lazy(() => import('./DOCDistributionChart'));
const ForecastActualChart       = lazy(() => import('./ForecastActualChart'));
const InventoryTrendChart       = lazy(() => import('./InventoryTrendChart'));
const StockStatusChart          = lazy(() => import('./StockStatusChart'));
const CategoryPerformanceSection = lazy(() => import('./CategoryPerformanceSection'));
import { inventoryRecommendations, inventoryAnomalies } from '../inventoryData';
import { WatchlistCard } from '../../../../components/common/WatchlistSection';
import { salesWatchlistItems } from '../../sales/salesData';

const kpiDetails = {
  "Inventory at Cost": {
    title: "Inventory Value Analysis", icon: "fa-boxes-stacked",
    summary: "Total inventory at $1.8M cost ($3.6M retail), up 8.2%. Electronics hold 50% of value with average SKU value at $420.",
    cards: [
      { label: 'TOTAL VALUE', val: '$1.8M', delta: '+8.2%', color: 'text-cb-600' },
      { label: 'RETAIL VALUE', val: '$3.6M', delta: '+12%', color: 'text-cb-400' },
      { label: 'AVG SKU VALUE', val: '$420', delta: 'Stable', color: 'text-cb-200' }
    ],
    tableColumns: [
      { header: 'CATEGORY', key: 'cat', bold: true },
      { header: 'VALUE', key: 'val', align: 'right', bold: true },
      { header: 'SHARE %', key: 'share', align: 'right' }
    ],
    tableData: [
      { cat: 'Electronics', val: '$900k', share: '50%' },
      { cat: 'Apparel', val: '$486k', share: '27%' },
      { cat: 'Home & Garden', val: '$414k', share: '23%' },
      { cat: 'Pet Supplies', val: '$162k', share: '9%' },
      { cat: 'Kitchen', val: '$126k', share: '7%' },
      { cat: 'Sports', val: '$108k', share: '6%' },
      { cat: 'Beauty', val: '$90k', share: '5%' },
      { cat: 'Books & Media', val: '$54k', share: '3%' }
    ]
  },
  "DOC (Avg)": {
    title: "Days of Cover (DOC)", icon: "fa-calendar-days",
    summary: "Average days of cover at 42 days, down 3.2 days. 15 SKUs need reorder now (under 14 days) and 8 SKUs are overstocked at 180+ days.",
    cards: [
      { label: 'AVG DOC', val: '42 Days', delta: '-3.2d', color: 'text-cb-600' },
      { label: 'MIN DOC', val: '2 Days', delta: 'Alert', color: 'text-cb-800' },
      { label: 'MAX DOC', val: '245 Days', delta: 'Overstock', color: 'text-cb-400' },
      { label: 'TARGET DOC', val: '30 Days', delta: 'Ideal', color: 'text-cb-300' }
    ],
    tableColumns: [
      { header: 'BUCKET', key: 'bucket', bold: true },
      { header: 'SKU COUNT', key: 'count', align: 'right', bold: true },
      { header: 'ACTION', key: 'action', align: 'right' }
    ],
    tableData: [
      { bucket: '< 14 Days', count: '15', action: 'Reorder Now' },
      { bucket: '14-60 Days', count: '142', action: 'Healthy' },
      { bucket: '60-90 Days', count: '84', action: 'Monitor' },
      { bucket: '90-120 Days', count: '56', action: 'Review' },
      { bucket: '120-180 Days', count: '28', action: 'Plan Sale' },
      { bucket: '> 180 Days', count: '8', action: 'Liquidate' },
      { bucket: 'Out of Stock', count: '12', action: 'Reorder Urgent' },
      { bucket: 'Pre-order', count: '6', action: 'In Transit' }
    ]
  },
  "OOS Risk": {
    title: "Stockout Risk Analysis", icon: "fa-triangle-exclamation",
    summary: "12 SKUs at out-of-stock risk (+3 new this period). Estimated $14,200 weekly revenue at risk. 5 high-velocity items are on the risk list.",
    cards: [
      { label: 'AT RISK SKUs', val: '12', delta: '+3', color: 'text-cb-800' },
      { label: 'LOST REV EST', val: '$14.2k', delta: 'Weekly', color: 'text-cb-850' },
      { label: 'HIGH VELOCITY', val: '5', delta: 'In risk list', color: 'text-cb-850' }
    ],
    tableColumns: [
      { header: 'PRODUCT', key: 'prod', bold: true },
      { header: 'DOC LEFT', key: 'doc', align: 'right', color: 'text-red-600' },
      { header: 'DEMAND', key: 'demand', align: 'right' }
    ],
    tableData: [
      { prod: 'Wireless Headphones', doc: '2 Days', demand: 'High' },
      { prod: 'Smart Watch S5', doc: '4 Days', demand: 'High' },
      { prod: 'Bluetooth Speaker', doc: '8 Days', demand: 'High' },
      { prod: 'USB-C Hub 7-in-1', doc: '11 Days', demand: 'High' },
      { prod: 'Office Chair X', doc: '6 Days', demand: 'Medium' },
      { prod: 'Standing Desk Pad', doc: '12 Days', demand: 'Medium' },
      { prod: 'Pet Grooming Kit', doc: '13 Days', demand: 'Medium' },
      { prod: 'LED Strip Lights', doc: '13 Days', demand: 'Low' }
    ]
  },
  "Overstock": {
    title: "Overstock & Slow Moving", icon: "fa-dumpster-fire",
    summary: "8 SKUs in overstock with $240k capital tied up averaging 245 days cover. Winter Coats alone represent $82k in slow-moving stock.",
    cards: [
      { label: 'OVERSTOCK SKUs', val: '8', delta: 'flat', color: 'text-cb-400' },
      { label: 'TIED CAPITAL', val: '$240k', delta: 'Slow moving', color: 'text-cb-300' },
      { label: 'AVG DOC (OVER)', val: '245d', delta: 'Critical', color: 'text-cb-300' }
    ],
    tableColumns: [
      { header: 'PRODUCT', key: 'prod', bold: true },
      { header: 'DOC', key: 'doc', align: 'right', color: 'text-orange-600' },
      { header: 'VALUE', key: 'val', align: 'right' }
    ],
    tableData: [
      { prod: 'Winter Coats', doc: '245d', val: '$82k' },
      { prod: 'Summer Collection', doc: '220d', val: '$64k' },
      { prod: 'Fitness Tracker V1', doc: '240d', val: '$15k' },
      { prod: 'Old Model Watch', doc: '190d', val: '$45k' },
      { prod: 'Seasonal Decor', doc: '210d', val: '$19k' },
      { prod: 'Bamboo Kitchenware', doc: '195d', val: '$28k' },
      { prod: 'Yoga Accessories', doc: '188d', val: '$22k' },
      { prod: 'Lawn Mower v1', doc: '182d', val: '$38k' }
    ]
  },
  "In-Stock %": {
    title: "Inventory Availability", icon: "fa-check-double",
    summary: "In-stock rate at 94.2% (+2.1%), targeting 98%. 12 SKUs currently out of stock. Apparel category at 88.2% needs most attention.",
    cards: [
      { label: 'IN-STOCK %', val: '94.2%', delta: '+2.1%', color: 'text-cb-600' },
      { label: 'TARGET', val: '98.0%', delta: 'Benchmark', color: 'text-cb-200' },
      { label: 'OUT OF STOCK', val: '12', delta: 'SKUs', color: 'text-cb-800' }
    ],
    tableColumns: [
      { header: 'CATEGORY', key: 'cat', bold: true },
      { header: 'IN-STOCK %', key: 'pct', align: 'right', bold: true },
      { header: 'STATUS', key: 'status', align: 'right' }
    ],
    tableData: [
      { cat: 'Electronics', pct: '98.5%', status: 'Healthy' },
      { cat: 'Beauty', pct: '97.2%', status: 'Healthy' },
      { cat: 'Books & Media', pct: '99.1%', status: 'Healthy' },
      { cat: 'Home', pct: '95.4%', status: 'Normal' },
      { cat: 'Pet Supplies', pct: '96.8%', status: 'Healthy' },
      { cat: 'Kitchen', pct: '91.4%', status: 'Normal' },
      { cat: 'Sports', pct: '93.6%', status: 'Normal' },
      { cat: 'Apparel', pct: '88.2%', status: 'Action Needed' }
    ]
  },
  "Inbound POs": {
    title: "Inbound PO Analysis", icon: "fa-truck-ramp-box",
    summary: "3 active inbound POs worth $42,400 in incoming inventory. All shipments expected within 4-7 days average lead time.",
    cards: [
      { label: 'TOTAL INBOUND', val: '$42.4k', delta: '+15%', color: 'text-blue-600' },
      { label: 'OPEN POs', val: '5', delta: 'In transit', color: 'text-blue-500' },
      { label: 'EST. ARRIVAL', val: '4-7 Days', delta: 'Avg lead time', color: 'text-blue-500' }
    ],
    tableColumns: [
      { header: 'PO #', key: 'po', bold: true },
      { header: 'VALUE', key: 'val', align: 'right', bold: true },
      { header: 'STATUS', key: 'status', align: 'right' }
    ],
    tableData: [
      { po: 'PO-2024-042', val: '$18,400', status: 'In Transit' },
      { po: 'PO-2024-043', val: '$12,200', status: 'Shipped' },
      { po: 'PO-2024-044', val: '$11,800', status: 'Processing' },
      { po: 'PO-2024-045', val: '$8,600', status: 'Confirmed' },
      { po: 'PO-2024-046', val: '$6,400', status: 'In Transit' },
      { po: 'PO-2024-047', val: '$4,200', status: 'Processing' },
      { po: 'PO-2024-048', val: '$3,800', status: 'Shipped' },
      { po: 'PO-2024-049', val: '$2,400', status: 'Confirmed' }
    ]
  }
};

const getKpiDetail = (title) => {
  const mapping = {
    "DOC (Avg)": "DOC (Avg)", "Avg DOC (days)": "DOC (Avg)",
    "OOS Risk": "OOS Risk", "OOS Risk (14d)": "OOS Risk",
    "Overstock": "Overstock", "Overstock (DOC>180)": "Overstock",
    "In-Stock %": "In-Stock %", "Inbound POs": "Inbound POs",
    "Inventory at Cost": "Inventory at Cost"
  };
  return kpiDetails[mapping[title] || "Inventory at Cost"];
};

const InventoryDeepDivePanel = ({ deepDiveTab, setDeepDiveTab, activeStat, activeStatChart, selectedKpiIndices, setActiveModal, setComponentModal, onProductClick }) => {
  const navigate = useNavigate();
  const [detailViewMode, setDetailViewMode] = useState('chart');
  const activeKpiDetail = getKpiDetail(activeStat.title);

  const openKpiModal = (title) => {
    const detail = getKpiDetail(title);
    setActiveModal({ isOpen: true, type: 'kpi', data: detail });
  };

  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-slate-800/60">
          <button
            onClick={() => navigate('/detailed-view/inventory', { state: { selectedKpiIndices } })}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400 hover:text-brand dark:hover:text-gray-200 transition-colors group"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
            Detailed View
          </button>
        </div>
        <DeepDiveTabBar>
          {[
            { label: 'Details', key: 'revenue' },
            { label: 'Watchlist', key: 'sku' },
            { label: 'Channel Mix', key: 'channel-mix' },
            { label: 'Charts', key: 'charts' },
          ].map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setDeepDiveTab(key)}
              className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${
                deepDiveTab === key
                  ? 'border-brand text-brand dark:text-gray-400 dark:border-gray-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </DeepDiveTabBar>

        <div className="h-[290px] flex flex-col overflow-hidden">
          {deepDiveTab === 'revenue' && (
            <div
              className={`flex-1 flex flex-col p-4 ${detailViewMode === 'chart' ? 'cursor-pointer group' : 'cursor-default'}`}
              onClick={detailViewMode === 'chart' ? () => openKpiModal(activeStat.title) : undefined}
            >
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{activeStat.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{activeStat.value}</span>
                  <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 rounded-md p-0.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setDetailViewMode('chart')} className={`w-5 h-5 rounded flex items-center justify-center transition-all ${detailViewMode === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400'}`}>
                      <i className="fa-solid fa-chart-area text-[9px]"></i>
                    </button>
                    <button onClick={() => setDetailViewMode('text')} className={`w-5 h-5 rounded flex items-center justify-center transition-all ${detailViewMode === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400'}`}>
                      <i className="fa-solid fa-list text-[9px]"></i>
                    </button>
                  </div>
                </div>
              </div>
              {detailViewMode === 'chart' && (
                <>
                  <div className="h-[200px] w-full pointer-events-none overflow-hidden">
                    <BaseAreaChart
                      data={activeStatChart.data}
                      yAxisFormatter={activeStatChart.fmt}
                      tooltipFormatter={(v, n) => [activeStatChart.fmt(v), n]}
                      areas={[{ key: activeStatChart.dataKey, name: activeStat.title, color: activeStatChart.color }]}
                    />
                  </div>
                  <ClickToExpand />
                </>
              )}
              {detailViewMode === 'text' && (
                <div className="flex-1 overflow-y-auto px-1 pt-0.5">
                  <p className="text-[11px] leading-relaxed text-gray-500 dark:text-slate-400 mb-3">{activeKpiDetail?.summary}</p>
                  <div className="space-y-1">
                    {activeKpiDetail?.tableData?.map((row, idx) => {
                      const vals = Object.values(row).slice(0, 3);
                      return (
                        <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/40 last:border-0">
                          <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate flex-1">{vals[0]}</span>
                          <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 ml-3">{vals[1]}</span>
                          {vals[2] && <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1.5">{vals[2]}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {deepDiveTab === 'sku' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {salesWatchlistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                  onClick={() => onProductClick({ ...item, name: item.title })}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-200 dark:border-slate-700">
                      <i className="fa-solid fa-box text-gray-400 text-[10px]"></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">{item.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{item.velocity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deepDiveTab === 'channel-mix' && (
            <div className="flex-1 flex flex-col p-4 cursor-pointer group" onClick={() => setActiveModal({ isOpen: true, type: 'kpi', data: { title: "Channel Mix", icon: "fa-users-viewfinder", chartType: 'donut', donutSegments: [{ label: 'Online Store', color: '#0A52E7', value: '45%', amount: '$56,025', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' }, { label: 'Retail', color: '#1D63FF', value: '30%', amount: '$37,350', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' }, { label: 'Marketplace', color: '#2E4CB9', value: '25%', amount: '$31,125', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' }], cards: [{ label: 'ONLINE STORE', val: '45%', delta: '+2.1%', color: 'text-blue-600' }, { label: 'RETAIL', val: '30%', delta: '-0.5%', color: 'text-indigo-600' }, { label: 'MARKETPLACE', val: '25%', delta: '+1.2%', color: 'text-blue-500' }, { label: 'TOTAL REVENUE', val: '$124,500', delta: '+12.4%', color: 'text-emerald-600' }], tableColumns: [{ header: 'CHANNEL', key: 'channel', bold: true }, { header: 'REVENUE', key: 'revenue', align: 'right', bold: true }, { header: 'SHARE', key: 'share', align: 'right' }, { header: 'ORDERS', key: 'orders', align: 'right' }, { header: 'GROWTH', key: 'growth', align: 'right' }], tableData: [{ channel: 'Online Store', revenue: '$56,025', share: '45%', orders: '185', growth: '+2.1%' }, { channel: 'Retail', revenue: '$37,350', share: '30%', orders: '124', growth: '-0.5%' }, { channel: 'Marketplace', revenue: '$31,125', share: '25%', orders: '103', growth: '+1.2%' }] }})}>
              <div className="flex items-center justify-center mb-2 pointer-events-none">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="44" fill="none" stroke="currentColor" strokeWidth="18" className="text-gray-100 dark:text-slate-800"></circle>
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#0A52E7" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="69.1"></circle>
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#1D63FF" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="152.0"></circle>
                    <circle cx="56" cy="56" r="44" fill="none" stroke="#2E4CB9" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="221.1"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-lg font-bold text-gray-900 dark:text-slate-100">100%</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-medium">Total Sales</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 pointer-events-none">
                {[
                  { label: 'Online Store', color: 'bg-cb-700', value: '45%', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
                  { label: 'Retail', color: 'bg-cb-600', value: '30%', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' },
                  { label: 'Marketplace', color: 'bg-cb-500', value: '25%', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between py-1.5 px-3 rounded-xl border ${item.bgColor} ${item.borderColor}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${item.color} rounded-full shadow-sm`}></div>
                      <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{item.value}</span>
                  </div>
                ))}
              </div>
              <ClickToExpand className="mt-auto pt-2" />
            </div>
          )}

          {deepDiveTab === 'charts' && (
            <div className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto">
              {[
                { key: 'doc', title: 'DOC Distribution', subtitle: 'Days of cover breakdown by bucket', icon: 'fa-calendar-check', component: <DOCDistributionChart /> },
                { key: 'forecast', title: 'Forecast vs Actual', subtitle: 'Demand forecast accuracy', icon: 'fa-chart-line', component: <ForecastActualChart /> },
                { key: 'trend', title: 'Inventory Level Trends', subtitle: 'Stock levels over time', icon: 'fa-chart-area', component: <InventoryTrendChart /> },
                { key: 'status', title: 'Stock Status', subtitle: 'Current inventory health', icon: 'fa-boxes-stacked', component: <StockStatusChart /> },
                { key: 'category', title: 'Category Performance', subtitle: 'Performance metrics by category', icon: 'fa-chart-pie', component: <CategoryPerformanceSection /> },
              ].map(chart => (
                <div
                  key={chart.key}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-100 dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all group flex-shrink-0"
                  onClick={() => setComponentModal({ title: chart.title, subtitle: chart.subtitle, component: chart.component })}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg flex-shrink-0">
                    <i className={`fa-solid ${chart.icon} text-sm text-gray-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{chart.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">{chart.subtitle}</p>
                  </div>
                  <i className="fa-solid fa-expand text-[10px] text-gray-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0"></i>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ActionsPanel
        items={inventoryRecommendations}
        anomalies={inventoryAnomalies}
        onItemSelect={(id) => navigate(`/intel/insight/inventory/${id}`)}
      />
    </div>
  );
};

export default InventoryDeepDivePanel;
