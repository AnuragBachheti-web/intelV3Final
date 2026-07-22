import { useState, useRef, useCallback } from 'react';
import { useOnboardingStore } from "../store/useOnboardingStore";

const marketplaces = [
  { id: 'amazon',  name: 'Amazon',  icon: 'fa-brands fa-amazon',   iconColor: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'shopify', name: 'Shopify', icon: 'fa-brands fa-shopify',   iconColor: 'text-green-600',  bg: 'bg-green-100'  },
  { id: 'ebay',    name: 'eBay',    icon: 'fa-brands fa-ebay',      iconColor: 'text-red-600',    bg: 'bg-red-100'    },
  { id: 'walmart', name: 'Walmart', icon: 'fa-solid fa-store',      iconColor: 'text-blue-600',   bg: 'bg-blue-100'   },
];

const REPORT_TYPES = [
  { key: 'asin',       label: 'ASIN / Cost',         icon: 'fa-solid fa-dollar-sign',          iconColor: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', cols: ['asin', 'cost', 'fba fee', 'inbound cost'] },
  { key: 'fba',        label: 'FBA Inventory',        icon: 'fa-solid fa-warehouse',            iconColor: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',    cols: ['fnsku', 'fulfillable', 'reserved', 'available qty'] },
  { key: 'returns',    label: 'Returns Report',       icon: 'fa-solid fa-rotate-left',          iconColor: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20',      cols: ['return date', 'return reason', 'return quantity', 'return-date'] },
  { key: 'settlement', label: 'Settlement Report',    icon: 'fa-solid fa-file-invoice-dollar',  iconColor: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20',cols: ['settlement id', 'transaction type', 'settlement', 'deposited to'] },
  { key: 'vendor',     label: 'Vendor Lead Times',    icon: 'fa-solid fa-clock',                iconColor: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20',  cols: ['lead time', 'supplier', 'replenishment', 'reorder point'] },
];

const detectType = (headers) => {
  const lower = headers.map(h => h.toLowerCase().trim());
  let best = null;
  let bestScore = 0;
  for (const rt of REPORT_TYPES) {
    const score = rt.cols.filter(col => lower.some(h => h.includes(col))).length;
    if (score > bestScore) { bestScore = score; best = rt; }
  }
  return bestScore >= 1 ? best : null;
};

const parseHeaders = (text) => text.split('\n')[0].split(',').map(h => h.replace(/"/g, '').trim());

const UNKNOWN_RT = { key: 'unknown', label: 'Unknown', icon: 'fa-solid fa-file', iconColor: 'text-gray-400', bg: 'bg-gray-100' };

// ─── Category Row ─────────────────────────────────────────────────────────────
// Header row: [icon] [label] [count] [toggle-arrow]
// Arrow click expands panel below: file-name tabs + columns for active tab

const CategoryRow = ({ rt, catFiles, activeIdx, onTabChange }) => {
  const [expanded, setExpanded] = useState(true);
  const activeFile = catFiles[Math.min(activeIdx, catFiles.length - 1)];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header — unchanged style, just arrow added after count */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className={`w-6 h-6 ${rt.bg} rounded-md flex items-center justify-center flex-shrink-0`}>
          <i className={`${rt.icon} ${rt.iconColor} text-[10px]`}></i>
        </div>
        <span className="flex-1 text-xs font-semibold text-gray-800">{rt.label}</span>
        <span className="text-[11px] font-bold text-white bg-gray-800 rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
          {catFiles.length}
        </span>
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition flex-shrink-0"
        >
          <i className={`fa-solid ${expanded ? 'fa-chevron-up' : 'fa-chevron-right'} text-[9px]`}></i>
        </button>
      </div>

      {/* Expandable panel */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* File name tabs */}
          <div className="flex gap-1 overflow-x-auto px-3 pt-2 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {catFiles.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => onTabChange(idx)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  idx === activeIdx
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {f.name.length > 22 ? f.name.slice(0, 20) + '…' : f.name}
              </button>
            ))}
          </div>

          {/* Columns for active file */}
          <div className="px-3 pt-1 pb-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5 mt-2">Columns</p>
            <div className="flex flex-wrap gap-1">
              {activeFile.headers.filter(Boolean).map((col, i) => (
                <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] rounded-full">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Upload Card ──────────────────────────────────────────────────────────────

const UploadCard = ({ platform, icon, iconColor, bg }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);           // { name, typeKey, headers }
  const [activeTabs, setActiveTabs] = useState({}); // { [typeKey]: number }

  const processFiles = useCallback((fileList) => {
    Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.csv')).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const headers = parseHeaders(e.target.result || '');
        const detected = detectType(headers);
        const typeKey = detected ? detected.key : 'unknown';
        setFiles(prev => [...prev.filter(pf => pf.name !== file.name), { name: file.name, typeKey, headers }]);
      };
      reader.readAsText(file);
    });
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); };

  const grouped = [
    ...REPORT_TYPES.map(rt => ({ rt, catFiles: files.filter(f => f.typeKey === rt.key) })).filter(g => g.catFiles.length > 0),
    ...(files.some(f => f.typeKey === 'unknown') ? [{ rt: UNKNOWN_RT, catFiles: files.filter(f => f.typeKey === 'unknown') }] : []),
  ];

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden mb-3">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
            <i className={`${icon} text-lg ${iconColor}`}></i>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{platform} CSV Upload</p>
            <p className="text-[11px] text-gray-400 leading-tight">Auto-segregates by report type</p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 px-5 py-3 border-2 border-dashed rounded-xl text-xs cursor-pointer transition-all select-none min-w-[110px] ${
            dragging ? 'border-gray-500 bg-gray-50 text-gray-600' : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <i className="fa-solid fa-cloud-arrow-up text-base"></i>
          <span className="whitespace-nowrap font-medium">Drop CSVs</span>
          <input ref={inputRef} type="file" multiple accept=".csv" className="hidden" onChange={e => processFiles(e.target.files)} />
        </div>
      </div>

      {/* Category rows */}
      {grouped.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2">
          {grouped.map(({ rt, catFiles }) => (
            <CategoryRow
              key={rt.key}
              rt={rt}
              catFiles={catFiles}
              activeIdx={Math.min(activeTabs[rt.key] ?? 0, catFiles.length - 1)}
              onTabChange={(idx) => setActiveTabs(prev => ({ ...prev, [rt.key]: idx }))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Step 3 ──────────────────────────────────────────────────────────────────

function Step3Marketplace() {
  const { setStep } = useOnboardingStore();

  return (
    <div className="max-w-lg mx-auto anim-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Marketplaces</h2>
        <p className="text-gray-500 text-sm">Sync your sales data automatically from the world's leading platforms.</p>
      </div>

      {/* Marketplace icons — all disabled, coming soon */}
      <div className="flex items-center justify-between px-4 py-4 border border-gray-200 bg-gray-50 rounded-xl mb-3 opacity-60 select-none">
        <div className="flex items-center gap-3">
          {marketplaces.map(m => (
            <div key={m.id} className={`w-9 h-9 ${m.bg} rounded-full flex items-center justify-center`} title={m.name}>
              <i className={`${m.icon} text-base ${m.iconColor}`}></i>
            </div>
          ))}
        </div>
        <span className="text-[11px] font-semibold text-gray-400 bg-gray-200 px-3 py-1 rounded-full tracking-wide uppercase">
          Coming Soon
        </span>
      </div>

      {/* Section heading */}
      <div className="flex items-center gap-2 mb-3 mt-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Smart CSV Upload</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Amazon CSV Upload */}
      <UploadCard
        platform="Amazon"
        icon="fa-brands fa-amazon"
        iconColor="text-orange-600"
        bg="bg-orange-100"
      />

      {/* Shopify CSV Upload */}
      <UploadCard
        platform="Shopify"
        icon="fa-brands fa-shopify"
        iconColor="text-green-600"
        bg="bg-green-100"
      />

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => setStep(4)}
          className="text-sm text-gray-500 hover:text-gray-700 transition font-medium"
        >
          {/* Skip for now */}
        </button>
        <button
          onClick={() => setStep(4)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition text-sm"
        >
          Continue <i className="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}

export default Step3Marketplace;
