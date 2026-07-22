// import React from 'react';
// import { historyItems, MODULE_ITEM_IDS } from '../historyData';

// const RecentHistorySidebar = ({ currentChatId, onChatSelect, moduleFilter }) => {
//   const allToday    = historyItems.today;
//   const allPrevious = [...historyItems.yesterday, ...historyItems.week];

//   const filterByModule = (items) => {
//     if (!moduleFilter) return items;
//     const ids = MODULE_ITEM_IDS[moduleFilter] || [];
//     return items.filter(c => ids.includes(c.id));
//   };

//   const todayChats    = filterByModule(allToday);
//   const previousChats = filterByModule(allPrevious);

//   const sectionLabel = moduleFilter
//     ? moduleFilter.charAt(0).toUpperCase() + moduleFilter.slice(1)
//     : null;

//   const ChatRow = ({ chat }) => (
//     <button
//       onClick={() => onChatSelect(chat)}
//       className={`w-full text-left flex items-start gap-2 px-2.5 py-2 rounded-lg transition-colors ${
//         currentChatId === chat.id
//           ? 'bg-gray-100 dark:bg-purple-900/30'
//           : 'hover:bg-white dark:hover:bg-slate-800'
//       }`}
//     >
//       <i className={`fa-regular fa-message text-[9px] mt-1 shrink-0 ${
//         currentChatId === chat.id
//           ? 'text-gray-700 dark:text-purple-400'
//           : 'text-gray-400 dark:text-slate-500'
//       }`}></i>
//       <span className={`text-xs leading-relaxed line-clamp-2 ${
//         currentChatId === chat.id
//           ? 'text-gray-900 dark:text-purple-400 font-medium'
//           : 'text-gray-700 dark:text-slate-300'
//       }`}>
//         {chat.title}
//       </span>
//     </button>
//   );

//   return (
//     <aside className="hidden xl:flex flex-col w-72 min-h-0 shrink-0 my-4 mr-4 bg-[#f8f9fc] dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
//       {/* Header */}
//       <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800">
//         <h2 className="font-semibold text-sm text-gray-900 dark:text-slate-100">
//           {sectionLabel ? `${sectionLabel} History` : 'Recent History'}
//         </h2>
//         <button className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
//           <i className="fa-solid fa-magnifying-glass text-xs"></i>
//         </button>
//       </div>

//       {/* Scrollable list */}
//       <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-4 custom-scrollbar">
//         {/* TODAY */}
//         {todayChats.length > 0 && (
//           <div>
//             <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest px-2 py-1.5">TODAY</p>
//             <div className="space-y-0.5">
//               {todayChats.map((chat) => (
//                 <ChatRow key={chat.id} chat={chat} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* PREVIOUS 7 DAYS */}
//         {previousChats.length > 0 && (
//           <div>
//             <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest px-2 py-1.5">PREVIOUS 7 DAYS</p>
//             <div className="space-y-0.5">
//               {previousChats.map((chat) => (
//                 <ChatRow key={chat.id} chat={chat} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Empty state when module filter yields nothing */}
//         {moduleFilter && todayChats.length === 0 && previousChats.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-10 text-center px-4">
//             <p className="text-xs text-gray-400 dark:text-slate-500">No {sectionLabel} history yet.</p>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-slate-800">
//         <button
//           className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
//         >
//           <span>View all history</span>
//           <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default RecentHistorySidebar;
