// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DeepDiveTabBar from '../../../../components/common/DeepDiveTabBar';
// import ClickToExpand from '../../../../components/common/ClickToExpand';
// import ActionsPanel from '../../../../components/common/ActionsPanel';
// import BaseAreaChart from '../../../../components/common/charts/BaseAreaChart';
// import { SEMANTIC_COLORS } from '../../../../utils/chartColors';
// import { salesRecommendations, salesAnomalies, revenueTrendData, salesWatchlistItems } from '../salesData';

// const kpiDetails = {
//   "Total Revenue": {
//     title: "Revenue", icon: "fa-dollar-sign",
//     summary: "Revenue at $124,500 this month, up 12.4% vs prior period. Gross margin holds at 64.2% with AOV of $302 and forecast accuracy of 94.8%.",
//     cards: [
//       { label: 'NET REVENUE', val: '$124,500', delta: '+12.4%', color: 'text-blue-600' },
//       { label: 'GROSS MARGIN', val: '64.2%', delta: '+2.1%', color: 'text-blue-500' },
//       { label: 'AOV CONTRIBUTION', val: '$302', delta: '+4.2%', color: 'text-blue-500' },
//       { label: 'FORECAST ACCURACY', val: '94.8%', delta: '+1.2%', color: 'text-blue-500' }
//     ],
//     tableColumns: [
//       { header: 'PRODUCT', key: 'name', bold: true },
//       { header: 'REVENUE SHARE', key: 'share', align: 'right', bold: true },
//       { header: 'GROWTH', key: 'growth', align: 'right', render: (v) => <span className="text-green-600 font-bold">{v}</span> }
//     ],
//     tableData: [
//       { name: 'Premium Headphones PRO', share: '$42,300 (34%)', growth: '+12.4%' },
//       { name: 'Security Camera Gen 2', share: '$28,400 (22%)', growth: '+8.1%' },
//       { name: 'Organic Pet Food', share: '$12,100 (10%)', growth: '+15.2%' },
//       { name: 'Ergonomic Chair Pro', share: '$9,800 (8%)', growth: '+6.4%' },
//       { name: 'USB-C Hub 7-in-1', share: '$8,200 (7%)', growth: '+19.3%' },
//       { name: 'Smart Speaker Mini', share: '$6,400 (5%)', growth: '+24.1%' },
//       { name: 'Coffee Maker Pro', share: '$5,200 (4%)', growth: '+3.7%' },
//       { name: 'LED Desk Lamp Smart', share: '$4,100 (3%)', growth: '-2.1%' }
//     ]
//   },
//   "Units Sold": {
//     title: "Units Sold", icon: "fa-box",
//     summary: "2,180 units sold this period averaging 72.6 per day. Amazon US leads at 65% of volume with a low return rate of 1.2%.",
//     cards: [
//       { label: 'TOTAL UNITS', val: '2,180', delta: '+8.1%', color: 'text-indigo-600' },
//       { label: 'UNITS PER DAY', val: '72.6', delta: '+5.4', color: 'text-indigo-500' },
//       { label: 'RETURN RATE', val: '1.2%', delta: '-0.4%', color: 'text-indigo-500' },
//       { label: 'STOCK VELOCITY', val: 'High', delta: 'Stable', color: 'text-indigo-500' }
//     ],
//     tableColumns: [
//       { header: 'CHANNEL', key: 'channel', bold: true },
//       { header: 'UNITS', key: 'units', align: 'right', bold: true },
//       { header: 'SHARE', key: 'share', align: 'right' }
//     ],
//     tableData: [
//       { channel: 'Amazon US', units: '1,420', share: '65%' },
//       { channel: 'Shopify Store', units: '540', share: '25%' },
//       { channel: 'Walmart', units: '220', share: '10%' },
//       { channel: 'TikTok Shop', units: '148', share: '+32%' },
//       { channel: 'eBay', units: '124', share: '+8%' },
//       { channel: 'Target.com', units: '98', share: '+4%' },
//       { channel: 'Wholesale', units: '72', share: 'Flat' },
//       { channel: 'B2B Direct', units: '44', share: '-2%' }
//     ]
//   },
//   "Total Orders": {
//     title: "Orders", icon: "fa-file-invoice",
//     summary: "412 orders processed this period, with 13.7 average orders per day. 34% are multi-item orders and 28% from repeat customers.",
//     cards: [
//       { label: 'TOTAL ORDERS', val: '412', delta: '+6.3%', color: 'text-purple-600' },
//       { label: 'AVG ORDERS/DAY', val: '13.7', delta: '+0.8', color: 'text-purple-500' },
//       { label: 'MULTI-ITEM ORDERS', val: '34%', delta: '+2.1%', color: 'text-purple-500' },
//       { label: 'REPEAT CUSTOMERS', val: '28%', delta: '+4.8%', color: 'text-purple-500' }
//     ],
//     tableColumns: [
//       { header: 'DAY', key: 'day', bold: true },
//       { header: 'ORDERS', key: 'orders', align: 'right' },
//       { header: 'UNITS', key: 'units', align: 'right' },
//       { header: 'AOV', key: 'aov', align: 'right', bold: true },
//       { header: 'NEW CUSTOMERS', key: 'new', align: 'right' },
//       { header: 'REPEAT', key: 'repeat', align: 'right' }
//     ],
//     tableData: [
//       { day: 'Monday', orders: '62', units: '189', aov: '$318', new: '41', repeat: '21' },
//       { day: 'Tuesday', orders: '58', units: '174', aov: '$312', new: '38', repeat: '20' },
//       { day: 'Wednesday', orders: '55', units: '168', aov: '$306', new: '36', repeat: '19' },
//       { day: 'Thursday', orders: '61', units: '185', aov: '$320', new: '40', repeat: '21' },
//       { day: 'Friday', orders: '68', units: '204', aov: '$325', new: '44', repeat: '24' },
//       { day: 'Saturday', orders: '45', units: '136', aov: '$298', new: '29', repeat: '16' },
//       { day: 'Sunday', orders: '38', units: '114', aov: '$284', new: '24', repeat: '14' },
//       { day: 'Weekly Avg', orders: '55', units: '167', aov: '$309', new: '36', repeat: '19' }
//     ]
//   },
//   "Avg Order Value": {
//     title: "Avg Order Value", icon: "fa-wallet",
//     summary: "Average order value at $302 (+4.2%), beating the $285 industry benchmark by 5.9%. Electronics lead at $452 AOV.",
//     cards: [
//       { label: 'AVG AOV', val: '$302', delta: '+4.2%', color: 'text-emerald-600' },
//       { label: 'MAX AOV', val: '$1,240', delta: 'Peak', color: 'text-emerald-500' },
//       { label: 'MIN AOV', val: '$42', delta: 'Base', color: 'text-emerald-500' },
//       { label: 'BENCHMARK', val: '$285', delta: '+5.9%', color: 'text-emerald-500' }
//     ],
//     tableColumns: [
//       { header: 'CATEGORY', key: 'cat', bold: true },
//       { header: 'AVG VALUE', key: 'val', align: 'right', bold: true },
//       { header: 'GROWTH', key: 'growth', align: 'right' }
//     ],
//     tableData: [
//       { cat: 'Electronics', val: '$452', growth: '+12%' },
//       { cat: 'Sports & Outdoor', val: '$198', growth: '+22%' },
//       { cat: 'Home Decor', val: '$210', growth: '+5%' },
//       { cat: 'Kitchen', val: '$178', growth: '+14%' },
//       { cat: 'Apparel', val: '$124', growth: '+8%' },
//       { cat: 'Pet Supplies', val: '$85', growth: '+18%' },
//       { cat: 'Beauty', val: '$68', growth: '+31%' },
//       { cat: 'Books & Media', val: '$42', growth: '-4%' }
//     ]
//   },
//   "Buy Box %": {
//     title: "Buy Box %", icon: "fa-box-open",
//     summary: "Buy box ownership at 87.4%, down 2.1% from last week's peak of 94.2%. Two SKUs have active alerts requiring immediate review.",
//     cards: [
//       { label: 'CURRENT BB%', val: '87.4%', delta: '-2.1%', color: 'text-orange-600' },
//       { label: 'PEAK BB%', val: '94.2%', delta: 'Last Week', color: 'text-orange-500' },
//       { label: 'LOW BB%', val: '72.1%', delta: 'Alert', color: 'text-orange-500' },
//       { label: 'ALERTS', val: '2 Active', delta: 'Review Now', color: 'text-orange-500' }
//     ],
//     tableColumns: [
//       { header: 'SKU', key: 'sku', bold: true },
//       { header: 'BUY BOX %', key: 'bb', align: 'right', bold: true },
//       { header: 'STATUS', key: 'status', align: 'right' }
//     ],
//     tableData: [
//       { sku: 'B09XYZ1234', bb: '92%', status: 'Stable' },
//       { sku: 'B09JKL7890', bb: '96%', status: 'Stable' },
//       { sku: 'B09PQR5678', bb: '89%', status: 'Stable' },
//       { sku: 'B09DEF9012', bb: '88%', status: 'At Risk' },
//       { sku: 'B09GHI3456', bb: '74%', status: 'At Risk' },
//       { sku: 'B09STU9012', bb: '58%', status: 'At Risk' },
//       { sku: 'B09ABC5678', bb: '42%', status: 'Lost' },
//       { sku: 'B09MNO1234', bb: '31%', status: 'Lost' }
//     ]
//   },
//   "ROAS": {
//     title: "ROAS", icon: "fa-bullseye",
//     summary: "Blended ROAS at 4.2x on $12,400 ad spend, generating $52,080 in attributed revenue. Spring Collection leads at 5.8x ROAS.",
//     cards: [
//       { label: 'TOTAL ROAS', val: '4.2x', delta: '+0.3x', color: 'text-cyan-600' },
//       { label: 'TOTAL SPEND', val: '$12,400', delta: '+15%', color: 'text-cyan-500' },
//       { label: 'ADS REVENUE', val: '$52,080', delta: '+18%', color: 'text-cyan-500' },
//       { label: 'EFFICIENCY', val: '82%', delta: 'Optimal', color: 'text-cyan-500' }
//     ],
//     tableColumns: [
//       { header: 'CAMPAIGN', key: 'camp', bold: true },
//       { header: 'ROAS', key: 'roas', align: 'right', bold: true },
//       { header: 'SPEND', key: 'spend', align: 'right' }
//     ],
//     tableData: [
//       { camp: 'Spring Collection', roas: '5.8x', spend: '$4,200' },
//       { camp: 'Seasonal Promo', roas: '6.2x', spend: '$2,800' },
//       { camp: 'Best Sellers', roas: '4.1x', spend: '$6,800' },
//       { camp: 'Competitor Targeting', roas: '4.8x', spend: '$1,800' },
//       { camp: 'Category Defense', roas: '3.4x', spend: '$2,400' },
//       { camp: 'New Launches', roas: '2.9x', spend: '$3,200' },
//       { camp: 'Retargeting', roas: '2.4x', spend: '$1,400' },
//       { camp: 'Brand Awareness', roas: '1.8x', spend: '$1,200' }
//     ]
//   },
//   "Channel Mix": {
//     title: "Channel Mix", icon: "fa-users-viewfinder", chartType: 'donut',
//     summary: "Revenue split: Online Store 45%, Retail 30%, Marketplace 25%. Online is growing (+2.1%) while Retail slightly contracted (-0.5%).",
//     donutSegments: [
//       { label: 'Online Store', color: '#0A52E7', value: '45%', amount: '$56,025', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
//       { label: 'Retail', color: '#1D63FF', value: '30%', amount: '$37,350', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' },
//       { label: 'Marketplace', color: '#2E4CB9', value: '25%', amount: '$31,125', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
//     ],
//     cards: [
//       { label: 'ONLINE STORE', val: '45%', delta: '+2.1%', color: 'text-blue-600' },
//       { label: 'RETAIL', val: '30%', delta: '-0.5%', color: 'text-indigo-600' },
//       { label: 'MARKETPLACE', val: '25%', delta: '+1.2%', color: 'text-blue-500' },
//       { label: 'TOTAL REVENUE', val: '$124,500', delta: '+12.4%', color: 'text-emerald-600' }
//     ],
//     tableColumns: [
//       { header: 'CHANNEL', key: 'channel', bold: true },
//       { header: 'REVENUE', key: 'revenue', align: 'right', bold: true },
//       { header: 'SHARE', key: 'share', align: 'right' },
//       { header: 'ORDERS', key: 'orders', align: 'right' },
//       { header: 'GROWTH', key: 'growth', align: 'right', render: (v) => <span className={v.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{v}</span> }
//     ],
//     tableData: [
//       { channel: 'Online Store', revenue: '$56,025', share: '45%', orders: '185', growth: '+2.1%' },
//       { channel: 'Retail', revenue: '$37,350', share: '30%', orders: '124', growth: '-0.5%' },
//       { channel: 'Marketplace', revenue: '$31,125', share: '25%', orders: '103', growth: '+1.2%' },
//       { channel: 'TikTok Shop', revenue: '$8,420', share: '6.8%', orders: '28', growth: '+142%' },
//       { channel: 'eBay', revenue: '$6,240', share: '5.0%', orders: '22', growth: '+8.4%' },
//       { channel: 'B2B Wholesale', revenue: '$4,800', share: '3.9%', orders: '12', growth: '+4.2%' },
//       { channel: 'Direct Website', revenue: '$3,200', share: '2.6%', orders: '18', growth: '+18.8%' },
//       { channel: 'Amazon CA', revenue: '$2,100', share: '1.7%', orders: '9', growth: '+6.1%' }
//     ]
//   },
//   "Repeat Customers": {
//     title: "Repeat Customers", icon: "fa-list-check",
//     summary: "92% of listings are active with 4 currently suppressed. 8 new listings launched in the last 7 days across the portfolio.",
//     cards: [
//       { label: 'TOTAL ACTIVE', val: '92%', delta: '+1.2%', color: 'text-slate-700' },
//       { label: 'INACTIVE', val: '12', delta: 'Alert', color: 'text-slate-500' },
//       { label: 'SUPPRESSED', val: '4', delta: 'Fix Now', color: 'text-slate-500' },
//       { label: 'NEW LISTINGS', val: '8', delta: 'Last 7d', color: 'text-slate-500' }
//     ],
//     tableColumns: [
//       { header: 'CATEGORY', key: 'cat', bold: true },
//       { header: 'LISTINGS', key: 'count', align: 'right', bold: true },
//       { header: 'SHARE', key: 'share', align: 'right' }
//     ],
//     tableData: [
//       { cat: 'Electronics', count: '42', share: '45%' },
//       { cat: 'Home Office', count: '28', share: '30%' },
//       { cat: 'Accessories', count: '22', share: '25%' },
//       { cat: 'Pet Supplies', count: '18', share: '19%' },
//       { cat: 'Kitchen', count: '14', share: '15%' },
//       { cat: 'Apparel', count: '11', share: '12%' },
//       { cat: 'Sports', count: '8', share: '9%' },
//       { cat: 'Beauty', count: '5', share: '5%' }
//     ]
//   }
// };

