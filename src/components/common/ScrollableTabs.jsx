import React, { useRef, useState, useEffect, useCallback } from 'react';

const ScrollableTabs = ({ tabs, activeTab, onTabChange }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, tabs]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center border-b border-gray-100 dark:border-slate-800/80">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="flex-shrink-0 z-10 px-2.5 py-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800"
        >
          <i className="fa-solid fa-chevron-left text-[10px]"></i>
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 p-3 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === tab
                ? 'bg-brand text-white shadow-sm dark:bg-gray-600'
                : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="flex-shrink-0 z-10 px-2.5 py-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800"
        >
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      )}
    </div>
  );
};

export default ScrollableTabs;
