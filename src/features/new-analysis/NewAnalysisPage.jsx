import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisCategories } from './analysisData';
import ModelSelector from '../../components/common/ModelSelector';
import { useAuthStore } from '../../store/useAuthStore';
import logoDark from '../../assets/logo_dark.png';
import logoLight from '../../assets/logo_white.png';
import { useNavigate } from 'react-router-dom';

const CategoryTab = ({ cat, idx, activeSuggestion, setActiveSuggestion }) => {
  const [tooltip, setTooltip] = useState(null);
  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setActiveSuggestion(activeSuggestion === idx ? null : idx)}
        onMouseEnter={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTooltip({ top: r.bottom + 8, left: r.left });
          // Mobile: reveal the suggestions panel on hover instead of requiring a tap.
          if (window.innerWidth < 640) setActiveSuggestion(idx);
        }}
        onMouseLeave={() => setTooltip(null)}
        className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 border rounded-xl text-sm font-semibold transition-all hover:shadow-sm ${
          activeSuggestion === idx
            ? 'bg-brand text-white border-brand dark:bg-gray-600 dark:border-gray-600'
            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600 text-gray-600 dark:text-slate-300'
        }`}
      >
        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${activeSuggestion === idx ? 'bg-white/20' : cat.color}`}>
          <i className={`fa-solid ${cat.icon} text-[10px] text-black dark:text-white`}></i>
        </div>
        {cat.title}
      </button>

      {tooltip && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', top: tooltip.top, left: tooltip.left, zIndex: 99999 }}
          className="w-56 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg px-3 py-2 pointer-events-none shadow-xl"
        >
          {cat.desc}
          <div className="absolute -top-1 left-5 w-2 h-2 bg-slate-900 rotate-45" />
        </div>,
        document.body
      )}
    </div>
  );
};

const NewAnalysisPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const _navigate = useNavigate();

  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const userName = user?.name || 'User';

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const _recentHistory = [
    {
      day: 'Today', items: [
        { type: 'message', text: 'Q3 Market Analysis for Tech Sector and recent trends' },
        { type: 'message', text: 'Competitor breakdown: Acme vs Globex pricing' }
      ]
    },
    {
      day: 'Previous 7 Days', items: [
        { type: 'chart', text: 'Revenue projection model based on historical data' },
        { type: 'file', text: 'Summarize Q2 earnings report PDF' },
        { type: 'message', text: 'Drafting a cold outreach email template for sales' },
        { type: 'message', text: 'Best practices for user onboarding flows' }
      ]
    }
  ];

  return (
    <DashboardLayout showTabs={false} showAIPrompt={false} noPadding contentClassName="!p-0 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto hide-scroll px-4 sm:px-6 lg:px-8 py-4 md:py-6">

          <div className="mb-5 sm:mb-8 text-center mt-4 md:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 sm:gap-3"
            >
              <img src={logoDark} alt="Realify" className="h-6 sm:h-10 object-contain block dark:hidden opacity-80" />
              <img src={logoLight} alt="Realify" className="h-6 sm:h-10 object-contain hidden dark:block opacity-80" />
              <h2 className="text-[22px] sm:text-[40px] font-medium tracking-tight text-gray-900 dark:text-slate-100" style={{ fontWeight: 200 }}>
                {greeting}, {userName}
              </h2>
            </motion.div>
          </div>

          <div className="w-full max-w-3xl flex flex-col gap-6">
            {/* Prompt Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-slate-500/20 focus-within:border-slate-500 transition-all">
              <div className="p-3 sm:p-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full resize-none bg-transparent border-none focus:ring-0 outline-none text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-base sm:text-lg min-h-[40px] sm:min-h-[60px] p-0"
                  placeholder="How may I help you?"
                  rows="1"
                />
              </div>

              <div className="flex items-center justify-between p-3 py-2.5 bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  {/* Attach Button */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('attach')}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-600"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    {activeDropdown === 'attach' && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-2">
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3">
                          <i className="fa-solid fa-paperclip text-gray-400"></i> Upload File
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3">
                          <i className="fa-solid fa-image text-gray-400"></i> Upload Image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mic Button */}
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-7 h-7 flex items-center justify-center rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-600 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-slate-400'
                      }`}
                  >
                    <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                  </button>

                </div>

                <div className="flex items-center gap-3">
                  <ModelSelector />

                  <button className="w-8 h-8 bg-brand hover:bg-brand-hover text-white dark:bg-gray-600 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95">
                    <i className="fa-solid fa-arrow-up"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt footer */}
            <div className="flex justify-between items-center px-2 -mt-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">Realify is AI & can make mistakes.</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">100% tokens available</span>
            </div>

            {/* Category Tab Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {analysisCategories.map((cat, idx) => (
                  <CategoryTab
                    key={idx}
                    cat={cat}
                    idx={idx}
                    activeSuggestion={activeSuggestion}
                    setActiveSuggestion={setActiveSuggestion}
                  />
                ))}
              </div>

              {/* Suggestions Panel */}
              <AnimatePresence>
                {activeSuggestion !== null && (
                  <motion.div
                    key={activeSuggestion}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                        <i className={`fa-solid ${analysisCategories[activeSuggestion].icon} text-xs`}></i>
                        <span>{analysisCategories[activeSuggestion].title}</span>
                      </div>
                      <button
                        onClick={() => setActiveSuggestion(null)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
                      >
                        <span>Close suggestions</span>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div>
                      {analysisCategories[activeSuggestion].suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { setPrompt(s); setActiveSuggestion(null); }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800 last:border-0 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Right Sidebar - History */}
        {/* Hidden for now */}
        {/* <div className="hidden xl:flex flex-col w-72 min-h-0 shrink-0 my-4 mr-4 bg-[#F6F8FC] dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#E5EAF2] dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
            <h2 className="font-bold text-gray-900 dark:text-slate-100">Recent History</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide min-h-0">
            {recentHistory.map((section, sIdx) => (
              <div key={sIdx} className="mb-6">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mb-3 px-2">
                  {section.day}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx}>
                      <a href="#" className="block px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-sm text-sm text-gray-700 dark:text-slate-300 transition-all group">
                        <div className="flex items-start gap-2">
                          <i className={`fa-${item.type === 'message' ? 'regular fa-message' : item.type === 'chart' ? 'solid fa-chart-line' : 'regular fa-file-lines'} mt-0.5 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300`}></i>
                          <span className="line-clamp-2 leading-tight text-[12px]">{item.text}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
            <button 
               onClick={() => navigate('/history')}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl p-2 text-sm font-bold transition-all shadow-sm text-gray-700 dark:text-slate-200">
              <span>View all history</span>
            </button>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default NewAnalysisPage;