// const chartSections = [
//   { key: 'revenue', title: 'Revenue Trend', value: '$124.5k this month', dataKey: 'revenue', data: revenueTrendData, color: SEMANTIC_COLORS.revenue, fmt: v => `$${v/1000}k` },
//   { key: 'orders', title: 'Orders Trend', value: '412 total orders', dataKey: 'orders', data: [{ name: 'W1', orders: 340 }, { name: 'W2', orders: 380 }, { name: 'W3', orders: 290 }, { name: 'W4', orders: 420 }, { name: 'W5', orders: 390 }, { name: 'W6', orders: 450 }], color: '#10b981', fmt: v => `${v}` },
//   { key: 'aov', title: 'Avg Order Value', value: '$302 avg this period', dataKey: 'aov', data: [{ name: 'W1', aov: 285 }, { name: 'W2', aov: 298 }, { name: 'W3', aov: 310 }, { name: 'W4', aov: 302 }, { name: 'W5', aov: 318 }, { name: 'W6', aov: 325 }], color: '#f59e0b', fmt: v => `$${v}` },
// ];

// const channelMixSegments = [
//   { label: 'Online Store', color: 'bg-cb-700', value: '45%', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
//   { label: 'Retail', color: 'bg-cb-600', value: '30%', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-900/50' },
//   { label: 'Marketplace', color: 'bg-cb-500', value: '25%', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-900/50' },
// ];

