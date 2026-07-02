// import React, { useState, useEffect, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import BaseModal from '../../../components/common/BaseModal';

// /* ── Scenario detection ─────────────────────────────────────────────────────── */
// const getScenario = (title = '') => {
//   const t = title.toLowerCase();
//   if (t.includes('repric') || t.includes('price match') || t.includes('close the') || t.includes('price gap') || t.includes('affected sku') || t.includes('price drop')) return 'reprice';
//   if (t.includes('launch') || t.includes('tiktok') || t.includes('expand') || (t.includes('channel') && !t.includes('monitor'))) return 'launch';
//   if (t.includes('restock') || t.includes('reorder') || t.includes(' po ') || t.includes('restock') || (t.includes('units') && t.includes('emergency'))) return 'inventory';
//   if (t.includes('bid') || t.includes('keyword') || t.includes('ad campaign') || t.includes('ad spend') || t.includes('roas') || t.includes('campaign')) return 'ads';
//   if (t.includes('bundle') || t.includes('a/b test')) return 'bundle';
//   return 'default';
// };

// /* ── Reprice data ────────────────────────────────────────────────────────────── */
// const REPRICE_SKUS = [
//   { name: 'Wireless Earbuds Pro',       currentPrice: 49.99, competitorPrice: 40.99, bb: 64,  revenue: 4200,  riskLevel: 'High'   },
//   { name: 'Smart Home Security Camera', currentPrice: 89.99, competitorPrice: 75.99, bb: 78,  revenue: 18600, riskLevel: 'High'   },
//   { name: 'Portable Charger 20K',       currentPrice: 29.99, competitorPrice: 24.99, bb: 71,  revenue: 3600,  riskLevel: 'High'   },
//   { name: 'Smart Speaker Mini',         currentPrice: 59.99, competitorPrice: 49.99, bb: 85,  revenue: 5400,  riskLevel: 'Medium' },
//   { name: 'Yoga Mat Premium',           currentPrice: 34.99, competitorPrice: 29.99, bb: 82,  revenue: 2800,  riskLevel: 'Medium' },
//   { name: 'Bamboo Phone Stand',         currentPrice: 19.99, competitorPrice: 17.49, bb: 76,  revenue: 1600,  riskLevel: 'High'   },
//   { name: 'Ergonomic Desk Organizer',   currentPrice: 44.99, competitorPrice: 38.99, bb: 89,  revenue: 6200,  riskLevel: 'Medium' },
//   { name: 'USB-C Hub 7-in-1',           currentPrice: 39.99, competitorPrice: 34.99, bb: 94,  revenue: 9800,  riskLevel: 'Low'    },
// ];

// const calcReprice = (sku, newPrice) => {
//   const np = Math.max(sku.competitorPrice * 0.88, Math.min(sku.currentPrice * 1.02, newPrice));
//   const gapBefore = sku.currentPrice - sku.competitorPrice;
//   const gapAfter = np - sku.competitorPrice;
//   const gapClosed = gapBefore > 0 ? Math.max(0, Math.min(1, (gapBefore - gapAfter) / gapBefore)) : 1;
//   const bbGain = Math.round(gapClosed * (96 - sku.bb));
//   const projBB = Math.min(97, sku.bb + bbGain);
//   const priceDelta = (np - sku.currentPrice) / sku.currentPrice;
//   const volumeGain = (projBB - sku.bb) / 100 * 1.6;
//   const projRev = Math.round(sku.revenue * (1 + priceDelta + volumeGain));
//   const revDelta = projRev - sku.revenue;
//   const projStatus = projBB >= 90 ? 'Winning' : projBB >= 80 ? 'Active' : 'At Risk';
//   const projRisk = projBB >= 90 ? 'Low' : projBB >= 80 ? 'Medium' : 'High';
//   return { projBB, projRev, revDelta, gapAfter, projStatus, projRisk };
// };

