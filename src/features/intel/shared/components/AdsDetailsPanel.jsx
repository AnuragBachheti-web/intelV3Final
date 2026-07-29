import React from 'react';

const AdsDetailsPanel = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-24">
        
        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ACOS VS BREAK-EVEN</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-red-600">{item.acos}%</span>
              <span className="text-[11px] text-gray-500">vs {item.be}% BE</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CM AFTER ADS</div>
            <div className="text-xl font-bold text-red-600">{item.cmaa}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">RECOVERABLE</div>
            <div className="text-xl font-bold text-emerald-600">{item.recoverable}</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-5 mb-3 text-sm italic text-blue-800 dark:text-blue-400 font-medium">
          Recommendations — each acts on its own
        </div>

        {/* Campaign 1 */}
        <div className="border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">Campaign 1 of 2</span>
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">Waterproof covers — broad</h4>
          <div className="text-[11px] text-gray-500 font-mono mb-3">SC | SP | Phrase gen kwt | Waterproof covers —</div>
          <div className="text-xl font-bold text-emerald-600 mb-2">+₹75,013/mo</div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Shows your ad on waterproof covers — broad searches. Spends 87% of budget at 41% ACOS vs 17% break-even.
          </p>
        </div>

        {/* Campaign 2 */}
        <div className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[10px] font-bold rounded-full">Campaign 2 of 2</span>
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">Auto targeting group</h4>
          <div className="text-[11px] text-gray-500 font-mono mb-3">SC | SP | Auto discovery | Auto targeting group</div>
          <div className="text-xl font-bold text-emerald-600 mb-2">+₹9,231/mo</div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Lets Amazon discover new search terms. Spends 13% of budget at 32% ACOS vs 17% break-even. Harvest winners to exact, negate the rest.
          </p>
        </div>

        {/* Simulate Block */}
        <div className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 mb-6">
          <div className="text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            SIMULATE — ADJUST AND RE-RUN · <span className="text-gray-900 dark:text-white font-black">Waterproof covers — broad</span>
          </div>
          
          <div className="flex items-center gap-3 mb-5 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <button className="hover:underline">Why</button>
            <span className="text-gray-300 dark:text-slate-700">•</span>
            <a href="#" className="hover:underline flex items-center gap-1">
              Open in Amazon <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-5">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-slate-400">Bid change:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-slate-100">-20%</span>
              <div className="w-32 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full relative ml-2">
                <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full w-1/3"></div>
                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-600 rounded-full shadow border-2 border-white"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-slate-400">Target ACOS:</span>
              <input type="text" defaultValue="6" className="w-16 px-2 py-1 border border-gray-300 dark:border-slate-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-900 text-center" />
              <span className="text-sm text-gray-600 dark:text-slate-400">%</span>
            </div>
          </div>

          <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg mb-6 hover:bg-blue-700 transition-colors">
            Re-simulate
          </button>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 border border-gray-100 dark:border-slate-800/80">
              <div className="text-[10px] font-bold text-gray-500 mb-1">30D</div>
              <div className="text-lg font-bold text-emerald-600">+₹28,565</div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">p≈.61</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 border border-gray-100 dark:border-slate-800/80">
              <div className="text-[10px] font-bold text-gray-500 mb-1">60D</div>
              <div className="text-lg font-bold text-emerald-600">+₹60,490</div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">p≈.53</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 border border-gray-100 dark:border-slate-800/80">
              <div className="text-[10px] font-bold text-gray-500 mb-1">90D</div>
              <div className="text-lg font-bold text-emerald-600">+₹92,416</div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">p≈.47</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <button className="flex-1 py-2.5 bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
              Apply change
            </button>
            <button className="flex-1 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Preview
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <i className="fa-solid fa-triangle-exclamation text-[10px]" /> Tripwire: units/wk drop {'>'}15% → auto-revert.
          </div>
        </div>

        {/* Advisory Block */}
        <div className="border border-gray-200 dark:border-slate-800 rounded-xl p-5 mb-2 bg-gray-50/50 dark:bg-slate-900/30">
          <h4 className="text-base font-bold italic text-gray-900 dark:text-slate-100 mb-4">Advisory — you do this yourself</h4>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold text-gray-900 dark:text-slate-100">campaign split</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 uppercase rounded">Advisory</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
            This SKU's spend is spread across 2 campaigns — a dedicated campaign would let its bids and budget be tuned without side effects on the other SKUs sharing those ad groups. Realify won't auto-execute a restructure.
          </p>
          
          <button className="text-sm font-bold text-blue-600 hover:underline">How to ▾</button>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 p-4 px-5">
        <div className="flex flex-col gap-3">
          <div className="text-sm text-gray-600 dark:text-slate-400">
            Projected if all applied · net CMAA gain <span className="font-bold text-emerald-600">+₹84,244/mo</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50">
              Export
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              Apply all 2 changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsDetailsPanel;
