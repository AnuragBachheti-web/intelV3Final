import { ROUTES } from "../constants/routes";

/**
 * Maps each role to the list of base path prefixes it may access.
 *
 * ProtectedRoute uses startsWith matching, so granting "/intel" also
 * covers "/intel/sales", "/intel/simulate", etc.
 *
 * AppSidebar uses exact matching against nav-item hrefs, which are always
 * the base paths listed here — so the two approaches stay consistent.
 */
export const rolePermissions = {
  admin: [
    ROUTES.NEW_ANALYSIS,          // /new-analysis
    ROUTES.HISTORY,               // /history
    ROUTES.INTEL_FULL,         // /intel  (+ all sub-routes)
    ROUTES.SCREENER,              // /research  (+ /research/actions/*)
    ROUTES.SETTINGS,              // /settings
    "/products",
    "/action-log",
    ROUTES.NOTIFICATIONS,         // /notifications
    ROUTES.CONNECT_MARKETPLACES,  // /connect-marketplaces
    ROUTES.PRODUCT_VIEW,          // /product-view
    "/detailed-view",             // /detailed-view/:intelType
    ROUTES.ACTIONS,               // /actions
  ],

  analyst: [
    ROUTES.NEW_ANALYSIS,
    ROUTES.HISTORY,
    ROUTES.INTEL_FULL,
    ROUTES.SCREENER,
    ROUTES.NOTIFICATIONS,
    "/detailed-view",
  ],

  viewer: [
    ROUTES.HISTORY,
    ROUTES.INTEL_FULL,
    ROUTES.NOTIFICATIONS,
  ],

  "inventory-planner": [
    ROUTES.INTEL_FULL,
    "/products",
    ROUTES.NOTIFICATIONS,
  ],

  "sales-manager": [
    ROUTES.INTEL_FULL,
    ROUTES.SCREENER,
    ROUTES.NOTIFICATIONS,
  ],
};
