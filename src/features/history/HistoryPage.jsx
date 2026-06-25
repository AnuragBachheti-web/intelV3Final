import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import HistoryItem from './components/HistoryItem';
import HistoryRightSidebar from './components/HistoryRightSidebar';
import ChatDetailView from './components/ChatDetailView';
import RecentHistorySidebar from './components/RecentHistorySidebar';
import ModelSelector from '../../components/common/ModelSelector';
import { historyItems, quickFilters, modules, mostUsedSearches, MODULE_ITEM_IDS } from './historyData';

// Flat array used for filtering — defined once outside the component
const allItems = [
  ...historyItems.today.map(i => ({ ...i, section: 'Today' })),
  ...historyItems.yesterday.map(i => ({ ...i, section: 'Yesterday' })),
  ...historyItems.week.map(i => ({ ...i, section: 'Previous 7 Days' })),
];

const HistoryPage = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputValue, setInputValue]     = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState(location.state?.moduleFilter || null);

  useEffect(() => {
    const chatId  = location.state?.chatId;
    const mFilter = location.state?.moduleFilter;
    if (mFilter !== undefined) setModuleFilter(mFilter || null);
    if (chatId) {
      const found = allItems.find(i => i.id === chatId);
      if (found) setSelectedChat(found);
    }
  }, [location.state?.chatId, location.state?.moduleFilter]);

  // Bookmark state — initialised from data, updated in memory
  const [bookmarks, setBookmarks] = useState(
    () => new Set(allItems.filter(i => i.bookmarked).map(i => i.id))
  );

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Merge live bookmark state into items
  const augment = (item) => ({ ...item, bookmarked: bookmarks.has(item.id) });

  const todayItems = historyItems.today.map(augment);
  const yestItems  = historyItems.yesterday.map(augment);
  const weekItems  = historyItems.week.map(augment);

  // Items for flat filter views
  const filteredFlat = useMemo(() => {
    const augmented = allItems.map(i => ({ ...i, bookmarked: bookmarks.has(i.id) }));
    if (activeFilter === 'bookmarked') return augmented.filter(i => i.bookmarked);
    if (activeFilter === 'artifacts')  return augmented.filter(i => i.files || i.charts);
    return [];
  }, [bookmarks, activeFilter]);

  const isFiltered = activeFilter === 'bookmarked' || activeFilter === 'artifacts';

  // Items for module-filtered view
  const moduleItems = useMemo(() => {
    if (!moduleFilter) return [];
    const ids = MODULE_ITEM_IDS[moduleFilter] || [];
    return allItems.filter(i => ids.includes(i.id)).map(i => ({ ...i, bookmarked: bookmarks.has(i.id) }));
  }, [moduleFilter, bookmarks]);

  // Truncate long titles so the header never breaks layout
  const pageTitle = selectedChat
    ? (selectedChat.title.length > 52
        ? selectedChat.title.slice(0, 52) + '…'
        : selectedChat.title)
    : 'History';

  return (
    <DashboardLayout
      title={pageTitle}
      subtitle={selectedChat ? '' : 'Track your previous intelligence searches and AI analysis'}
      showTabs={false}
      showAIPrompt={false}
      noPadding={!!selectedChat}
      contentClassName={selectedChat ? '!p-0 !overflow-hidden' : ''}
    >
      {selectedChat ? (
        /*
         * h-full inherits the defined height from <main> (which is flex-1 in a flex-col parent).
         * flex-1 would have no effect here because <main> is a block container, not flex.
         */
        <div className="flex h-full overflow-hidden">

          {/* Left: chat content (scrolls) + prompt (pinned) */}
          <div className="flex flex-col flex-1 min-h-0">

            {/* Scrollable chat messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 min-h-0">
              <ChatDetailView chat={selectedChat} onBack={() => setSelectedChat(null)} />
            </div>

            {/* Pinned prompt — lives outside the scroll container, never moves */}
            <div className="shrink-0 px-4 sm:px-6 pb-5 pt-3 bg-gradient-to-t from-white dark:from-[#030712] via-white/90 dark:via-[#030712]/90 to-transparent">
              <div className="max-w-5xl ml-[26px] mr-auto">
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <button className="w-7 h-7 flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white rounded-full transition-colors flex-shrink-0">
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Ask anything about ${selectedChat.title.split(' ').slice(0, 5).join(' ').toLowerCase()}...`}
                      className="flex-1 bg-transparent text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-1 border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <i className="fa-solid fa-sliders text-sm"></i>
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <i className="fa-solid fa-microphone text-sm"></i>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <ModelSelector variant="compact" />
                      <button
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                          inputValue.trim()
                            ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 hover:bg-gray-700'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default'
                        }`}
                      >
                        <i className="fa-solid fa-arrow-up text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">AI can make mistakes.</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">100% tokens available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: sidebar with its own independent scroll */}
          <RecentHistorySidebar
            currentChatId={selectedChat.id}
            onChatSelect={(chat) => chat ? setSelectedChat(chat) : setSelectedChat(null)}
            moduleFilter={moduleFilter}
          />
        </div>
      ) : (
        /* List view */
        <div className="flex flex-col lg:flex-row gap-8 min-h-full">
          <div className="flex-1">

            {/* Search bar */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand dark:focus:ring-gray-500/20 dark:focus:border-gray-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {moduleFilter ? (
              /* ── Module filtered view (Intel / Research) ── */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModuleFilter(null)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-gray-700 dark:hover:bg-slate-300 transition-colors"
                    >
                      <i className="fa-solid fa-arrow-left text-[10px]" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 capitalize">
                      {moduleFilter}
                    </h2>
                  </div>
                  <button
                    onClick={() => setModuleFilter(null)}
                    className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Clear filter
                  </button>
                </div>
                {moduleItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {moduleItems.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedChat(item)}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">No items in this module yet.</p>
                  </div>
                )}
              </div>
            ) : isFiltered ? (
              /* ── Flat filtered view (Bookmarked / Artifacts) ── */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 capitalize">
                    {activeFilter === 'bookmarked' ? 'Bookmarked' : 'Artifacts'}
                  </h2>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Clear filter
                  </button>
                </div>

                {filteredFlat.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredFlat.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedChat(item)}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <i className={`fa-solid ${activeFilter === 'artifacts' ? 'fa-file' : 'fa-bookmark'} text-gray-400 dark:text-slate-500 text-lg`}></i>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      {activeFilter === 'artifacts' ? 'No artifacts available.' : 'No bookmarked chats yet.'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      {activeFilter === 'artifacts'
                        ? 'Chats with files or charts will appear here.'
                        : 'Click the bookmark icon on any chat to save it.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ── Grouped view: Today / Yesterday / 7 Days ── */
              <>
                <div id="today-section" className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Today</h2>
                    <button className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors">Clear all</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {todayItems.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedChat(item)}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                </div>

                <div id="yesterday-section" className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Yesterday</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {yestItems.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedChat(item)}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                </div>

                <div id="week-section" className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Previous 7 Days</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {weekItems.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedChat(item)}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center py-8">
                  <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                    Load more history
                  </button>
                </div>
              </>
            )}
          </div>

          <HistoryRightSidebar
            quickFilters={quickFilters}
            modules={modules}
            mostUsedSearches={mostUsedSearches}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            bookmarkCount={bookmarks.size}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default HistoryPage;
