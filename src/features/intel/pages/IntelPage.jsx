import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/common/StatCard';
import KPISelectorModal from '../../../components/common/KPISelectorModal';
import { useFilterStore } from '../../../store/useFilterStore';
import { useViewModeStore } from '../../../store/useViewModeStore';
import apiClient from '../../../api/client';
import { quickToRange } from '../../detailed-view/detailedViewUtils';
import useClickOutside from '../../../hooks/useClickOutside';
import useProductNavigation from '../../../hooks/useProductNavigation';

import InsightsPanel from '../shared/components/InsightsPanel';
import IntelFilterPanel from '../shared/components/IntelFilterPanel';
import { TAB_TO_ROUTE, V2_FULL_TAB_TO_ROUTE, ROUTE_TO_TAB } from '../shared/data/intelUiData';
import {
  INTEL_TABS,
  STATS_BY_TAB,
} from '../shared/data/intelData';
import TabContent from '../shared/components/common/TabContent';
import RealifyBrief from '../shared/components/common/RealifyBrief';
import BriefHeaderControls from '../shared/components/common/BriefHeaderControls';
import { useUniversalBrief } from '../hooks/useUniversalBrief';
import ConfirmActionModal from '../shared/components/ConfirmActionModal';
import SimulateModal, { SimulateContent } from '../shared/components/SimulateModal';
import InsightDetailsPanel from '../shared/components/InsightDetailsPanel';
import DismissModal from '../shared/components/DismissModal';
import RepriceModal from '../shared/components/RepriceModal';
import CaseReportModal from '../shared/components/CaseReportModal';