// /* ── Impact bar ──────────────────────────────────────────────────────────────── */
// const ImpactBar = ({ label, value, bar, color = 'bg-green-600' }) => (
//   <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//     <div className="flex items-center justify-between mb-2">
//       <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{label}</span>
//       <span className="text-sm font-bold text-green-600 dark:text-green-400">{value}</span>
//     </div>
//     <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
//       <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, Math.max(2, bar))}%` }} />
//     </div>
//   </div>
// );

// /* ── Reprice scenario ────────────────────────────────────────────────────────── */
// const RepriceContent = ({ step, onClose }) => {
//   const [skuIdx, setSkuIdx] = useState(0);
//   const sku = REPRICE_SKUS[skuIdx];
//   const [newPrice, setNewPrice] = useState(+(sku.competitorPrice + 0.50).toFixed(2));

//   useEffect(() => {
//     setNewPrice(+(REPRICE_SKUS[skuIdx].competitorPrice + 0.50).toFixed(2));
//   }, [skuIdx]);

//   const calc = useMemo(() => calcReprice(sku, newPrice), [sku, newPrice]);
//   const gap = (sku.currentPrice - sku.competitorPrice).toFixed(2);
//   const newGap = calc.gapAfter.toFixed(2);
//   const priceDiff = (newPrice - sku.currentPrice).toFixed(2);
//   const currentStatus = sku.bb < 75 ? 'At Risk' : sku.bb < 85 ? 'Active' : 'Winning';

//   return (
//     <>
//       {/* Selected Action + SKU dropdown + price editor */}
//       <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
//         <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 text-sm">{step?.title || 'Reprice Affected SKUs'}</h4>

//         <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">
//           Select Affected SKU
//         </label>
//         <select
//           value={skuIdx}
//           onChange={e => setSkuIdx(+e.target.value)}
//           className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 mb-4"
//         >
//           {REPRICE_SKUS.map((s, i) => (
//             <option key={i} value={i}>{s.name} — ${s.currentPrice.toFixed(2)} (competitor ${s.competitorPrice.toFixed(2)})</option>
//           ))}
//         </select>

//         <div className="flex items-center justify-between mb-1">
//           <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Set New Price</label>
//           <span className="flex items-baseline gap-1.5">
//             <span className={`text-lg font-bold ${+priceDiff < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-slate-100'}`}>
//               ${(+newPrice).toFixed(2)}
//             </span>
//             <span className="text-xs text-gray-400 dark:text-slate-500">
//               ({+priceDiff >= 0 ? '+' : ''}{priceDiff} from current)
//             </span>
//           </span>
//         </div>
//         <input
//           type="range"
//           min={+(sku.competitorPrice * 0.88).toFixed(2)}
//           max={sku.currentPrice}
//           step={0.5}
//           value={newPrice}
//           onChange={e => setNewPrice(+e.target.value)}
//           className="w-full accent-blue-500 cursor-pointer"
//         />
//         <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
//           <span>−12% floor</span>
//           <span>Competitor ${sku.competitorPrice.toFixed(2)}</span>
//           <span>Current ${sku.currentPrice.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* States grid */}
//       <div className="grid grid-cols-2 gap-4 mb-5">
//         <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-chart-line text-red-500 text-xs" /> Current State
//           </h5>
//           <div className="space-y-2.5">
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Price</p>
//               <p className="text-xl font-bold text-gray-900 dark:text-slate-100">${sku.currentPrice.toFixed(2)}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Competitor Gap</p>
//               <p className="text-sm font-bold text-red-600 dark:text-red-400">+${gap} above market</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Buy Box</p>
//               <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{sku.bb}%</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Status</p>
//               <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium">{currentStatus}</span>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Risk Level</p>
//               <p className="text-sm font-bold text-red-600">{sku.riskLevel}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-arrow-trend-up text-green-500 text-xs" /> Projected State
//           </h5>
//           <div className="space-y-2.5">
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Price</p>
//               <p className="text-xl font-bold text-gray-900 dark:text-slate-100">${(+newPrice).toFixed(2)}</p>
//               <p className="text-xs text-green-600 font-medium">{+priceDiff >= 0 ? '+' : ''}{priceDiff}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Competitor Gap</p>
//               <p className={`text-sm font-bold ${+newGap <= 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
//                 {+newGap <= 0 ? 'Price-competitive' : `+$${newGap} above`}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Buy Box</p>
//               <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
//                 {calc.projBB}%
//                 <span className="text-xs font-normal text-green-600 dark:text-green-400 ml-1">+{calc.projBB - sku.bb}pp</span>
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Status</p>
//               <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">{calc.projStatus}</span>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-slate-400">Risk Level</p>
//               <p className={`text-sm font-bold ${calc.projRisk === 'Low' ? 'text-green-600' : 'text-amber-600'}`}>{calc.projRisk}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Impact Analysis */}
//       <div className="mb-5">
//         <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Impact Analysis</h5>
//         <div className="space-y-2.5">
//           <ImpactBar
//             label="Buy Box Win Rate"
//             value={`+${calc.projBB - sku.bb}pp → ${calc.projBB}%`}
//             bar={calc.projBB}
//             color="bg-green-600"
//           />
//           <ImpactBar
//             label="Revenue Projection"
//             value={calc.revDelta >= 0 ? `+$${calc.revDelta.toLocaleString()}` : `-$${Math.abs(calc.revDelta).toLocaleString()}`}
//             bar={Math.min(88, 30 + Math.abs(calc.revDelta / sku.revenue) * 100)}
//             color={calc.revDelta >= 0 ? 'bg-green-600' : 'bg-red-500'}
//           />
//           <ImpactBar
//             label="Competitor Gap Closed"
//             value={+newGap <= 0 ? '100% matched' : `${Math.round((1 - +newGap / +gap) * 100)}% closed`}
//             bar={Math.max(5, 100 - (+newGap <= 0 ? 0 : (+newGap / +gap) * 100))}
//             color={+newGap <= 0 ? 'bg-green-600' : 'bg-amber-500'}
//           />
//         </div>
//       </div>

