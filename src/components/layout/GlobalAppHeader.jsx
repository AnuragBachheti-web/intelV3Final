import React, { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFilterStore } from '../../store/useFilterStore';
import { useHeaderScroll, notifyHeaderMeasured } from '../../hooks/useHeaderScroll';
import { useSimulationStore } from '../../store/useSimulationStore';
import useClickOutside from '../../hooks/useClickOutside';

const CHANNEL_OPTS = [
  ['all', 'All Channels'],
  ['amazon', 'Amazon'],
  ['shopify', 'Shopify'],
  ['tiktok-shop', 'TikTok Shop'],
];
const CATEGORY_OPTS = [
  ['all', 'All Categories'],
  ['electronics', 'Electronics'],
  ['home-garden', 'Home & Garden'],
  ['apparel', 'Apparel'],
];
const QUICK_DATE_OPTS = [
  { label: 'Last 7 Days', value: 'last-7-days' },
  { label: 'Last 30 Days', value: 'last-30-days' },
  { label: 'Last 90 Days', value: 'last-90-days' },
];
const MONTHS_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_ABBR = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const FilterPopover = ({ dateRange, setDateRange, category, setCategory, channel, setChannel, onPendingCountChange }) => {
  const now = new Date();

  const [open, setOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('date');

  const [pendingDate, setPendingDate] = useState(dateRange);
  const [pendingCategory, setPendingCategory] = useState(category);
  const [pendingChannel, setPendingChannel] = useState(channel);

  // Left calendar month (right = +1)
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() > 0 ? now.getMonth() - 1 : 0);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const rightYear = calMonth === 11 ? calYear + 1 : calYear;
  const rightMonth = calMonth === 11 ? 0 : calMonth + 1;

  // Report pending count to parent (for bell badge)
  useEffect(() => {
    if (!open) {
      onPendingCountChange?.(0);
      return;
    }
    const count = [pendingDate, pendingCategory, pendingChannel].filter(v => v !== 'all').length;
    onPendingCountChange?.(count);
  }, [open, pendingDate, pendingCategory, pendingChannel]);

  // Click-outside to close
  useClickOutside(panelRef, open, () => setOpen(false), btnRef);

  const toggleOpen = () => {
    if (!open) {
      setPendingDate(dateRange);
      setPendingCategory(category);
      setPendingChannel(channel);
      setRangeStart(null);
      setRangeEnd(null);
    }
    setOpen(v => !v);
  };

  const handleUpdate = () => {
    setDateRange(pendingDate);
    setCategory(pendingCategory);
    setChannel(pendingChannel);
    setOpen(false);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleDateClick = (year, month, day) => {
    const clicked = new Date(year, month, day);
    if (!rangeStart || rangeEnd) {
      setRangeStart(clicked);
      setRangeEnd(null);
      setPendingDate('custom');
    } else {
      if (clicked < rangeStart) { setRangeEnd(rangeStart); setRangeStart(clicked); }
      else { setRangeEnd(clicked); }
      setPendingDate('custom');
    }
    setHoverDate(null);
  };

  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const isInRange = (year, month, day) => {
    const d = new Date(year, month, day);
    const end = rangeEnd || hoverDate;
    if (!rangeStart || !end) return false;
    const [s, e] = rangeStart <= end ? [rangeStart, end] : [end, rangeStart];
    return d > s && d < e;
  };

  const renderCal = (year, month, showPrev, showNext) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const cells = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    return (
      <div className="flex-1 min-w-[185px]">
        <div className="flex items-center justify-between mb-3">
          {showPrev
            ? <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"><i className="fa-solid fa-chevron-left text-[9px]" /></button>
            : <div className="w-6" />}
          <span className="text-[13px] font-semibold text-gray-800 dark:text-slate-200">
            {MONTHS_NAMES[month]} <span className="font-normal text-gray-500 dark:text-slate-400">{year}</span>
          </span>
          {showNext
            ? <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"><i className="fa-solid fa-chevron-right text-[9px]" /></button>
            : <div className="w-6" />}
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAY_ABBR.map(d => <div key={d} className="text-center text-[10px] font-medium text-gray-400 dark:text-slate-500 py-0.5">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const d = new Date(year, month, day);
            const isStart = sameDay(rangeStart, d);
            const isEnd = sameDay(rangeEnd, d);
            const inRange = isInRange(year, month, day);
            const isToday = sameDay(now, d);
            return (
              <button
                key={day}
                onClick={() => handleDateClick(year, month, day)}
                onMouseEnter={() => rangeStart && !rangeEnd && setHoverDate(d)}
                onMouseLeave={() => setHoverDate(null)}
                className={`relative h-7 w-full flex items-center justify-center text-[12px] rounded transition-colors
                  ${isStart || isEnd ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 font-semibold' : ''}
                  ${inRange ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300' : ''}
                  ${!isStart && !isEnd && !inRange ? 'hover:bg-gray-100 dark:hover:bg-slate-800/60 text-gray-700 dark:text-slate-300' : ''}
                `}
              >
                {day}
                {isToday && !isStart && !isEnd && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRadioList = (opts, val, setVal) => (
    <div className="space-y-0.5 pt-1">
      {opts.map(([v, label]) => {
        const selected = val === v;
        return (
          <button key={v} onClick={() => setVal(v)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/40 text-left transition-colors"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-gray-900 dark:border-slate-200 bg-gray-900 dark:bg-slate-200' : 'border-gray-300 dark:border-slate-600'}`}>
              {selected && <div className="w-1.5 h-1.5 bg-white dark:bg-gray-900 rounded-full" />}
            </div>
            <span className={`text-sm ${selected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );

  const channelLabel = CHANNEL_OPTS.find(([v]) => v === pendingChannel)?.[1] || 'All Channels';
  const categoryLabel = CATEGORY_OPTS.find(([v]) => v === pendingCategory)?.[1] || 'All Categories';
  const navItems = [
    { id: 'date', label: 'Select Date' },
    { id: 'channel', label: channelLabel },
    { id: 'category', label: categoryLabel },
  ];

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={toggleOpen}
        title="Filters"
        className={`relative w-8 h-8 flex items-center justify-center rounded-xl border shadow-sm transition-all active:scale-95 ${
          open
            ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-200 text-white dark:text-gray-900'
            : 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <i className="fa-solid fa-sliders text-xs" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl z-[9999] overflow-hidden flex flex-col"
          style={{ width: 572 }}
        >
          <div className="flex" style={{ minHeight: 260 }}>
            {/* Left nav */}
            <div className="flex flex-col py-3 gap-1 px-2 flex-shrink-0 border-r border-gray-100 dark:border-slate-800" style={{ width: 148 }}>
              {navItems.map(nav => (
                <button
                  key={nav.id}
                  onClick={() => setActiveNav(nav.id)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-left transition-colors ${
                    activeNav === nav.id
                      ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    activeNav === nav.id ? 'border-white dark:border-gray-900 bg-white dark:bg-gray-900' : 'border-gray-300 dark:border-slate-600'
                  }`}>
                    {activeNav === nav.id && <div className="w-1 h-1 bg-gray-900 dark:bg-slate-100 rounded-full" />}
                  </div>
                  <span className="text-[12px] font-medium truncate">{nav.label}</span>
                </button>
              ))}
            </div>

            {/* Right content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeNav === 'date' && (
                <div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500">Quick Filters</span>
                    {QUICK_DATE_OPTS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setPendingDate(opt.value); setRangeStart(null); setRangeEnd(null); }}
                        className={`px-3 py-1 rounded-full text-[11px] border transition-colors ${
                          pendingDate === opt.value
                            ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100 font-semibold'
                            : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {renderCal(calYear, calMonth, true, false)}
                    <div className="w-px bg-gray-100 dark:bg-slate-800 flex-shrink-0 self-stretch" />
                    {renderCal(rightYear, rightMonth, false, true)}
                  </div>
                </div>
              )}
              {activeNav === 'channel' && renderRadioList(CHANNEL_OPTS, pendingChannel, setPendingChannel)}
              {activeNav === 'category' && renderRadioList(CATEGORY_OPTS, pendingCategory, setPendingCategory)}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-slate-800 px-4 py-3 flex items-center justify-end gap-2.5">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-colors rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-5 py-2 bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-700 dark:hover:bg-slate-200 active:scale-[0.98] transition-all"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TOOLBAR = { compressed: 64, expanded: 84 };

const GlobalAppHeader = ({
  title,
  subtitle,
  onNotificationClick,
  shopProfile,
  customRightElement,
  showTabs = true,
  tabs,
  filters: customFilters,
  scrollRef,
  activeTabPath,
  tabsOnly = false,
  showSearch = false,
  renderOnly = null,
  searchCollapsed = false,
  centerElement = null,
}) => {
  const location = useLocation();
  const {
    searchQuery, setSearchQuery,
    dateRange, setDateRange,
    category, setCategory,
    channel, setChannel,
  } = useFilterStore();

  const secondaryRef = useRef(null);
  const { isCompressed, forceExpand } = useHeaderScroll(TOOLBAR, scrollRef);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filterPreviewCount, setFilterPreviewCount] = useState(0);
  const searchInputRef = useRef(null);
  const { isSimulating, progress: globalProgress } = useSimulationStore();

  useEffect(() => {
    if (!searchCollapsed) setSearchExpanded(false);
  }, [searchCollapsed]);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  useLayoutEffect(() => {
    const el = secondaryRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-secondary-height', `${h}px`);
      notifyHeaderMeasured(TOOLBAR);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const defaultTabs = useMemo(() => [
    { path: '/sales',     label: 'Sales',     icon: 'fa-dollar-sign'     },
    { path: '/margin',    label: 'Margin',    icon: 'fa-chart-line'      },
    { path: '/inventory', label: 'Inventory', icon: 'fa-boxes'           },
    { path: '/ads',       label: 'Ads',       icon: 'fa-bullhorn'        },
    { path: '/cash',      label: 'Cash',      icon: 'fa-money-bill-wave' },
  ], []);

  const activeTabs = tabs || defaultTabs;

  const isTabActive = (tab) => {
    if (activeTabPath !== undefined) return tab.path === activeTabPath;
    return location.pathname === tab.path;
  };

  const renderTab = (tab, variant) => {
    const active = isTabActive(tab);
    const compactCls = active
      ? 'bg-gray-900 dark:bg-slate-700 text-white dark:text-white'
      : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800';
    const fullCls = active
      ? 'bg-gray-900 dark:bg-slate-700 text-white dark:text-white'
      : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800';

    const isCompact = variant === 'compact';
    const className = isCompact
      ? `px-3 py-1 text-[11px] font-medium rounded-full transition-colors whitespace-nowrap flex items-center gap-1 ${compactCls}`
      : `px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5 ${fullCls}`;

    const content = isCompact
      ? <><i className={`fa-solid ${tab.icon} text-[9px]`} />{tab.label}</>
      : <><i className={`fa-solid ${tab.icon} text-[11px]`} />{tab.label}</>;

    if (tab.onClick) {
      return (
        <button key={tab.path} onClick={tab.onClick} className={className}>
          {content}
        </button>
      );
    }
    return (
      <Link key={tab.path} to={tab.path} className={className}>
        {content}
      </Link>
    );
  };

  const defaultFilterBar = (
    <div className="flex items-center gap-2">
      {[
        {
          value: dateRange, onChange: setDateRange,
          options: [['all','All'],['last-7-days','Last 7 Days'],['last-30-days','Last 30 Days'],['last-90-days','Last 90 Days'],['ytd','Year to Date']],
        },
        {
          value: category, onChange: setCategory,
          options: [['all','All Categories'],['electronics','Electronics'],['home-garden','Home & Garden'],['apparel','Apparel']],
        },
      ].map((sel, i) => (
        <select
          key={i}
          value={sel.value}
          onChange={(e) => sel.onChange(e.target.value)}
          className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-slate-300 focus:ring-2 focus:ring-brand/30 dark:focus:ring-gray-500/30 outline-none transition-colors hover:border-gray-300 dark:hover:border-slate-600 shadow-sm"
        >
          {sel.options.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      ))}
    </div>
  );

  const filterBar = customFilters !== undefined ? customFilters : (showTabs ? defaultFilterBar : null);

  if (tabsOnly) {
    return (
      <div className="flex-shrink-0 rounded-t-2xl overflow-hidden bg-white dark:bg-[#030712] border-b border-gray-200 dark:border-slate-800">
        <div ref={secondaryRef} className="flex items-center overflow-x-auto scrollbar-hide px-4 sm:px-6 pt-1 gap-0.5">
          {activeTabs.map((tab) => renderTab(tab, 'full'))}
        </div>
      </div>
    );
  }

  if (renderOnly === 'toolbar') {
    return (
      <div className="flex items-center px-4 sm:px-6 gap-4 h-[56px] relative border-b border-black/[0.05]">
        {/* LEFT — page title + subtitle */}
        {title && (
          <div className="shrink-0 min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 text-[18px] leading-tight tracking-tight whitespace-nowrap">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 whitespace-nowrap hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* CENTER — absolutely centered on full header width for true centering */}
        {centerElement && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center">
              {centerElement}
            </div>
          </div>
        )}
        {/* Flex spacer always present to push right section to edge */}
        <div className="flex-1" />

        {/* RIGHT — search bar + icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search bar — fixed-width container prevents layout shift when expanding */}
          <div className={`hidden sm:flex items-center flex-shrink-0 ${!searchCollapsed ? 'w-56 lg:w-72' : 'relative'}`}>
            {!searchCollapsed ? (
              <div className="relative group w-full flex items-center">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs group-focus-within:text-brand dark:group-focus-within:text-gray-400 transition-colors pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products, SKUs, or customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-[7px] text-xs text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all"
                />
              </div>
            ) : (
              <>
                <button
                  onClick={() => setSearchExpanded(v => !v)}
                  className={`w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-all${searchExpanded ? ' border-brand/40 bg-blue-50 dark:bg-slate-700' : ''}`}
                  title="Search"
                >
                  <i className={`fa-solid fa-magnifying-glass text-xs ${searchExpanded ? 'text-brand dark:text-gray-300' : 'text-gray-400 dark:text-slate-500'}`} />
                </button>
                {searchExpanded && (
                  <div className="absolute right-0 top-full mt-1.5 w-72 z-[99999] shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                    <div className="relative bg-white dark:bg-slate-900">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-brand dark:text-gray-400 text-xs pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products, SKUs, or customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => { if (!searchQuery) setSearchExpanded(false); }}
                        className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setSearchExpanded(false); setSearchQuery(''); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <i className="fa-solid fa-xmark text-xs" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {customRightElement}

          {isSimulating && (
            <div className="relative w-8 h-8 flex-shrink-0" title={`Executing: ${globalProgress}%`}>
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-200 dark:text-slate-700" />
                <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="text-gray-800 dark:text-slate-200 transition-all duration-700"
                  strokeDasharray={`${2 * Math.PI * 12}`}
                  strokeDashoffset={`${2 * Math.PI * 12 * (1 - globalProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-700 dark:text-slate-300">
                {globalProgress}%
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            {[
              { id: 'amazon',  icon: 'fa-amazon',  color: 'text-orange-500' },
              { id: 'shopify', icon: 'fa-shopify',  color: 'text-green-500'  },
              // { id: 'tiktok',  icon: 'fa-tiktok',   color: 'text-black dark:text-white' },
            ].map((p) => {
              const activePlatforms = JSON.parse(localStorage.getItem('active_platforms') || '["shopify"]');
              const isActive = activePlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    let next;
                    if (isActive) {
                      if (activePlatforms.length > 1) next = activePlatforms.filter(id => id !== p.id);
                      else return;
                    } else {
                      next = [...activePlatforms, p.id];
                    }
                    localStorage.setItem('active_platforms', JSON.stringify(next));
                    localStorage.setItem('active_platform', next[0]);
                    window.location.reload();
                  }}
                  title={`${p.id.charAt(0).toUpperCase() + p.id.slice(1)} ${isActive ? '(Active)' : '(Connect)'}`}
                  className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 shadow-sm'
                      : 'opacity-35 grayscale hover:opacity-80 hover:grayscale-0'
                  }`}
                >
                  <i className={`fa-brands ${p.icon} ${p.color} text-sm`} />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-gray-50 dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center group active:scale-95 transition-all"
            onClick={() => window.location.reload()}
            title="Refresh Data"
          >
            <i className="fa-solid fa-rotate text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-200 text-sm group-hover:rotate-180 transition-transform duration-700 ease-out" />
          </button>
          <button
            onClick={onNotificationClick}
            className="w-8 h-8 relative flex items-center justify-center group active:scale-95 transition-all"
            title="Notifications"
          >
            <i className="fa-solid fa-bell text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-slate-100 text-sm transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center group active:scale-95 transition-all"
            title={shopProfile?.name || 'Profile'}
          >
            <i className="fa-solid fa-circle-user text-lg text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  if (renderOnly === 'secondary') {
    return (
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-slate-800">
        <div ref={secondaryRef} className="flex items-center">
          {showTabs && (
            <div id="header-navigation" className="flex-1 flex items-center overflow-x-auto scrollbar-hide px-4 sm:px-6 py-2 gap-1 min-w-0">
              {activeTabs.map((tab) => renderTab(tab, 'full'))}
            </div>
          )}
          {!tabsOnly && filterBar && (
            <div className={`flex items-center px-4 sm:px-6 pb-1 pt-1 ${showTabs ? 'flex-shrink-0' : 'flex-1 w-full'}`}>
              {filterBar}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 rounded-t-2xl overflow-hidden bg-white dark:bg-[#030712] border-b border-gray-200 dark:border-slate-800">

      {/* ── Toolbar row: title | search/compact-tabs | icons ── */}
      <div className="page-header-toolbar px-4 sm:px-6 gap-3">

        {/* LEFT — title */}
        {title && (
          <div className="page-header-title shrink-0 min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 text-[1.1rem] leading-tight tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="page-header-subtitle text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 whitespace-nowrap hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* CENTER — search (fades out) and compact tabs (fade in, absolute overlay) */}
        <div className="flex-1 relative min-w-0 max-w-md mx-auto">
          {showSearch && (
            <div className={`page-header-search relative group${!isCompressed ? ' is-active' : ''}`}>
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs group-focus-within:text-brand dark:group-focus-within:text-gray-400 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, SKUs, or customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-[7px] text-xs text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all"
              />
            </div>
          )}

          {showTabs && (
            <div className={`page-header-compact-tabs absolute inset-0 flex items-center justify-center gap-0.5${isCompressed ? ' is-visible' : ''}`}>
              {activeTabs.map((tab) => renderTab(tab, 'compact'))}
            </div>
          )}
        </div>

        {/* RIGHT — marketplace toggles, refresh, notifications, profile, expand */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {customRightElement}

          {isCompressed && (
            <FilterPopover
              dateRange={dateRange} setDateRange={setDateRange}
              category={category} setCategory={setCategory}
              channel={channel} setChannel={setChannel}
              onPendingCountChange={setFilterPreviewCount}
            />
          )}

          {isSimulating && (
            <div className="relative w-8 h-8 flex-shrink-0" title={`Executing: ${globalProgress}%`}>
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-200 dark:text-slate-700" />
                <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="text-gray-800 dark:text-slate-200 transition-all duration-700"
                  strokeDasharray={`${2 * Math.PI * 12}`}
                  strokeDashoffset={`${2 * Math.PI * 12 * (1 - globalProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-700 dark:text-slate-300">
                {globalProgress}%
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            {[
              { id: 'amazon',  icon: 'fa-amazon',       color: 'text-orange-500' },
              { id: 'shopify', icon: 'fa-shopify',       color: 'text-green-500'  },
              { id: 'walmart', icon: 'fa-cart-shopping', color: 'text-blue-400'   },
            ].map((p) => {
              const activePlatforms = JSON.parse(localStorage.getItem('active_platforms') || '["shopify"]');
              const isActive = activePlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    let next;
                    if (isActive) {
                      if (activePlatforms.length > 1) next = activePlatforms.filter(id => id !== p.id);
                      else return;
                    } else {
                      next = [...activePlatforms, p.id];
                    }
                    localStorage.setItem('active_platforms', JSON.stringify(next));
                    localStorage.setItem('active_platform', next[0]);
                    window.location.reload();
                  }}
                  title={`${p.id.charAt(0).toUpperCase() + p.id.slice(1)} ${isActive ? '(Active)' : '(Connect)'}`}
                  className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 shadow-sm'
                      : 'opacity-35 grayscale hover:opacity-80 hover:grayscale-0'
                  }`}
                >
                  <i className={`fa-brands ${p.icon} ${p.color} text-sm`} />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-gray-50 dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center group active:scale-95 transition-all"
            onClick={() => window.location.reload()}
            title="Refresh Data"
          >
            <i className="fa-solid fa-rotate text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-200 text-sm group-hover:rotate-180 transition-transform duration-700 ease-out" />
          </button>

          <button
            onClick={onNotificationClick}
            className="w-8 h-8 relative flex items-center justify-center group active:scale-95 transition-all"
            title="Notifications"
          >
            <i className="fa-solid fa-bell text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-slate-100 text-sm transition-colors" />
            {filterPreviewCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 dark:bg-slate-200 text-white dark:text-gray-900 text-[9px] font-bold rounded-full flex items-center justify-center leading-none pointer-events-none">
                {filterPreviewCount}
              </span>
            ) : (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          <button
            className="w-8 h-8 flex items-center justify-center group active:scale-95 transition-all"
            title={shopProfile?.name || 'Profile'}
          >
            <i className="fa-solid fa-circle-user text-lg text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors" />
          </button>

          <button
            onClick={forceExpand}
            className={`page-header-expand-btn w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm active:scale-95 transition-all${isCompressed ? ' is-visible' : ''}`}
            title="Expand header"
          >
            <i className="fa-solid fa-chevron-down text-blue-600 dark:text-blue-400 text-xs" />
          </button>
        </div>
      </div>

      {/* ── Secondary row: full tabs + filter dropdowns (collapses on scroll) ── */}
      <div className="page-header-secondary">
        <div ref={secondaryRef} className="page-header-secondary-inner">
          {showTabs && (
            <div
              id="header-navigation"
              className="flex items-center overflow-x-auto scrollbar-hide px-4 sm:px-6 pt-1 gap-0.5"
            >
              {activeTabs.map((tab) => renderTab(tab, 'full'))}
            </div>
          )}
          {filterBar}
        </div>
      </div>
    </div>
  );
};

export default GlobalAppHeader;
