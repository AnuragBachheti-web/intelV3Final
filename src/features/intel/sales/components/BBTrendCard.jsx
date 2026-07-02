// import React from 'react';

// const BBTrendCard = ({ value, change, isPositive = true }) => {
//   return (
//     <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center">
//           <i className="fa-solid fa-trophy text-yellow-500 mr-2"></i>
//           Buy Box % Trend
//         </h3>
//         <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">Details</button>
//       </div>
      
//       <div className="flex items-baseline gap-2 mb-4">
//         <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{value}</span>
//         <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
//           {isPositive ? '+' : ''}{change}
//         </span>
//       </div>

//       <div className="h-24 w-full relative mb-4 overflow-visible">
//         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
//           <path
//             d="M0 35 Q 10 25, 20 30 T 40 20 T 60 28 T 80 15 T 100 25"
//             fill="none"
//             style={{ stroke: 'rgb(var(--cb-600))' }}
//             strokeWidth="3"
//             strokeLinecap="round"
//           />
//           <path
//             d="M0 35 Q 10 25, 20 30 T 40 20 T 60 28 T 80 15 T 100 25 L 100 40 L 0 40 Z"
//             style={{ fill: 'rgb(var(--cb-600) / 0.05)' }}
//           />
//         </svg>
//       </div>

//       <div className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
//         <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-tight">
//           <i className="fa-solid fa-triangle-exclamation mr-1"></i>
//           BB% dropped below 85% on Apr 22 — 3 ASINs lost BB
//         </p>
//         <button className="text-[11px] text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap ml-2">Investigate</button>
//       </div>
//     </div>
//   );
// };

// export default BBTrendCard;
