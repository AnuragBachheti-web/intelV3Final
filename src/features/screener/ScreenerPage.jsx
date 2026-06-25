import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MarketShareTab from './tabs/MarketShareTab';
import PriceBuyBoxTab from './tabs/PriceBuyBoxTab';
import AssortmentGapsTab from './tabs/AssortmentGapsTab';
import BSRDemandTab from './tabs/BSRDemandTab';
import OpportunityResearchTab from './tabs/OpportunityResearchTab';

const screenerTabs = [
  { path: '/research', label: 'Market Share', icon: 'fa-chart-pie' },
  { path: '/research/price-buybox', label: 'Price & Buy Box', icon: 'fa-tags' },
  { path: '/research/assortment-gaps', label: 'Assortment Gaps', icon: 'fa-layer-group' },
  { path: '/research/bsr-demand', label: 'BSR & Demand', icon: 'fa-fire' },
  { path: '/research/opportunity-research', label: 'Opportunity Research', icon: 'fa-magnifying-glass-chart' },
];

const ScreenerPage = () => {
  const { pathname } = useLocation();

  const renderTab = () => {
    switch (pathname) {
      case '/research/price-buybox':
        return <PriceBuyBoxTab />;
      case '/research/assortment-gaps':
        return <AssortmentGapsTab />;
      case '/research/bsr-demand':
        return <BSRDemandTab />;
      case '/research/opportunity-research':
        return <OpportunityResearchTab />;
      default:
        return <MarketShareTab />;
    }
  };

  return (
    <DashboardLayout
      title="Research"
      subtitle="Real-time analytics and predictive insights"
      tabs={screenerTabs}
      showSearch={true}
      aiPromptFullWidth={true}
    >
      {renderTab()}
    </DashboardLayout>
  );
};

export default ScreenerPage;
