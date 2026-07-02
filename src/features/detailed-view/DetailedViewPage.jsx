import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import KPISelectorModal from '../../components/common/KPISelectorModal';
import KPIDetailModal from '../../components/common/KPIDetailModal';
import BaseAreaChart from '../../components/common/charts/BaseAreaChart';
import { revenueTrendData } from '../intel/sales/salesData';

import ProductHeatmap from './components/ProductHeatmap';
import ChannelMixWidget from './components/ChannelMixWidget';
import SectionHeading from './components/SectionHeading';
import StickyKpiStrip from './components/StickyKpiStrip';
import DetailViewTabNav from './components/DetailViewTabNav';
import FilterBar from './components/FilterBar';
import CompactFilterButton from './components/CompactFilterButton';
import useDetailedViewFilters from './hooks/useDetailedViewFilters';
import { useViewModeStore } from '../../store/useViewModeStore';
import useModalToggle from '../../hooks/useModalToggle';
import { STATS_DATA, PAGE_TITLES, BACK_ROUTES } from './detailedViewData';

import SalesTables from './tabs/SalesTables';
import MarginDashboardGrid from './tabs/MarginDashboardGrid';
import InventoryTables from './tabs/InventoryTables';
import AdsTables from './tabs/AdsTables';
import CashPageTables from './tabs/CashPageTables';

// Margin — used directly in the Row 1 "Bleeding Margin SKUs" panel
import BleedingMarginTable from '../intel/margin/components/BleedingMarginTable';
import CashFlowTable from '../intel/cash/components/CashFlowTable';
import { cashStats } from '../intel/cash/cashData';

// Inventory charts — lazy: only loaded when intelType === 'inventory'
const InventoryTrendChart = lazy(() => import('../intel/inventory/components/InventoryTrendChart'));
const StockStatusChart = lazy(() => import('../intel/inventory/components/StockStatusChart'));
const DOCDistributionChart = lazy(() => import('../intel/inventory/components/DOCDistributionChart'));
const ForecastActualChart = lazy(() => import('../intel/inventory/components/ForecastActualChart'));

// Ads charts — lazy: only loaded when intelType === 'ads'
const AdSpendTrendChart = lazy(() => import('../intel/ads/components/AdSpendTrendChart'));

// Cash charts — lazy: only loaded when intelType === 'cash'
const CashFlowTrendSection = lazy(() => import('../intel/cash/components/CashFlowTrendSection'));

const TABLES_MAP = { sales: SalesTables, inventory: InventoryTables, ads: AdsTables, cash: CashPageTables };

