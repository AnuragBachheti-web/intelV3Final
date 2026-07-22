// import React, { useState, useRef, useEffect } from 'react';
// import { useChatStore } from '../../../store/useChatStore';

// const RealifyCompanion = () => {
//   const [mode, setMode] = useState('OPERATOR');
//   const [inputValue, setInputValue] = useState('');
//   const streamRef = useRef(null);

//   const { companionConversation, isCompanionThinking, addCompanionMessage, setCompanionThinking } = useChatStore();

//   useEffect(() => {
//     if (streamRef.current) {
//       streamRef.current.scrollTop = streamRef.current.scrollHeight;
//     }
//   }, [companionConversation, isCompanionThinking]);

//   const handleSend = () => {
//     if (!inputValue.trim()) return;
//     const currentInput = inputValue; // Capture current input
//     addCompanionMessage({ label: 'YOU', text: currentInput, type: 'user' });
//     setInputValue('');
//     setCompanionThinking(true);

//     setTimeout(() => {
//       setCompanionThinking(false);
//       let answer = 'Analysed across pricing, margin, inventory and competitive data. Check surfacing cards for actionable recommendations or ask a more specific question.';
//       const l = currentInput.toLowerCase();
//       if (l.includes('bb') || l.includes('buy box')) answer = 'Your BB win rate of 72% reflects last-7-day ownership. Drop from 81% traces to 3 ASINs where TechMaster Pro undercut by $3-$5. Reprice B0XY1234 to $44.49 projects +24pp BB win at -$0.82/unit CM3 impact.';
//       if (l.includes('cm3') || l.includes('margin') || l.includes('share')) answer = 'CM3 is off-plan by $42K MTD. Concentrated on 7 ASINs: pricing compression ($18K), ad spend ($14K), COGS increase ($10K). Top action: reprice 2 ASINs and pause 1 campaign.';
//       if (l.includes('playbook')) answer = 'Seller QRS reprices 14x/day. 70% activity between 06:00-09:00 ET. Strategy: floor-price suppression to win BB then raise post-cart. Recommend floor at $43.80 across 3 overlap ASINs.';
//       if (l.includes('opportunity') || l.includes('defence')) answer = 'Top candidate: Kitchen Silicone Utensils - Score 84/100. Demand 28/30, Competition 16/20. Category avg listing quality 48/100. Projected CM2 38% at $18.99.';

//       addCompanionMessage({ label: 'AGENT · Analysis', text: answer, type: 'agent' });
//     }, 1500);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   const surfacingItems = [
//     { type: 'critical', title: '🔴 BB War', body: 'QRS entered 12 ASINs, reprices 14×/day.', action: 'Open Radar', color: 'red', q: 'Why did QRS enter 12 ASINs?', a: 'Seller QRS reprices 14x/day. 70% activity between 06:00-09:00 ET. Strategy: floor-price suppression to win BB then raise post-cart. Recommend floor at $43.80 across 3 overlap ASINs.' },
//     { type: 'warning', title: '🟡 Share Erosion', body: 'Electronics −2.3pts on 4 ASINs.', action: 'Deep dive', color: 'amber', q: 'Why is Electronics down 2.3 points?', a: 'Your BB win rate of 72% reflects last-7-day ownership. Drop from 81% traces to 3 ASINs where TechMaster Pro undercut by $3-$5. Reprice B0XY1234 to $44.49 projects +24pp BB win at -$0.82/unit CM3 impact.' },
//     { type: 'positive', title: '🟢 Gap Emerged', body: 'Home Décor density −18%.', action: 'Explore', color: 'emerald', q: 'Show me the Home Décor gap', a: 'Top candidate: Kitchen Silicone Utensils - Score 84/100. Demand 28/30, Competition 16/20. Category avg listing quality 48/100. Projected CM2 38% at $18.99.' },
//   ];

//   const handleSurfacingClick = (item) => {
//     addCompanionMessage({ label: 'YOU', text: item.q, type: 'user' });
//     setCompanionThinking(true);
//     setTimeout(() => {
//       setCompanionThinking(false);
//       addCompanionMessage({ label: 'AGENT · Analysis', text: item.a, type: 'agent' });
//     }, 1500);
//   };

//   return (
//     <aside className="w-full flex-shrink-0 sticky sticky-below-header max-h-below-header flex flex-col bg-white dark:bg-slate-900 border-1.5 border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm self-start">
//       {/* Header */}
//       <div className="p-3.5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2.5 bg-gray-50/50 dark:bg-slate-800/30">
//         <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
//           <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
//             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
//           </svg>
//         </div>
//         <div className="min-w-0 flex-1">
//           <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">Realify Companion</div>
//           <div className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tight">M-04 Competitor Radar</div>
//         </div>
//         <button
//           onClick={() => setMode(mode === 'OPERATOR' ? 'AI' : 'OPERATOR')}
//           className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800 hover:bg-blue-100 transition-colors"
//         >
//           {mode}
//         </button>
//       </div>

