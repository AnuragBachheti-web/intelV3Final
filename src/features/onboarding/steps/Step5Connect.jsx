import { useState, useRef, useCallback } from 'react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const REPORT_TYPES = [
  { key: 'asin', label: 'Monthly Unified Transaction', tag: 'ESSENTIAL', dummyFile: '2026MayMonthlyUnifiedTransaction.csv' },
  { key: 'cogs', label: 'COGS / unit costs', tag: 'ESSENTIAL', dummyFile: 'Autofy COGS Data.csv' },
  { key: 'fee_preview', label: 'Fee Preview (Estimated Fees)', tag: 'ESSENTIAL', dummyFile: 'A1.csv' },
  { key: 'sponsored', label: 'Sponsored Products – Advertised Product', tag: 'SUPPORTING', dummyFile: 'Sponsored_Products_Advertised_product_report (2).csv' },
  { key: 'biz_report', label: 'Business Report (Sales & Traffic)', tag: 'SUPPORTING', dummyFile: 'BusinessReport-29-06-26.csv' },
  { key: 'returns', label: 'FBA Customer Returns', tag: 'SUPPORTING', dummyFile: 'A5.csv' },
  { key: 'storage', label: 'FBA Storage Fees', tag: 'SUPPORTING', dummyFile: 'A2.csv, A3.csv, A4.csv' },
  { key: 'listings', label: 'All Listings', tag: 'ESSENTIAL', desc: 'catalog / ASIN mapping' },
];

const SHOPIFY_REPORTS = [
  { label: 'Shopify booked orders (units, gross, discount, tax)', tag: 'ESSENTIAL', desc: 'Shopify units, gross, discounts & tax (booked revenue)' },
  { label: 'Shopify product cost (COGS) & variants', tag: 'ESSENTIAL', desc: 'Shopify COGS & variants -> margin' },
  { label: 'Shopify inventory by location', tag: 'SUPPORTING', desc: 'Shopify stock by location (+ shared-FBA / MCF detection)' },
  { label: 'Shopify settled revenue & processing fees', tag: 'SUPPORTING', desc: 'settled net-of-fee revenue (the true Shopify margin base)' },
  { label: 'Shopify payout reconciliation', tag: 'SUPPORTING', desc: 'payout reconciliation detail' },
  { label: 'Shopify payments / finances summary', tag: 'SUPPORTING', desc: 'payments / finances summary' },
];

function Step5Connect() {
  const { setStep: _setStep } = useOnboardingStore();
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // States for dummy workflow
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | uploaded
  const [connectStatus, setConnectStatus] = useState('idle'); // idle | reading | ready

  // Track which reports are "checked" (received)
  const [checkedAmazon, setCheckedAmazon] = useState(new Set());
  const [checkedShopify, setCheckedShopify] = useState(new Set());

  const processFiles = useCallback((fileList) => {
    if (fileList && fileList.length > 0) {
      setUploadStatus('uploading');
      setTimeout(() => {
        setUploadStatus('uploaded');
        // Automatically check the first 7 Amazon items to simulate successful parsing
        setCheckedAmazon(new Set([0, 1, 2, 3, 4, 5, 6]));
      }, 1500);
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

  const handleConnectClick = () => {
    if (uploadStatus === 'uploaded') {
      const confirmed = window.confirm("Set up this account as a CUSTOMER? Your dashboard is built from these reports — nothing is synthesized.");
      if (confirmed) {
        setConnectStatus('reading');
        setTimeout(() => {
          setConnectStatus('ready');
        }, 3000);
      }
    } else {
      navigate(ROUTES.SALES);
    }
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
            {uploadStatus === 'uploaded' && checkedAmazon.has(i) ? (
              <i className="fa-solid fa-circle-check text-emerald-600 text-lg w-4 h-4 flex items-center justify-center" />
            ) : (
              <input
                type="checkbox"
                checked={checkedAmazon.has(i)}
                onChange={() => toggleAmazonCheck(i)}
                className="w-4 h-4 border-gray-300 rounded text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer transition-colors"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-[13px] font-medium truncate ${uploadStatus === 'uploaded' && checkedAmazon.has(i) ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{rt.label}</p>
                {rt.tag && (
                  <span className="text-[9px] text-purple-600/80 font-bold uppercase tracking-wider">{rt.tag}</span>
                )}
              </div>
            </div>
            {uploadStatus === 'uploaded' && checkedAmazon.has(i) && rt.dummyFile ? (
              <p className="text-[11px] text-emerald-600 font-bold text-right w-5/12 leading-tight truncate pl-4">{rt.dummyFile}</p>
            ) : (
              <p className="text-[11px] text-gray-400 text-right w-5/12 leading-tight truncate pl-4">{rt.desc}</p>
            )}
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
            <p className="text-[11px] text-gray-400 text-right w-5/12 leading-tight pl-4 max-w-[200px]">{rt.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pb-4 pt-4 mt-auto border-t border-gray-100 flex flex-col items-center justify-end z-10 -mx-6 px-6 md:-mx-10 md:px-10">
      
      {uploadStatus === 'uploaded' && connectStatus === 'idle' && (
        <div className="mb-6 flex flex-col gap-3 w-full max-w-lg">
          <div className="bg-emerald-50 text-emerald-800 text-sm p-4 rounded-xl font-medium border border-emerald-100">
            Recognized 9 reports · 4 months (2026-03, 2026-04, 2026-05, 2026-06).
          </div>
          <div className="bg-orange-50 text-orange-800 text-sm p-4 rounded-xl font-medium border border-orange-100">
            We found data for a channel you didn't add.
          </div>
        </div>
      )}

      {connectStatus === 'idle' && (
        <div className="flex items-center justify-end w-full">
          <button
            onClick={handleConnectClick}
            disabled={uploadStatus === 'uploading'}
            className={`flex items-center justify-center gap-2 px-10 py-3 font-semibold rounded-xl transition text-sm shadow-md w-full sm:w-auto ${
              uploadStatus === 'uploading' 
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-90' 
                : 'bg-[#131d33] text-white hover:bg-[#1a2642] hover:shadow-lg'
            }`}
          >
            {uploadStatus === 'uploading' && <i className="fa-solid fa-circle-notch fa-spin"></i>}
            Connect my data
          </button>
        </div>
      )}

      {connectStatus === 'reading' && (
        <div className="flex flex-col items-center justify-center w-full max-w-sm ml-auto">
          <button className="w-full flex items-center justify-center gap-2 px-10 py-3 bg-[#131d33] text-blue-500 font-semibold rounded-xl text-xl shadow-md mb-3 cursor-default">
            <i className="fa-solid fa-certificate fa-spin"></i>
          </button>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full absolute left-0 top-0 bottom-0 transition-all duration-[3000ms] ease-in-out" 
              style={{ width: connectStatus === 'reading' ? '95%' : '0%' }}
            ></div>
          </div>
          <p className="text-[13px] text-gray-600 font-mono mt-1">Reading your reports...</p>
        </div>
      )}

      {connectStatus === 'ready' && (
        <div className="flex flex-col items-center justify-center w-full max-w-sm ml-auto">
          <button 
            onClick={() => navigate(ROUTES.SALES)}
            className="w-full flex items-center justify-center gap-2 px-10 py-3 bg-[#131d33] text-white font-semibold rounded-xl text-sm shadow-md mb-3 hover:bg-[#1a2642] transition"
          >
            Go inside
          </button>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-full"></div>
          </div>
          <p className="text-[13px] text-gray-600 font-mono mt-1">Ready — 1447 SKUs.</p>
        </div>
      )}
    </div>
  </div>
);
}

export default Step5Connect;