const DetailedViewPage = () => {
  const { intelType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [kpiIsSticky, setKpiIsSticky] = useState(false);
  const kpiSectionRef = useRef(null);

  const filters = useDetailedViewFilters(isScrolled);

  // Remember that Dashboard View (this page) is the active view + which tab, so
  // navigating away and back to Intel (e.g. via the sidebar) restores it.
  const { setDashboardView, setLastIntelTab } = useViewModeStore();
  useEffect(() => {
    setDashboardView(true);
    setLastIntelTab(intelType);
  }, [intelType]); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedKpiIndices, setSelectedKpiIndices] = useState(location.state?.selectedKpiIndices || [0, 1, 2, 3, 4, 5]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const kpiDetailModal = useModalToggle();
  const statsData = intelType === 'cash' ? cashStats : (STATS_DATA[intelType] || STATS_DATA.sales);
  const pageTitle = PAGE_TITLES[intelType] || 'Sales';
  const backRoute = location.state?.from || BACK_ROUTES[intelType] || '/intel';

  const TablesComponent = TABLES_MAP[intelType] || SalesTables;

  // Scroll detection — shows tabs in sticky header, collapses search bar
  useEffect(() => {
    const el = document.querySelector('.dashboard-main-content');
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 30);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // KPI sticky — triggers when KPI section < 28% visible
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

  const goToTab = (tabKey) => navigate(`/detailed-view/${tabKey}`, { state: { from: backRoute } });

  return (
    <DashboardLayout
      title="Intelligence"
      subtitle={`${pageTitle} — Detailed View`}
      showTabs={false}
      filters={null}
      showSearch={true}
      searchCollapsed={isScrolled}
      headerCenterElement={isScrolled ? <DetailViewTabNav intelType={intelType} onTabClick={goToTab} compact /> : null}
      customRightElement={isScrolled ? <CompactFilterButton filters={filters} /> : null}
    >
      <StickyKpiStrip kpiIsSticky={kpiIsSticky} statsData={statsData} onDashboardClick={() => navigate(backRoute)} />

      {/* Tab nav (left) + Filter button (right) */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 mb-5">
        <DetailViewTabNav intelType={intelType} onTabClick={goToTab} />
        <FilterBar filters={filters} />
      </div>

      {/* Toggle row — Customize KPIs (left) + Dashboard toggle (right) */}
      <div className="flex items-center justify-between mt-0 mb-3">
        <button
          onClick={() => setIsKpiSelectorOpen(true)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
        >
          <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
            <i className="fa-solid fa-plus text-[8px]" />
          </span>
          Customise KPIs
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">AI View</span>
          <button
            onClick={() => navigate(backRoute)}
            className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-gray-900 dark:bg-slate-100 transition-colors hover:opacity-80"
          >
            <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-gray-900 transition-transform translate-x-4" />
          </button>
          <span className="text-xs font-semibold text-gray-900 dark:text-slate-100">Dashboard View</span>
        </div>
      </div>

      {/* KPI cards — 6 StatCards matching AI View style */}
      <div ref={kpiSectionRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {selectedKpiIndices.map(idx => {
          const stat = statsData[idx] || statsData[0];
          return (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
              subtext={stat.subtext}
              onClick={() => kpiDetailModal.open(stat)}
            />
          );
        })}
      </div>

      {/* Main dashboard content */}
      <div className="space-y-4">

        {/* Row 1: For margin — BleedingMarginSKUs + ChannelMix. For others — primary trend chart + ChannelMix */}
        {intelType === 'margin' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">Bleeding Margin SKUs</h4>
                <span className="text-[11px] text-gray-400 dark:text-slate-500">Sorted by $ at risk descending</span>
              </div>
              <BleedingMarginTable onRowClick={() => { }} hideTitleBar />
            </div>
            <div><ChannelMixWidget /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
            <div className="lg:col-span-2 flex flex-col">
              {intelType === 'sales' && (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200">Revenue Trend</p>
                  </div>
                  <div className="p-3">
                    <BaseAreaChart
                      data={revenueTrendData}
                      yAxisFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                      tooltipFormatter={(v, n) => [`$${(v / 1000).toFixed(0)}k`, n]}
                      areas={[{ key: 'revenue', name: 'Revenue Trend', color: '#22c55e' }]}
                      height={308}
                    />
                  </div>
                </div>
              )}
              {intelType === 'inventory' && (
                <Suspense fallback={<div className="min-h-[200px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="flex-1 min-h-0 p-4"><InventoryTrendChart /></div>
                  </div>
                </Suspense>
              )}
              {intelType === 'ads' && (
                <Suspense fallback={<div className="min-h-[200px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                      <p className="text-xs font-bold text-gray-800 dark:text-slate-200">Ad Spend Trend</p>
                    </div>
                    <div className="flex-1 min-h-0 p-3"><AdSpendTrendChart /></div>
                  </div>
                </Suspense>
              )}
              {intelType === 'cash' && (
                <Suspense fallback={<div className="min-h-[200px] rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
                  <div className="h-full"><CashFlowTrendSection /></div>
                </Suspense>
              )}
            </div>
            <div>
              <ChannelMixWidget />
            </div>
          </div>
        )}

        {/* Row 2: Product heatmap */}
        <div className="bg-white dark:bg-[#030712] border border-gray-200 dark:border-slate-800 rounded-2xl p-4">
          <ProductHeatmap intelType={intelType} />
        </div>

        {/* Row 3: Secondary charts — remaining inventory charts */}
        {intelType === 'inventory' && (
          <Suspense fallback={<div className="h-40 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <StockStatusChart />
              <DOCDistributionChart />
              <ForecastActualChart />
            </div>
          </Suspense>
        )}

        {/* Row 4: KPI detail tables / Margin 50-50 grid */}
        {intelType === 'margin' ? <MarginDashboardGrid /> : <TablesComponent />}
      </div>

      {/* Full-width Cash Flow table (below grid so all columns are visible) */}
      {intelType === 'cash' && (
        <div className="mt-6">
          <SectionHeading title="Cash Flow" />
          <CashFlowTable />
        </div>
      )}

      <KPIDetailModal
        isOpen={kpiDetailModal.isOpen}
        onClose={kpiDetailModal.close}
        stat={kpiDetailModal.data}
        filterContext={{ dateRange: filters.appliedDate, categories: filters.appliedCats, channels: filters.appliedChans }}
        tab={intelType}
      />

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={statsData}
        selectedIndices={selectedKpiIndices}
        onSave={(indices) => { setSelectedKpiIndices(indices); }}
      />

    </DashboardLayout>
  );
};

export default DetailedViewPage;
