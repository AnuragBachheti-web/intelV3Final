import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleConfirmInlineAction = () => {
    setIsApplyingAction(true);
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
        <div className="flex items-center gap-1.5 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono font-bold">
          <button
            onClick={() => handleSwitchTab('overview')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleSwitchTab('simulate')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'simulate'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
            }`}
          >
            Simulate
          </button>
        </div>

        <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase">
          {skuCode}
        </span>
      </div>

      {/* ── SCROLLABLE PANEL BODY (STRICT DOM UNMOUNTING OF INACTIVE TAB) ── */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 text-xs space-y-4">
        
        {activeTab === 'overview' ? (
          /* ── A. OVERVIEW TAB CONTENT (MOUNTED ONLY WHEN ACTIVE) ── */
          <div className="space-y-4">
            {/* Header Title */}
            <div className="space-y-1">
              <span className="inline-block text-[9.5px] font-mono font-bold tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200/50 dark:border-blue-800/40 uppercase">
                {insight.tagCategory || 'AI SIGNAL'} · {skuCode}
              </span>
              <h3 className="text-[14.5px] font-bold text-gray-900 dark:text-white leading-snug">
                {signalName}
              </h3>
            </div>

            {/* Telemetry Line */}
            <div className="text-[11px] font-mono text-gray-500 dark:text-slate-400 flex items-center justify-between gap-2 p-2.5 px-3 bg-gray-50/80 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
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

            {/* Root Cause Analysis */}
            <div className="space-y-1">
              <h4 className="text-[9.5px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                ROOT CAUSE ANALYSIS
              </h4>
              <p className="text-[12.5px] text-gray-700 dark:text-slate-200 leading-relaxed font-sans">
                {rootCauseText}
              </p>
            </div>

            {/* Mini P&L Row + Velocity Sparkline + Stock Status */}
            <div className="p-3 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[9.5px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  MINI P&amp;L &amp; VELOCITY TELEMETRY
                </h4>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ● Stock: 14 Days DOC
                </span>
              </div>

              {/* Mini P&L Columns */}
              <div className="grid grid-cols-5 divide-x divide-gray-200 dark:divide-slate-700/80 text-center font-mono py-1">
                <div className="px-1">
                  <span className="text-[8.5px] text-gray-400 block uppercase">REVENUE</span>
                  <strong className="text-[11.5px] font-bold text-gray-900 dark:text-white block mt-0.5">{miniPnl.revenue}</strong>
                </div>
                <div className="px-1">
                  <span className="text-[8.5px] text-gray-400 block uppercase">COGS</span>
                  <strong className="text-[11.5px] font-bold text-red-600 dark:text-red-400 block mt-0.5">{miniPnl.cogs}</strong>
                </div>
                <div className="px-1">
                  <span className="text-[8.5px] text-gray-400 block uppercase">MARGIN</span>
                  <strong className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{miniPnl.grossMargin}</strong>
                </div>
                <div className="px-1">
                  <span className="text-[8.5px] text-gray-400 block uppercase">AD SPEND</span>
                  <strong className="text-[11.5px] font-bold text-amber-600 dark:text-amber-400 block mt-0.5">{miniPnl.adSpend}</strong>
                </div>
                <div className="px-1">
                  <span className="text-[8.5px] text-gray-400 block uppercase">TRUE PROFIT</span>
                  <strong className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{miniPnl.trueProfit}</strong>
                </div>
              </div>

              {/* Velocity Sparkline Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
                <span>7-Day Velocity Trend:</span>
                <div className="flex items-center gap-1">
                  {[18, 20, 22, 19, 24, 28, 22.5].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className="w-2 bg-blue-500 dark:bg-blue-400 rounded-xs"
                        style={{ height: `${val * 0.8}px` }}
                      />
                    </div>
                  ))}
                  <span className="ml-1 font-bold text-gray-900 dark:text-white">22.5/day</span>
                </div>
              </div>
            </div>

            {/* Recommended Intervention */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[9.5px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  RECOMMENDED INTERVENTION
                </h4>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  recAction.impact === 'HIGH'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800/40'
                    : recAction.impact === 'MED'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'
                }`}>
                  IMPACT: {recAction.impact}
                </span>
              </div>

              <div className="space-y-1 p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <h5 className="text-[13px] font-bold text-gray-900 dark:text-white font-sans leading-snug">
                  {recAction.title}
                </h5>
                <p className="text-[12px] text-gray-600 dark:text-slate-300 leading-relaxed font-sans">
                  {recAction.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── B. SIMULATE TAB CONTENT (MOUNTED ONLY WHEN ACTIVE — ZERO OVERLAYS) ── */
          <div className="space-y-5">
            {/* Header Info */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold uppercase">
                  PROJECTION · DIRECTIONAL
                </span>
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mt-1">
                  Simulate • {skuCode}
                </h3>
              </div>
              <span className="text-[10.5px] font-mono text-gray-500">
                CONFIDENCE: <strong className="text-gray-900 dark:text-white font-bold">{confidence}</strong>
              </span>
            </div>

            {/* Presets Bar */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">Assumptions Preset:</span>
              <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                {['Conservative', 'Expected', 'Aggressive'].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPreset(p);
                      if (p === 'Conservative') { setPriceDeltaPct(-4); setConversionBoostPct(8); }
                      if (p === 'Expected') { setPriceDeltaPct(-8); setConversionBoostPct(15); }
                      if (p === 'Aggressive') { setPriceDeltaPct(-12); setConversionBoostPct(24); }
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      preset === p
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Sliders / Controllers */}
            <div className="space-y-4 bg-gray-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11.5px] font-medium text-gray-700 dark:text-slate-300">
                  <span>Price Change:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{priceDeltaPct}% (₹8,499)</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="5"
                  value={priceDeltaPct}
                  onChange={(e) => setPriceDeltaPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11.5px] font-medium text-gray-700 dark:text-slate-300">
                  <span>Conversion Boost:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{conversionBoostPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={conversionBoostPct}
                  onChange={(e) => setConversionBoostPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* 30/60/90 Day Projected Impact Grid */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                30 / 60 / 90 DAY PROJECTED IMPACT
              </h4>
              <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-gray-50 dark:bg-slate-800 text-gray-400 border-b border-gray-100 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5 font-semibold">METRIC</th>
                      <th className="p-2.5 font-semibold">NOW</th>
                      <th className="p-2.5 font-semibold text-red-500">DO-NOTHING D90</th>
                      <th className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">DO-THIS D90</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-700 dark:text-slate-300">Buy Box Share</td>
                      <td className="p-2.5 font-bold">71%</td>
                      <td className="p-2.5 font-bold text-red-500">42%</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">96%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-700 dark:text-slate-300">Daily Sales</td>
                      <td className="p-2.5 font-bold">22.5 units</td>
                      <td className="p-2.5 font-bold text-red-500">14.0 units</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">45.0 units</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-700 dark:text-slate-300">True Profit / Unit</td>
                      <td className="p-2.5 font-bold">₹480</td>
                      <td className="p-2.5 font-bold text-red-500">₹420</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">₹485</td>
                    </tr>
                    <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                      <td className="p-2.5 font-bold text-gray-900 dark:text-white">Monthly Revenue</td>
                      <td className="p-2.5 font-bold">{formattedExposure}</td>
                      <td className="p-2.5 font-bold text-red-500">₹85,000</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">₹2.40L</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Downside Risks Callout */}
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1">
                <i className="fa-solid fa-triangle-exclamation text-[10px]" />
                DOWNSIDE RISK &amp; SENSITIVITY
              </span>
              <p className="text-[11.5px] text-amber-900 dark:text-amber-200 leading-snug">
                If competitor lowers price further by 5%, margin floor will compress by 2.4%. Auto-revert rule will activate automatically.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ── 3. FIXED BOTTOM FOOTER TOOLBAR ── */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Level 3 Link */}
          <button
            onClick={() => navigate(`/intel/details/${tabKey}/${signalId}`)}
            className="text-[11.5px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <span>View full history</span>
            <i className="fa-solid fa-arrow-right text-[10px]" />
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'overview' ? (
              <>
                <button
                  onClick={() => handleSwitchTab('simulate')}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-[12px] font-semibold transition-colors shadow-2xs"
                >
                  Simulate
                </button>
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
