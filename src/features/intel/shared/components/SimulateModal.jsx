import React, { useState } from 'react';
import StandardModal from '../../../../components/common/StandardModal';
import { SIMULATE_DATA } from '../../simulateData';

const SimulateModal = ({ isOpen, onClose, sku }) => {
  const [shockPct, setShockPct] = useState(20);
  
  // Decide which dummy data to use. 
  // For demonstration, if sku contains 'COVER', we simulate a failure.
  const isError = sku && sku.includes('COVER');
  const data = isError ? SIMULATE_DATA.error : SIMULATE_DATA.success;
  
  if (!data) return null;

  return (
    <StandardModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-[850px]"
    >
      <div className="bg-white">
        
        {/* Header Block */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white font-serif leading-snug">
              Simulate • {data.sku} — {data.title}
            </h2>
            <div className="flex-shrink-0 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-mono tracking-wider whitespace-nowrap">
                L1 · projection · directional
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed max-w-[90%]">
            {data.description}
          </p>
        </div>

        {/* Content Block */}
        <div className="px-6 py-5 bg-[#faf9f7] dark:bg-slate-900">
          
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
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  MONTHLY CONTRIBUTION AT RISK FROM THIS CONCENTRATION · DO-THIS VS DO-NOTHING
                </p>
                <div className="flex items-end gap-16">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.contributionAtRisk.now}</div>
                    <div className="text-[11px] font-medium text-gray-500 mt-1">
                      Range — conservative {data.contributionAtRisk.now} · expected {data.contributionAtRisk.now} · optimistic {data.contributionAtRisk.now}
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div>
                      <div className="text-[11px] font-bold text-gray-400 mb-1">DO-NOTHING (D90)</div>
                      <div className="text-lg font-bold text-gray-700 dark:text-slate-300">{data.contributionAtRisk.doNothingD90}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-gray-400 mb-1">DO-THIS (D90)</div>
                      <div className="text-lg font-bold text-gray-700 dark:text-slate-300">{data.contributionAtRisk.doThisD90}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intervention */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  INTERVENTION
                </p>
                <p className="text-[13px] text-gray-700 dark:text-slate-300 leading-relaxed">
                  {data.intervention}
                </p>
              </div>

              {/* Projection Table */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  30 / 60 / 90 PROJECTION — CLICK ANY NUMBER FOR ITS MATH
                </p>
                <div className="w-full border-t border-gray-200 dark:border-slate-700">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">METRIC</th>
                        <th className="py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">NOW</th>
                        <th className="py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">DO-NOTHING D90</th>
                        <th className="py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">DAY 30</th>
                        <th className="py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">DAY 60</th>
                        <th className="py-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider text-right">DAY 90</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {data.projection.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-3 text-[12px] font-medium text-gray-700 dark:text-slate-300">{row.metric}</td>
                          <td className="py-3 text-[12px] font-medium text-gray-400 text-right">{row.now}</td>
                          <td className="py-3 text-[12px] font-medium text-gray-400 text-right">{row.doNothingD90}</td>
                          <td className="py-3 text-[12px] font-bold text-gray-700 dark:text-slate-300 text-right border-b border-dotted border-gray-400 cursor-pointer">{row.day30}</td>
                          <td className="py-3 text-[12px] font-bold text-gray-700 dark:text-slate-300 text-right border-b border-dotted border-gray-400 cursor-pointer">{row.day60}</td>
                          <td className="py-3 text-[12px] font-bold text-gray-700 dark:text-slate-300 text-right border-b border-dotted border-gray-400 cursor-pointer">{row.day90}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* What could go wrong */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  WHAT COULD GO WRONG
                </p>
                <div className="flex flex-col gap-2">
                  {data.whatCouldGoWrong.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg border-l-2 border-amber-500 p-4 shadow-sm">
                      <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-0.5">{item.title}</h4>
                      {item.subtitle && <p className="text-[12px] text-amber-600 dark:text-amber-500 font-medium mb-1">{item.subtitle}</p>}
                      <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monitoring plan */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30">
                  <h4 className="text-[12px] font-bold text-gray-900 dark:text-white">Monitoring plan — what to watch, by when, and the tripwire that means revert</h4>
                </div>
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-700/50">
                  {data.monitoringPlan.map((step, idx) => (
                    <div key={idx} className="px-4 py-3 flex items-start gap-4">
                      <div className="w-12 flex-shrink-0 text-[12px] font-bold text-red-600 dark:text-red-400 pt-0.5">
                        Day {step.day}
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-gray-900 dark:text-white mb-0.5">{step.title.split('—')[0]}<span className="font-normal text-gray-500"> — {step.title.split('—')[1]}</span></div>
                        <div className="text-[12px] text-red-600/80 dark:text-red-400/80">{step.tripwire}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assumptions */}
              <div>
                <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  ASSUMPTIONS — EDIT, PICK A PRESET, THEN RE-SIMULATE
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <button className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-[11px] font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">conservative</button>
                  <button className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-[11px] font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">expected</button>
                  <button className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-[11px] font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">optimistic</button>
                  <button className="px-3 py-1.5 rounded-full bg-slate-500 text-white text-[11px] font-bold hover:bg-slate-600 ml-2">Re-simulate</button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-gray-500 uppercase">SHOCK_PCT</span>
                  <input 
                    type="number" 
                    value={shockPct}
                    onChange={(e) => setShockPct(e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-gray-400 italic">
                    Hypothetical drop in this SKU's sales to stress-test. (default {data.defaultShockPct} - conservative constant (20% shock))
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-b-xl">
          {data.canSimulate ? (
            <button className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-[13px] font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Download CSV
            </button>
          ) : <div />}
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </StandardModal>
  );
};

export default SimulateModal;
