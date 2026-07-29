import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntelFilterStore } from '../../../../store/useIntelFilterStore';

/**
 * Level 2: SKU / Signal Detail Panel Inspector (Master Prompt v4)
 * 
 * Core v4 Architectural Rule:
 * 1. Two tabs inside ONE container: [Overview] and [Simulate]. Zero overlay modals!
 * 2. Unmount on tab switch: active tab rendered, inactive tab 100% removed from DOM.
 * 3. Inline action confirmation bar below footer for "Take Action" / "Apply Plan".
 * 4. Level 3 link "View full history →" at panel bottom.
 */
const InsightDetailsPanel = ({
  insight,
  activePanelTab = 'overview', // 'overview' | 'simulate'
  onTabChange,
  onClose,
}) => {
  const navigate = useNavigate();
  const [internalTab, setInternalTab] = useState('overview');
  const [showInlineConfirm, setShowInlineConfirm] = useState(false);
  const [isApplyingAction, setIsApplyingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Assumptions state for Simulate tab
  const [preset, setPreset] = useState('Expected');
  const [priceDeltaPct, setPriceDeltaPct] = useState(-8);
  const [conversionBoostPct, setConversionBoostPct] = useState(15);
  const [adSpendShiftPct, setAdSpendShiftPct] = useState(10);
  const [shockPct, setShockPct] = useState(20);

  if (!insight) return null;

  // Use controlled activePanelTab if passed, else internalTab
  const activeTab = activePanelTab || internalTab;

  const handleSwitchTab = (tab) => {
    setShowInlineConfirm(false);
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  const confidence = insight.confidenceLabel || 'HIGH';
  const source = insight.sourceRule || insight.sourceOwn || 'MULTI-SOURCE AI';
  const formattedExposure = typeof insight.exposure === 'number'
    ? `₹${(insight.exposure / 100000).toFixed(1)}L`
    : (insight.exposureFormatted || insight.monthlyRevenue || '₹45,000');

  const signalName = insight.headline || insight.skuCode || 'AI Detection Signal';
  const skuCode = insight.skuCode || insight.category || 'SKU-001';
  const tabKey = insight.tabKey || 'sales';
  const signalId = insight.id || 'sig-rev-1';

  const rootCauseText = insight.whyMattersText || insight.rootCause ||
    `${signalName}. This erodes buy box share by up to 24% across your top revenue SKUs. Ignoring this will result in projected monthly revenue loss of ${formattedExposure}.`;

  const miniPnl = insight.pnl || {
    revenue: '₹1.20L',
    cogs: '₹42.0K',
    grossMargin: '₹78.0K (65%)',
    adSpend: '₹14.0K',
    trueProfit: '₹38.2K (31.8%)',
  };

  const recAction = insight.recommendedAction || {
    title: insight.headlineHighlight || 'Reprice to ₹8,499 to restore 94% Buy Box win rate',
    description: 'Adjust selling price dynamically to maintain Buy Box win rate above 90% while preserving minimum margin floor.',
    impact: insight.urgency || insight.priority || 'HIGH',
  };

  const markSignalExecuted = useIntelFilterStore((state) => state.markSignalExecuted);

  const handleConfirmInlineAction = () => {
    setIsApplyingAction(true);
    if (insight?.id) markSignalExecuted(insight.id);
    setTimeout(() => {
      setIsApplyingAction(false);
      setActionSuccess(true);
      setTimeout(() => {
        setActionSuccess(false);
        setShowInlineConfirm(false);
      }, 1200);
    }, 600);
  };

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Metric,Now,Do-Nothing D90,Day 30,Day 60,Day 90\n" +
      `Buy Box Win Rate,71%,42%,88%,94%,96%\n` +
      `Daily Sales Volume,22 units,14 units,35 units,42 units,45 units\n` +
      `True Profit per Unit,₹480,₹420,₹460,₹475,₹485\n` +
      `Monthly Revenue,${formattedExposure},₹85,000,₹1,45,000,₹1,80,000,₹2,10,000\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Simulation_${skuCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-card dark:shadow-none font-sans">

      {/* ── 1. TOP PANEL TABS: [Overview] [Simulate] ── */}
      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-[11px] font-sans font-bold">
          <button
            onClick={() => handleSwitchTab('overview')}
            className={`px-3 py-1 rounded-md transition-all ${activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleSwitchTab('simulate')}
            className={`px-3 py-1 rounded-md transition-all ${activeTab === 'simulate'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
              }`}
          >
            Simulate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase ${recAction.impact === 'HIGH'
              ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800/40'
              : recAction.impact === 'MED'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'
            }`}>
            IMPACT: {recAction.impact}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              title="Close panel"
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE PANEL BODY (STRICT DOM UNMOUNTING OF INACTIVE TAB) ── */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 text-xs space-y-4">

        {activeTab === 'overview' ? (
          /* ── A. OVERVIEW TAB CONTENT (MOUNTED ONLY WHEN ACTIVE) ── */
          <div className="space-y-5">
            {/* 1. Header Title (Product Name / Simple Look) */}
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-gray-500 uppercase">
                {skuCode}
              </span>
              <h3 className="text-[14.5px] font-bold text-gray-900 dark:text-white leading-snug">
                {signalName}
              </h3>
            </div>

            {/* 2. Telemetry Line */}
            <div className="text-[11px] font-sans text-gray-500 dark:text-slate-400 flex items-center justify-between gap-2 p-2.5 px-3 bg-gray-50/80 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
              <div>
                CONFIDENCE: <strong className="text-gray-900 dark:text-white font-bold">{confidence}</strong>
              </div>
              <span className="text-gray-300 dark:text-slate-700">·</span>
              <div>
                SOURCE: <strong className="text-gray-900 dark:text-white font-bold">{source}</strong>
              </div>
              <span className="text-gray-300 dark:text-slate-700">·</span>
              <div>
                AT RISK: <strong className="text-red-600 dark:text-red-400 font-bold">{formattedExposure}</strong>
              </div>
            </div>

            {/* 3. PROBLEM */}
            <div className="space-y-1">
              <h4 className="text-[9.5px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                PROBLEM
              </h4>
              <p className="text-[12.5px] text-gray-700 dark:text-slate-200 leading-relaxed font-sans">
                {insight.headlineHighlight || insight.headline || 'Critical metric deviation detected requiring immediate attention.'}
              </p>
            </div>

            {/* 4. ROOT CAUSE */}
            <div className="space-y-1">
              <h4 className="text-[9.5px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                ROOT CAUSE
              </h4>
              <p className="text-[12.5px] text-gray-700 dark:text-slate-200 leading-relaxed font-sans">
                {rootCauseText}
              </p>
            </div>

            {/* 5. RECOMMENDATION */}
            <div className="space-y-1">
              <h4 className="text-[9.5px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                RECOMMENDATION
              </h4>
              <p className="text-[12.5px] text-gray-700 dark:text-slate-200 leading-relaxed font-sans">
                <strong className="font-bold text-gray-900 dark:text-white">{recAction.title}:</strong> {recAction.description}
              </p>
            </div>

            {/* 6. RISK IF IGNORED */}
            <div className="space-y-1">
              <h4 className="text-[9.5px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                RISK IF IGNORED
              </h4>
              <p className="text-[12.5px] text-gray-700 dark:text-slate-200 leading-relaxed font-sans">
                {insight.riskIfIgnored || `Continued inaction will result in a projected monthly revenue loss of ${formattedExposure} and potential degradation of organic search rankings.`}
              </p>
            </div>

            {/* 7. SUPPORTING INSIGHT */}
            <div className="space-y-1">
              <h4 className="text-[9.5px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                SUPPORTING INSIGHT
              </h4>
              <p className="text-[12.5px] text-gray-700 dark:text-slate-200 leading-relaxed font-sans">
                {insight.supportingInsight || `Historical data indicates that acting within 24 hours yields a 92% recovery rate in sales velocity for ${skuCode}.`}
              </p>
            </div>

          </div>
        ) : (
          /* ── B. SIMULATE TAB CONTENT (MOUNTED ONLY WHEN ACTIVE — ZERO OVERLAYS) ── */
          <div className="space-y-4 font-sans">
            {/* Header Info - Removed as requested to match SS exactly, or keep back button style? User didn't ask for header removal, just structure inside. */}

            {/* 1. Description Box */}
            <div className="bg-gray-100 dark:bg-slate-800/60 p-3.5 rounded-xl text-[13px] text-gray-700 dark:text-slate-300 shadow-sm border border-gray-100 dark:border-slate-700/50">
              <div className="font-bold text-[14.5px] text-gray-900 dark:text-white mb-1.5 leading-snug">
                {recAction.title}
              </div>
              <p className="leading-relaxed text-[12.5px]">
                {recAction.description}
              </p>
            </div>

            {/* 2. Affected SKUs */}
            {/* <div className="bg-gray-100 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                AFFECTED SKUS
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-[11.5px] text-gray-700 dark:text-slate-300">{skuCode}</span>
                <span className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-[11.5px] text-gray-700 dark:text-slate-300">AF-DM-5032</span>
                <span className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-[11.5px] text-gray-700 dark:text-slate-300">AF-CM-7009</span>
                <span className="text-[11px] text-gray-400 mt-1 ml-1">+2 more</span>
              </div>
            </div> */}

            {/* 3. Adjust & Re-run Slider */}
            <div className="bg-gray-100 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                ADJUST AND RE-RUN
              </h4>
              <div className="flex items-center justify-between text-[13px] mb-2.5">
                <span className="text-gray-800 dark:text-slate-200 font-medium">Budget / Price Adjustment</span>
                <span className="font-bold text-gray-900 dark:text-white">{priceDeltaPct > 0 ? `+${priceDeltaPct}` : priceDeltaPct}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="25"
                value={priceDeltaPct}
                onChange={(e) => setPriceDeltaPct(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
              />
            </div>

            {/* 4. Conservative | Expected | Optimistic */}
            <div className="flex items-center justify-between gap-2 mt-2">
              {['Conservative', 'Expected', 'Optimistic'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPreset(p);
                    if (p === 'Conservative') setPriceDeltaPct(5);
                    if (p === 'Expected') setPriceDeltaPct(15);
                    if (p === 'Optimistic') setPriceDeltaPct(25);
                  }}
                  className={`flex-1 py-2 rounded-lg border text-[12px] font-semibold transition-all shadow-sm ${preset === p || (p === 'Expected' && preset !== 'Conservative' && preset !== 'Optimistic')
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 5. Horizon Table */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-800">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <th className="pb-2 font-semibold">HORIZON</th>
                    <th className="pb-2 font-semibold">REVENUE</th>
                    <th className="pb-2 font-semibold">PROFIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 text-gray-700 dark:text-slate-300">30 days</td>
                    <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">+₹{(Math.abs(priceDeltaPct) * 12000).toLocaleString()}</td>
                    <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">+₹{(Math.abs(priceDeltaPct) * 2600).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-700 dark:text-slate-300">60 days</td>
                    <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">+₹{(Math.abs(priceDeltaPct) * 24000).toLocaleString()}</td>
                    <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">+₹{(Math.abs(priceDeltaPct) * 5200).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-700 dark:text-slate-300">90 days</td>
                    <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">+₹{(Math.abs(priceDeltaPct) * 36800).toLocaleString()}</td>
                    <td className="py-2.5 font-sans font-bold text-gray-900 dark:text-white">+₹{(Math.abs(priceDeltaPct) * 8000).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[10px] text-gray-400 mt-2">
                Directional estimate, not a guarantee. Based on high-confidence signal data and current run-rate.
              </div>
            </div>

            {/* 6. Outcome Metric Boxes (Moved from Top) */}
            <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="bg-gray-100 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  REVENUE IMPACT
                </h4>
                <div className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
                  +{formattedExposure}
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  PROFIT IMPACT
                </h4>
                <div className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
                  +₹{Math.round((insight.exposure || 200000) * 0.22).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  CONFIDENCE
                </h4>
                <div className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
                  {confidence}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── 3. FIXED BOTTOM FOOTER TOOLBAR ── */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-end gap-3">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'overview' ? (
              <>
                <button
                  onClick={() => setShowInlineConfirm(true)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-colors shadow-2xs"
                >
                  Take Action
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDownloadCsv}
                  className="px-3.5 py-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 text-gray-700 dark:text-slate-300 rounded-lg text-[11.5px] font-bold"
                >
                  Download CSV
                </button>
                <button
                  onClick={() => handleSwitchTab('overview')}
                  className="px-3.5 py-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 text-gray-700 dark:text-slate-300 rounded-lg text-[11.5px] font-semibold"
                >
                  Back to Overview
                </button>
                <button
                  onClick={() => setShowInlineConfirm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold shadow-2xs"
                >
                  Apply Plan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Inline Action Confirmation Bar (No Popover Overlays!) */}
        {showInlineConfirm && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between gap-3 text-[12px] font-sans animate-fade-in">
            {actionSuccess ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <span>✓</span>
                <span>Plan applied successfully! Channel rules updated.</span>
              </div>
            ) : (
              <>
                <span className="font-semibold text-gray-800 dark:text-slate-200 truncate">
                  Apply intervention plan for {skuCode}?
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowInlineConfirm(false)}
                    disabled={isApplyingAction}
                    className="px-3 py-1 border border-gray-300 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-gray-700 dark:text-slate-300 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInlineAction}
                    disabled={isApplyingAction}
                    className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-2xs flex items-center gap-1.5"
                  >
                    {isApplyingAction ? 'Applying...' : 'Confirm'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default React.memo(InsightDetailsPanel);
