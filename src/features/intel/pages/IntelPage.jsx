import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/common/StatCard';
import KPISelectorModal from '../../../components/common/KPISelectorModal';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import { useViewModeStore } from '../../../store/useViewModeStore';
import apiClient from '../../../api/client';
import { quickToRange, v2DateLabel, v2CatLabel } from '../../detailed-view/detailedViewUtils';
import useClickOutside from '../../../hooks/useClickOutside';
import useProductNavigation from '../../../hooks/useProductNavigation';
import useModalToggle from '../../../hooks/useModalToggle';
import InsightsPanel from '../shared/components/InsightsPanel';
import IntelFilterPanel from '../shared/components/IntelFilterPanel';
import { TAB_TO_ROUTE, V2_FULL_TAB_TO_ROUTE, ROUTE_TO_TAB } from '../shared/data/intelUiData';
import {
  INTEL_TABS,
  STATS_BY_TAB,
} from '../shared/data/intelData';
import RealifyBrief from "../shared/components/common/RealifyBrief";
import BriefHeaderControls from "../shared/components/common/BriefHeaderControls";
import { REALIFY_BRIEF } from "../shared/data/realifyBriefData";

const CompactHeaderSearch = ({ searchQuery, setSearchQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useClickOutside(containerRef, isOpen, () => setIsOpen(false));

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
        title="Search"
      >
        <i className="fa-solid fa-magnifying-glass text-xs" />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative flex items-center animate-in fade-in zoom-in-95 duration-200">
      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="w-40 sm:w-56 pl-8 pr-7 py-1 h-8 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-gray-300 dark:focus:border-slate-600 transition-all shadow-2xs"
      />
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 text-xs p-1"
      >
        <i className="fa-solid fa-xmark text-[10px]" />
      </button>
    </div>
  );
};