//       <FooterButtons onClose={onClose} />
//     </>
//   );
// };

// /* ── Launch scenario ─────────────────────────────────────────────────────────── */
// const LAUNCH_CHANNELS = ['TikTok Shop', 'Shopify', 'Walmart Marketplace', 'eBay', 'Instagram Shops'];

// const LaunchContent = ({ step, insight, onClose }) => {
//   const defaultChannel = LAUNCH_CHANNELS.find(c => (step?.title || '').toLowerCase().includes(c.toLowerCase().split(' ')[0])) || LAUNCH_CHANNELS[0];
//   const [channel, setChannel] = useState(defaultChannel);
//   const [budget, setBudget] = useState(1500);

//   const projRevenue = Math.round(budget * 5.8 + 2200);
//   const projReach = Math.round(budget * 3.2 + 800);
//   const projLtv = (budget * 0.0012 + 1.8).toFixed(1);

//   return (
//     <>
//       <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
//         <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 text-sm">{step?.title || 'Launch on New Channel'}</h4>
//         <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">Target Channel</label>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {LAUNCH_CHANNELS.map(c => (
//             <button
//               key={c}
//               onClick={() => setChannel(c)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${channel === c
//                 ? 'bg-blue-500 border-blue-500 text-white'
//                 : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
//               }`}
//             >
//               {c}
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center justify-between mb-1">
//           <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Launch Budget</label>
//           <span className="text-lg font-bold text-gray-900 dark:text-slate-100">${budget.toLocaleString()}/mo</span>
//         </div>
//         <input type="range" min={500} max={5000} step={100} value={budget} onChange={e => setBudget(+e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
//         <div className="flex justify-between text-[10px] text-gray-400 mt-0.5"><span>$500</span><span>$5,000</span></div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-5">
//         <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-900/30 dark:to-slate-800/20 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-chart-line text-gray-400 text-xs" /> Current State
//           </h5>
//           <div className="space-y-2.5">
//             <div><p className="text-xs text-gray-500">Active Channels</p><p className="text-xl font-bold text-gray-900 dark:text-slate-100">1</p></div>
//             <div><p className="text-xs text-gray-500">Weekly Revenue</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">{insight ? '$6,200' : '$5,800'}</p></div>
//             <div><p className="text-xs text-gray-500">Customer Reach</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">412/week</p></div>
//             <div><p className="text-xs text-gray-500">LTV Multiplier</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">1.8x</p></div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-arrow-trend-up text-green-500 text-xs" /> Projected State
//           </h5>
//           <div className="space-y-2.5">
//             <div><p className="text-xs text-gray-500">Active Channels</p><p className="text-xl font-bold text-gray-900 dark:text-slate-100">2</p><p className="text-xs text-green-600 font-medium">+{channel}</p></div>
//             <div><p className="text-xs text-gray-500">Weekly Revenue</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">+${projRevenue.toLocaleString()}</p></div>
//             <div><p className="text-xs text-gray-500">Customer Reach</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">+{projReach.toLocaleString()}/week</p></div>
//             <div><p className="text-xs text-gray-500">LTV Multiplier</p><p className="text-sm font-bold text-green-600 dark:text-green-400">{projLtv}x</p></div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-5">
//         <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Impact Analysis</h5>
//         <div className="space-y-2.5">
//           <ImpactBar label="Revenue Lift" value={`+$${projRevenue.toLocaleString()}/week`} bar={Math.min(88, projRevenue / 200)} color="bg-green-600" />
//           <ImpactBar label="Customer Reach" value={`+${projReach.toLocaleString()} customers`} bar={Math.min(82, projReach / 80)} color="bg-blue-500" />
//           <ImpactBar label="LTV Impact" value={`${projLtv}x multiplier`} bar={parseFloat(projLtv) * 20} color="bg-purple-500" />
//         </div>
//       </div>