//       {/* Surfacing Section */}
//       <div className="p-3.5 border-b border-gray-50 dark:border-slate-800 overflow-y-auto max-h-[220px] custom-scrollbar">
//         <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Surfacing &middot; 3 active</div>
//         <div className="space-y-2">
//           {surfacingItems.map((item, i) => (
//             <div key={i} onClick={() => handleSurfacingClick(item)} className={`p-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20 border-l-4 border-l-${item.color}-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer relative group`}>
//               <button onClick={(e) => { e.stopPropagation(); }} className="absolute top-2 right-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <i className="fa-solid fa-xmark text-[9px]"></i>
//               </button>
//               <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 mb-0.5 leading-tight">{item.title}</div>
//               <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{item.body}</div>
//               <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1.5">{item.action}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Conversation Stream */}
//       <div ref={streamRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar bg-white dark:bg-slate-900">
//         <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Conversation</div>
//         {companionConversation.map((msg, i) => (
//           <div key={i} className={`p-3 rounded-xl border ${msg.type === 'user' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 ml-4' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 mr-4'}`}>
//             <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${msg.type === 'user' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'}`}>{msg.label}</div>
//             <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{msg.text}</div>
//             {msg.action && (
//               <div className="mt-2.5 flex gap-2">
//                 <button className="text-[10px] font-bold px-3 py-1 bg-brand text-white rounded-lg shadow-sm hover:bg-brand-hover dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors">{msg.action}</button>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Thinking Indicator */}
//         {isCompanionThinking && (
//           <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 opacity-60 mr-4">
//             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">AGENT - Thinking</div>
//             <div className="space-y-1.5">
//               <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
//               <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
//             </div>
//             <div className="text-[9px] text-slate-400 mt-2 italic font-medium">analysing market shifts...</div>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="p-3.5 bg-gray-50/50 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800">
//         <div className="flex flex-wrap gap-1.5 mb-3">
//           {['Summarise playbook', 'Deep dive share', 'Draft defence'].map((chip) => (
//             <button
//               key={chip}
//               onClick={() => {
//                 const txt = chip;
//                 setInputValue(txt);
//                 // use immediate value for sending
//                 addCompanionMessage({ label: 'YOU', text: txt, type: 'user' });
//                 setInputValue('');
//                 setCompanionThinking(true);
//                 setTimeout(() => {
//                   setCompanionThinking(false);
//                   let ans = 'Analysed across pricing, margin, inventory and competitive data. Check surfacing cards for actionable recommendations.';
//                   if (txt.includes('playbook')) ans = 'Seller QRS reprices 14x/day. 70% activity between 06:00-09:00 ET. Strategy: floor-price suppression to win BB then raise post-cart. Recommend floor at $43.80 across 3 overlap ASINs.';
//                   if (txt.includes('share')) ans = 'Your BB win rate of 72% reflects last-7-day ownership. Drop from 81% traces to 3 ASINs where TechMaster Pro undercut by $3-$5. Reprice B0XY1234 to $44.49 projects +24pp BB win at -$0.82/unit CM3 impact.';
//                   if (txt.includes('defence')) ans = 'Top candidate: Kitchen Silicone Utensils - Score 84/100. Demand 28/30, Competition 16/20. Category avg listing quality 48/100. Projected CM2 38% at $18.99.';
//                   addCompanionMessage({ label: 'AGENT · Analysis', text: ans, type: 'agent' });
//                 }, 1500);
//               }}
//               className="text-[10px] font-bold px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:border-blue-500 transition-all shadow-sm"
//             >
//               {chip}
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="Ask Realify..."
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand/30 dark:focus:ring-gray-500/30 focus:border-transparent outline-none dark:text-slate-200"
//           />
//           <button onClick={handleSend} className="w-8 h-8 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-brand-hover dark:bg-gray-600 dark:hover:bg-gray-500 transition-all shadow-md shadow-black/10 dark:shadow-gray-700/20">
//             <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
//               <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//             </svg>
//           </button>
//         </div>
//         <div className="text-center text-[9px] text-slate-300 dark:text-slate-600 font-bold tracking-widest mt-2 uppercase">AI CAN MAKE MISTAKES</div>
//       </div>
//     </aside>
//   );
// };

// export default RealifyCompanion;
