import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useUIStore } from '../../store/useUIStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import logo_dark from '../../assets/logo_dark.png';
import logo_white from '../../assets/logo_white.png';
import LOGO1 from '../../assets/LOGO1.png';
import LOGO2 from '../../assets/LOGO2.png';
import white_latest from '../../assets/white_latest.png';
import dark_latest from '../../assets/dark_latest.png';
import { historyItems } from '../../features/history/historyData';
import { rolePermissions } from "../../config/RolePermission";

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DUR = '200ms';
const t = (props) => props.map(p => `${p} ${DUR} ${EASE}`).join(', ');

const INTEL_FULL_PATHS = ['/intel', '/intel/sales', '/intel/margin', '/intel/inventory', '/intel/ads', '/intel/cash'];

const RECENT_HISTORY = [
  ...historyItems.today.map(h => ({ id: h.id, label: h.title })),
  ...historyItems.yesterday.map(h => ({ id: h.id, label: h.title })),
].slice(0, 7);

/* ── Perplexity-style panel icons ── */
const IconPanelCollapse = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.5 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <rect x="1" y="2" width="4.5" height="12" rx="2" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const IconPanelExpand = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.5 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/* ── History section with group-by, toggle, and 3-dot context menu ── */
const HistorySectionContent = () => {
  const [groupBy, setGroupBy] = useState('none');
  const [groupByOpen, setGroupByOpen] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [fixedTooltip, setFixedTooltip] = useState(null);
  const [historySearch, setHistorySearch] = useState('');
  const groupByRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (groupByRef.current && !groupByRef.current.contains(e.target)) {
        setGroupByOpen(false);
      }
      setActiveMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div className="w-full mt-2 mb-1 px-1">
        {/* Header: Recents toggle + Group by icon */}
        <div className="group/recents flex items-center justify-between px-1.5 mb-1.5">
          <button
            onClick={() => setHistoryVisible(v => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-500 dark:hover:text-slate-400 transition-colors"
          >
            <span className="font-medium">Recents</span>
            <i className={`fa-solid fa-chevron-${historyVisible ? 'down' : 'right'} text-[8px] opacity-0 group-hover/recents:opacity-100 transition-opacity`} />
          </button>
          <div className="relative" ref={groupByRef}>
            <button
              onClick={() => setGroupByOpen(o => !o)}
              className="group relative w-5 h-5 flex items-center justify-center rounded text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <i className="fa-solid fa-sliders text-[9px]" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Group by
              </span>
            </button>
            {groupByOpen && (
              <div className="absolute right-0 top-full mt-1 w-24 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-[9999] overflow-hidden py-1">
                {[['none', 'None'], ['date', 'Date'], ['project', 'Project']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setGroupBy(val); setGroupByOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 transition-colors"
                  >
                    <span>{label}</span>
                    {groupBy === val && <i className="fa-solid fa-check text-[9px] text-blue-500 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-1.5 px-0.5">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-[9px] pointer-events-none" />
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-3 py-1.5 text-[11px] bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 rounded-lg text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-gray-300 dark:focus:border-slate-600 transition-colors"
          />
        </div>

        {/* History list */}
        {historyVisible && RECENT_HISTORY.filter(h => !historySearch || h.label.toLowerCase().includes(historySearch.toLowerCase())).map((h) => (
          <div
            key={h.id}
            className="relative group/hist flex items-center rounded hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setFixedTooltip({ label: h.label, top: rect.top + rect.height / 2, left: rect.right + 8 });
            }}
            onMouseLeave={() => setFixedTooltip(null)}
          >
            <Link
              to={ROUTES.HISTORY}
              state={{ chatId: h.id }}
              className="flex-1 block px-2 py-1.5 text-xs text-gray-900 dark:text-slate-200 hover:text-gray-700 dark:hover:text-slate-300 truncate min-w-0 font-normal"
            >
              {h.label}
            </Link>
            <div className={`relative flex-shrink-0 transition-opacity pr-1 ${activeMenuId === h.id ? 'opacity-100' : 'opacity-0 group-hover/hist:opacity-100'}`}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMenuId(activeMenuId === h.id ? null : h.id); }}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <i className="fa-solid fa-ellipsis text-[9px]" />
              </button>
              {activeMenuId === h.id && (
                <div onMouseDown={e => e.stopPropagation()} className="absolute right-0 top-full mt-0.5 w-28 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-[9999] overflow-hidden py-1">
                  {[
                    { icon: 'fa-star', label: 'Star' },
                    { icon: 'fa-pen', label: 'Rename' },
                    { icon: 'fa-trash', label: 'Delete', danger: true },
                  ].map(action => (
                    <button
                      key={action.label}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${action.danger ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'}`}
                    >
                      <i className={`fa-solid ${action.icon} text-[9px]`} />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* View All History */}
        <div className="mt-3 px-1">
          <Link
            to={ROUTES.HISTORY}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
          >
            <i className="fa-solid fa-clock-rotate-left text-[9px]" />
            <span>View All History</span>
          </Link>
        </div>
      </div>

      {/* Fixed-position tooltip — escapes overflow clipping */}
      {fixedTooltip && (
        <div
          style={{ position: 'fixed', top: fixedTooltip.top, left: fixedTooltip.left, transform: 'translateY(-50%)', zIndex: 99999 }}
          className="px-2.5 py-2 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 text-[10px] rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 whitespace-normal w-52 leading-relaxed pointer-events-none"
        >
          {fixedTooltip.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white dark:border-r-slate-900" />
        </div>
      )}
    </>
  );
};

/* ── Services item (Products + Actions flyout) ── */
const ServicesItem = ({ isCollapsed, isServicesActive, isProductsActive, isActionLogActive }) => {
  const [showFlyout, setShowFlyout] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const btnRef = useRef(null);

  const handleClick = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    if (showFlyout) {
      setShowFlyout(false);
    } else {
      setFlyoutPos({ top: r.top, left: r.right + 8 });
      setShowFlyout(true);
    }
  };

  useEffect(() => {
    if (!showFlyout) return;
    const handler = (e) => {
      const flyout = document.getElementById('services-flyout');
      if (btnRef.current?.contains(e.target)) return;
      if (flyout?.contains(e.target)) return;
      setShowFlyout(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFlyout]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        className={`flex items-center group relative w-full rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0 py-1.5' : 'justify-start px-2 py-1.5'
          } ${isServicesActive
            ? 'text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 shadow-sm'
            : 'text-gray-900 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800/30'
          }`}
        onMouseEnter={isCollapsed ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTooltip({ top: r.top + r.height / 2, left: r.right + 12 });
        } : undefined}
        onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
      >
        <div className={`flex items-center justify-center flex-shrink-0 rounded-md ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}`}>
          <i className="fa-solid fa-layer-group" style={{ fontSize: isCollapsed ? 16 : 15 }} />
        </div>
        {!isCollapsed && (
          <>
            <span className="ml-2 text-xs font-normal whitespace-nowrap flex-1 text-left">Services</span>
            <i className={`fa-solid fa-chevron-right text-[9px] text-gray-400 dark:text-slate-500 flex-shrink-0 transition-transform duration-200 ${showFlyout ? 'rotate-90' : ''}`} />
          </>
        )}
      </button>

      {isCollapsed && tooltip && !showFlyout && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)', zIndex: 99999 }}
          className="px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-xl border border-slate-800 whitespace-nowrap pointer-events-none">
          Services
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45" />
        </div>,
        document.body
      )}

      {showFlyout && flyoutPos && ReactDOM.createPortal(
        <div
          id="services-flyout"
          style={{ position: 'fixed', top: flyoutPos.top, left: flyoutPos.left, zIndex: 99999 }}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 min-w-[140px]"
        >
          <Link to="/products" onClick={() => setShowFlyout(false)}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${isProductsActive
              ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100'
              : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}>
            <i className="fa-solid fa-box text-[11px] flex-shrink-0" />
            Products
          </Link>
          <Link to="/action-log" onClick={() => setShowFlyout(false)}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${isActionLogActive
              ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100'
              : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}>
            <i className="fa-solid fa-clock-rotate-left text-[11px] flex-shrink-0" />
            Actions
          </Link>
        </div>,
        document.body
      )}
    </>
  );
};

const AppSidebar = ({ darkMode, setDarkMode, inline = false }) => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { connectedStores } = useMarketplaceStore();
  const isConnected = connectedStores.length > 0;
  const location = useLocation();

  const isHistoryActive = location.pathname === ROUTES.HISTORY;
  const isScreenerActive = location.pathname.startsWith(ROUTES.SCREENER);
  const isNewAnalysisActive = location.pathname === ROUTES.NEW_ANALYSIS;
  const isSettingsActive = location.pathname === ROUTES.SETTINGS;
  const isIntelFullActive = INTEL_FULL_PATHS.includes(location.pathname) || location.pathname.startsWith('/intel/insight/') || location.pathname.startsWith('/intel/simulate');

  const navItems = [
    { name: 'New', icon: 'fa-plus', href: ROUTES.NEW_ANALYSIS, active: isNewAnalysisActive },
    { name: 'History', icon: 'fa-clock-rotate-left', href: ROUTES.HISTORY, active: isHistoryActive },
    { name: 'Intel', icon: 'fa-chart-line', href: ROUTES.INTEL_FULL, active: isIntelFullActive },
    { name: 'Research', icon: 'fa-chart-column', href: ROUTES.SCREENER, active: isScreenerActive },
  ];
  const role = localStorage.getItem("userRole") || "admin";
  const allowedRoutes = rolePermissions[role] || [];
  const filteredNavItems = navItems.filter(item => allowedRoutes.includes(item.href));
  const isProductsActive = location.pathname === '/products';
  const isActionLogActive = location.pathname === '/action-log';
  const showProducts = allowedRoutes.includes("/products");
  const showActionLog = allowedRoutes.includes("/action-log");
  const _productsItem = { name: 'Products', icon: 'fa-box', href: '/products', active: isProductsActive };
  const _actionLogItem = { name: 'Action Log', icon: 'fa-clock-rotate-left', href: '/action-log', active: isActionLogActive };
  const settingsItem = { name: 'Settings', icon: 'fa-gear', href: ROUTES.SETTINGS, active: isSettingsActive };

  /* ── Inline variant (used inside DashboardLayout) ── */
  if (inline) {
    return (
      <div
        style={{ width: isSidebarCollapsed ? 56 : 220, transition: t(['width']), willChange: 'width' }}
        className="hidden md:flex flex-shrink-0 flex-col h-full bg-white dark:bg-[#030712] transition-colors duration-300 border-r border-gray-200 dark:border-slate-800 overflow-visible relative z-10"
      >
        {/* Logo row */}
        {isSidebarCollapsed ? (
          <div className="flex items-center justify-center flex-shrink-0" style={{ height: 56 }}>
            <div
              className="relative group flex items-center justify-center cursor-pointer w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/30"
              onClick={toggleSidebar}
              title="Expand sidebar"
            >
              <img
                src={darkMode ? logo_white : logo_dark}
                alt="Realify"
                className="absolute inset-0 w-full h-full object-contain p-1 transition-opacity duration-150 group-hover:opacity-0"
              />
              <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 text-gray-500 dark:text-slate-400">
                <IconPanelExpand size={15} />
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 flex-shrink-0" style={{ height: 56 }}>
            <img src={darkMode ? white_latest : dark_latest} alt="Realify" className="h-10 w-auto max-w-[110px] object-contain" />
            <button
              onClick={toggleSidebar}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
              title="Collapse sidebar"
            >
              <IconPanelCollapse size={15} />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 w-full scrollbar-hide px-2 pt-2 flex flex-col gap-1 overflow-y-auto">
          {filteredNavItems.map(item => (
            <div key={item.name} className="w-full">
              <SidebarItem item={item} isCollapsed={isSidebarCollapsed} />
            </div>
          ))}
          {!isSidebarCollapsed && isConnected && <HistorySectionContent />}
        </nav>

        {/* Bottom: Services + Settings + dark mode */}
        <div className="pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100 dark:border-slate-800 w-full px-2">
          {(showProducts || showActionLog) && (
            <ServicesItem isCollapsed={isSidebarCollapsed} isServicesActive={isProductsActive || isActionLogActive} isProductsActive={isProductsActive} isActionLogActive={isActionLogActive}
            />
          )}
          <SidebarItem item={settingsItem} isCollapsed={isSidebarCollapsed} small={true} />
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} isCollapsed={isSidebarCollapsed} small={true} />
        </div>
      </div>
    );
  }

  /* ── Floating sidebar (main) ── */
  return (
    <div
      id="sidebar"
      style={{ width: isSidebarCollapsed ? 48 : 220, transition: t(['width']), willChange: 'width' }}
      className="hidden md:flex fixed left-4 top-4 h-[calc(100vh-2rem)] bg-[#FEFEFF] dark:bg-[#030712] border border-gray-200 dark:border-slate-800 rounded-2xl flex-col z-[99999] transition-colors duration-300 shadow-sm overflow-visible"
    >
      {/* Header: logo + collapse/expand button */}
      {isSidebarCollapsed ? (
        <div className="flex items-center justify-center pt-4 pb-2">
          <div
            className="relative group flex items-center justify-center cursor-pointer w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/30"
            onClick={toggleSidebar}
            title="Expand sidebar"
          >
            <img
              src={darkMode ? logo_white : logo_dark}
              alt="Realify"
              className="absolute inset-0 w-full h-full object-contain p-1 transition-opacity duration-150 group-hover:opacity-0"
            />
            <span className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 text-gray-500 dark:text-slate-400">
              <IconPanelExpand size={15} />
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 pt-4 pb-2">
          <img
            src={darkMode ? LOGO2 : LOGO1}
            alt="Realify"
            className="h-8 w-auto max-w-[72px] object-contain"
          />
          <button
            onClick={toggleSidebar}
            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
            title="Collapse sidebar"
          >
            <IconPanelCollapse size={15} />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 w-full scrollbar-hide px-2 pt-2 flex flex-col gap-1 overflow-y-auto">
        {filteredNavItems.map(item => (
          <div key={item.name} className="w-full">
            <SidebarItem item={item} isCollapsed={isSidebarCollapsed} />
          </div>
        ))}
        {!isSidebarCollapsed && isConnected && <HistorySectionContent />}
      </nav>

      {/* Bottom: Services + Settings + dark mode */}
      <div className="pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100 dark:border-slate-800 w-full px-2">
        {(showProducts || showActionLog) && (
          <ServicesItem isCollapsed={isSidebarCollapsed} isServicesActive={isProductsActive || isActionLogActive} isProductsActive={isProductsActive} isActionLogActive={isActionLogActive}
          />
        )}
        <SidebarItem item={settingsItem} isCollapsed={isSidebarCollapsed} small={true} />
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} isCollapsed={isSidebarCollapsed} small={true} />
      </div>
    </div>
  );
};

/* ── Sidebar nav item ── */
const SidebarItem = ({ item, isCollapsed, small = false }) => {
  const [tooltip, setTooltip] = useState(null);
  return (
    <>
      <Link
        to={item.href}
        className={`flex items-center group relative w-full rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0 py-1.5' : 'justify-start px-2 py-1.5'
          } ${item.active
            ? 'text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 shadow-sm'
            : 'text-gray-900 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800/30'
          }`}
        onMouseEnter={isCollapsed ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTooltip({ top: r.top + r.height / 2, left: r.right + 12 });
        } : undefined}
        onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
      >
        <div className={`flex items-center justify-center flex-shrink-0 rounded-md ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}`}>
          <i
            className={`${item.regular ? 'fa-regular' : 'fa-solid'} ${item.icon}`}
            style={{ fontSize: isCollapsed ? 16 : 15 }}
          />
        </div>

        {!isCollapsed && (
          <span className={`ml-2 ${small ? 'text-xs' : 'text-sm'} font-normal whitespace-nowrap`}>
            {item.name}
          </span>
        )}
      </Link>

      {/* Fixed-position tooltip for collapsed state — portaled to body to escape z-index stacking context */}
      {isCollapsed && tooltip && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)', zIndex: 99999 }}
          className="px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-xl border border-slate-800 whitespace-nowrap pointer-events-none"
        >
          {item.name}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45" />
        </div>,
        document.body
      )}
    </>
  );
};

/* ── Dark mode toggle ── */
const DarkModeToggle = ({ darkMode, setDarkMode, isCollapsed, small = false }) => {
  const [tooltip, setTooltip] = useState(null);
  return (
    <>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`flex items-center group relative w-full rounded-lg text-gray-900 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800/30 transition-colors ${isCollapsed ? 'justify-center px-0 py-1.5' : 'justify-start px-2 py-1.5'
          }`}
        onMouseEnter={isCollapsed ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTooltip({ top: r.top + r.height / 2, left: r.right + 12 });
        } : undefined}
        onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
      >
        <div className={`flex items-center justify-center flex-shrink-0 rounded-md ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}`}>
          <i
            className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}
            style={{ fontSize: isCollapsed ? 16 : 15 }}
          />
        </div>

        {!isCollapsed && (
          <span className={`ml-2 ${small ? 'text-xs' : 'text-sm'} font-normal whitespace-nowrap`}>
            {darkMode ? 'Light' : 'Dark'}
          </span>
        )}
      </button>

      {/* Fixed-position tooltip for collapsed state — portaled to body to escape z-index stacking context */}
      {isCollapsed && tooltip && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)', zIndex: 99999 }}
          className="px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-xl border border-slate-800 whitespace-nowrap pointer-events-none"
        >
          {darkMode ? 'Light mode' : 'Dark mode'}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45" />
        </div>,
        document.body
      )}
    </>
  );
};

export default AppSidebar;
