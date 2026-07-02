import React from 'react';
import MiniCalendar from './MiniCalendar';
import { V2_CAT_GRID } from '../detailedViewData';
import { quickToRange, formatCalDate, v2CatLabel } from '../detailedViewUtils';

const QUICK_DATE_OPTS = [['last-7-days', 'Last 7 Days'], ['last-30-days', 'Last 30 Days'], ['last-90-days', 'Last 90 Days']];

const SECTIONS = [{ key: 'date', label: 'Select Date' }, { key: 'channel', label: 'All Channels' }, { key: 'category', label: 'All Categories' }];

// The dropdown content of the Detailed View filter bar — sidebar of sections
// (date/channel/category) plus the matching editor for whichever is active.
const FilterPanel = ({ filters, style }) => {
  const {
    v2Section, setV2Section,
    pendingDate, setPendingDate, pendingCats, pendingChans,
    pendingRangeStart, pendingRangeEnd, hoverDay, setHoverDay,
    setPendingRangeStart, setPendingRangeEnd,
    calViewYear, calViewMonth, calRightM, calRightY,
    prevCalMonth, nextCalMonth, handleDateClick,
    togglePendingCat, togglePendingChan, clearPendingChans,
    v2ChanGrid, v2ChanLabel,
    setV2FilterOpen, handleApplyV2Filter,
  } = filters;

  const onDateHover = (date) => { if (pendingRangeStart && !pendingRangeEnd) setHoverDay(date); };

  return (
    <div
      className="fixed bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-[9999] w-[580px] overflow-hidden"
      style={style}
    >
      <div className="flex" style={{ minHeight: '300px' }}>
        <div className="w-[155px] flex-shrink-0 border-r border-gray-100 dark:border-slate-800 p-3 flex flex-col gap-1">
          {SECTIONS.map(sec => (
            <button key={sec.key} onClick={() => setV2Section(sec.key)}
              className={`flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${v2Section === sec.key ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${v2Section === sec.key ? 'border-white dark:border-gray-900' : 'border-gray-300 dark:border-slate-600'}`}>
                {v2Section === sec.key && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900" />}
              </span>
              {sec.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {v2Section === 'date' && (
            <div className="flex-1 flex flex-col p-4 gap-2">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Quick Filters</span>
                {QUICK_DATE_OPTS.map(([val, lbl]) => (
                  <button key={val}
                    onClick={() => { const r = quickToRange(val); setPendingRangeStart(r.start); setPendingRangeEnd(r.end); setPendingDate(val); }}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${pendingDate === val ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 flex-1">
                <MiniCalendar
                  year={calViewYear} month={calViewMonth} showPrev showNext={false}
                  onPrev={prevCalMonth} onNext={nextCalMonth}
                  rangeStart={pendingRangeStart} rangeEnd={pendingRangeEnd} hoverDay={hoverDay}
                  onDateClick={handleDateClick} onDateHover={onDateHover} onDateLeave={() => setHoverDay(null)}
                />
                <div className="w-px bg-gray-100 dark:bg-slate-800 self-stretch flex-shrink-0" />
                <MiniCalendar
                  year={calRightY} month={calRightM} showPrev={false} showNext
                  onPrev={prevCalMonth} onNext={nextCalMonth}
                  rangeStart={pendingRangeStart} rangeEnd={pendingRangeEnd} hoverDay={hoverDay}
                  onDateClick={handleDateClick} onDateHover={onDateHover} onDateLeave={() => setHoverDay(null)}
                />
              </div>
              {pendingRangeStart && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-[11px] text-gray-600 dark:text-slate-400">
                    {formatCalDate(pendingRangeStart)}{pendingRangeEnd ? ` — ${formatCalDate(pendingRangeEnd)}` : ''}
                  </span>
                </div>
              )}
            </div>
          )}
          {v2Section === 'category' && (
            <div className="flex-1 flex flex-col p-4 gap-5">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">All Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {V2_CAT_GRID.map(([val, lbl]) => {
                    const isSel = val === 'all' ? pendingCats.length === 0 : pendingCats.includes(val);
                    return <button key={val} onClick={() => togglePendingCat(val)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>{lbl}</button>;
                  })}
                </div>
              </div>
              {pendingCats.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
                  {pendingCats.map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300">
                      {v2CatLabel(cat)} <button onClick={() => togglePendingCat(cat)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition"><i className="fa-solid fa-xmark text-[9px]" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          {v2Section === 'channel' && (
            <div className="flex-1 flex flex-col p-4 gap-5">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">All Channels</p>
                <div className="flex flex-wrap gap-1.5">
                  {v2ChanGrid.map(([val, lbl]) => {
                    const isSel = val === 'all-chans' ? pendingChans.length === 0 : pendingChans.includes(val);
                    return <button key={val} onClick={() => val === 'all-chans' ? clearPendingChans() : togglePendingChan(val)} className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSel ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'}`}>{lbl}</button>;
                  })}
                </div>
              </div>
              {pendingChans.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-auto">
                  {pendingChans.map(ch => (
                    <span key={ch} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300">
                      {v2ChanLabel(ch)} <button onClick={() => togglePendingChan(ch)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition"><i className="fa-solid fa-xmark text-[9px]" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
        <button onClick={() => setV2FilterOpen(false)} className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
        <button onClick={handleApplyV2Filter} className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition">Update</button>
      </div>
    </div>
  );
};

export default FilterPanel;
