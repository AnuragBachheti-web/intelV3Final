import { create } from 'zustand';

/**
 * Session-Persistent Intel Filter Store (Master Prompt v3)
 * Persists filter state across domain tab switches (Revenue <-> Margin <-> Cash <-> Inventory <-> Ads)
 */
export const useIntelFilterStore = create((set) => ({
  // Default 3 Inline Filters
  timeRange: '30D', // '7D' | '14D' | '30D' | '60D' | '90D' | 'Custom'
  marketplace: 'all', // 'all' | 'amazon' | 'walmart' | 'shopify'
  categoryCut: 'all', // 'all' | 'electronics' | 'home-garden' | 'apparel' | 'pet' | 'operations'

  // Advanced Filters (Behind More Filters)
  brand: 'all',
  priceBand: 'all', // 'all' | 'under1000' | '1000to5000' | 'above5000'
  priority: 'all', // 'all' | 'HIGH' | 'MED' | 'LOW'
  performanceTier: 'all', // 'all' | 'top20' | 'mid60' | 'bottom20'
  subCategory: 'all',
  isMoreFiltersOpen: false,

  // Setters
  setTimeRange: (timeRange) => set({ timeRange }),
  setMarketplace: (marketplace) => set({ marketplace }),
  setCategoryCut: (categoryCut) => set({ categoryCut }),
  setBrand: (brand) => set({ brand }),
  setPriceBand: (priceBand) => set({ priceBand }),
  setPriority: (priority) => set({ priority }),
  setPerformanceTier: (performanceTier) => set({ performanceTier }),
  setSubCategory: (subCategory) => set({ subCategory }),
  setIsMoreFiltersOpen: (isOpen) => set({ isMoreFiltersOpen: isOpen }),

  resetAdvancedFilters: () => set({
    brand: 'all',
    priceBand: 'all',
    priority: 'all',
    performanceTier: 'all',
    subCategory: 'all',
  }),

  resetAllFilters: () => set({
    timeRange: '30D',
    marketplace: 'all',
    categoryCut: 'all',
    brand: 'all',
    priceBand: 'all',
    priority: 'all',
    performanceTier: 'all',
    subCategory: 'all',
  }),
}));
