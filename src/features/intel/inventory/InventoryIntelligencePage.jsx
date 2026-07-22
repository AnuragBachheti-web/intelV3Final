import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatCard from '../../../components/common/StatCard';
import DeepDiveModal from '../../../components/common/DeepDiveModal';
import AnalyticsModal from '../../../components/common/AnalyticsModal';
import ChartModal from '../../../components/common/ChartModal';
import KPISelectorModal from '../../../components/common/KPISelectorModal';
import KPIDetailModal from '../../../components/common/KPIDetailModal';
import { useFilterStore } from '../../../store/useFilterStore';
import apiClient from '../../../api/client';
import InventoryStatusTable from './components/InventoryStatusTable';
import { inventoryIntel } from './inventoryData';
import IntelSection from '../../../components/common/IntelSection';
import { SEMANTIC_COLORS } from '../../../utils/chartColors';
import { formatCurrency } from '../../../utils/formatters';
import { revenueTrendData } from '../sales/salesData';
import InventoryDeepDivePanel from './components/InventoryDeepDivePanel';
import useProductNavigation from '../../../hooks/useProductNavigation';
import useModalToggle from '../../../hooks/useModalToggle';

const InventoryIntelligencePage = () => {
  const [invData, setInvData] = useState(null);
  const [, setLoading] = useState(true);
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);
  const [activeModal, setActiveModal] = useState({ isOpen: false, type: null, data: null });
  const [deepDiveTab, setDeepDiveTab] = useState('revenue');
  const [expandedChart, setExpandedChart] = useState(null);
  const [componentModal, setComponentModal] = useState(null);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const { goToProduct, findWatchlistItem, buildFallbackWatchlistItem, buildAnalyticsKpiGroups } = useProductNavigation();

  useEffect(() => {
    const fetchInvData = async () => {
      const shop = localStorage.getItem('active_shop');
      const platform = localStorage.getItem('active_platform') || 'shopify';
      if (shop) {
        try {
          const response = await apiClient.get(`/${platform}/inventory-intelligence`);
          setInvData(response.data);
        } catch (error) {
          console.error("Failed to fetch inventory data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchInvData();
  }, []);

  const openProductModal = (product) => {
    const name = product.title || product.name;
    const watchlistItem = findWatchlistItem(name);

    goToProduct({
      name,
      icon: 'fa-box',
      image: watchlistItem?.image || null,
      description: `${name} is a key product driving your sales performance. Review channel distribution, margin contribution, and inventory health below.`,
      kpiGroups: buildAnalyticsKpiGroups({
        totalRevenue: '—',
        unitsSold: '—',
        avgPrice: '—',
        buyBoxPct: '—',
        marginPct: '34.2%',
        cm2Profit: '$42.8K',
        revenue: '—',
        units: '—',
        onHand: product.onhand || watchlistItem?.stock || '—',
        doc: product.doc || '—',
        velocity: product.vel || watchlistItem?.velocity || '—',
        reorderQty: product.inbound || '200',
      }),
      insights: [
        `On-hand: ${product.onhand || watchlistItem?.stock || '—'} units — approaching critical level`,
        `Current DOC: ${product.doc || '—'} — initiate reorder to prevent stockout`,
        watchlistItem?.subtext || `Sales velocity at ${product.vel || '—'} — monitor stock levels`,
      ],
      watchlistItem: watchlistItem || buildFallbackWatchlistItem(name, product.sku || 'N/A', {
        stock: product.onhand ? `${product.onhand}` : '—',
        velocity: product.vel || null,
        status: 'LOW',
        statusColor: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/40',
        progress: 18,
        progressColor: 'bg-red-500',
        subtext: product.doc ? `Est. stockout in ${product.doc}` : 'No watchlist data available',
      }),
    }, '/inventory');
  };

  const stats = [
    { title: "DOC (Avg)", value: "42 Days", change: "-3.2d", isPositive: true, subtext: "Stock-out coverage" },
    { title: "OOS Risk", value: "12", change: "+3", isPositive: false, subtext: "Critical reorder" },
    { title: "Overstock", value: "8", change: "flat", isPositive: true, subtext: "Excess capital" },
    { title: "In-Stock %", value: "94.2%", change: "+2.1%", isPositive: true, subtext: "Availability rate" },
    { title: "Inbound POs", value: "5", change: "$42.4k", isPositive: true, subtext: "Items in transit" },
    { title: "In-Stock %", value: "94.2%", change: "+2.1%", isPositive: true, subtext: "Inventory health" },
    { title: "Avg DOC (days)", value: "42", change: "-3.2", isPositive: true, subtext: "Average cover" },
    { title: "OOS Risk (14d)", value: "15", change: "+2", isPositive: false, subtext: "Next 2 weeks" },
    { title: "Overstock (DOC>180)", value: "8", change: "0", isPositive: true, subtext: "Dead stock" },
    { title: "Inventory at Cost", value: formatCurrency(invData?.total_inventory_value || 1800000), change: "+8.2%", isPositive: true, subtext: "Book value" }
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
    <DashboardLayout
      title="Intelligence"
      subtitle="Real-time inventory analytics and predictive replenishment insights"
      showSearch={true}
    >
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
            {selectedKpiIndices.map((kpiIdx) => (
              <StatCard
                key={kpiIdx}
                {...stats[kpiIdx]}
                onClick={() => { setSelectedStatIdx(kpiIdx); setDeepDiveTab('revenue'); kpiDetailModal.open(stats[kpiIdx]); }}
              />
            ))}
          </div>

          <IntelSection title="Insights" items={inventoryIntel} />

          <div className="mt-6">
            <InventoryStatusTable onRowClick={openProductModal} />
          </div>
        </div>

        <InventoryDeepDivePanel
          deepDiveTab={deepDiveTab}
          setDeepDiveTab={setDeepDiveTab}
          activeStat={activeStat}
          activeStatChart={activeStatChart}
          selectedKpiIndices={selectedKpiIndices}
          setActiveModal={setActiveModal}
          setComponentModal={setComponentModal}
          onProductClick={openProductModal}
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
      />
      <ChartModal chart={expandedChart} onClose={() => setExpandedChart(null)} />
      <DeepDiveModal modal={componentModal} onClose={() => setComponentModal(null)} />
      <KPIDetailModal
        isOpen={kpiDetailModal.isOpen}
        onClose={kpiDetailModal.close}
        stat={kpiDetailModal.data}
        filterContext={{ dateRange }}
        tab="inventory"
      />
    </DashboardLayout>
  );
};

export default InventoryIntelligencePage;
