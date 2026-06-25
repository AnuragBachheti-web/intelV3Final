import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { useOAuth } from "./hooks/useOAuth";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Lazy loading features
const Onboarding             = lazy(() => import("./features/onboarding/components/OnboardingLayout"));
const History                = lazy(() => import("./features/history/HistoryPage"));
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
const IntelV2Page            = lazy(() => import("./features/intel-v2"));
const IntelV2InsightDetailPage = lazy(() => import("./features/intel-v2/IntelV2InsightDetailPage"));
const IntelV2SimulationPage  = lazy(() => import("./features/intel-v2/IntelV2SimulationPage"));
const ProductsListPage       = lazy(() => import("./features/products/ProductsListPage"));
const NotificationsPage      = lazy(() => import("./features/notifications/NotificationsPage"));
const ActionLogPage          = lazy(() => import("./features/action-log/ActionLogPage"));
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
            <Route path="/intel-v2"           element={<IntelV2Page defaultTab="sales"     fullWidthInsights={true} />} />
            <Route path="/intel-v2/sales"     element={<IntelV2Page defaultTab="sales"     fullWidthInsights={true} />} />
            <Route path="/intel-v2/margin"    element={<IntelV2Page defaultTab="margin"    fullWidthInsights={true} />} />
            <Route path="/intel-v2/inventory" element={<IntelV2Page defaultTab="inventory" fullWidthInsights={true} />} />
            <Route path="/intel-v2/ads"       element={<IntelV2Page defaultTab="ads"       fullWidthInsights={true} />} />
            <Route path="/intel-v2/cash"      element={<IntelV2Page defaultTab="cash"      fullWidthInsights={true} />} />
            <Route path="/intel-v2/insight/:intelTab/:idx" element={<IntelV2InsightDetailPage />} />
            <Route path="/intel-v2/simulate"  element={<IntelV2SimulationPage />} />

            {/* Intel tab aliases */}
            <Route path={ROUTES.SALES}     element={<IntelV2Page defaultTab="sales"     />} />
            <Route path={ROUTES.MARGIN}    element={<IntelV2Page defaultTab="margin"    />} />
            <Route path={ROUTES.INVENTORY} element={<IntelV2Page defaultTab="inventory" />} />
            <Route path={ROUTES.ADS}       element={<IntelV2Page defaultTab="ads"       />} />
            <Route path={ROUTES.CASH}      element={<IntelV2Page defaultTab="cash"      />} />

            <Route path={ROUTES.HISTORY}              element={<History />} />
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
            <Route path={ROUTES.NOTIFICATIONS}        element={<NotificationsPage />} />
            <Route path="/products"                   element={<ProductsListPage />} />
            <Route path={ROUTES.ACTION_LOG}           element={<ActionLogPage />} />

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
