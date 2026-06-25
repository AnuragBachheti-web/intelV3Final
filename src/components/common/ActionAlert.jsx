import React from 'react';

// const ActionAlert = ({ 
//   title, 
//   subtitle, 
//   items = [], 
//   actionLabel, 
//   onAction, 
//   type = 'warning' 
// }) => {
//   const isCritical = type === 'critical';
  
//   return (
//     <div className={`mb-6 bg-gradient-to-r ${
//       isCritical 
//         ? 'from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900/50' 
//         : 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900/50'
//     } border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md`} 
//     style={{ borderLeft: `4px solid ${isCritical ? '#ef4444' : '#f59e0b'}` }}>
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//         <div className={`w-10 h-10 ${
//           isCritical ? 'bg-red-100 dark:bg-red-900/40' : 'bg-amber-100 dark:bg-amber-900/40'
//         } rounded-xl flex items-center justify-center flex-shrink-0`}>
//           <i className={`fa-solid ${isCritical ? 'fa-circle-exclamation' : 'fa-triangle-exclamation'} ${
//             isCritical ? 'text-red-600 dark:text-red-500' : 'text-amber-600 dark:text-amber-500'
//           }`}></i>
//         </div>
//         <div className="flex-1">
//           <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">{title}</h3>
//           <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{subtitle}</p>
//           {items.length > 0 && (
//             <div className="flex items-center gap-2 flex-wrap">
//               {items.map((item, idx) => (
//                 <span key={idx} className={`px-2.5 py-1 ${
//                   item.type === 'danger' 
//                     ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
//                     : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
//                 } text-xs font-semibold rounded-lg border ${
//                   item.type === 'danger' ? 'border-red-200 dark:border-red-900/50' : 'border-amber-200 dark:border-amber-900/50'
//                 }`}>
//                   {item.label}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//         {actionLabel && (
//           <button 
//             onClick={onAction}
//             className={`px-4 py-2 ${
//               isCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
//             } text-white text-sm font-medium rounded-xl transition flex-shrink-0 shadow-sm`}
//           >
//             {actionLabel}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

const ActionAlert = () => null;

export default ActionAlert;
