import React, { useState, useEffect } from 'react';
import InsightsPanel from '../InsightsPanel';
import InsightDetailsPanel from '../InsightDetailsPanel';
import { SIGNALS_BY_TAB } from '../../data/insightsDummyData';

/**
 * TabContent — Dual-Pane Desk Navigator & Inspector (Master Prompt v4)
 * Left (~60%): AI Signals Stream
 * Right (~40%): Detail Panel (Contains in-panel [Overview] and [Simulate] tabs, zero overlay modals)
 */
const TabContent = ({
  activeTab = 'sales',
  expandedInsight,
  onSelectInsight,
}) => {
  const [panelTab, setPanelTab] = useState('overview'); // 'overview' | 'simulate'

  const tabKey = activeTab === 'revenue' ? 'sales' : (activeTab || 'sales');
  const rawSignals = SIGNALS_BY_TAB[tabKey] || SIGNALS_BY_TAB.sales;
  const sortedSignals = [...rawSignals].sort((a, b) => (b.score || 0) - (a.score || 0));
  const top1Signal = sortedSignals[0] || null;

  // Auto-select #1 signal if none selected or if active tab changes
  useEffect(() => {
    if (!expandedInsight || expandedInsight.tabKey !== tabKey) {
      if (top1Signal && onSelectInsight) {
        onSelectInsight(top1Signal);
      }
      setPanelTab('overview');
    }
  }, [tabKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeInsight = expandedInsight && expandedInsight.tabKey === tabKey
    ? expandedInsight
    : top1Signal;

  const handleSimulateClick = (signal) => {
    if (onSelectInsight) onSelectInsight(signal);
    setPanelTab('simulate');
  };

  const handleTakeActionClick = (signal) => {
    if (onSelectInsight) onSelectInsight(signal);
  };

  return (
    <div className="ws-tab-enter grid grid-cols-1 lg:grid-cols-[1.18fr_1fr] gap-4 lg:gap-5 items-stretch min-h-[520px] lg:h-[620px]">
      {/* Left: AI Signals Stream (~60% width) */}
      <div className="h-[520px] lg:h-full overflow-hidden">
        <InsightsPanel
          intelTab={activeTab}
          onSelectInsight={(sig) => {
            if (onSelectInsight) onSelectInsight(sig);
            setPanelTab('overview');
          }}
          expandedInsightId={activeInsight?.id}
          onOpenSimulateModal={handleSimulateClick}
          onOpenTakeActionModal={handleTakeActionClick}
        />
      </div>

      {/* Right: Detail Panel Inspector (~40% width, in-panel tabs, ZERO overlay modals) */}
      <div className="h-[520px] lg:h-full overflow-hidden">
        <InsightDetailsPanel
          insight={activeInsight}
          activePanelTab={panelTab}
          onTabChange={setPanelTab}
        />
      </div>
    </div>
  );
};

export default React.memo(TabContent);
