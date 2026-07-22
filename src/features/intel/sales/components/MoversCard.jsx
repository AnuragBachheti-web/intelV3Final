// import React from 'react';

// const MoversCard = ({ title, items, type = 'top' }) => {
//   return (
//     <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center">
//           <i className={`fa-solid ${type === 'top' ? 'fa-arrow-trend-up text-green-600' : 'fa-arrow-trend-down text-red-500'} mr-2`}></i>
//           {title}
//         </h3>
//         <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">View all</button>
//       </div>
//       <div className="space-y-4">
//         {items.map((item, idx) => (
//           <div key={idx} className="flex items-center justify-between group cursor-pointer">
//             <div className="flex items-center gap-3">
//               <div className={`w-8 h-8 ${type === 'top' ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500'} rounded-lg flex items-center justify-center text-xs font-bold`}>
//                 {idx + 1}
//               </div>
//               <div className="min-w-0">
//                 <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate w-32 md:w-40 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
//                   {item.name}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-slate-400">{item.sku}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.revenue}</p>
//               <p className={`text-xs font-semibold ${type === 'top' ? 'text-green-600' : 'text-red-500'}`}>
//                 {item.change}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MoversCard;