// const CompactWatchlistCard = ({ title, sku, stock, velocity, image, status, statusColor, progress, progressColor, subtext, metricLabel1 = 'Stock', metricLabel2 = 'Velocity' }) => (
//   <div className={`p-2.5 rounded-xl border transition-all ${statusColor}`}>
//     <div className="flex items-center gap-2 mb-2">
//       {image ? (
//         <img src={image} alt={title} className="w-10 h-10 rounded-lg object-contain bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex-shrink-0" />
//       ) : (
//         <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-300 dark:border-slate-700">
//           <i className="fa-solid fa-box text-gray-400 text-xs"></i>
//         </div>
//       )}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between gap-1">
//           <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-xs truncate leading-tight">{title}</h4>
//           {status && (
//             <span className={`px-1.5 py-0.5 text-white text-[9px] rounded-md font-bold flex-shrink-0 ${status === 'LOW' ? 'bg-red-600' : status === 'HOT' ? 'bg-green-600' : 'bg-yellow-600'}`}>
//               {status}
//             </span>
//           )}
//         </div>
//         <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">SKU: {sku}</p>
//       </div>
//     </div>
//     <div className={`grid ${velocity ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-2`}>
//       <div>
//         <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">{metricLabel1}</p>
//         <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{stock}</p>
//       </div>
//       {velocity && (
//         <div>
//           <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">{metricLabel2}</p>
//           <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{velocity}</p>
//         </div>
//       )}
//     </div>
//     <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
//       <div className={`h-full transition-all duration-1000 ${progressColor}`} style={{ width: `${progress}%` }}></div>
//     </div>
//     <p className="text-[10px] text-gray-500 dark:text-slate-400">{subtext}</p>
//   </div>
// );