//       <FooterButtons onClose={onClose} />
//     </>
//   );
// };

// /* ── Inventory scenario ──────────────────────────────────────────────────────── */
// const InventoryContent = ({ step, insight: _insight, onClose }) => {
//   const [qty, setQty] = useState(500);
//   const currentStock = 120;
//   const velocity = 30;
//   const currentDoc = Math.round(currentStock / velocity);
//   const projStock = currentStock + qty;
//   const projDoc = Math.round(projStock / velocity);
//   const projStatus = projDoc >= 21 ? 'Healthy' : projDoc >= 10 ? 'Low' : 'Critical';
//   const revProtected = Math.round(qty * 24.5);

//   return (
//     <>
//       <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
//         <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 text-sm">{step?.title || 'Restock Inventory'}</h4>
//         <div className="flex items-center justify-between mb-1">
//           <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Reorder Quantity</label>
//           <span className="text-lg font-bold text-gray-900 dark:text-slate-100">{qty.toLocaleString()} units</span>
//         </div>
//         <input type="range" min={100} max={1000} step={50} value={qty} onChange={e => setQty(+e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
//         <div className="flex justify-between text-[10px] text-gray-400 mt-0.5"><span>100 units</span><span>1,000 units</span></div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-5">
//         <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-chart-line text-red-500 text-xs" /> Current State
//           </h5>
//           <div className="space-y-2.5">
//             <div><p className="text-xs text-gray-500">On-Hand Stock</p><p className="text-xl font-bold text-gray-900 dark:text-slate-100">{currentStock} units</p></div>
//             <div><p className="text-xs text-gray-500">Days of Coverage</p><p className="text-sm font-bold text-red-600 dark:text-red-400">{currentDoc} days</p></div>
//             <div><p className="text-xs text-gray-500">Daily Velocity</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">{velocity} units/day</p></div>
//             <div><p className="text-xs text-gray-500">Status</p><span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium">Critical</span></div>
//             <div><p className="text-xs text-gray-500">Risk Level</p><p className="text-sm font-bold text-red-600">High</p></div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-arrow-trend-up text-green-500 text-xs" /> Projected State
//           </h5>
//           <div className="space-y-2.5">
//             <div><p className="text-xs text-gray-500">On-Hand Stock</p><p className="text-xl font-bold text-gray-900 dark:text-slate-100">{projStock} units</p><p className="text-xs text-green-600 font-medium">+{qty}</p></div>
//             <div><p className="text-xs text-gray-500">Days of Coverage</p><p className="text-sm font-bold text-green-600 dark:text-green-400">{projDoc} days <span className="text-xs font-normal text-green-500">+{projDoc - currentDoc}d</span></p></div>
//             <div><p className="text-xs text-gray-500">Daily Velocity</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">{velocity} units/day</p></div>
//             <div><p className="text-xs text-gray-500">Status</p><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">{projStatus}</span></div>
//             <div><p className="text-xs text-gray-500">Risk Level</p><p className={`text-sm font-bold ${projDoc >= 21 ? 'text-green-600' : 'text-amber-600'}`}>{projDoc >= 21 ? 'Low' : 'Medium'}</p></div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-5">
//         <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Impact Analysis</h5>
//         <div className="space-y-2.5">
//           <ImpactBar label="Days of Coverage" value={`+${projDoc - currentDoc} days → ${projDoc}d`} bar={Math.min(92, projDoc * 3)} color="bg-green-600" />
//           <ImpactBar label="Revenue Protected" value={`+$${revProtected.toLocaleString()}`} bar={Math.min(88, revProtected / 400)} color="bg-blue-500" />
//           <ImpactBar label="Stock-Out Risk" value="−85% probability" bar={15} color="bg-red-500" />
//         </div>
//       </div>

