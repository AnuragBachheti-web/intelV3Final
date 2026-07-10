import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MarketplaceSyncBanner from '../../components/common/MarketplaceSyncBanner';
import useClickOutside from '../../hooks/useClickOutside';
import { salesWatchlistItems } from '../intel/sales/salesData';
import { ITEM_SKU_DATA } from '../intel/shared/data/intelData';

const PERF_STATS = [
  { key: 'revenue',    label: 'Revenue',         icon: 'fa-arrow-trend-up',  value: '$14,250', change: '+12.4%', isPositive: true,  sub: 'vs previous 7 days', color: '#6366f1' },
  { key: 'units',      label: 'Units Sold',       icon: 'fa-cart-shopping',   value: '215',     change: '+8.7%',  isPositive: true,  sub: 'vs previous 7 days', color: '#3b82f6' },
  { key: 'conversion', label: 'Conversion Rate',  icon: 'fa-percent',         value: '3.2%',    change: '+0.6pp', isPositive: true,  sub: 'vs previous 7 days', color: '#10b981' },
  { key: 'buybox',     label: 'Buy Box %',        icon: 'fa-trophy',          value: '87.4%',   change: '-2.1%',  isPositive: false, sub: 'vs previous 7 days', color: '#f59e0b' },
];

const TREND_DATA = {
  revenue:    [9800, 11200, 12400, 15200, 13600, 13100, 14250].map((v, i) => ({ date: `May ${14+i}`, value: v })),
  units:      [168, 192, 198, 245, 227, 219, 215].map((v, i) => ({ date: `May ${14+i}`, value: v })),
  conversion: [2.6, 2.9, 3.1, 3.5, 3.2, 3.1, 3.2].map((v, i) => ({ date: `May ${14+i}`, value: v })),
  buybox:     [92, 91, 89, 88, 87, 88, 87.4].map((v, i) => ({ date: `May ${14+i}`, value: v })),
};