// const SalesDeepDivePanelV2 = ({ deepDiveTab, setDeepDiveTab, activeStat, activeStatChart, selectedKpiIndices, onProductClick, setActiveModal, setExpandedChart }) => {
//   const navigate = useNavigate();
//   const [panelMode, setPanelMode] = useState('deepdive');
//   const [detailViewMode, setDetailViewMode] = useState('chart');
//   const [openSection, setOpenSection] = useState(null);
//   const [activeWatchlistIdx, setActiveWatchlistIdx] = useState(null);

//   const activeKpiDetail = kpiDetails[activeStat.title] || kpiDetails["Total Revenue"];

//   const openKpiModal = (stat) => {
//     const detail = kpiDetails[stat.title] || kpiDetails["Total Revenue"];
//     setActiveModal(prev => ({ ...prev, isOpen: true, type: 'kpi', data: detail }));
//   };

//   const toggleSection = (key) => setOpenSection(prev => prev === key ? null : key);

//   return (
//     <div className="lg:col-span-1 flex flex-col gap-4">
//       <div className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm ${panelMode === 'deepdive' ? 'overflow-hidden' : ''}`}>

//         {/* Header: Detailed View + Deep Dive / Watchlist toggle */}
//         <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-slate-800/60">
//           <button
//             onClick={() => navigate('/detailed-view/sales', { state: { selectedKpiIndices } })}
//             className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400 hover:text-brand dark:hover:text-gray-200 transition-colors group"
//           >
//             <i className="fa-solid fa-arrow-up-right-from-square text-[9px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
//             Detailed View
//           </button>
//           <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
//             <button
//               onClick={() => setPanelMode('deepdive')}
//               className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
//                 panelMode === 'deepdive'
//                   ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-800 dark:text-slate-200'
//                   : 'text-gray-500 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300'
//               }`}
//             >
//               Deep Dive
//             </button>
//             <button
//               onClick={() => setPanelMode('watchlist')}
//               className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
//                 panelMode === 'watchlist'
//                   ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-800 dark:text-slate-200'
//                   : 'text-gray-500 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300'
//               }`}
//             >
//               Watchlist
//             </button>
//           </div>
//         </div>

