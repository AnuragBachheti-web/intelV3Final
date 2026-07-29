import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import GlobalAppHeader from './GlobalAppHeader';
import AIPromptBox from '../common/AIPromptBox';
import NotificationDrawer from './NotificationDrawer';
import LoadingBar from '../common/LoadingBar';
import AIResultPanel from '../common/AIResultPanel';
import apiClient from '../../api/client';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import NoStoresConnected from '../common/NoStoresConnected';

const DashboardLayout = ({
  title,
  subtitle,
  showTabs = true,
  tabs,
  filters,
  children,
  sidebarActive = true,
  showAIPrompt = true,
  hideHeader = false,
  customRightElement,
  contentClassName,
  noPadding = false,
  activeTabPath,
  tabsOnly = false,
  showSearch: _showSearch = false,
  aiPromptFullWidth = false,
  searchCollapsed = false,
  headerCenterElement = null,
  hideMobileSearchIcon = false,
}) => {
  const _navigate = useNavigate();
  const location = useLocation();
  const { connectedStores } = useMarketplaceStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Show "no stores" overlay on all pages except settings/onboarding/auth
  const EXEMPT_PREFIXES = ['/settings', '/login', '/unauthorized', '/privacy', '/terms'];
  const showNoStores =
    connectedStores.length === 0 &&
    location.pathname !== '/' &&
    !EXEMPT_PREFIXES.some((p) => location.pathname.startsWith(p));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [shopProfile, setShopProfile] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0c101a';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!localStorage.getItem('active_shop') && localStorage.getItem('shopify_shop')) {
      localStorage.setItem('active_shop', localStorage.getItem('shopify_shop'));
      localStorage.setItem('active_platform', 'shopify');
    }

    const fetchShopProfile = async () => {
      if (fetchedRef.current) return;
      const shop = localStorage.getItem('active_shop');
      const platform = localStorage.getItem('active_platform') || 'shopify';
      if (!shop) return;
      fetchedRef.current = true;
      try {
        const res = await apiClient.get(`/${platform}/shop-profile`);
        setShopProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch shop profile:', err);
      }
    };
    fetchShopProfile();
  }, []);

  return (
    <div className={`h-screen overflow-hidden flex bg-white dark:bg-[#030712] ${darkMode ? 'dark' : ''}`}>
      <LoadingBar />
      <AIResultPanel />

      {/* Left sidebar */}
      {sidebarActive && (
        <AppSidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          inline
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
      )}

      {/* Right column: toolbar + content */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">

        {/* Top toolbar: title (left) + search bar + icons (right) */}
        {!hideHeader && (
          <div className="flex-shrink-0 bg-white dark:bg-[#030712]">
            <GlobalAppHeader
              title={title}
              subtitle={subtitle}
              shopProfile={shopProfile}
              onNotificationClick={() => setIsNotificationOpen(true)}
              customRightElement={customRightElement}
              searchCollapsed={searchCollapsed}
              centerElement={headerCenterElement}
              renderOnly="toolbar"
              darkMode={darkMode}
              onMenuClick={sidebarActive ? () => setMobileNavOpen(true) : undefined}
              hideMobileSearchIcon={hideMobileSearchIcon}
            />
          </div>
        )}

        {/* Content area with light background */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900 px-1.5 sm:px-2 pt-1.5 pb-2 gap-2">

          {/* White card: tabs + content */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#f0f1f2] dark:bg-[#030712] rounded-2xl border border-gray-200/70 dark:border-slate-800 shadow-sm overflow-hidden">

            {/* Secondary: tabs + filters (hidden when no stores connected) */}
            {!hideHeader && !showNoStores && (showTabs || filters) && (
              <div className="flex-shrink-0">
                <GlobalAppHeader
                  title={title}
                  subtitle={subtitle}
                  showTabs={showTabs}
                  tabs={tabs}
                  filters={filters}
                  scrollRef={scrollRef}
                  activeTabPath={activeTabPath}
                  tabsOnly={tabsOnly}
                  renderOnly="secondary"
                />
              </div>
            )}

            {/* Main page content */}
            <main
              ref={scrollRef}
              style={!showNoStores && showAIPrompt ? { paddingBottom: '9rem' } : undefined}
              className={`dashboard-main-content flex-1 overflow-y-auto overscroll-y-contain min-h-0 custom-scrollbar ${noPadding && !showNoStores ? '' : 'p-2 sm:p-2.5'
                } ${contentClassName || ''}`}
            >
              {showNoStores ? <NoStoresConnected /> : children}
            </main>
          </div>
        </div>
      </div>

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        darkMode={darkMode}
      />

      {showAIPrompt && !showNoStores && (
        <AIPromptBox
          placeholder={`Ask Realify`}
          sidebarActive={sidebarActive}
          fullWidth={aiPromptFullWidth}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