const ACTION_BADGE = {
  'CRITICAL':    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'HIGH':        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'OPPORTUNITY': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  'INSIGHT':     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'MARKET':      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const defaultDescription = (name) =>
  `${name} is one of your top-performing products, consistently driving strong revenue across channels. It maintains competitive pricing and healthy margin contribution relative to your catalog average. Recent demand signals indicate sustained buyer interest, with particular strength in repeat purchase behaviour. Monitor inventory velocity closely to avoid stockout risk during high-demand periods.`;

// ─── Compact Watchlist Card ───────────────────────────────────────────────────

const CompactWatchlistCard = ({ title, sku, stock, velocity, image, status }) => (
  <div className="p-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all">
    <div className="flex items-center gap-2 mb-2">
      {image ? (
        <img src={image} alt={title} className="w-9 h-9 rounded-lg object-contain bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-300 dark:border-slate-700">
          <i className="fa-solid fa-box text-gray-400 text-[10px]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-xs leading-tight line-clamp-2">{title}</h4>
          {status && (
            <span className={`px-1.5 py-0.5 text-white text-[8px] rounded font-bold flex-shrink-0 ml-1 ${status === 'LOW' ? 'bg-red-600' : status === 'HOT' ? 'bg-green-600' : 'bg-yellow-600'}`}>
              {status}
            </span>
          )}
        </div>
        <p className="text-[9px] text-gray-500 dark:text-slate-400 mt-0.5 font-mono">SKU: {sku}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-[9px] text-gray-500 dark:text-slate-400">Stock</p>
        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{stock}</p>
      </div>
      {velocity && (
        <div>
          <p className="text-[9px] text-gray-500 dark:text-slate-400">Velocity</p>
          <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{velocity}</p>
        </div>
      )}
    </div>
  </div>
);

// ─── Product Filter Panel ─────────────────────────────────────────────────────

const ProductFilterPanel = ({ pendingDate, setPendingDate, customRange, setCustomRange, hoverDate, setHoverDate, calViewMonth, setCalViewMonth, onClose, onUpdate }) => {
  const today = new Date(); today.setHours(0,0,0,0);

  const applyPreset = (preset) => {
    const t = new Date(today);
    let start, end;
    if (preset === '7d')  { start = new Date(t.getTime() - 6*86400000); end = new Date(t); }
    if (preset === '30d') { start = new Date(t.getTime() - 29*86400000); end = new Date(t); }
    if (preset === '90d') { start = new Date(t.getTime() - 89*86400000); end = new Date(t); }
    setCustomRange({ start, end });
    setPendingDate(preset);
  };

  const isSame = (a, b) => a && b && a.toDateString() === b.toDateString();
  const inRange = (date) => {
    const s = customRange.start;
    const e = customRange.end || (customRange.start && !customRange.end ? hoverDate : null);
    if (!s) return false;
    const lo = e && s > e ? e : s;
    const hi = e && s > e ? s : e;
    return hi && date >= lo && date <= hi;
  };

  const handleDayClick = (date) => {
    if (!customRange.start || (customRange.start && customRange.end)) {
      setCustomRange({ start: date, end: null }); setPendingDate(null);
    } else {
      setCustomRange(date < customRange.start ? { start: date, end: customRange.start } : { start: customRange.start, end: date });
    }
  };

  const renderMonth = (year, month, isLeft) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    const goPrev = () => setCalViewMonth(p => p.month === 0 ? { year: p.year-1, month: 11 } : { year: p.year, month: p.month-1 });
    const goNext = () => setCalViewMonth(p => p.month === 11 ? { year: p.year+1, month: 0 } : { year: p.year, month: p.month+1 });
    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          {isLeft ? <button onClick={goPrev} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition"><i className="fa-solid fa-chevron-left text-[9px]"/></button> : <span/>}
          <p className="text-xs font-bold text-gray-800 dark:text-slate-100">{MONTHS[month]} {year}</p>
          {!isLeft ? <button onClick={goNext} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition"><i className="fa-solid fa-chevron-right text-[9px]"/></button> : <span/>}
        </div>
        <div className="grid grid-cols-7 mb-1">{WEEKDAYS.map(d => <div key={d} className="text-[8px] sm:text-[9px] text-center text-gray-400 font-semibold py-1">{d}</div>)}</div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={`e${i}`}/>;
            const isStart = isSame(date, customRange.start);
            const isEnd = isSame(date, customRange.end || (customRange.start && !customRange.end ? hoverDate : null));
            const isIn = inRange(date);
            const isToday = isSame(date, today);
            return (
              <button key={date.getTime()} onClick={() => handleDayClick(date)}
                onMouseEnter={() => customRange.start && !customRange.end && setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto flex items-center justify-center text-[10px] sm:text-[11px] font-medium rounded-lg transition-colors ${
                  isStart || isEnd ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 font-bold'
                  : isIn ? 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200'
                  : isToday ? 'ring-1 ring-inset ring-gray-400 text-gray-900 dark:text-slate-100'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}>{date.getDate()}</button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextCal = calViewMonth.month === 11
    ? { year: calViewMonth.year+1, month: 0 }
    : { year: calViewMonth.year, month: calViewMonth.month+1 };

  const getDurLabel = () => {
    if (pendingDate === '7d') return '7 days';
    if (pendingDate === '30d') return '30 days';
    if (pendingDate === '90d') return '90 days';
    if (customRange.start && customRange.end) {
      const days = Math.round((customRange.end - customRange.start) / 86400000) + 1;
      return `${days} days`;
    }
    return '—';
  };

  const fmtD = (d) => d ? d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '';
  const canUpdate = pendingDate || (customRange.start && customRange.end);

  return (
    <div className="fixed inset-x-4 top-20 bottom-4 sm:absolute sm:inset-x-auto sm:top-full sm:bottom-auto sm:mt-2 sm:right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-[9999] sm:w-[460px] overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto sm:flex-none flex flex-col p-4 gap-3" style={{ minHeight: 320 }}>
        {/* Quick presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Quick Filters</span>
          {[['7d','Last 7 Days'],['30d','Last 30 Days'],['90d','Last 90 Days']].map(([val,lbl]) => (
            <button key={val} onClick={() => applyPreset(val)}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${pendingDate === val ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300'}`}>
              {lbl}
            </button>
          ))}
        </div>
        {/* Dual calendar */}
        <div className="flex gap-2 sm:gap-4 flex-1">
          {renderMonth(calViewMonth.year, calViewMonth.month, true)}
          <div className="w-px bg-gray-100 dark:bg-slate-800 self-stretch flex-shrink-0"/>
          {renderMonth(nextCal.year, nextCal.month, false)}
        </div>
        {/* Duration display */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-[11px] font-medium text-gray-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-gray-700 dark:bg-slate-300 flex-shrink-0"/>
            {getDurLabel()}
          </div>
          {customRange.start && (
            <span className="text-[11px] text-gray-600 dark:text-slate-400">
              {fmtD(customRange.start)}{customRange.end ? ` — ${fmtD(customRange.end)}` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-4 pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
        <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
        <button onClick={onUpdate} disabled={!canUpdate} className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed">Update</button>
      </div>
    </div>
  );
};

// ─── Product View Page ────────────────────────────────────────────────────────

const ProductViewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const activePlatforms = JSON.parse(localStorage.getItem('active_platforms') || '["shopify"]');
  const [, setActiveTime] = useState('30d');
  const [activeTab, setActiveTab] = useState(
    ['Amazon', 'Shopify', 'Walmart'].find(t => activePlatforms.includes(t.toLowerCase())) || 'Amazon'
  );
  const [insightCategory, setInsightCategory] = useState('All');
  const [activeWatchlistIdx, setActiveWatchlistIdx] = useState(null);
  const [prevWatchlistIdx, setPrevWatchlistIdx] = useState(activeWatchlistIdx);
  if (activeWatchlistIdx !== prevWatchlistIdx) {
    setPrevWatchlistIdx(activeWatchlistIdx);
    setInsightCategory('All');
  }
  const [actionsViewMode, setActionsViewMode] = useState('list');
  const [activePerfStat, setActivePerfStat] = useState('revenue');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [savedName, setSavedName] = useState(null);
  const [savedDesc, setSavedDesc] = useState(null);
  const [savedPrice, setSavedPrice] = useState(null);

  // Filter panel state
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState('30d');
  const [customRange, setCustomRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);
  const [calViewMonth, setCalViewMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const filterRef = useRef(null);

  useClickOutside(filterRef, filterOpen, () => setFilterOpen(false));

  const initialProduct = state?.product;
  const from = state?.from || -1;
  const fromState = state?.fromState || null;

  if (!initialProduct) {
    navigate(-1);
    return null;
  }

  const watchlistItems = salesWatchlistItems;

  const buildProductFromWatchlist = (item) => ({
    name: item.title,
    image: item.image || null,
    sku: item.sku,
    description: defaultDescription(item.title),
    sellingPrice: '$149.99',
    unitCost: '$62.59',
    margin: '58.2%',
    stock: item.stock || '—',
    kpiGroups: initialProduct.kpiGroups,
    watchlistItem: item,
    insights: initialProduct.insights,
  });

  const activeProduct = activeWatchlistIdx !== null
    ? buildProductFromWatchlist(watchlistItems[activeWatchlistIdx])
    : initialProduct;

  const displayPrice = savedPrice || activeProduct.price || activeProduct.sellingPrice || '$149.99';
  const displayDescription = savedDesc || activeProduct.description || defaultDescription(activeProduct.name);
  const fieldLabelClass = 'text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block';

  const initialActiveIdx = watchlistItems.findIndex(
    (item) => item.title?.toLowerCase() === initialProduct.name?.toLowerCase()
  );

  const productDd = ITEM_SKU_DATA.deepDive[activeProduct.sku] ||
    Object.values(ITEM_SKU_DATA.deepDive)
      .filter(d => typeof d.name === 'string')
      .find(d => d.name?.toLowerCase() === activeProduct.name?.toLowerCase()) || null;

  const productActions = productDd ? productDd.actions.map((a, i) => ({ ...a, id: i + 1 })) : [];
  const actionTypes = ['All', ...new Set(productActions.map(a => a.type))];
  const filteredActions = insightCategory === 'All'
    ? productActions
    : productActions.filter(a => a.type === insightCategory);

  const handleActionSelect = (action) => {
    if (!productDd) return;
    const allSteps = productDd.actions.map((a, i) => ({
      id: i + 1,
      title: a.title,
      sub: a.sub,
      type: a.type,
    }));
    const clickedIdx = productDd.actions.findIndex(a => a.title === action.title);
    const insight = {
      heading: productDd.name,
      body: productDd.keyInsight || `${productDd.name} has specific actions requiring your attention. Review the recommended actions below.`,
      type: 'INSIGHT',
      time: '2 min ago',
      steps: allSteps,
    };
    navigate('/intel/insight/sales/0', {
      state: {
        insights: [insight],
        currentIndex: 0,
        intelTab: 'sales',
        insightTab: 'Item',
        sourceRoute: '/product-view',
        productViewState: { product: activeProduct, from },
        initialStepId: clickedIdx >= 0 ? clickedIdx + 1 : 1,
      },
    });
  };

  const channelTabs   = ['Amazon', 'Shopify', 'Walmart'].filter(t => activePlatforms.includes(t.toLowerCase()));

  const activeDateLabel = pendingDate === '7d' ? 'Last 7 Days'
    : pendingDate === '90d' ? 'Last 90 Days'
    : pendingDate === '30d' ? null
    : (customRange.start && customRange.end)
      ? `${customRange.start.toLocaleDateString('en-US', { month:'short', day:'numeric' })} – ${customRange.end.toLocaleDateString('en-US', { month:'short', day:'numeric' })}`
    : null;

  return (
    <DashboardLayout
      title={activeProduct.name}
      subtitle="Product Analysis"
      showTabs={false}
    >
      {/* 70 / 30 split on desktop — main content left, watchlist right. Mobile: single column, no watchlist. */}
      <div className="flex flex-col sm:grid sm:grid-cols-10 gap-5 items-start">

        {/* Left 70% — product info + actions */}
        <div className="sm:col-span-7 flex flex-col gap-5">

          {/* Channel tabs + back button (left) + filter (right) */}
          <div className="flex items-center gap-1 border-b border-gray-200 dark:border-slate-800 -mt-1">
            <button
              onClick={() => navigate(from, fromState ? { state: fromState } : undefined)}
              className="flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 transition-colors flex-shrink-0 mr-2 mb-px"
            >
              <i className="fa-solid fa-arrow-left text-sm" />
            </button>
            {channelTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-gray-900 dark:text-slate-100 border-gray-900 dark:border-slate-200 font-semibold'
                    : 'text-gray-400 dark:text-slate-500 border-transparent hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="flex-1" />
            <div className="relative flex items-center gap-2 pb-0.5" ref={filterRef}>
              {activeDateLabel && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-sm">
                  {activeDateLabel}
                  <button onClick={() => { setPendingDate('30d'); setCustomRange({ start: null, end: null }); setActiveTime('30d'); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 ml-0.5 transition">
                    <i className="fa-solid fa-xmark text-[9px]" />
                  </button>
                </span>
              )}
              <button
                onClick={() => setFilterOpen(v => !v)}
                className={`flex items-center gap-1.5 px-3 h-7 rounded-xl border transition-all text-xs font-medium ${
                  filterOpen
                    ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <i className="fa-solid fa-sliders text-[11px]" />
                Filter
              </button>
              {filterOpen && (
                <ProductFilterPanel
                  pendingDate={pendingDate}
                  setPendingDate={setPendingDate}
                  customRange={customRange}
                  setCustomRange={setCustomRange}
                  hoverDate={hoverDate}
                  setHoverDate={setHoverDate}
                  calViewMonth={calViewMonth}
                  setCalViewMonth={setCalViewMonth}
                  onClose={() => setFilterOpen(false)}
                  onUpdate={() => {
                    setActiveTime(pendingDate || 'Custom');
                    setFilterOpen(false);
                  }}
                />
              )}
            </div>
          </div>

          {/* Product info card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5">

              {/* Product image */}
              <div className="w-full h-44 sm:w-44 sm:h-44 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-slate-700 overflow-hidden">
                {activeProduct.image ? (
                  <img src={activeProduct.image} alt={activeProduct.name} className="max-h-full max-w-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <i className="fa-solid fa-box text-4xl text-gray-300 dark:text-slate-600" />
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">No image</span>
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="flex-1 min-w-0">
                {/* Status tags */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold rounded-lg">Low Stock</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[10px] font-bold rounded-lg">Electronics</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-lg">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <MarketplaceSyncBanner onGoToMarketplace={() => {}} />
                    <div>
                      <label className={fieldLabelClass}>Product Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-bold text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-slate-600 transition"
                      />
                    </div>
                    <div>
                      <label className={fieldLabelClass}>Price</label>
                      <input
                        type="text"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className="w-40 px-3 py-2 text-sm font-bold text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-slate-600 transition"
                      />
                    </div>
                    <div>
                      <label className={fieldLabelClass}>Description</label>
                      <textarea
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-slate-600 transition resize-none leading-relaxed"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSavedName(editName); setSavedDesc(editDesc); setSavedPrice(editPrice); setIsEditing(false); }}
                        className="px-4 py-1.5 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-snug">{savedName || activeProduct.name}</h2>
                      <button
                        onClick={() => {
                          setEditName(savedName || activeProduct.name);
                          setEditDesc(displayDescription);
                          setEditPrice(displayPrice);
                          setIsEditing(true);
                        }}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen text-[10px]" />
                      </button>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                      {displayPrice}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 mb-3 font-mono">
                      SKU: {activeProduct.sku || activeProduct.watchlistItem?.sku || 'WH-PRO-2024'} · Realify Audio · Added Mar 14, 2026
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                      {displayDescription}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Performance Overview</h3>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-[11px] font-medium text-gray-500 dark:text-slate-400">
                <i className="fa-regular fa-calendar text-[10px]" /> Last 7 Days
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Stat cards */}
              <div className="flex flex-col gap-2 w-full sm:w-[200px] sm:flex-shrink-0">
                {PERF_STATS.map(stat => (
                  <button
                    key={stat.key}
                    onClick={() => setActivePerfStat(stat.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      activePerfStat === stat.key
                        ? 'border-gray-900 dark:border-slate-100 bg-gray-50 dark:bg-slate-800'
                        : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activePerfStat === stat.key ? 'bg-gray-200 dark:bg-slate-700' : 'bg-gray-100 dark:bg-slate-800'}`}>
                      <i className={`fa-solid ${stat.icon} text-[10px] text-gray-600 dark:text-slate-300`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide leading-tight">{stat.label}</p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight">{stat.value}</span>
                        <span className={`text-[10px] font-bold ${stat.isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{stat.change}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 dark:text-slate-500 mt-0.5">{stat.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Trend chart */}
              <div className="w-full h-[260px] sm:h-auto sm:flex-1 min-w-0">
                {(() => {
                  const stat = PERF_STATS.find(s => s.key === activePerfStat);
                  const data = TREND_DATA[activePerfStat];
                  const isRevenue = activePerfStat === 'revenue';
                  return (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-slate-300">{stat?.label} Trend</p>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-slate-500">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: stat?.color }} />
                          Last 7 Days
                        </span>
                      </div>
                      <div className="flex-1" style={{ minHeight: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={stat?.color} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={stat?.color} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} className="text-gray-400 dark:text-slate-500" dy={6} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} className="text-gray-400 dark:text-slate-500" tickFormatter={v => isRevenue ? `$${(v/1000).toFixed(0)}K` : v} width={40} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                              formatter={v => [isRevenue ? `$${v.toLocaleString()}` : v, stat?.label]}
                            />
                            <Area type="monotone" dataKey="value" stroke={stat?.color} strokeWidth={2} fill="url(#perfGradient)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: stat?.color }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Actions section */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Actions</h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">Click to view deep-dive</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setActionsViewMode('list')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs transition ${actionsViewMode === 'list' ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                  >
                    <i className="fa-solid fa-list" />
                  </button>
                  <button
                    onClick={() => setActionsViewMode('grid')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs transition ${actionsViewMode === 'grid' ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                  >
                    <i className="fa-solid fa-grip" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {actionTypes.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setInsightCategory(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      insightCategory === tab
                        ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 shadow-sm'
                        : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    {tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${actionsViewMode === 'grid' ? 'grid grid-cols-2' : 'flex flex-col'} gap-3 p-4`}>
              {filteredActions.length === 0 && (
                <p className="col-span-2 text-center text-xs text-gray-400 dark:text-slate-500 py-8">No actions available.</p>
              )}
              {filteredActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleActionSelect(action)}
                  className="text-left p-4 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-md transition-all bg-white dark:bg-slate-900 group"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md ${ACTION_BADGE[action.type] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {action.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-1 leading-snug group-hover:text-brand dark:group-hover:text-gray-200 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {action.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 30% — Watchlist, desktop only */}
        <div className="hidden sm:block sm:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Watchlist</h3>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Click to view</p>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {watchlistItems.map((item, idx) => {
                const isActive =
                  activeWatchlistIdx === idx ||
                  (activeWatchlistIdx === null && idx === initialActiveIdx);
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveWatchlistIdx(idx)}
                    className="w-full text-left"
                  >
                    <div className={`rounded-xl transition-all ring-2 ${isActive ? 'ring-blue-400 dark:ring-blue-500' : 'ring-transparent'}`}>
                      <CompactWatchlistCard {...item} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductViewPage;
