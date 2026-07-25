import { useState, useRef, useCallback } from 'react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const MARKETPLACES = [
  { id: 'amazon', name: 'Amazon', icon: 'fa-brands fa-amazon', iconColor: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'shopify', name: 'Shopify', icon: 'fa-brands fa-shopify', iconColor: 'text-green-600', bg: 'bg-green-100' },
  { id: 'walmart', name: 'Walmart', icon: 'fa-solid fa-store', iconColor: 'text-blue-600', bg: 'bg-blue-100' },
];

const COUNTRY_OPTIONS = [
  'India — amazon.in (₹)',
  'United States — amazon.com ($)',
  'United Kingdom — amazon.co.uk (£)',
  'Germany — amazon.de (€)',
  'Canada — amazon.ca (CA$)',
];

const REPORT_TYPES = [
  { key: 'asin', label: 'Quantity, Unfixed Transaction', tag: 'ESSENTIAL', tagColor: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-solid fa-dollar-sign', desc: 'Fix selling price, actual fees, quantity, returns, internal cost.', cols: ['asin', 'cost', 'fba fee', 'inbound cost'] },
  { key: 'cogs', label: 'COGS / Unit Costs', tag: 'ESSENTIAL', tagColor: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-solid fa-warehouse', desc: 'margin & profit after ads', cols: ['cogs', 'unit cost'] },
  { key: 'fba_returns', label: 'Free Return (Validation Field)', tag: 'OPTIONAL', tagColor: 'text-gray-400', bg: 'bg-gray-50', icon: 'fa-solid fa-rotate-left', desc: 'FBA / MFN mapping + 1 validation.', cols: ['return date', 'fnsku'] },
  { key: 'sponsored', label: 'Sponsored Products — Advertised Product', tag: 'OPTIONAL', tagColor: 'text-gray-400', bg: 'bg-gray-50', icon: 'fa-solid fa-bullhorn', desc: 'ACOS, TACOS, cost per click, spend.', cols: ['campaign', 'ad spend'] },
  { key: 'biz_report', label: 'Business Report (Sales & Traffic)', tag: 'OPTIONAL', tagColor: 'text-gray-400', bg: 'bg-gray-50', icon: 'fa-solid fa-chart-bar', desc: 'Buy / not-buy traffic.', cols: ['sessions', 'units ordered'] },
  { key: 'returns', label: 'V&A Customer Returns', tag: 'OPTIONAL', tagColor: 'text-gray-400', bg: 'bg-gray-50', icon: 'fa-solid fa-box-open', desc: 'returns report', cols: ['return reason'] },
  { key: 'storage', label: 'V&A Storage Fees', tag: 'OPTIONAL', tagColor: 'text-gray-400', bg: 'bg-gray-50', icon: 'fa-solid fa-archive', desc: 'storage cost per SKU', cols: ['storage fee'] },
  { key: 'listings', label: 'All Listings', tag: 'ESSENTIAL', tagColor: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-solid fa-list', desc: 'catalog / listing mapping', cols: ['asin', 'listing'] },
];

const SHOPIFY_REPORTS = [
  { label: 'Shopify financial orders (price, group, discount, fee)', tag: 'OPTIONAL', desc: 'Shopify units, price, discounts & variants summaries', tagColor: 'text-gray-400' },
  { label: 'Shopify product cost (COGS & variants & defaults)', tag: 'OPTIONAL', desc: 'Shopify COGS & variant cost', tagColor: 'text-gray-400' },
  { label: 'Shopify Inventory by location', tag: 'OPTIONAL', desc: 'Shopify stock by location by period / NOT detailed', tagColor: 'text-gray-400' },
  { label: 'Shopify settled revenue & processing fees', tag: 'OPTIONAL', desc: 'settled list of the revenue (less the revenue / NOT detected)', tagColor: 'text-gray-400' },
  { label: 'Shopify payout reconciliation', tag: 'OPTIONAL', desc: 'payout reconciliation', tagColor: 'text-gray-400' },
  { label: 'Shopify payments / finances summary', tag: 'OPTIONAL', desc: 'payments / finances summary', tagColor: 'text-gray-400' },
  { label: 'Shopify billing statements', tag: 'OPTIONAL', desc: 'Shopify subscription / app billing', tagColor: 'text-gray-400' },
];

function Step5Connect() {
  const { setStep: _setStep } = useOnboardingStore();
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // Track which reports are "checked" (received)
  const [checkedAmazon, setCheckedAmazon] = useState(new Set());
  const [checkedShopify, setCheckedShopify] = useState(new Set());

  const processFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.csv'));
    if (newFiles.length > 0) {
      setCheckedAmazon(prev => {
        const next = new Set(prev);
        for (let i = 0; i < REPORT_TYPES.length; i++) {
          if (!next.has(i)) { next.add(i); break; }
        }
        return next;
      });
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const toggleAmazonCheck = (idx) => {
    setCheckedAmazon(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const toggleShopifyCheck = (idx) => {
    setCheckedShopify(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  return (
  <div className="flex flex-col h-full anim-fade-in relative max-w-3xl mx-auto w-full">

    {/* Top Buttons matching SS1 */}
    <div className="flex items-center justify-center gap-3 mb-6">
      <button className="px-5 py-2 border border-blue-200 bg-blue-50/50 text-gray-900 rounded-xl text-sm font-semibold shadow-sm transition hover:bg-blue-50">
        Amazon
      </button>
      <button className="px-5 py-2 border border-blue-200 bg-blue-50/50 text-gray-900 rounded-xl text-sm font-semibold shadow-sm transition hover:bg-blue-50">
        Shopify
      </button>
      <button className="px-5 py-2 border border-gray-200 bg-white text-gray-500 rounded-xl text-sm font-semibold cursor-not-allowed opacity-70">
        Walmart <span className="text-[9px] text-purple-600 ml-1 font-bold tracking-wider">SOON</span>
      </button>
    </div>

    {/* Guided Wizard CTA */}
    <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition text-sm mb-2">
      <i className="fa-solid fa-wand-magic-sparkles text-xs" />
      Set up with a guided wizard
    </button>
    <p className="text-xs text-center text-gray-400 mb-6">
      Answer a few questions and we'll tell you what we need. Or{' '}
      <span className="text-gray-700 font-medium cursor-pointer hover:underline">drop files below — we recognise most report types</span>.
    </p>

    {/* Upload drop zone */}
    <div
      className={`flex flex-col items-center justify-center gap-1.5 py-7 border border-dashed rounded-2xl cursor-pointer transition-all mb-8 ${dragging ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 bg-gray-50/30'
        }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <i className="fa-solid fa-arrow-down text-blue-500 mb-2" />
      <p className="text-sm text-gray-600 font-medium">
        Drag & drop your reports here, or <span className="text-blue-600 font-bold hover:underline">choose files</span>
      </p>
      <p className="text-xs text-gray-400">Drop as many as you like — we recognize each one.</p>
      <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); }} className="text-xs text-blue-500 font-medium hover:underline mt-1">
        Download the COGS template
      </a>
      <input ref={inputRef} type="file" multiple accept=".csv" className="hidden" onChange={e => processFiles(e.target.files)} />
    </div>

    {/* AMAZON SECTION */}
    <div className="mb-8">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        AMAZON
      </p>
      <div className="flex flex-col">
        {REPORT_TYPES.map((rt, i) => (
          <div key={i} className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition px-2 -mx-2 rounded-lg">
            <input
              type="checkbox"
              checked={checkedAmazon.has(i)}
              onChange={() => toggleAmazonCheck(i)}
              className="w-4 h-4 border-gray-300 rounded text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer transition-colors"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] text-gray-700 font-medium truncate">{rt.label}</p>
                {rt.tag && (
                  <span className="text-[9px] text-purple-600/80 font-bold uppercase tracking-wider">{rt.tag}</span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-right w-5/12 leading-tight truncate pl-4">{rt.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* SHOPIFY SECTION */}
    <div className="mb-8">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        SHOPIFY
      </p>
      <div className="flex flex-col">
        {SHOPIFY_REPORTS.map((rt, i) => (
          <div key={i} className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition px-2 -mx-2 rounded-lg">
            <input
              type="checkbox"
              checked={checkedShopify.has(i)}
              onChange={() => toggleShopifyCheck(i)}
              className="w-4 h-4 border-gray-300 rounded text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer transition-colors"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] text-gray-700 font-medium truncate">{rt.label}</p>
                {rt.tag && (
                  <span className="text-[9px] text-purple-600/80 font-bold uppercase tracking-wider">{rt.tag}</span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-right w-5/12 leading-tight truncate pl-4">{rt.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pb-4 pt-4 mt-auto border-t border-gray-100 flex items-center justify-end z-10 -mx-6 px-6 md:-mx-10 md:px-10">
      <button
        onClick={() => navigate(ROUTES.SALES)}
        className="flex items-center gap-2 px-10 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition text-sm shadow-md hover:shadow-lg"
      >
        Connect my data
      </button>
    </div>
  </div>
);
}

export default Step5Connect;