//         {/* ── DEEP DIVE MODE: exact same as SalesDeepDivePanel ── */}
//         {panelMode === 'deepdive' && (
//           <>
//             <DeepDiveTabBar>
//               {[
//                 { label: activeStat.title, key: 'revenue' },
//                 { label: 'Watchlist', key: 'sku' },
//                 { label: 'Channel Mix', key: 'channel-mix' },
//                 { label: 'Charts', key: 'charts' },
//               ].map(({ label, key }) => (
//                 <button
//                   key={key}
//                   onClick={() => setDeepDiveTab(key)}
//                   className={`px-3 py-3 text-xs font-semibold transition whitespace-nowrap border-b-2 -mb-px ${
//                     deepDiveTab === key
//                       ? 'border-brand text-brand dark:text-gray-400 dark:border-gray-400'
//                       : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
//                   }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </DeepDiveTabBar>

//             <div className="h-[290px] flex flex-col overflow-hidden">
//               {deepDiveTab === 'revenue' && (
//                 <div
//                   className={`flex-1 flex flex-col p-4 ${detailViewMode === 'chart' ? 'cursor-pointer group' : 'cursor-default'}`}
//                   onClick={detailViewMode === 'chart' ? () => openKpiModal(activeStat) : undefined}
//                 >
//                   <div className="flex items-center justify-between px-1 mb-2">
//                     <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{activeStat.title}</span>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{activeStat.value}</span>
//                       <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 rounded-md p-0.5" onClick={e => e.stopPropagation()}>
//                         <button onClick={() => setDetailViewMode('chart')} className={`w-5 h-5 rounded flex items-center justify-center transition-all ${detailViewMode === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400'}`}>
//                           <i className="fa-solid fa-chart-area text-[9px]"></i>
//                         </button>
//                         <button onClick={() => setDetailViewMode('text')} className={`w-5 h-5 rounded flex items-center justify-center transition-all ${detailViewMode === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400'}`}>
//                           <i className="fa-solid fa-list text-[9px]"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   {detailViewMode === 'chart' && (
//                     <>
//                       <div className="h-[200px] w-full pointer-events-none overflow-hidden">
//                         <BaseAreaChart
//                           data={activeStatChart.data}
//                           yAxisFormatter={activeStatChart.fmt}
//                           tooltipFormatter={(v, n) => [activeStatChart.fmt(v), n]}
//                           areas={[{ key: activeStatChart.dataKey, name: activeStat.title, color: activeStatChart.color }]}
//                         />
//                       </div>
//                       <ClickToExpand />
//                     </>
//                   )}
//                   {detailViewMode === 'text' && (
//                     <div className="flex-1 overflow-y-auto px-1 pt-0.5">
//                       <p className="text-[11px] leading-relaxed text-gray-500 dark:text-slate-400 mb-3">{activeKpiDetail?.summary}</p>
//                       <div className="space-y-1">
//                         {activeKpiDetail?.tableData?.map((row, idx) => {
//                           const vals = Object.values(row).slice(0, 3);
//                           return (
//                             <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/40 last:border-0">
//                               <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate flex-1">{vals[0]}</span>
//                               <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 ml-3">{vals[1]}</span>
//                               {vals[2] && <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1.5">{vals[2]}</span>}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {deepDiveTab === 'sku' && (
//                 <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
//                   {salesWatchlistItems.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
//                       onClick={() => onProductClick({ ...item, name: item.title })}
//                     >
//                       {item.image ? (
//                         <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex-shrink-0" />
//                       ) : (
//                         <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-200 dark:border-slate-700">
//                           <i className="fa-solid fa-box text-gray-400 text-[10px]"></i>
//                         </div>
//                       )}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{item.title}</p>
//                         <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">{item.sku}</p>
//                       </div>
//                       <div className="flex items-center gap-2 flex-shrink-0">
//                         <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{item.velocity}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {deepDiveTab === 'channel-mix' && (
//                 <div
//                   className="p-4 cursor-pointer group"
//                   onClick={() => setActiveModal({ isOpen: true, type: 'kpi', data: kpiDetails["Channel Mix"] })}
//                 >
//                   <div className="flex items-center justify-center mb-2 pointer-events-none">
//                     <div className="relative w-28 h-28">
//                       <svg className="w-full h-full transform -rotate-90">
//                         <circle cx="56" cy="56" r="44" fill="none" stroke="currentColor" strokeWidth="18" className="text-gray-100 dark:text-slate-800"></circle>
//                         <circle cx="56" cy="56" r="44" fill="none" stroke="#0A52E7" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="69.1"></circle>
//                         <circle cx="56" cy="56" r="44" fill="none" stroke="#1D63FF" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="152.0"></circle>
//                         <circle cx="56" cy="56" r="44" fill="none" stroke="#2E4CB9" strokeWidth="18" strokeDasharray="276.5" strokeDashoffset="221.1"></circle>
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center flex-col">
//                         <p className="text-lg font-bold text-gray-900 dark:text-slate-100">100%</p>
//                         <p className="text-[9px] text-gray-500 dark:text-slate-400 font-medium">Total Sales</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-1.5 pointer-events-none">
//                     {channelMixSegments.map((item, idx) => (
//                       <div key={idx} className={`flex items-center justify-between py-1.5 px-3 rounded-xl border ${item.bgColor} ${item.borderColor}`}>
//                         <div className="flex items-center gap-3">
//                           <div className={`w-3 h-3 ${item.color} rounded-full shadow-sm`}></div>
//                           <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
//                         </div>
//                         <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{item.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                   <ClickToExpand className="mt-2" />
//                 </div>
//               )}

