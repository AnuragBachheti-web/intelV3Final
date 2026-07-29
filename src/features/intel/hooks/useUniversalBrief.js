import { useMemo } from 'react';

export const UNIVERSAL_BRIEF_DATA = {
  totalExposure: 482750,
  upsideRevenue: 895000,
  monitoredSkus: 128,
  signalCount: 12,
  narrative: 'Competitor price reduction of 18–22% across 14 top SKUs has eroded Buy Box win rates by 24%. Dynamic repricing to ₹8,499 and restocking 350 FBA units will protect market share and recover ₹4.82L in at-risk revenue.',
};

/**
 * Universal Brief Hook
 * Fetched ONCE on session load. Shared across ALL tabs.
 * Never refetches or re-evaluates when domain tabs change.
 */
export const useUniversalBrief = () => {
  return useMemo(() => {
    return UNIVERSAL_BRIEF_DATA;
  }, []); // Empty dependency array: computed ONCE per session
};
