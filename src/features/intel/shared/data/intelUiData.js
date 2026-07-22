// ─── Static presentation mappings + tab/route data for the Intel (AI View) page ───
import {
  INSIGHTS_DATA,
  MARGIN_INSIGHTS_DATA,
  INVENTORY_INSIGHTS_DATA,
  ADS_INSIGHTS_DATA,
  CASH_INSIGHTS_DATA,
  STEPS_BY_INSIGHT_TAB,
  MARGIN_STEPS_BY_INSIGHT_TAB,
  INVENTORY_STEPS_BY_INSIGHT_TAB,
  ADS_STEPS_BY_INSIGHT_TAB,
  CASH_STEPS_BY_INSIGHT_TAB,
} from './intelData';

export const INSIGHTS_BY_INTEL_TAB = {
  sales: INSIGHTS_DATA,
  margin: MARGIN_INSIGHTS_DATA,
  inventory: INVENTORY_INSIGHTS_DATA,
  ads: ADS_INSIGHTS_DATA,
  cash: CASH_INSIGHTS_DATA,
};

export const STEPS_BY_INTEL_TAB = {
  sales: STEPS_BY_INSIGHT_TAB,
  margin: MARGIN_STEPS_BY_INSIGHT_TAB,
  inventory: INVENTORY_STEPS_BY_INSIGHT_TAB,
  ads: ADS_STEPS_BY_INSIGHT_TAB,
  cash: CASH_STEPS_BY_INSIGHT_TAB,
};

export const INSIGHT_TYPE_META = {
  CRITICAL: { icon: 'fa-solid fa-triangle-exclamation', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  OPPORTUNITY: { icon: 'fa-solid fa-arrow-trend-up', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  INSIGHT: { icon: 'fa-solid fa-lightbulb', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  MARKET: { icon: 'fa-solid fa-chart-line', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  REVIEW: { icon: 'fa-solid fa-eye', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  ALERT: { icon: 'fa-solid fa-bell', bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
};

export const INSIGHT_BADGE_COLORS = {
  CRITICAL: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  OPPORTUNITY: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  INSIGHT: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  MARKET: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  REVIEW: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
  ALERT: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
};

export const CATEGORY_KEY_MAP = {
  'electronics': (h) => h.toLowerCase().includes('electronics'),
  'home-garden': (h) => h.toLowerCase().includes('home & garden') || h.toLowerCase().includes('home and garden'),
  'apparel': (h) => h.toLowerCase().includes('apparel'),
  'pet-suppliers': (h) => h.toLowerCase().includes('pet'),
};

export const TAB_TO_ROUTE = {
  sales: '/intel/sales',
  margin: '/intel/margin',
  inventory: '/intel/inventory',
  ads: '/intel/ads',
  cash: '/intel/cash',
};

export const V2_FULL_TAB_TO_ROUTE = {
  sales: '/intel/sales',
  margin: '/intel/margin',
  inventory: '/intel/inventory',
  ads: '/intel/ads',
  cash: '/intel/cash',
};

export const ROUTE_TO_TAB = {
  '/sales': 'sales',
  '/margin': 'margin',
  '/inventory': 'inventory',
  '/ads': 'ads',
  '/cash': 'cash',
  '/intel': 'sales',
  '/intel/sales': 'sales',
  '/intel/margin': 'margin',
  '/intel/inventory': 'inventory',
  '/intel/ads': 'ads',
  '/intel/cash': 'cash',
};