const FilterDropdown = ({ label, options, hasSearch, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropRef = useRef(null);
  useClickOutside(dropRef, isOpen, () => setIsOpen(false));

  const displayLabel = value && value !== 'All' ? `${label}: ${value}` : label;
  const filteredOptions = hasSearch
    ? options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="relative shrink-0" ref={dropRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 flex items-center gap-1.5 rounded-xl border text-xs font-medium transition-colors ${value && value !== 'All'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
          }`}
      >
        {displayLabel}
        <i className="fa-solid fa-chevron-down text-[10px] opacity-60 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-1.5">
          {hasSearch && (
            <div className="px-2 py-1 mb-1 border-b border-gray-100 dark:border-slate-800">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-6 pr-2 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-slate-600"
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (onChange) onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${value === opt
                    ? 'font-bold bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const MAIN_KPI_CARDS = [
  { key: 'sales', title: 'Revenue', value: '$248.5K', change: '+14.2%', trend: 'up', isPositive: true, subtext: 'vs previous 30d' },
  { key: 'margin', title: 'Margin', value: '$42.8K', change: '+8.4%', trend: 'up', isPositive: true, subtext: 'Net CM2 Margin' },
  { key: 'cash', title: 'Cash', value: '$284.6K', change: '+8.2%', trend: 'up', isPositive: true, subtext: 'Working capital' },
  { key: 'inventory', title: 'Inventory', value: '$1.82M', change: '+4.2%', trend: 'up', isPositive: true, subtext: 'Total stock cost' },
  { key: 'ads', title: 'Ads', value: '$24.8K', change: '+18.2%', trend: 'up', isPositive: false, subtext: 'Ad spend (30d)' },
];

const KPI_FAMILY_PILLS = [
  { key: 'all', label: 'All families' },
  { key: 'competitive', label: 'Competitive' },
  { key: 'demand', label: 'Demand' },
  { key: 'opportunity', label: 'Opportunity' },
  { key: 'news', label: 'News' },
  { key: 'risk', label: 'Risk' },
];

const IntelV2Page = ({ defaultTab = 'sales' }) => {
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

  // Main KPI Card state (Revenue, Margin, Cash, Inventory, Ads)
  // null = all main cards full size, sub-KPIs hidden
  // selected = main cards shrink in height/width, sub-KPIs open below
  const [selectedMainKpi, setSelectedMainKpi] = useState(null);

  const [expandedInsight, setExpandedInsight] = useState(null);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isRepriceModalOpen, setIsRepriceModalOpen] = useState(false);
  const [isCaseReportModalOpen, setIsCaseReportModalOpen] = useState(false);

  // Scroll-aware header + sticky KPI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [kpiIsSticky, setKpiIsSticky] = useState(false);
  const [compactFilterOpen, setCompactFilterOpen] = useState(false);
  const kpiSectionRef = useRef(null);
  const compactFilterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const [_filterPanelPos, setFilterPanelPos] = useState({ top: 64, right: 24 });

  /* ── V2 filter panel ── */
  const [v2FilterOpen, setV2FilterOpen] = useState(false);
  const [_v2Section, setV2Section] = useState('date');
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
  const [_hoverDay, _setHoverDay] = useState(null);
  const [calViewYear, setCalViewYear] = useState(() => new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(() => new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1);
  const v2FilterRef = useRef(null);
  const chanDropRef = useRef(null);
  const mobileFilterBtnRef = useRef(null);

  const { setDateRange, category, setCategory, setChannel, setProducts, searchQuery: _searchQuery, setSearchQuery: _setSearchQuery } = useFilterStore();
  const navigate = useNavigate();
  const { goToProduct, findWatchlistItem, buildFallbackWatchlistItem, buildAnalyticsKpiGroups } = useProductNavigation();

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

  const activeStats = STATS_BY_TAB[selectedMainKpi || 'sales'] || STATS_BY_TAB.sales;

  const handleStepClick = (stepId) => {
    navigate(`/intel/insight/sales/${stepId}`);
  };

  const [_showStickyTabs, setShowStickyTabs] = useState(false);
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

  // Compact header center — null (tabs removed)
  const compactHeaderCenter = null;

  const _compactFilterElement = null; // search bar removed

  /* ── V2 filter helpers ── */
  const v2ChanList = channelOptions.filter(([v]) => v !== 'all');
  const _v2ChanGrid = [...v2ChanList, ['all-chans', 'All Channels']];
  const _v2ChanLabel = (v) => channelOptions.find(([k]) => k === v)?.[1] || v;

  const _prevCalMonth = () => {
    if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear(y => y - 1); }
    else setCalViewMonth(m => m - 1);
  };
  const _nextCalMonth = () => {
    if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear(y => y + 1); }
    else setCalViewMonth(m => m + 1);
  };
  const _handleDateClick = (date) => {
    if (!pendingRangeStart || pendingRangeEnd) {
      setPendingRangeStart(date); setPendingRangeEnd(null); setPendingDate('custom');
    } else {
      if (date < pendingRangeStart) { setPendingRangeEnd(pendingRangeStart); setPendingRangeStart(date); }
      else setPendingRangeEnd(date);
      setPendingDate('custom');
    }
  };
  const _calRightM = (calViewMonth + 1) % 12;
  const _calRightY = calViewMonth === 11 ? calViewYear + 1 : calViewYear;

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
  const _handleApplyV2Filter = () => {
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
  const _togglePendingCat = (cat) => {
    if (cat === 'all') { setPendingCats([]); return; }
    setPendingCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const _togglePendingChan = (ch) =>
    setPendingChans(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  const _togglePendingProduct = (id) =>
    setPendingProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const _removeAppliedChan = (ch) => {
    const next = appliedChans.filter(c => c !== ch);
    setAppliedChans(next);
    setChannel(next.length === 1 ? next[0] : 'all');
  };

  const briefData = useUniversalBrief();

  return (
    <DashboardLayout
      title="Workspace"
      // subtitle="Real-time analytics"
      showSearch={false}
      showTabs={false}
      showAIPrompt={true}
      aiPromptFullWidth={true}
      searchCollapsed={false}
      headerCenterElement={compactHeaderCenter}
      customRightElement={null}
      hideMobileSearchIcon={true}
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
            <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400 whitespace-nowrap">Dashboard</span>
            <button
              onClick={() => navigate(`/detailed-view/${activeIntelTab}`, { state: { from: '/intel' } })}
              className="relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full bg-gray-300 dark:bg-slate-600 transition-colors hover:bg-gray-400 dark:hover:bg-slate-500"
            >
              <span className="inline-block h-3 w-3 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">

        {/* MOBILE-only: page heading + Filters trigger (ss1 layout) */}
        <div className="sm:hidden flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 text-[17px] leading-tight tracking-tight">Intelligence///</h2>
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


        {/* Realify Brief (Top Banner) + Channel / Date Controls */}
        <div className="w-full space-y-2">
          <RealifyBrief data={briefData} />

        </div>

        {/* Single Unified Container Box for KPI Cards + Feed */}
        <div className="bg-white dark:bg-[#030712] border border-gray-200 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-sm space-y-3">

          {/* Section 1: KPI Cards / Converted Pills Row */}
          <div ref={kpiSectionRef} className="w-full space-y-3">
            {selectedMainKpi === null ? (
              <>
                {/* Header Controls at top right when no main card is selected */}
                <div className="flex items-center justify-end gap-3 w-full">
                  <BriefHeaderControls
                    isDashboardViewActive={false}
                    onDashboardToggle={() =>
                      navigate(`/detailed-view/${activeIntelTab}`, {
                        state: { from: '/intel' },
                      })
                    }
                  />
                </div>

                {/* 5 Main KPI Cards in standard StatCard size */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 transition-all duration-300">
                  {MAIN_KPI_CARDS.map(kpi => (
                    <StatCard
                      key={kpi.key}
                      title={kpi.title}
                      value={kpi.value}
                      change={kpi.change}
                      isPositive={kpi.isPositive}
                      subtext={kpi.subtext}
                      onClick={() => setSelectedMainKpi(kpi.key)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Converted Pills + Controls in ONE SINGLE ROW when a main card is selected */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full border-b border-gray-100 dark:border-slate-800/80 pb-3">
                  {/* Converted Pills: NAME ONLY */}
                  <div className="flex items-center gap-2 overflow-x-auto min-w-0 py-1 scrollbar-hide">
                    {MAIN_KPI_CARDS.map(kpi => {
                      const isSelected = selectedMainKpi === kpi.key;
                      return (
                        <button
                          key={kpi.key}
                          onClick={() => setSelectedMainKpi(prev => (prev === kpi.key ? null : kpi.key))}
                          className={`flex items-center justify-center px-4 py-2 text-[14px] font-bold rounded-xl border transition-all shadow-xs whitespace-nowrap ${isSelected
                            ? 'bg-[#1C1C1E] dark:bg-slate-100 text-white dark:text-gray-900 border-[#1C1C1E] dark:border-slate-100'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                        >
                          <span>{kpi.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right side controls in the EXACT SAME ROW */}
                  <div className="flex items-center justify-end gap-3 flex-shrink-0">
                    <BriefHeaderControls
                      isDashboardViewActive={false}
                      onDashboardToggle={() =>
                        navigate(`/detailed-view/${selectedMainKpi || activeIntelTab}`, {
                          state: { from: '/intel' },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Sub KPI Cards for selected Main KPI in full size */}
                <div className="space-y-2.5 pt-1 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      {/* Sub KPIs — {MAIN_KPI_CARDS.find(m => m.key === selectedMainKpi)?.title} */}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
                    {selectedKpiIndices.map(idx => {
                      const currentSubStats = STATS_BY_TAB[selectedMainKpi] || STATS_BY_TAB.sales;
                      const stat = currentSubStats[idx] || currentSubStats[0];
                      return (
                        <StatCard
                          key={idx}
                          title={stat.title}
                          value={stat.value}
                          change={stat.change}
                          trend={stat.trend}
                          isPositive={stat.isPositive}
                          loading={loading}
                          showIcon={false}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section 2: AI SIGNALS STREAM CONTAINER */}
          <div id="ai-insights">
            <TabContent
              key={activeIntelTab}
              activeTab={activeIntelTab}
              expandedInsight={expandedInsight}
              onSelectInsight={setExpandedInsight}
            />
          </div>

        </div>
      </div>

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={activeStats}
        selectedIndices={selectedKpiIndices}
        onSave={(indices) => { setSelectedKpiIndices(indices); }}
      />
      <DismissModal
        isOpen={isDismissModalOpen}
        onClose={() => setIsDismissModalOpen(false)}
      />
      <RepriceModal
        isOpen={isRepriceModalOpen}
        onClose={() => setIsRepriceModalOpen(false)}
      />
      <CaseReportModal
        isOpen={isCaseReportModalOpen}
        onClose={() => setIsCaseReportModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default IntelV2Page;
