import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/common/StatCard';
import RevenueChart from './components/RevenueChart';
import PerformanceSection from './components/PerformanceSection';
import AnalyticsModal from '../../../components/common/AnalyticsModal';
import { revenueTrendData, salesIntelItems } from './salesData';
import IntelSection from '../../../components/common/IntelSection';
import { SEMANTIC_COLORS } from '../../../utils/chartColors';
import ChartModal from '../../../components/common/ChartModal';
import KPISelectorModal from '../../../components/common/KPISelectorModal';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import apiClient from '../../../api/client';
import SalesDeepDivePanel from './components/SalesDeepDivePanel';
import useProductNavigation from '../../../hooks/useProductNavigation';
import useModalToggle from '../../../hooks/useModalToggle';

const SalesIntelligencePage = () => {
  const [, setIntelData] = useState(null);
  const [, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);
  const [activeModal, setActiveModal] = useState({ isOpen: false, type: null, data: null });
  const [deepDiveTab, setDeepDiveTab] = useState('revenue');
  const [expandedChart, setExpandedChart] = useState(null);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const { goToProduct, findWatchlistItem, buildFallbackWatchlistItem, buildAnalyticsKpiGroups } = useProductNavigation();

  const fetchedRef = React.useRef(false);

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
    }, '/sales');
  };

  useEffect(() => {
    const fetchIntel = async () => {
      if (fetchedRef.current) return;
      const shop = localStorage.getItem('active_shop');
      const platform = localStorage.getItem('active_platform') || 'shopify';
      if (shop) {
        fetchedRef.current = true;
        try {
          const summaryRes = await apiClient.get(`/${platform}/sales-intelligence`);
          setIntelData(summaryRes.data);
          const productsRes = await apiClient.get(`/${platform}/top-products`, { params: { limit: 3 } });
          setTopProducts(productsRes.data);
        } catch (error) {
          console.error("Failed to fetch intelligence data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchIntel();
  }, []);

  const stats = [
    { title: "Total Revenue", value: "$124,500", change: "12.4%", trend: "up", isPositive: true },
    { title: "Units Sold", value: "2,180", change: "8.1%", trend: "up", isPositive: true },
    { title: "Total Orders", value: "412", change: "6.3%", trend: "up", isPositive: true },
    { title: "Avg Order Value", value: "$302", change: "4.2%", trend: "up", isPositive: true },
    { title: "Buy Box %", value: "87.4%", change: "-2.1%", trend: "down", isPositive: false },
    { title: "ROAS", value: "4.2x", change: "+0.3x", trend: "up", isPositive: true },
    { title: "Channel Mix", value: "3.8%", change: "-0.5%", trend: "down", isPositive: false },
    { title: "Repeat Customers", value: "28%", change: "+4.8%", trend: "up", isPositive: true },
  ];

  const statChartConfigs = [
    { dataKey: 'revenue', data: revenueTrendData, color: SEMANTIC_COLORS.revenue, fmt: v => `$${(v/1000).toFixed(0)}k` },
    { dataKey: 'val', data: [{ name: 'W1', val: 1800 }, { name: 'W2', val: 2100 }, { name: 'W3', val: 1650 }, { name: 'W4', val: 2400 }, { name: 'W5', val: 2180 }, { name: 'W6', val: 2350 }], color: '#6366f1', fmt: v => `${v}` },
    { dataKey: 'val', data: [{ name: 'W1', val: 340 }, { name: 'W2', val: 380 }, { name: 'W3', val: 290 }, { name: 'W4', val: 420 }, { name: 'W5', val: 390 }, { name: 'W6', val: 450 }], color: '#10b981', fmt: v => `${v}` },
    { dataKey: 'val', data: [{ name: 'W1', val: 285 }, { name: 'W2', val: 298 }, { name: 'W3', val: 310 }, { name: 'W4', val: 302 }, { name: 'W5', val: 318 }, { name: 'W6', val: 325 }], color: '#f59e0b', fmt: v => `$${v}` },
  ];
  const activeStat = stats[selectedStatIdx] || stats[0];
  const activeStatChart = {
    ...(statChartConfigs[selectedStatIdx] || statChartConfigs[0]),
    color: activeStat.isPositive ? '#22c55e' : '#ef4444',
  };

  return (
    <DashboardLayout title="Intelligence" subtitle="Real-time sales analytics" showSearch={true}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">

        <div className="lg:col-span-2">
          <div className="flex items-center justify-start mb-3">
            <button
              onClick={() => setIsKpiSelectorOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
            >
              <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                <i className="fa-solid fa-plus text-[8px]"></i>
              </span>
              Customise KPIs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-2">
            {selectedKpiIndices.map((kpiIdx) => {
              const stat = stats[kpiIdx];
              return (
                <StatCard
                  key={kpiIdx}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  isPositive={stat.isPositive}
                  loading={loading}
                  onClick={() => { setSelectedStatIdx(kpiIdx); setDeepDiveTab('revenue'); kpiDetailModal.open(stat); }}
                />
              );
            })}
          </div>

          <IntelSection title="Insights" items={salesIntelItems} />

          <div className="mt-6">
            <PerformanceSection onProductClick={openProductModal} />
          </div>
        </div>

        <SalesDeepDivePanel
          deepDiveTab={deepDiveTab}
          setDeepDiveTab={setDeepDiveTab}
          activeStat={activeStat}
          activeStatChart={activeStatChart}
          selectedKpiIndices={selectedKpiIndices}
          onProductClick={openProductModal}
          setActiveModal={setActiveModal}
          setExpandedChart={setExpandedChart}
        />
      </div>

      <KPISelectorModal
        isOpen={isKpiSelectorOpen}
        onClose={() => setIsKpiSelectorOpen(false)}
        allKpis={stats}
        selectedIndices={selectedKpiIndices}
        onSave={setSelectedKpiIndices}
      />
      <AnalyticsModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ ...activeModal, isOpen: false })}
        data={activeModal.data}
        tableOnly={activeModal.data?.title === 'Top SKUs by Revenue'}
      />
      <ChartModal chart={expandedChart} onClose={() => setExpandedChart(null)} />
      <KPIDetailModal
        isOpen={kpiDetailModal.isOpen}
        onClose={kpiDetailModal.close}
        stat={kpiDetailModal.data}
        filterContext={{ dateRange }}
        tab="sales"
      />
    </DashboardLayout>
  );
};

export default SalesIntelligencePage;