//       <FooterButtons onClose={onClose} />
//     </>
//   );
// };

// /* ── Default / Ads / Bundle scenario ─────────────────────────────────────────── */
// const DefaultContent = ({ step, insight: _insight, onClose }) => {
//   const isAds = getScenario(step?.title || '') === 'ads';
//   const isBundle = getScenario(step?.title || '') === 'bundle';
//   const [adjustment, setAdjustment] = useState(50);

//   const projMetric1 = isAds ? Math.round(adjustment * 1.4 + 120) : isBundle ? Math.round(adjustment * 0.6 + 28) : 87;
//   const projMetric2 = isAds ? (adjustment * 0.032 + 2.8).toFixed(1) : isBundle ? Math.round(adjustment * 1.8 + 400) : 24;

//   return (
//     <>
//       <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
//         <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3 text-sm">{step?.title || 'Action Simulation'}</h4>
//         {(isAds || isBundle) && (
//           <div>
//             <div className="flex items-center justify-between mb-1">
//               <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
//                 {isAds ? 'Budget Increase' : 'Bundle Discount'}
//               </label>
//               <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
//                 {isAds ? `+$${adjustment}` : `${adjustment}%`}
//               </span>
//             </div>
//             <input type="range" min={10} max={100} step={5} value={adjustment} onChange={e => setAdjustment(+e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-5">
//         <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-900/30 dark:to-slate-800/20 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-chart-line text-gray-400 text-xs" /> Current State
//           </h5>
//           <div className="space-y-2.5">
//             <div><p className="text-xs text-gray-500">{isAds ? 'Daily Spend' : isBundle ? 'Avg Order Value' : 'Performance Score'}</p><p className="text-xl font-bold text-gray-900 dark:text-slate-100">{isAds ? '$48' : isBundle ? '$28' : '72'}</p></div>
//             <div><p className="text-xs text-gray-500">{isAds ? 'ROAS' : isBundle ? 'Attach Rate' : 'Market Position'}</p><p className="text-sm font-bold text-gray-900 dark:text-slate-100">{isAds ? '2.8x' : isBundle ? '0%' : '#4'}</p></div>
//             <div><p className="text-xs text-gray-500">Risk Level</p><p className="text-sm font-bold text-amber-600">Medium</p></div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
//           <h5 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//             <i className="fa-solid fa-arrow-trend-up text-green-500 text-xs" /> Projected State
//           </h5>
//           <div className="space-y-2.5">
//             <div><p className="text-xs text-gray-500">{isAds ? 'Daily Spend' : isBundle ? 'Avg Order Value' : 'Performance Score'}</p><p className="text-xl font-bold text-gray-900 dark:text-slate-100">{isAds ? `$${48 + adjustment}` : isBundle ? `$${projMetric1}` : '87'}</p><p className="text-xs text-green-600 font-medium">+{isAds ? adjustment : isBundle ? projMetric1 - 28 : 15}</p></div>
//             <div><p className="text-xs text-gray-500">{isAds ? 'ROAS' : isBundle ? 'Attach Rate' : 'Market Position'}</p><p className="text-sm font-bold text-green-600 dark:text-green-400">{isAds ? `${projMetric2}x` : isBundle ? `${Math.min(45, adjustment * 0.4).toFixed(0)}%` : '#2'}</p></div>
//             <div><p className="text-xs text-gray-500">Risk Level</p><p className="text-sm font-bold text-green-600">Low</p></div>
//           </div>
//         </div>
//       </div>