const IntelV2Page = ({ defaultTab = 'sales', fullWidthInsights = false }) => {
  const location = useLocation();
  const activeIntelTab = ROUTE_TO_TAB[location.pathname] || defaultTab;

  // Remember that AI View (this page) is the active view + which tab, so
  // navigating away and back to Intel (e.g. via the sidebar) restores it.
  const { setDashboardView, setLastIntelTab } = useViewModeStore();
  useEffect(() => {
    setDashboardView(false);
    setLastIntelTab(activeIntelTab);
  }, [activeIntelTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const [loading, setLoading] = useState(true);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3, 4]);
  const kpiDetailModal = useModalToggle();

  // Insights section 1
  const [activeInsightTab, setActiveInsightTab] = useState('Overall');
  const [itemViewMode, setItemViewMode] = useState('list');
  const [stepOffset, setStepOffset] = useState(0);
  const [restoreItemSubTab, setRestoreItemSubTab] = useState(null);

  // Insights section 2
  const [activeInsightTab2, setActiveInsightTab2] = useState('Overall');
  const [itemViewMode2, setItemViewMode2] = useState('list');
  const [stepOffset2, setStepOffset2] = useState(0);

  // Scroll-aware header + sticky KPI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [kpiIsSticky, setKpiIsSticky] = useState(false);
  const [compactFilterOpen, setCompactFilterOpen] = useState(false);
  const kpiSectionRef = useRef(null);
  const compactFilterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const [filterPanelPos, setFilterPanelPos] = useState({ top: 64, right: 24 });

  /* ── V2 filter panel ── */
  const [v2FilterOpen, setV2FilterOpen] = useState(false);
  const [v2Section, setV2Section] = useState('date');
  const [pendingDate, setPendingDate] = useState(() => {
    const d = useFilterStore.getState().dateRange;
    return (d && d !== 'all') ? d : 'last-7-days';
  });
  const [pendingCats, setPendingCats] = useState([]);
  const [pendingChans, setPendingChans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [appliedDate, setAppliedDate] = useState(() => {
    const d = useFilterStore.getState().dateRange;
    return (d && d !== 'all') ? d : null;
  });
  const [appliedCats, setAppliedCats] = useState([]);
  const [appliedChans, setAppliedChans] = useState([]);
  const [appliedProducts, setAppliedProducts] = useState([]);
  const appliedFilterCount = [appliedDate !== null, appliedCats.length > 0, appliedChans.length > 0, appliedProducts.length > 0].filter(Boolean).length;
  const [chanDropOpen, setChanDropOpen] = useState(false);
  const [pendingRangeStart, setPendingRangeStart] = useState(null);
  const [pendingRangeEnd, setPendingRangeEnd] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);
  const [calViewYear, setCalViewYear] = useState(() => new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(() => new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1);
  const v2FilterRef = useRef(null);
  const chanDropRef = useRef(null);
  const mobileFilterBtnRef = useRef(null);

  const { setDateRange, category, setCategory, setChannel, setProducts, searchQuery, setSearchQuery } = useFilterStore();
  const navigate = useNavigate();
  const { goToProduct, findWatchlistItem, buildFallbackWatchlistItem, buildAnalyticsKpiGroups } = useProductNavigation();

  useEffect(() => {
    if (category !== 'all') {
      setActiveInsightTab('Category');
    }
  }, [category]);

  useEffect(() => {
    if (location.state?.restoreInsightTab) {
      setActiveInsightTab(location.state.restoreInsightTab);
    }
    setRestoreItemSubTab(location.state?.restoreItemSubTab || null);
  }, [location.key, location.state?.restoreInsightTab, location.state?.restoreItemSubTab]);

  const activePlatforms = JSON.parse(localStorage.getItem('active_platforms') || '["shopify","amazon","tiktok"]');
  const channelOptions = [
    ['all', 'All Channels'],
    ...(activePlatforms.includes('amazon') ? [['amazon', 'Amazon']] : []),
    ...(activePlatforms.includes('shopify') ? [['shopify', 'Shopify']] : []),
    ...(activePlatforms.includes('tiktok') ? [['tiktok-shop', 'TikTok Shop']] : []),
  ];
  const fetchedRef = React.useRef(false);

  // Scroll detection — collapses search bar and shows Intel tabs in header
  useEffect(() => {
    const el = document.querySelector('.dashboard-main-content');
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 30);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Close compact filter dropdown when user scrolls back up
  useEffect(() => {
    if (!isScrolled) setCompactFilterOpen(false);
  }, [isScrolled]);

  // KPI sticky — triggers when KPI section is < 28% visible in scroll container
  useEffect(() => {
    const scrollEl = document.querySelector('.dashboard-main-content');
    const target = kpiSectionRef.current;
    if (!scrollEl || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setKpiIsSticky(entry.intersectionRatio < 0.28),
      { root: scrollEl, threshold: [0, 0.1, 0.25, 0.28, 0.5, 1.0] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Close compact filter on outside click
  useClickOutside(compactFilterRef, compactFilterOpen, () => setCompactFilterOpen(false));

  // Close V2 filter panel on outside click (check both content ref and compact header ref)
  useClickOutside(v2FilterRef, v2FilterOpen, () => setV2FilterOpen(false), compactFilterRef);

  // Close channel chips dropdown on outside click
  useClickOutside(chanDropRef, chanDropOpen, () => setChanDropOpen(false));

  const openProductModal = (product) => {
    const watchlistItem = findWatchlistItem(product.name);

    goToProduct({
      name: product.name,
      icon: 'fa-box',
      image: watchlistItem?.image || null,
      description: `${product.name} is a key product driving your sales performance. Review channel distribution, margin contribution, and inventory health below.`,
      kpiGroups: buildAnalyticsKpiGroups({
        totalRevenue: product.revenue,
        unitsSold: product.units,
        avgPrice: product.aov,
        buyBoxPct: product.bb,
        marginPct: '34.2%',
        cm2Profit: '$42.8K',
        revenue: product.revenue,
        units: product.units,
        onHand: watchlistItem?.stock || '—',
        doc: '12.3',
        velocity: watchlistItem?.velocity || '—',
        reorderQty: '200',
      }),
      insights: [
        `Revenue at ${product.revenue} — primarily driven by Amazon US channel`,
        `Buy Box at ${product.bb} — monitor competitor pricing to maintain position`,
        watchlistItem?.subtext || 'Review inventory levels to avoid stockouts',
      ],
      watchlistItem: watchlistItem || buildFallbackWatchlistItem(product.name, product.sku || 'N/A'),
    }, '/intel');
  };

  useEffect(() => {
    const fetchIntel = async () => {
      if (fetchedRef.current) return;
      const shop = localStorage.getItem('active_shop');
      const platform = localStorage.getItem('active_platform') || 'shopify';
      if (shop) {
        fetchedRef.current = true;
        try {
          await apiClient.get(`/${platform}/sales-intelligence`);
        } catch (error) {
          console.error('Failed to fetch intelligence data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchIntel();
  }, []);

  const activeStats = STATS_BY_TAB.sales;

  const handleStepClick = (stepId) => {
    navigate(`/intel/insight/sales/${stepId}`);
  };

  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const originalTabsRef = useRef(null);

  useEffect(() => {
    const scrollEl = document.querySelector('.dashboard-main-content');
    const targetEl = originalTabsRef.current;
    if (!scrollEl || !targetEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyTabs(!entry.isIntersecting);
      },
      { root: scrollEl, threshold: 0.1 }
    );

    observer.observe(targetEl);
    return () => observer.disconnect();
  }, []);

  // Compact header center — Intel tabs shown ONLY when original tabs scroll out of view
  const compactHeaderCenter = showStickyTabs ? (
    <div className="flex items-center gap-0.5 animate-in fade-in duration-200">
      {INTEL_TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => { navigate((fullWidthInsights ? V2_FULL_TAB_TO_ROUTE : TAB_TO_ROUTE)[tab.key]); setStepOffset(0); }}
          className={`px-3 h-[56px] text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 border-b-2
            ${activeIntelTab === tab.key
              ? 'border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-100 font-bold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
            }`}
        >
          <i className={`fa-solid ${tab.icon} text-[10px]`} />
          {tab.label}
        </button>
      ))}
    </div>
  ) : null;

  const compactFilterElement = isScrolled ? (
    <CompactHeaderSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  ) : null;

  /* ── V2 filter helpers ── */
  const v2ChanList = channelOptions.filter(([v]) => v !== 'all');
  const v2ChanGrid = [...v2ChanList, ['all-chans', 'All Channels']];
  const v2ChanLabel = (v) => channelOptions.find(([k]) => k === v)?.[1] || v;

  const prevCalMonth = () => {
    if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear(y => y - 1); }
    else setCalViewMonth(m => m - 1);
  };
  const nextCalMonth = () => {
    if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear(y => y + 1); }
    else setCalViewMonth(m => m + 1);
  };
  const handleDateClick = (date) => {
    if (!pendingRangeStart || pendingRangeEnd) {
      setPendingRangeStart(date); setPendingRangeEnd(null); setPendingDate('custom');
    } else {
      if (date < pendingRangeStart) { setPendingRangeEnd(pendingRangeStart); setPendingRangeStart(date); }
      else setPendingRangeEnd(date);
      setPendingDate('custom');
    }
  };
  const calRightM = (calViewMonth + 1) % 12;
  const calRightY = calViewMonth === 11 ? calViewYear + 1 : calViewYear;

  function handleOpenV2Filter() {
    // Compute where to anchor the panel (below whichever trigger button is visible)
    const isMobile = window.innerWidth < 640;
    const triggerEl = isMobile ? mobileFilterBtnRef.current : (isScrolled ? compactFilterRef.current : filterBtnRef.current);
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      if (isMobile) {
        setFilterPanelPos({ top: rect.bottom + 8, left: 16, right: 16, bottom: 16 });
      } else {
        setFilterPanelPos({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
      }
    }
    setPendingDate(appliedDate);
    setPendingCats([...appliedCats]);
    setPendingChans([...appliedChans]);
    setPendingProducts([...appliedProducts]);
    setV2Section('date');
    if (appliedDate) {
      const r = quickToRange(appliedDate === 'custom' ? 'last-30-days' : appliedDate);
      setPendingRangeStart(r.start);
      setPendingRangeEnd(r.end);
      const sm = r.start.getMonth();
      setCalViewMonth(sm === 0 ? 11 : sm - 1);
      setCalViewYear(sm === 0 ? r.start.getFullYear() - 1 : r.start.getFullYear());
    } else {
      setPendingRangeStart(null);
      setPendingRangeEnd(null);
      const now = new Date();
      setCalViewMonth(now.getMonth() === 0 ? 11 : now.getMonth() - 1);
      setCalViewYear(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
    }
    setV2FilterOpen(true);
  }
  const handleApplyV2Filter = () => {
    setAppliedDate(pendingDate);
    setAppliedCats([...pendingCats]);
    setAppliedChans([...pendingChans]);
    setAppliedProducts([...pendingProducts]);
    setDateRange(pendingDate);
    setCategory(pendingCats.length === 1 ? pendingCats[0] : 'all');
    setChannel(pendingChans.length === 1 ? pendingChans[0] : 'all');
    setProducts([...pendingProducts]);
    setV2FilterOpen(false);
  };
  const togglePendingCat = (cat) => {
    if (cat === 'all') { setPendingCats([]); return; }
    setPendingCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const togglePendingChan = (ch) =>
    setPendingChans(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  const togglePendingProduct = (id) =>
    setPendingProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const removeAppliedChan = (ch) => {
    const next = appliedChans.filter(c => c !== ch);
    setAppliedChans(next);
    setChannel(next.length === 1 ? next[0] : 'all');
  };

  const briefData =
    REALIFY_BRIEF[activeIntelTab] || REALIFY_BRIEF.sales;

  return (
    <DashboardLayout
      title="Intelligence"
      subtitle="Real-time sales analytics"
      showSearch={true}
      showTabs={false}
      showAIPrompt={false}
      aiPromptFullWidth={true}
      searchCollapsed={isScrolled}
      headerCenterElement={compactHeaderCenter}
      customRightElement={compactFilterElement}
      hideMobileSearchIcon={!isScrolled}
    >
      {/* Sticky compact KPI strip — smoothly slides in when KPI section scrolls out of view */}
      <div
        className="sticky top-[-24px] z-50 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-[#e0e1e2] dark:bg-[#030712] border-b border-gray-100 dark:border-slate-800 overflow-hidden"
        style={{
          maxHeight: kpiIsSticky ? '76px' : '0',
          opacity: kpiIsSticky ? 1 : 0,
          boxShadow: kpiIsSticky ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
          transition: 'max-height 280ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease-out, box-shadow 280ms ease-out',
        }}
      >
        <div className="flex items-center gap-2 py-3 min-w-0">
          <div className="flex-1 grid grid-cols-5 gap-2">
            {selectedKpiIndices.map(idx => {
              const stat = activeStats[idx] || activeStats[0];
              return (
                <div
                  key={idx}
                  className="w-full flex items-center justify-center px-3 py-2 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-xl"
                >
                  <div>
                    <p className="text-[9px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide leading-tight mb-0.5">{stat.title}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight">{stat.value}</p>
                      <span className={`text-[9px] font-semibold leading-tight ${stat.isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:flex flex-shrink-0 items-center justify-center gap-2 self-center my-auto">
            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium whitespace-nowrap">AI View</span>
            <button
              onClick={() => navigate(`/detailed-view/${activeIntelTab}`, { state: { from: '/intel' } })}
              className="relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full bg-gray-300 dark:bg-slate-600 transition-colors hover:bg-gray-400 dark:hover:bg-slate-500"
            >
              <span className="inline-block h-3 w-3 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-0.5" />
            </button>
            <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400 whitespace-nowrap">Dashboard</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">

        {/* MOBILE-only: page heading + Filters trigger (ss1 layout) */}
        <div className="sm:hidden flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 text-[17px] leading-tight tracking-tight">Intelligence</h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Real-time sales analytics</p>
          </div>
          <button
            ref={mobileFilterBtnRef}
            onClick={handleOpenV2Filter}
            className={`relative flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-xl border transition-all text-xs font-medium ${v2FilterOpen
              ? 'bg-gray-900 dark:bg-slate-100 border-gray-900 dark:border-slate-100 text-white dark:text-gray-900'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
          >
            <i className="fa-solid fa-sliders text-[11px]" />
            Filters
            {appliedFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-[9px] font-bold rounded-full border-2 border-white dark:border-slate-950">
                {appliedFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE-only: search bar — sits between the heading/filters row and the tabs row */}
        <div className="sm:hidden relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, SKUs, or customers..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-gray-300 dark:focus:border-slate-600 transition-colors"
          />
        </div>

        {/* Realify Brief (Top Banner) + Search Bar (left) & Channel / Date Controls (right) */}
        <div className="w-full space-y-2">
          <RealifyBrief data={briefData} />
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="relative w-[38%] sm:w-[32%] min-w-[170px] max-w-[320px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 h-8 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-gray-300 dark:focus:border-slate-600 transition-all shadow-2xs"
              />
            </div>
            <BriefHeaderControls />
          </div>
        </div>

        {/* 5 stat cards */}
        <div ref={kpiSectionRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {selectedKpiIndices.map(idx => {
            const stat = activeStats[idx] || activeStats[0];
            return (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                isPositive={stat.isPositive}
                loading={loading}
                onClick={() => kpiDetailModal.open(stat)}
              />
            );
          })}
        </div>

        {/* Intel tabs (left) + AI / Dashboard View toggle (right) */}
        <div ref={originalTabsRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 border-b border-gray-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide sm:overflow-visible">
            {INTEL_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { navigate((fullWidthInsights ? V2_FULL_TAB_TO_ROUTE : TAB_TO_ROUTE)[tab.key]); setStepOffset(0); }}
                className={`px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-px
                  ${activeIntelTab === tab.key
                    ? 'border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                  }`}
              >
                <i className={`fa-solid ${tab.icon} text-[11px]`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard View toggle (right) */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
              Dashboard View
            </span>
            <button
              onClick={() =>
                navigate(`/detailed-view/${activeIntelTab}`, {
                  state: { selectedKpiIndices, from: '/intel' },
                })
              }
              className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-gray-300 dark:bg-slate-600 transition-colors hover:bg-gray-400 dark:hover:bg-slate-500"
            >
              <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Insights section 1 */}
        <InsightsPanel
          activeInsightTab={activeInsightTab}
          setActiveInsightTab={setActiveInsightTab}
          itemViewMode={itemViewMode}
          setItemViewMode={setItemViewMode}
          stepOffset={stepOffset}
          setStepOffset={setStepOffset}
          onProductClick={openProductModal}
          onStepClick={handleStepClick}
          showDetailedView={true}
          onDetailedView={() => navigate(`/detailed-view/${activeIntelTab}`, { state: { selectedKpiIndices, from: '/intel' } })}
          intelTab={activeIntelTab}
          selectedCategory={category}
          noSidePanel={fullWidthInsights}
          initialItemSubTab={restoreItemSubTab}
          sourceRoute={location.pathname}
        />

        {/* Insights section 2 — carousel mode (commented out) */}
        {false && ( // eslint-disable-line no-constant-binary-expression
          <InsightsPanel
            activeInsightTab={activeInsightTab2}
            setActiveInsightTab={setActiveInsightTab2}
            itemViewMode={itemViewMode2}
            setItemViewMode={setItemViewMode2}
            stepOffset={stepOffset2}
            setStepOffset={setStepOffset2}
            isCarouselMode={true}
            onProductClick={openProductModal}
            onStepClick={handleStepClick}
            intelTab={activeIntelTab}
          />
        )}

      </div>

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={activeStats}
        selectedIndices={selectedKpiIndices}
        onSave={(indices) => { setSelectedKpiIndices(indices); }}
      />

      <KPIDetailModal
        isOpen={kpiDetailModal.isOpen}
        onClose={kpiDetailModal.close}
        stat={kpiDetailModal.data}
        filterContext={{ dateRange: appliedDate, categories: appliedCats, channels: appliedChans, products: appliedProducts }}
        tab={activeIntelTab}
      />
    </DashboardLayout>
  );
};

export default IntelV2Page;
