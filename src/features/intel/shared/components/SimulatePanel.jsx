import React, { useState } from 'react';
import { SIMULATE_DATA } from '../../simulateData';

const SimulatePanel = ({ isOpen, onClose, insight }) => {
  const [shockPct, setShockPct] = useState(20);
  
  if (!isOpen) return null;

  const sku = insight?.skuCode || 'AFWCLEANER0004';
  const title = insight?.headline || insight?.title || '';
  const isError = sku.includes('COVER');
  const data = isError ? SIMULATE_DATA.error : SIMULATE_DATA.success;
  
  if (!data) return null;

  return (
    <div className="h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-y-auto custom-scrollbar flex flex-col shadow-sm">
      {/* Header Block */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white font-serif leading-snug">
            Simulate • {sku}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors flex-shrink-0"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>
        <p className="text-[12px] text-gray-500 dark:text-slate-400 leading-relaxed">
          {title ? <span className="font-semibold text-gray-700 dark:text-slate-200">{title}</span> : data.title} - {data.description}
        </p>
      </div>

      {/* Content Block */}
      <div className="flex-1 px-5 py-4 bg-[#faf9f7] dark:bg-slate-900/50">
        {/* Error State */}
        {!data.canSimulate && (
          <div className="py-2">
            <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">
              CAN'T SIMULATE
            </p>
            <p className="text-[13px] text-gray-700 dark:text-slate-300">
              {data.errorReason}
            </p>
          </div>
        )}

        {/* Success State */}
        {data.canSimulate && (
          <div className="flex flex-col gap-6">
            
            {/* Contribution Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
              <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 leading-tight">
                MONTHLY CONTRIBUTION AT RISK FROM THIS CONCENTRATION · DO-THIS VS DO-NOTHING
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.contributionAtRisk.now}</div>
                  <div className="text-[10px] font-medium text-gray-500 mt-1 leading-tight">
                    Range — conservative {data.contributionAtRisk.now} · expected {data.contributionAtRisk.now} · optimistic {data.contributionAtRisk.now}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 mb-1">DO-NOTHING (D90)</div>
                    <div className="text-base font-bold text-gray-700 dark:text-slate-300">{data.contributionAtRisk.doNothingD90}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 mb-1">DO-THIS (D90)</div>
                    <div className="text-base font-bold text-gray-700 dark:text-slate-300">{data.contributionAtRisk.doThisD90}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Intervention */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                INTERVENTION
              </p>
              <p className="text-[12px] text-gray-700 dark:text-slate-300 leading-relaxed">
                {data.intervention}
              </p>
            </div>

            {/* Projection Table */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                30/60/90 PROJECTION
              </p>
              <div className="w-full border-t border-gray-200 dark:border-slate-700 overflow-x-auto">
                <table className="w-full text-left min-w-[300px]">
                  <thead>
                    <tr>
                      <th className="py-2 text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">METRIC</th>
                      <th className="py-2 text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">NOW</th>
                      <th className="py-2 text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">D90</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {data.projection.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2 text-[11px] font-medium text-gray-700 dark:text-slate-300">{row.metric}</td>
                        <td className="py-2 text-[11px] font-medium text-gray-400 text-right">{row.now}</td>
                        <td className="py-2 text-[11px] font-bold text-gray-700 dark:text-slate-300 text-right">{row.day90}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* What could go wrong */}
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                WHAT COULD GO WRONG
              </p>
              <div className="flex flex-col gap-2">
                {data.whatCouldGoWrong.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg border-l-2 border-amber-500 p-3 shadow-sm">
                    <h4 className="text-[12px] font-bold text-gray-900 dark:text-white mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assumptions */}
            <div>
              <p className="text-[9px] font-mono text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                ASSUMPTIONS
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <button className="px-2.5 py-1 rounded-full border border-gray-300 dark:border-slate-600 text-[10px] font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">conservative</button>
                <button className="px-2.5 py-1 rounded-full border border-gray-300 dark:border-slate-600 text-[10px] font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">expected</button>
                <button className="px-2.5 py-1 rounded-full border border-gray-300 dark:border-slate-600 text-[10px] font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">optimistic</button>
              </div>
              
              <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase font-bold">SHOCK_PCT</div>
                  <div className="text-[9px] text-gray-400 italic mt-0.5 leading-tight">
                    Hypothetical drop in this SKU's sales.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={shockPct}
                    onChange={(e) => setShockPct(e.target.value)}
                    className="w-14 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="px-2.5 py-1 rounded bg-slate-500 text-white text-[10px] font-bold hover:bg-slate-600">Re-sim</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default SimulatePanel;