//               {deepDiveTab === 'charts' && (
//                 <div className="p-3 grid grid-cols-2 gap-2">
//                   {chartSections.map(chart => (
//                     <div
//                       key={chart.key}
//                       className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all"
//                       onClick={() => setExpandedChart(chart)}
//                     >
//                       <div className="px-3 py-1.5 border-b border-gray-50 dark:border-slate-800/60">
//                         <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{chart.title}</p>
//                         <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{chart.value}</p>
//                       </div>
//                       <div className="h-[78px] px-1 pt-1 pb-1 pointer-events-none">
//                         <BaseAreaChart
//                           data={chart.data}
//                           yAxisFormatter={chart.fmt}
//                           tooltipFormatter={(v, n) => [chart.fmt(v), n]}
//                           areas={[{ key: chart.dataKey, name: chart.title, color: chart.color }]}
//                           showLegend={false}
//                           yDomain={['auto', 'auto']}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* ── WATCHLIST MODE ── */}
//         {panelMode === 'watchlist' && (
//           <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">

//             {/* Product Watchlist */}
//             <div className="p-3 flex flex-col gap-2">
//               {salesWatchlistItems.map((item, idx) => {
//                 const isActive = activeWatchlistIdx === idx;
//                 return (
//                   <button
//                     key={idx}
//                     onClick={() => { setActiveWatchlistIdx(idx); onProductClick({ ...item, name: item.title }); }}
//                     className="w-full text-left"
//                   >
//                     <div className={`rounded-xl transition-all ring-2 ${isActive ? 'ring-blue-400 dark:ring-blue-500' : 'ring-transparent'}`}>
//                       <CompactWatchlistCard {...item} />
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Accordion sections */}
//             <div className="border-t border-gray-100 dark:border-slate-800">

