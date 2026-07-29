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

  // Reset selection if active tab changes and selected insight is from a different tab
  useEffect(() => {
    if (expandedInsight && expandedInsight.tabKey !== tabKey) {
      if (onSelectInsight) onSelectInsight(null);
    }
  }, [tabKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeInsight = expandedInsight && expandedInsight.tabKey === tabKey
    ? expandedInsight
    : null;

  const handleSelectInsight = (signal) => {
    if (!onSelectInsight) return;
    if (activeInsight && activeInsight.id === signal?.id) {
      // Toggle off if clicking the currently selected insight
      onSelectInsight(null);
    } else {
      onSelectInsight(signal);
      setPanelTab('overview');
    }
  };

  const handleSimulateClick = (signal) => {
    if (onSelectInsight) onSelectInsight(signal);
    setPanelTab('simulate');
  };

  const handleTakeActionClick = (_signal) => {
    // Direct action execution from list button does NOT open or collapse the right inspector view
  };

  const isExpanded = Boolean(activeInsight);

  return (
    <div className={`ws-tab-enter grid transition-all duration-300 gap-4 lg:gap-5 items-stretch min-h-[520px] lg:h-[620px] ${
      isExpanded 
        ? 'grid-cols-1 lg:grid-cols-[1.25fr_1fr]' 
        : 'grid-cols-1'
    }`}>
      {/* Left: AI Signals Stream (100% width by default, ~56% width when action selected) */}
      <div className="h-[520px] lg:h-full overflow-hidden transition-all duration-300">
        <InsightsPanel
          intelTab={activeTab}
          onSelectInsight={handleSelectInsight}
          expandedInsightId={activeInsight?.id}
          onOpenSimulateModal={handleSimulateClick}
          onOpenTakeActionModal={handleTakeActionClick}
          isCollapsed={isExpanded}
        />
      </div>

      {/* Right: Detail Panel Inspector (Opens when an action is clicked, closes back to full width) */}
      {isExpanded && (
        <div className="h-[520px] lg:h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <InsightDetailsPanel
            insight={activeInsight}
            activePanelTab={panelTab}
            onTabChange={setPanelTab}
            onClose={() => onSelectInsight && onSelectInsight(null)}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(TabContent);
