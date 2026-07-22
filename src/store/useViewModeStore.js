import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tracks whether the user was last looking at the Intel section in AI View
// (/intel/:tab) or Dashboard View (/detailed-view/:tab), plus which tab —
// so navigating away (History, New Analysis, ...) and back returns them to
// the same view instead of always defaulting to AI View.
export const useViewModeStore = create(
  persist(
    (set) => ({
      dashboardView: false, // false = AI View, true = Dashboard View
      lastIntelTab: 'sales',
      setDashboardView: (value) => set({ dashboardView: value }),
      setLastIntelTab: (tab) => set({ lastIntelTab: tab }),
    }),
    {
      name: 'realify-view-mode',
    }
  )
);
