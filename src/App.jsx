import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { useOAuth } from "./hooks/useOAuth";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Lazy loading features
const Onboarding             = lazy(() => import("./features/onboarding/components/OnboardingLayout"));
const History                = lazy(() => import("./features/history/HistoryPage"));
const HistoryDetailPage      = lazy(() => import("./features/history/HistoryDetailPage"));
const MarketplaceConnectionPage = lazy(() => import("./features/onboarding/pages/MarketplaceConnectionPage"));
const ActionsPage            = lazy(() => import("./features/action-center"));
const NewAnalysisPage        = lazy(() => import("./features/new-analysis"));
const DiscoverPage           = lazy(() => import("./features/discover/DiscoverPage"));
const Screener               = lazy(() => import("./features/screener/ScreenerPage"));
const ScreenerActionDetailPage = lazy(() => import("./features/screener/components/ScreenerActionDetailPage"));
const SettingsPage           = lazy(() => import("./features/settings/SettingsPage"));
const HubsPage               = lazy(() => import("./features/hubs"));
const DetailedViewPage       = lazy(() => import("./features/detailed-view/DetailedViewPage"));
const ProductViewPage        = lazy(() => import("./features/product-view/ProductViewPage"));
const ComparisonPage         = lazy(() => import("./features/comparison/ComparisonPage"));
const IntelPage            = lazy(() => import("./features/intel"));
const IntelInsightDetailPage = lazy(() => import("./features/intel/pages/IntelInsightDetailPage"));
const IntelSimulationPage  = lazy(() => import("./features/intel/pages/IntelSimulationPage"));
const IntelRollbackPage    = lazy(() => import("./features/intel/pages/IntelRollbackPage"));
const ProductsListPage       = lazy(() => import("./features/products/ProductsListPage"));
const AgentsPage             = lazy(() => import("./features/agents/AgentsPage"));
const IntegrationsPage       = lazy(() => import("./features/integrations/IntegrationsPage"));
const NotificationsPage      = lazy(() => import("./features/notifications/NotificationsPage"));
const ActionLogPage          = lazy(() => import("./features/action-log/ActionLogPage"));
const ProfitAdsPage          = lazy(() => import("./features/profit-ads/ProfitAdsPage"));
const PrivacyPolicy          = lazy(() => import("./features/onboarding/pages/PrivacyPolicy"));
const TermsOfService         = lazy(() => import("./features/onboarding/pages/TermsOfService"));
const InviteLoginPage        = lazy(() => import("./features/auth/InviteLoginPage"));
const Unauthorized           = lazy(() => import("./pages/Unauthorized"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-brand dark:border-gray-500/20 rounded-full animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full border-t-4 border-brand dark:border-gray-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

function App() {
  useOAuth();

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.ONBOARDING}           element={<Onboarding />} />

            {/* Intel V2 sub-routes */}
            <Route path="/intel"           element={<IntelPage defaultTab="sales"     fullWidthInsights={true} />} />
            <Route path="/intel/sales"     element={<IntelPage defaultTab="sales"     fullWidthInsights={true} />} />
            <Route path="/intel/margin"    element={<IntelPage defaultTab="margin"    fullWidthInsights={true} />} />
            <Route path="/intel/inventory" element={<IntelPage defaultTab="inventory" fullWidthInsights={true} />} />
            <Route path="/intel/ads"       element={<IntelPage defaultTab="ads"       fullWidthInsights={true} />} />
            <Route path="/intel/cash"      element={<IntelPage defaultTab="cash"      fullWidthInsights={true} />} />
            <Route path="/intel/insight/:intelTab/:idx" element={<IntelInsightDetailPage />} />
            <Route path="/intel/simulate"   element={<IntelSimulationPage />} />
            <Route path="/intel/rollback"  element={<IntelRollbackPage />} />

            <Route path={ROUTES.HISTORY}              element={<History />} />
            <Route path={ROUTES.HISTORY_DETAIL}       element={<HistoryDetailPage />} />
            {/* <Route path="/discover"                   element={<DiscoverPage />} /> */}
            <Route path="/research/actions/:id"       element={<ScreenerActionDetailPage />} />
            <Route path={`${ROUTES.SCREENER}/*`}      element={<Screener />} />
            <Route path={ROUTES.CONNECT_MARKETPLACES} element={<MarketplaceConnectionPage />} />
            <Route path="/actions"                    element={<ActionsPage />} />
            <Route path={ROUTES.NEW_ANALYSIS}         element={<NewAnalysisPage />} />
            <Route path={ROUTES.SETTINGS}             element={<SettingsPage />} />
            {/* <Route path="/hubs"                       element={<HubsPage />} /> */}
            <Route path={ROUTES.DETAILED_VIEW}        element={<DetailedViewPage />} />
            <Route path={ROUTES.PRODUCT_VIEW}         element={<ProductViewPage />} />
            <Route path={ROUTES.COMPARISON}           element={<ComparisonPage />} />
            <Route path={ROUTES.NOTIFICATIONS}        element={<NotificationsPage />} />
            <Route path="/products"                   element={<ProductsListPage />} />
            <Route path={ROUTES.CATALOGUE}            element={<ProductsListPage />} />
            <Route path={ROUTES.AGENTS}               element={<AgentsPage />} />
            <Route path={ROUTES.INTEGRATIONS}         element={<IntegrationsPage />} />
            <Route path={ROUTES.ACTION_LOG}           element={<ActionLogPage />} />
            <Route path="/profit-ads"                  element={<ProfitAdsPage />} />

            <Route path={ROUTES.LOGIN}                element={<InviteLoginPage />} />
            <Route path={ROUTES.UNAUTHORIZED}         element={<Unauthorized />} />
            <Route path={ROUTES.PRIVACY_POLICY}       element={<PrivacyPolicy />} />
            <Route path={ROUTES.TERMS_OF_SERVICE}     element={<TermsOfService />} />

            <Route path="*" element={<Navigate to={ROUTES.ONBOARDING} replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