//       <div className="mb-5">
//         <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Impact Analysis</h5>
//         <div className="space-y-2.5">
//           <ImpactBar label={isAds ? 'ROAS Improvement' : isBundle ? 'AOV Increase' : 'Performance Gain'} value={isAds ? `+${(projMetric2 - 2.8).toFixed(1)}x` : isBundle ? `+$${projMetric1 - 28}` : '+15 pts'} bar={isAds ? parseFloat(projMetric2) * 18 : isBundle ? Math.min(80, (projMetric1 - 28) * 2) : 72} color="bg-green-600" />
//           <ImpactBar label={isAds ? 'Revenue Impact' : isBundle ? 'Revenue from Bundles' : 'Efficiency Gain'} value={isAds ? `+$${Math.round(adjustment * 3.2).toLocaleString()}` : isBundle ? `+$${projMetric2.toLocaleString ? projMetric2.toLocaleString() : projMetric2}` : '+24%'} bar={isAds ? Math.min(85, adjustment * 0.9) : 55} color="bg-blue-500" />
//           <ImpactBar label="Risk Reduction" value="−35%" bar={65} color="bg-purple-500" />
//         </div>
//       </div>

//       <FooterButtons onClose={onClose} />
//     </>
//   );
// };

// /* ── Footer ──────────────────────────────────────────────────────────────────── */
// const FooterButtons = ({ onClose }) => (
//   <div className="flex items-center gap-3">
//     <button
//       onClick={onClose}
//       className="flex-1 px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover dark:bg-gray-600 dark:hover:bg-gray-500 transition shadow-sm flex items-center justify-center gap-2"
//     >
//       <i className="fa-solid fa-bolt" /> Stimulate Action
//     </button>
//     <button
//       onClick={onClose}
//       className="px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium transition"
//     >
//       Cancel
//     </button>
//   </div>
// );

// /* ── Main modal ──────────────────────────────────────────────────────────────── */
// const IntelSimulationModal = ({ isOpen, onClose, insight, step }) => {
//   const scenario = getScenario(step?.title || '');

//   return (
//     <BaseModal isOpen={isOpen} onClose={onClose}>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Action Simulation</h3>
//               <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Preview the impact of this action before implementing</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
//             >
//               <i className="fa-solid fa-xmark text-gray-500 dark:text-slate-400 text-lg" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           {scenario === 'reprice'    && <RepriceContent   step={step} insight={insight} onClose={onClose} />}
//           {scenario === 'launch'     && <LaunchContent    step={step} insight={insight} onClose={onClose} />}
//           {scenario === 'inventory'  && <InventoryContent step={step} insight={insight} onClose={onClose} />}
//           {(scenario === 'ads' || scenario === 'bundle' || scenario === 'default') &&
//             <DefaultContent step={step} insight={insight} onClose={onClose} />}
//         </div>
//       </motion.div>
//     </BaseModal>
//   );
// };

// export default IntelSimulationModal;
