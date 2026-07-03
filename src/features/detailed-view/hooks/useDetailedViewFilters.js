import { useState, useRef, useEffect, useMemo } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';
import { useFilterStore } from '../../../store/useFilterStore';
import { quickToRange } from '../detailedViewUtils';

// Owns all state/handlers for the Detailed View filter bar: the date-range
// calendar, category/channel multi-select, applied-filter chips, and the
// dropdown panel's open/position state. Consumed by <FilterBar> / <CompactFilterButton>.
const useDetailedViewFilters = (isScrolled) => {
  const [v2FilterOpen, setV2FilterOpen] = useState(false);
  const [v2Section, setV2Section] = useState('date');
  const [pendingDate, setPendingDate] = useState(null);
  const [pendingCats, setPendingCats] = useState([]);
  const [pendingChans, setPendingChans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [appliedDate, setAppliedDate] = useState(() => localStorage.getItem('dv_filter_date') || null);
  const [appliedCats, setAppliedCats] = useState([]);
  const [appliedChans, setAppliedChans] = useState([]);
  const [appliedProducts, setAppliedProducts] = useState([]);
  const [chanDropOpen, setChanDropOpen] = useState(false);
  const [pendingRangeStart, setPendingRangeStart] = useState(null);
  const [pendingRangeEnd, setPendingRangeEnd] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);
  const [calViewYear, setCalViewYear] = useState(() => new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(() => new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1);
  const [filterPanelPos, setFilterPanelPos] = useState({ top: 64, right: 24 });

  const v2FilterRef = useRef(null);
  const chanDropRef = useRef(null);
  const filterBtnRef = useRef(null);
  const compactFilterRef = useRef(null);

  const { setDateRange, setCategory, setChannel, setProducts } = useFilterStore();

  useClickOutside(v2FilterRef, v2FilterOpen, () => setV2FilterOpen(false));
  useClickOutside(chanDropRef, chanDropOpen, () => setChanDropOpen(false));

  // Restore persisted date filter to store on mount
  useEffect(() => {
    const saved = localStorage.getItem('dv_filter_date');
    if (saved) setDateRange(saved);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // localStorage read once per mount — value doesn't change during component lifetime
  const activePlatforms = useMemo(
    () => JSON.parse(localStorage.getItem('active_platforms') || '["shopify","amazon","tiktok"]'),
    []
  );
  const channelOptions = useMemo(() => [
    ['all', 'All Channels'],
    ...(activePlatforms.includes('amazon') ? [['amazon', 'Amazon']] : []),
    ...(activePlatforms.includes('shopify') ? [['shopify', 'Shopify']] : []),
    ...(activePlatforms.includes('tiktok') ? [['tiktok-shop', 'TikTok Shop']] : []),
  ], [activePlatforms]);
  const v2ChanList = useMemo(() => channelOptions.filter(([v]) => v !== 'all'), [channelOptions]);
  const v2ChanGrid = useMemo(() => [...v2ChanList, ['all-chans', 'All Channels']], [v2ChanList]);
  const v2ChanLabel = (v) => channelOptions.find(([k]) => k === v)?.[1] || v;

  const prevCalMonth = () => {
    if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear(y => y - 1); }
    else setCalViewMonth(m => m - 1);
  };
  const nextCalMonth = () => {
    if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear(y => y + 1); }
    else setCalViewMonth(m => m + 1);
  };
  const handleDateClick = (date) => {
    if (!pendingRangeStart || pendingRangeEnd) {
      setPendingRangeStart(date); setPendingRangeEnd(null); setPendingDate('custom');
    } else {
      if (date < pendingRangeStart) { setPendingRangeEnd(pendingRangeStart); setPendingRangeStart(date); }
      else setPendingRangeEnd(date);
      setPendingDate('custom');
    }
  };
  const calRightM = (calViewMonth + 1) % 12;
  const calRightY = calViewMonth === 11 ? calViewYear + 1 : calViewYear;

  const handleOpenV2Filter = () => {
    const isMobile = window.innerWidth < 640;
    // Mobile has no compact header (it's hidden below sm), so always anchor off
    // the FilterBar's own button rather than the (possibly hidden) compact one.
    const triggerEl = isMobile ? filterBtnRef.current : (isScrolled ? compactFilterRef.current : filterBtnRef.current);
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      if (isMobile) {
        setFilterPanelPos({ top: rect.bottom + 8, left: 16, right: 16 });
      } else {
        setFilterPanelPos({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
      }
    }
    setPendingDate(appliedDate);
    setPendingCats([...appliedCats]);
    setPendingChans([...appliedChans]);
    setPendingProducts([...appliedProducts]);
    setV2Section('date');
    if (appliedDate) {
      const r = quickToRange(appliedDate === 'custom' ? 'last-30-days' : appliedDate);
      setPendingRangeStart(r.start); setPendingRangeEnd(r.end);
      const sm = r.start.getMonth();
      setCalViewMonth(sm === 0 ? 11 : sm - 1);
      setCalViewYear(sm === 0 ? r.start.getFullYear() - 1 : r.start.getFullYear());
    } else {
      setPendingRangeStart(null); setPendingRangeEnd(null);
      const now = new Date();
      setCalViewMonth(now.getMonth() === 0 ? 11 : now.getMonth() - 1);
      setCalViewYear(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
    }
    setV2FilterOpen(v => !v);
  };
  const handleApplyV2Filter = () => {
    setAppliedDate(pendingDate);
    if (pendingDate) localStorage.setItem('dv_filter_date', pendingDate);
    else localStorage.removeItem('dv_filter_date');
    setAppliedCats([...pendingCats]);
    setAppliedChans([...pendingChans]);
    setAppliedProducts([...pendingProducts]);
    setDateRange(pendingDate);
    setCategory(pendingCats.length === 1 ? pendingCats[0] : 'all');
    setChannel(pendingChans.length === 1 ? pendingChans[0] : 'all');
    setProducts([...pendingProducts]);
    setV2FilterOpen(false);
  };
  const togglePendingCat = (cat) => {
    if (cat === 'all') { setPendingCats([]); return; }
    setPendingCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const togglePendingChan = (ch) =>
    setPendingChans(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  const clearPendingChans = () => setPendingChans([]);
  const togglePendingProduct = (id) =>
    setPendingProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const removeAppliedChan = (ch) => {
    const next = appliedChans.filter(c => c !== ch);
    setAppliedChans(next);
    setChannel(next.length === 1 ? next[0] : 'all');
  };
  const removeAppliedDate = () => { setAppliedDate(null); setDateRange(null); localStorage.removeItem('dv_filter_date'); };
  const removeAppliedCats = () => { setAppliedCats([]); setCategory('all'); };
  const removeAppliedProducts = () => { setAppliedProducts([]); setProducts([]); };

  return {
    v2FilterOpen, setV2FilterOpen, v2Section, setV2Section,
    pendingDate, setPendingDate, pendingCats, pendingChans,
    pendingProducts, setPendingProducts,
    setPendingRangeStart, setPendingRangeEnd,
    appliedDate, appliedCats, appliedChans, appliedProducts,
    chanDropOpen, setChanDropOpen,
    pendingRangeStart, pendingRangeEnd, hoverDay, setHoverDay,
    calViewYear, calViewMonth, calRightM, calRightY,
    filterPanelPos,
    v2FilterRef, chanDropRef, filterBtnRef, compactFilterRef,
    v2ChanGrid, v2ChanLabel,
    prevCalMonth, nextCalMonth, handleDateClick,
    handleOpenV2Filter, handleApplyV2Filter,
    togglePendingCat, togglePendingChan, clearPendingChans, togglePendingProduct,
    removeAppliedChan, removeAppliedDate, removeAppliedCats, removeAppliedProducts,
  };
};

export default useDetailedViewFilters;