//               {/* Section 1: Dynamic Visibility (disabled) */}
//               <div className="border-b border-gray-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between cursor-not-allowed select-none">
//                 <div className="flex items-center gap-2 opacity-40">
//                   <i className="fa-solid fa-sliders text-[10px] text-gray-500 dark:text-slate-400"></i>
//                   <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Dynamic Visibility</span>
//                 </div>
//                 <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-1.5 py-0.5 rounded uppercase tracking-wide">Soon</span>
//               </div>

//               {/* Section 2: Channel Mix */}
//               <div className="border-b border-gray-100 dark:border-slate-800">
//                 <button
//                   onClick={() => toggleSection('channel-mix')}
//                   className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-users-viewfinder text-[10px] text-gray-500 dark:text-slate-400"></i>
//                     <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Channel Mix</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-down text-[9px] text-gray-400 transition-transform duration-200 ${openSection === 'channel-mix' ? 'rotate-180' : ''}`}></i>
//                 </button>
//                 {openSection === 'channel-mix' && (
//                   <div
//                     className="px-4 pb-4 cursor-pointer group"
//                     onClick={() => setActiveModal({ isOpen: true, type: 'kpi', data: kpiDetails["Channel Mix"] })}
//                   >
//                     <div className="flex items-center justify-center mb-2 pointer-events-none">
//                       <div className="relative w-24 h-24">
//                         <svg className="w-full h-full transform -rotate-90">
//                           <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth="15" className="text-gray-100 dark:text-slate-800"></circle>
//                           <circle cx="48" cy="48" r="36" fill="none" stroke="#0A52E7" strokeWidth="15" strokeDasharray="226.2" strokeDashoffset="56.5"></circle>
//                           <circle cx="48" cy="48" r="36" fill="none" stroke="#1D63FF" strokeWidth="15" strokeDasharray="226.2" strokeDashoffset="124.4"></circle>
//                           <circle cx="48" cy="48" r="36" fill="none" stroke="#2E4CB9" strokeWidth="15" strokeDasharray="226.2" strokeDashoffset="181.0"></circle>
//                         </svg>
//                         <div className="absolute inset-0 flex items-center justify-center flex-col">
//                           <p className="text-base font-bold text-gray-900 dark:text-slate-100">100%</p>
//                           <p className="text-[8px] text-gray-500 dark:text-slate-400 font-medium">Total Sales</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="space-y-1.5 pointer-events-none">
//                       {channelMixSegments.map((item, idx) => (
//                         <div key={idx} className={`flex items-center justify-between py-1.5 px-3 rounded-xl border ${item.bgColor} ${item.borderColor}`}>
//                           <div className="flex items-center gap-3">
//                             <div className={`w-2.5 h-2.5 ${item.color} rounded-full shadow-sm`}></div>
//                             <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
//                           </div>
//                           <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{item.value}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <ClickToExpand className="mt-2" />
//                   </div>
//                 )}
//               </div>

