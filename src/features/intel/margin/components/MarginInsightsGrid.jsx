// import { motion } from 'framer-motion';
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
// import { unprofitableSKUs, adSpendImpact, cogsCompressions, returnsImpact, channelFeeData } from '../marginData';

// const MarginInsightCard = ({ title, icon, iconColor, children, actionLabel = "Details" }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
//   >
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
//         <i className={`fa-solid ${icon} ${iconColor}`}></i>
//         {title}
//       </h3>
//       <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
//         {actionLabel}
//       </button>
//     </div>
//     {children}
//   </motion.div>
// );

// const MarginInsightsGrid = () => {
//   // Dummy trend data for the small chart
//   const trendData = [
//     { name: 'Apr 7', cm2: 38.1, gross: 54.2 },
//     { name: 'Apr 13', cm2: 37.5, gross: 53.5 },
//     { name: 'Apr 19', cm2: 37.0, gross: 52.8 },
//     { name: 'Apr 25', cm2: 36.9, gross: 52.5 },
//     { name: 'May 1', cm2: 36.9, gross: 52.3 },
//     { name: 'May 4', cm2: 36.9, gross: 52.3 },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
//       {/* Unprofitable SKUs */}
//       <MarginInsightCard title="Unprofitable SKUs" icon="fa-triangle-exclamation" iconColor="text-red-500" actionLabel="View all 18">
//         <div className="space-y-3">
//           {unprofitableSKUs.map((sku, idx) => (
//             <div key={idx} className="flex items-center justify-between p-2.5 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/20">
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{sku.name}</p>
//                 <p className="text-[10px] text-gray-500 dark:text-slate-500">{sku.sku} · {sku.channel}</p>
//               </div>
//               <div className="text-right ml-4">
//                 <p className="text-sm font-bold text-red-600">{sku.loss}</p>
//                 <p className="text-[10px] text-gray-400 font-bold">{sku.sub}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </MarginInsightCard>

//       {/* Ad Spend Impact */}
//       <MarginInsightCard title="Ad Spend Impact on Margin" icon="fa-bullhorn" iconColor="text-indigo-500">
//         <div className="space-y-4">
//           {adSpendImpact.map((item, idx) => (
//             <div key={idx} className="flex items-center justify-between group/item">
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{item.name}</p>
//                 <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold">Ad spend: {item.spend}</p>
//               </div>
//               <div className="text-right ml-4">
//                 <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">{item.impact}</p>
//                 <p className={`text-xs font-bold ${item.erosionType === 'danger' ? 'text-red-500' : 'text-amber-500'}`}>{item.erosion} erosion</p>
//               </div>
//             </div>
//           ))}
//           <div className="mt-2 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100/50 dark:border-indigo-900/20">
//             <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium leading-relaxed">
//               <i className="fa-solid fa-info-circle mr-1.5"></i>
//               Total ad spend: $63,520 · CM3 erosion: $63.5K · ROAS: 4.2x
//             </p>
//           </div>
//         </div>
//       </MarginInsightCard>

//       {/* Margin Trend (30d) */}
//       <MarginInsightCard title="Margin Trend (30d)" icon="fa-chart-line" iconColor="text-blue-600" actionLabel="">
//         <div className="h-[200px] -mx-2">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={trendData}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
//               <XAxis dataKey="name" hide />
//               <YAxis domain={['auto', 'auto']} hide />
//               <Tooltip 
//                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//                 formatter={(val) => [`${val}%`, '']}
//               />
//               <Line type="monotone" dataKey="cm2" stroke="#6366f1" strokeWidth={3} dot={false} />
//               <Line type="monotone" dataKey="gross" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="flex items-center justify-center gap-4 mt-2">
//            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div><span className="text-[10px] font-bold text-gray-500">CM2 %</span></div>
//            <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 border-t-2 border-dashed border-slate-400"></div><span className="text-[10px] font-bold text-gray-500">Gross %</span></div>
//         </div>
//       </MarginInsightCard>

//       {/* COGS Compressions */}
//       <MarginInsightCard title="COGS Compressions" icon="fa-boxes-stacked" iconColor="text-amber-500">
//         <div className="space-y-4">
//           {cogsCompressions.map((item, idx) => (
//             <div key={idx} className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{item.name}</p>
//                 <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold">{item.trend}</p>
//               </div>
//               <div className="text-right ml-4">
//                 <p className="text-xs font-bold text-red-500">{item.increase}</p>
//                 <p className="text-[10px] text-gray-400 font-medium">{item.impact}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </MarginInsightCard>

//       {/* Returns Impact */}
//       <MarginInsightCard title="Returns Impact" icon="fa-rotate-left" iconColor="text-slate-500">
//         <div className="space-y-4">
//           {returnsImpact.map((item, idx) => (
//             <div key={idx} className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">{item.name}</p>
//                 <p className="text-[10px] text-gray-500 dark:text-slate-500 font-medium">{item.meta}</p>
//               </div>
//               <div className="text-right ml-4">
//                 <p className="text-sm font-bold text-red-600">{item.loss}</p>
//                 <p className="text-[10px] text-gray-400 font-bold">{item.sub}</p>
//               </div>
//             </div>
//           ))}
//           <div className="mt-2 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
//             <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
//               <i className="fa-solid fa-info-circle mr-1.5"></i>
//               Total return costs: $28,420 (3.4% of revenue)
//             </p>
//           </div>
//         </div>
//       </MarginInsightCard>

//       {/* Channel Fee Analysis */}
//       <MarginInsightCard title="Channel Fee Analysis" icon="fa-receipt" iconColor="text-sky-500">
//         <div className="h-[140px] mb-4">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={channelFeeData} layout="vertical" margin={{ left: -20, right: 20 }}>
//               <XAxis type="number" hide />
//               <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
//               <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
//               <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={24}>
//                 {channelFeeData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           {channelFeeData.map((fee, idx) => (
//             <div key={idx} className="p-2.5 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl border border-gray-100/50 dark:border-slate-700/50">
//               <p className="text-[10px] font-bold text-gray-400 tracking-tight">{fee.name} Fees</p>
//               <div className="flex items-baseline gap-1.5">
//                 <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{fee.value}</p>
//                 <p className="text-[10px] font-bold text-gray-400">{fee.share}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </MarginInsightCard>
//     </div>
//   );
// };

// export default MarginInsightsGrid;
