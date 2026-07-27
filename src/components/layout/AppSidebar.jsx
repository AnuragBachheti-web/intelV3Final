import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useUIStore } from '../../store/useUIStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { useViewModeStore } from '../../store/useViewModeStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import logo_dark from '../../assets/logo_dark.png';
import logo_white from '../../assets/logo_white.png';
import LOGO1 from '../../assets/LOGO1.png';
import LOGO2 from '../../assets/LOGO2.png';
import white_latest from '../../assets/white_latest.png';
import dark_latest from '../../assets/dark_latest.png';
import { historyItems } from '../../features/history/historyData';
import { rolePermissions } from "../../config/RolePermission";
import useClickOutside from '../../hooks/useClickOutside';
import { usePinnedChatsStore } from '../../store/usePinnedChatsStore';
import { truncateAtWordBoundary } from '../../utils/formatters';
import { SETTINGS_NAV_ITEMS } from '../../features/settings/settingsNavItems';

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
  const groupByRef = useRef(null);
  const pinnedIds = usePinnedChatsStore(s => s.pinnedIds);
  const togglePinned = usePinnedChatsStore(s => s.togglePinned);

  useClickOutside(groupByRef, groupByOpen, () => setGroupByOpen(false));

  useEffect(() => {
    const handler = () => setActiveMenuId(null);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleHistory = RECENT_HISTORY;
  const pinnedItems = visibleHistory.filter(h => pinnedIds.includes(h.id));
  const recentItems = visibleHistory.filter(h => !pinnedIds.includes(h.id));

  const renderHistoryRow = (h) => {
    const pinned = pinnedIds.includes(h.id);
    return (
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
          to={ROUTES.HISTORY_DETAIL}
          state={{ chatId: h.id }}
          className="flex-1 block px-2 py-1.5 text-xs text-gray-900 dark:text-slate-200 hover:text-gray-700 dark:hover:text-slate-300 overflow-hidden whitespace-nowrap min-w-0 font-normal"
        >
          {truncateAtWordBoundary(h.label, 20)}
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePinned(h.id); }}
          title={pinned ? 'Unpin chat' : 'Pin chat'}
          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded transition-colors ${pinned
            ? 'text-brand opacity-100'
            : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 opacity-0 group-hover/hist:opacity-100'
            } ${activeMenuId === h.id ? 'opacity-100' : ''}`}
        >
          <i className="fa-solid fa-thumbtack text-[9px]" />
        </button>
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
    );
  };

  return (
    <>
      <div className="w-full mt-2 mb-1 px-1">
        {/* Pinned list */}
        {pinnedItems.length > 0 && (
          <div className="mb-2">
            <p className="px-1.5 mb-1 text-xs font-medium text-gray-400 dark:text-slate-500">Pinned</p>
            {pinnedItems.map(renderHistoryRow)}
          </div>
        )}

        {/* Header: Recents toggle + Group by icon */}
        <div className="group/recents flex items-center justify-between px-1.5 mb-1.5">
          <button
            onClick={() => setHistoryVisible(v => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-500 dark:hover:text-slate-400 transition-colors"
          >
            <span className="font-medium">Recent</span>
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

        {/* History list */}
        {historyVisible && recentItems.map(renderHistoryRow)}

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
          className="hidden md:block px-2.5 py-2 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 text-[10px] rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 whitespace-normal w-52 leading-relaxed pointer-events-none"
        >
          {fixedTooltip.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white dark:border-r-slate-900" />
        </div>
      )}
    </>
  );
};

/* ── Hubs item (Products + Actions) ──
   Expanded sidebar: slides open as an inline accordion below the button.
   Collapsed sidebar: opens a flyout to the right (no room to expand below). */
const ServicesItem = ({ isCollapsed, isServicesActive, _isProductsActive, isActionLogActive }) => {
  const [open, setOpen] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const btnRef = useRef(null);
  const flyoutRef = useRef(null);

  // Collapse the inline accordion whenever the sidebar collapses, so it doesn't
  // linger as a stray flyout on the next expand.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isCollapsed) setOpen(false);
  }, [isCollapsed]);

  const handleClick = () => {
    if (isCollapsed) {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      if (open) {
        setOpen(false);
      } else {
        setFlyoutPos({ top: r.top, left: r.right + 8 });
        setOpen(true);
      }
    } else {
      setOpen(o => !o);
    }
  };

  useClickOutside(flyoutRef, isCollapsed && open, () => setOpen(false), btnRef);

  const subItems = (
    <>
      <Link to="/action-log" onClick={() => setOpen(false)}
        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${isActionLogActive
          ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100'
          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
          }`}>
        <i className="fa-solid fa-clock-rotate-left text-[11px] flex-shrink-0" />
        Actions
      </Link>
    </>
  );

  const inlineOpen = !isCollapsed && open;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        className={`flex items-center group relative w-full rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0 py-1.5' : 'justify-start px-2 py-1.5'
          } ${isServicesActive
            ? 'text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 shadow-sm'
            : isCollapsed
              ? 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/30'
              : 'text-gray-900 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800/30'
          }`}
        onMouseEnter={isCollapsed ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTooltip({ top: r.top + r.height / 2, left: r.right + 12 });
        } : undefined}
        onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
      >
        <div className={`flex items-center justify-center flex-shrink-0 rounded-md ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}`}>
          <i className="fa-solid fa-layer-group" style={{ fontSize: isCollapsed ? 13 : 15 }} />
        </div>
        {!isCollapsed && (
          <>
            <span className="ml-2 text-xs font-normal whitespace-nowrap flex-1 text-left">Hubs</span>
            <i className={`fa-solid fa-chevron-down text-[9px] text-gray-400 dark:text-slate-500 flex-shrink-0 transition-transform duration-200 ${inlineOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Inline slide-down accordion (expanded sidebar) */}
      {!isCollapsed && (
        <div
          className="overflow-hidden transition-all duration-200 ease-in-out"
          style={{ maxHeight: inlineOpen ? 120 : 0, opacity: inlineOpen ? 1 : 0 }}
        >
          <div className="pl-3">
            {subItems}
          </div>
        </div>
      )}

      {isCollapsed && tooltip && !open && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)', zIndex: 99999 }}
          className="px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-xl border border-slate-800 whitespace-nowrap pointer-events-none">
          Hubs
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45" />
        </div>,
        document.body
      )}

      {/* Flyout (collapsed sidebar) */}
      {isCollapsed && open && flyoutPos && ReactDOM.createPortal(
        <div
          id="services-flyout"
          ref={flyoutRef}
          style={{ position: 'fixed', top: flyoutPos.top, left: flyoutPos.left, zIndex: 99999 }}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden py-1  min-w-[120px] md:min-w-[140px]"
        >
          {subItems}
        </div>,
        document.body
      )}
    </>
  );
};

const AppSidebar = ({ darkMode, _setDarkMode, inline = false, mobileOpen = false, onMobileClose }) => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { connectedStores } = useMarketplaceStore();
  const { dashboardView, lastIntelTab, setDashboardView } = useViewModeStore();
  const isConnected = connectedStores.length > 0;
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-close the mobile drawer on navigation, and lock body scroll while it's open.
  useEffect(() => {
    if (mobileOpen) onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Mobile drawer's "Settings" row opens a sub-list (ss4) instead of navigating
  // directly — switching settings sections is only reachable from here, never
  // from within a settings tab itself. Reset back to the main menu on close.
  const [settingsSubOpen, setSettingsSubOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) setSettingsSubOpen(false);
  }, [mobileOpen]);
  const activeSettingsTab = new URLSearchParams(location.search).get('tab') || 'account';

  const _isHistoryActive = location.pathname === ROUTES.HISTORY;
  const isScreenerActive = location.pathname.startsWith(ROUTES.SCREENER);
  const isNewAnalysisActive = location.pathname === ROUTES.NEW_ANALYSIS;
  const isSettingsActive = location.pathname === ROUTES.SETTINGS;
  const isIntelFullActive = INTEL_FULL_PATHS.includes(location.pathname) || location.pathname.startsWith('/intel/insight/') || location.pathname.startsWith('/intel/simulate') || location.pathname.startsWith('/detailed-view/');

  // Land back on whichever view (AI or Dashboard) + tab the user last had open,
  // instead of always defaulting to AI View / sales.
  const intelHref = dashboardView ? `/detailed-view/${lastIntelTab}` : `/intel/${lastIntelTab}`;
  // Role permissions are checked against the base path, not the tab-specific one.
  const intelPermissionKey = dashboardView ? '/detailed-view' : ROUTES.INTEL_FULL;

  const isCatalogueActive = location.pathname === '/catalogue' || location.pathname === '/products';
  const isAgentsActive = location.pathname === '/agents';
  const isIntegrationsActive = location.pathname === '/integrations';
  const isProfitAdsActive = location.pathname === '/profit-ads';

  const navItems = [
    { name: 'New', icon: 'fa-plus', href: ROUTES.NEW_ANALYSIS, active: isNewAnalysisActive },
    { name: 'Workspace', icon: 'fa-chart-line', href: intelHref, permissionKey: intelPermissionKey, active: isIntelFullActive },
    { name: 'Profit & Ads', icon: 'fa-chart-pie', href: '/profit-ads', permissionKey: '/profit-ads', active: isProfitAdsActive },
    { name: 'Agents', icon: 'fa-robot', href: ROUTES.AGENTS || '/agents', permissionKey: ROUTES.AGENTS || '/agents', active: isAgentsActive },
    { name: 'Research', icon: 'fa-chart-column', href: ROUTES.SCREENER, active: isScreenerActive },
    { name: 'Integrations', icon: 'fa-plug', href: ROUTES.INTEGRATIONS || '/integrations', permissionKey: ROUTES.INTEGRATIONS || '/integrations', active: isIntegrationsActive },
  ];
  const role = localStorage.getItem("userRole") || "admin";
  const allowedRoutes = rolePermissions[role] || [];
  const filteredNavItems = navItems.filter(item => allowedRoutes.includes(item.permissionKey || item.href));
  const _isProductsActive = location.pathname === '/products' || location.pathname === '/catalogue';
  const isActionLogActive = location.pathname === '/action-log';
  const catalogueItem = { name: 'Catalog', icon: 'fa-box', href: '/catalogue', active: isCatalogueActive };
  const _actionsItem = { name: 'Actions', icon: 'fa-clock-rotate-left', href: '/action-log', active: isActionLogActive };
  const settingsItem = { name: 'Settings', icon: 'fa-gear', href: ROUTES.SETTINGS, active: isSettingsActive };

  /* ── Mobile drawer (ss2 layout) — opened via the header hamburger button ── */
  const mobileDrawer = mobileOpen && (
    <>
      <div className="md:hidden fixed inset-0 bg-black/40 z-[9998]" onClick={onMobileClose} />
      <div className="md:hidden fixed inset-y-0 left-0 w-[66vw] bg-white dark:bg-[#030712] z-[9999] flex flex-col shadow-2xl">
        {settingsSubOpen ? (
          <>
            {/* Settings sub-list header: back to main menu, or close the drawer entirely */}
            <div className="flex items-center justify-between px-3 pt-4 pb-2 flex-shrink-0 border-b border-gray-100 dark:border-slate-800" style={{ height: 56 }}>
              <button
                onClick={() => setSettingsSubOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                title="Back"
              >
                <i className="fa-solid fa-arrow-left text-sm" />
              </button>
              <span className="text-sm font-bold text-gray-900 dark:text-slate-100">Settings</span>
              <button
                onClick={onMobileClose}
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                title="Close menu"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Scrollable settings section list — switching sections is only possible from here */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-2 pt-2 flex flex-col gap-1">
              {SETTINGS_NAV_ITEMS.slice(0, 7).map(item => (
                <Link
                  key={item.id}
                  to={`${ROUTES.SETTINGS}?tab=${item.id}`}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                    activeSettingsTab === item.id
                      ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-center text-[13px] ${activeSettingsTab === item.id ? '' : 'text-gray-400 dark:text-slate-500'}`} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              ))}
              <div className="border-t border-gray-100 dark:border-slate-800 my-1" />
              {SETTINGS_NAV_ITEMS.slice(7).map(item => (
                <Link
                  key={item.id}
                  to={`${ROUTES.SETTINGS}?tab=${item.id}`}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                    activeSettingsTab === item.id
                      ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-center text-[13px] ${activeSettingsTab === item.id ? '' : 'text-gray-400 dark:text-slate-500'}`} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex-shrink-0 pb-4 pt-2 border-t border-gray-100 dark:border-slate-800 w-full px-2">
              <div className="flex items-center gap-2 px-2 py-2">
                <i className="fa-solid fa-circle-user text-2xl text-gray-900 dark:text-slate-200" />
                <span className="text-xs font-medium text-gray-900 dark:text-slate-200 truncate">My Account</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top: scrollable logo + nav + history */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col">
              <div className="flex items-center justify-between px-3 pt-4 pb-2 flex-shrink-0" style={{ height: 56 }}>
                <img src={darkMode ? white_latest : dark_latest} alt="Realify" className="h-9 w-auto max-w-[110px] object-contain" />
                <button
                  onClick={onMobileClose}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                  title="Close menu"
                >
                  <i className="fa-solid fa-xmark text-sm" />
                </button>
              </div>
              <nav className="w-full px-2 pt-2 flex flex-col gap-1 flex-shrink-0">
                {filteredNavItems.map(item => (
                  <div key={item.name} className="w-full">
                    <SidebarItem item={item} isCollapsed={false} small={true} />
                  </div>
                ))}
              </nav>
              {isConnected && <HistorySectionContent />}
            </div>

            {/* Bottom: Catalog + Actions + Settings */}
            <div className="flex-shrink-0 pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100 dark:border-slate-800 w-full px-2">
              <SidebarItem item={catalogueItem} isCollapsed={false} small={true} />
              <button
                onClick={() => setSettingsSubOpen(true)}
                className={`flex items-center group relative w-full rounded-lg transition-colors justify-start px-2 py-1.5 ${
                  isSettingsActive
                    ? 'text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 shadow-sm'
                    : 'text-gray-900 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-center flex-shrink-0 rounded-md w-7 h-7">
                  <i className="fa-solid fa-gear" style={{ fontSize: 15 }} />
                </div>
                <span className="ml-2 text-xs font-normal whitespace-nowrap">Settings</span>
              </button>

              {/* AI VIew Toggle */}
              <button
                onClick={() => {
                  const nextView = !dashboardView;

                  setDashboardView(nextView);

                  navigate(
                    nextView
                      ? `/detailed-view/${lastIntelTab}`
                      : `/intel/${lastIntelTab}`
                  );
                }}
                className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid ${dashboardView ? 'fa-table-cells-large' : 'fa-wand-magic-sparkles'} text-base text-gray-900 dark:text-slate-200`} />

                  <span className="text-xs font-medium text-gray-900 dark:text-slate-200">
                    {dashboardView ? "Dashboard View" : "AI View"}
                  </span>
                </div>

                <div
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${dashboardView
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-slate-600"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${dashboardView
                        ? "translate-x-4"
                        : "translate-x-0.5"
                      }`}
                  />
                </div>
              </button>


              <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-lg">
                <i className="fa-solid fa-circle-user text-2xl text-gray-900 dark:text-slate-200" />
                <span className="text-xs font-medium text-gray-900 dark:text-slate-200 truncate">My Account</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  /* ── Inline variant (used inside DashboardLayout) ── */
  if (inline) {
    return (
      <>
        <div
          style={{ width: isSidebarCollapsed ? 56 : 200, transition: t(['width']), willChange: 'width' }}
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
                <SidebarItem item={item} isCollapsed={isSidebarCollapsed} small={true} />
              </div>
            ))}
            {!isSidebarCollapsed && isConnected && <HistorySectionContent />}
          </nav>

          {/* Bottom: Catalog + Actions + Settings */}
          <div className="pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100 dark:border-slate-800 w-full px-2">
            <SidebarItem item={catalogueItem} isCollapsed={isSidebarCollapsed} small={true} />
            <SidebarItem item={settingsItem} isCollapsed={isSidebarCollapsed} small={true} />
          </div>
        </div>
        {mobileDrawer}
      </>
    );
  }

  /* ── Floating sidebar (main) ── */
  return (
    <div
      id="sidebar"
      style={{ width: isSidebarCollapsed ? 48 : 200, transition: t(['width']), willChange: 'width' }}
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
            <SidebarItem item={item} isCollapsed={isSidebarCollapsed} small={true} />
          </div>
        ))}
        {!isSidebarCollapsed && isConnected && <HistorySectionContent />}
      </nav>

      {/* Bottom: Catalog + Actions + Settings */}
      <div className="pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100 dark:border-slate-800 w-full px-2">
        <SidebarItem item={catalogueItem} isCollapsed={isSidebarCollapsed} small={true} />
        <SidebarItem item={settingsItem} isCollapsed={isSidebarCollapsed} small={true} />
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
            : (isCollapsed && small)
              ? 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/30'
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
            style={{ fontSize: isCollapsed ? (small ? 13 : 16) : 15 }}
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
        className={`flex items-center group relative w-full rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/30 transition-colors ${isCollapsed ? 'justify-center px-0 py-1.5 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400' : 'justify-start px-2 py-1.5 text-gray-900 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100'
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
            style={{ fontSize: isCollapsed ? 13 : 15 }}
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