//               {/* Section 3: Charts */}
//               <div>
//                 <button
//                   onClick={() => toggleSection('charts')}
//                   className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <i className="fa-solid fa-chart-area text-[10px] text-gray-500 dark:text-slate-400"></i>
//                     <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Charts</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-down text-[9px] text-gray-400 transition-transform duration-200 ${openSection === 'charts' ? 'rotate-180' : ''}`}></i>
//                 </button>
//                 {openSection === 'charts' && (
//                   <div className="p-3 grid grid-cols-2 gap-2">
//                     {chartSections.map(chart => (
//                       <div
//                         key={chart.key}
//                         className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all"
//                         onClick={() => setExpandedChart(chart)}
//                       >
//                         <div className="px-3 py-1.5 border-b border-gray-50 dark:border-slate-800/60">
//                           <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{chart.title}</p>
//                           <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{chart.value}</p>
//                         </div>
//                         <div className="h-[78px] px-1 pt-1 pb-1 pointer-events-none">
//                           <BaseAreaChart
//                             data={chart.data}
//                             yAxisFormatter={chart.fmt}
//                             tooltipFormatter={(v, n) => [chart.fmt(v), n]}
//                             areas={[{ key: chart.dataKey, name: chart.title, color: chart.color }]}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//             </div>
//           </div>
//         )}

//       </div>

//       <ActionsPanel
//         items={salesRecommendations}
//         anomalies={salesAnomalies}
//         onItemSelect={(id) => navigate(`/intel/insight/sales/${id}`)}
//       />
//     </div>
//   );
// };

// export default SalesDeepDivePanelV2;
