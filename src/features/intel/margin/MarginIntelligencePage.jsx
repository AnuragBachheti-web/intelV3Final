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
import MarginAnalysisTable from './components/MarginAnalysisTable';
import { marginIntelItems } from './marginData';
import IntelSection from '../../../components/common/IntelSection';
import { SEMANTIC_COLORS } from '../../../utils/chartColors';
import { revenueTrendData } from '../sales/salesData';
import MarginDeepDivePanel from './components/MarginDeepDivePanel';
import useProductNavigation from '../../../hooks/useProductNavigation';
import useModalToggle from '../../../hooks/useModalToggle';

const MarginIntelligencePage = () => {
  const [marginData, setMarginData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);
  const [selectedKpiIndices, setSelectedKpiIndices] = useState([0, 1, 2, 3]);
  const [isKpiSelectorOpen, setIsKpiSelectorOpen] = useState(false);
  const kpiDetailModal = useModalToggle();
  const { dateRange } = useFilterStore();
  const [activeModal, setActiveModal] = useState({ isOpen: false, type: null, data: null });
  const [deepDiveTab, setDeepDiveTab] = useState('revenue');
  const [expandedChart, setExpandedChart] = useState(null);
  const [componentModal, setComponentModal] = useState(null);
  const { goToProduct, findWatchlistItem, buildFallbackWatchlistItem, buildAnalyticsKpiGroups } = useProductNavigation();

  useEffect(() => {
    const fetchMarginData = async () => {
      const shop = localStorage.getItem('active_shop');
      const platform = localStorage.getItem('active_platform') || 'shopify';
      if (shop) {
        try {
          const response = await apiClient.get(`/${platform}/margin-intelligence`);
          setMarginData(response.data);
        } catch (error) {
          console.error("Failed to fetch margin data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchMarginData();
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
        totalRevenue: product.revenue || (product.rev ? `$${Number(product.rev).toLocaleString()}` : '—'),
        unitsSold: product.cogs || '—',
        avgPrice: product.cm2 || '—',
        buyBoxPct: product.gross || (product.bb ? `${(product.bb * 100).toFixed(0)}%` : '—'),
        marginPct: product.cm3 || (product.cmpct != null ? `${(product.cmpct * 100).toFixed(1)}%` : '34.2%'),
        cm2Profit: product.cm2pct || (product.cm2 != null && typeof product.cm2 === 'number' ? `$${product.cm2}` : '$42.8K'),
        revenue: product.revenue || (product.rev ? `$${Number(product.rev).toLocaleString()}` : '—'),
        units: product.cogs || '—',
        onHand: watchlistItem?.stock || '—',
        doc: '12.3',
        velocity: watchlistItem?.velocity || '—',
        reorderQty: '200',
      }),
      insights: [
        `Revenue at ${product.revenue || (product.rev ? `$${Number(product.rev).toLocaleString()}` : '—')} — primarily driven by Amazon US channel`,
        `Buy Box at ${product.gross || (product.bb ? `${(product.bb * 100).toFixed(0)}%` : '—')} — monitor competitor pricing to maintain position`,
        watchlistItem?.subtext || 'Review inventory levels to avoid stockouts',
      ],
      watchlistItem: watchlistItem || buildFallbackWatchlistItem(name, product.sku || 'N/A'),
    }, '/margin');
  };

  const stats = [
    { title: "CM2 (Cross-Channel)", value: "$18,450", change: "+5.2%", isPositive: true, subtext: "Contribution Margin 2" },
    { title: "CM%", value: "28.4%", change: "+2.1%", isPositive: true, subtext: "Profit after direct costs" },
    { title: "Unprofitable SKUs", value: "12", change: "-2", isPositive: true, subtext: "SKUs with negative CM2" },
    { title: "Pricing Opportunities", value: "27", change: "+$24.8k", isPositive: true, subtext: "Potential margin gain" },
    { title: "CM2 (USD)", value: "$124,500", change: "+$12k", isPositive: true, subtext: "Total CM2 in Dollars" },
    { title: "CM3 Channel", value: "12.4%", change: "-0.4%", isPositive: false, subtext: "After channel marketing" },
    { title: "CM3 Cross-Ch", value: "11.8%", change: "+1.2%", isPositive: true, subtext: "Blended CM3 across all" },
    { title: "Gross Margin %", value: loading ? "..." : `${marginData?.gross_margin_pct || 42.3}%`, change: "1.4%", isPositive: true, subtext: "of net sales (30d)" },
    { title: "Contribution %", value: "19.4%", change: "+2.1%", isPositive: true, subtext: "Overall contribution yield" }
  ];

  const statChartConfigs = [
    { dataKey: 'revenue', data: revenueTrendData, color: SEMANTIC_COLORS.revenue, fmt: v => `$${(v / 1000).toFixed(0)}k` },
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
      subtitle="Real-time profitability analytics and margin optimization"
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
            {selectedKpiIndices.map((kpiIdx) => {
              const stat = stats[kpiIdx];
              return (
                <StatCard
                  key={kpiIdx}
                  {...stat}
                  onClick={() => { setSelectedStatIdx(kpiIdx); setDeepDiveTab('revenue'); kpiDetailModal.open(stat); }}
                />
              );
            })}
          </div>

          <IntelSection title="Insights" items={marginIntelItems} />

          <div className="mt-6">
            <MarginAnalysisTable onRowClick={openProductModal} />
          </div>
        </div>

        <MarginDeepDivePanel
          deepDiveTab={deepDiveTab}
          setDeepDiveTab={setDeepDiveTab}
          activeStat={activeStat}
          activeStatChart={activeStatChart}
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
        tab="margin"
      />
    </DashboardLayout>
  );
};

export default MarginIntelligencePage;
