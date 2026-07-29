import React from 'react';

/**
 * Universal Signal Card (Master Prompt v5)
 * 
 * Strict Color Discipline:
 * - Red is reserved ONLY for priority dot of genuinely HIGH-urgency signals.
 * - Type pills stay in ONE consistent neutral-blue design (no rainbow color-coding).
 * 
 * Line 1: [● priority dot] [TYPE PILL] · [SKU/Category] ................ ₹[Exposure]
 * Line 2: [1-line description with action already implied]
 * Line 3:                                           [Simulate]  [Take Action]
 */
const InsightCard = ({
  card,
  isSelected,
  onSelect,
  onSimulate,
  onTakeAction,
}) => {
  if (!card) return null;

  // Format Exposure
  const formattedExposure = typeof card.exposure === 'number'
    ? `₹${(card.exposure / 100000).toFixed(1)}L`
    : (card.exposureFormatted || card.monthlyRevenue || '₹45,000');

  // Priority Dot Color — Red is strictly reserved for HIGH urgency
  const priorityDotColor =
    card.urgency === 'HIGH' || card.priority === 'HIGH'
      ? 'bg-red-500'
      : card.urgency === 'MED' || card.priority === 'MED'
      ? 'bg-amber-500'
      : 'bg-blue-500';

  const typeLabel = (card.tagCategory || card.type || 'AI SIGNAL').toUpperCase();
  const skuOrCat = card.skuCode || card.category || 'GENERAL';
  const description = card.headlineHighlight || card.headline || card.description || '';

  return (
    <div
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select signal: ${typeLabel} - ${skuOrCat}`}
      className={`focus-ring group relative rounded-xl border p-3 sm:p-3.5 transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between gap-2.5 ${
        isSelected
          ? 'border-blue-500 dark:border-blue-500 border-l-[3.5px] border-l-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500/20'
          : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 hover:shadow-card'
      }`}
    >
      {/* ── Line 1: Header Row ── */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 truncate min-w-0">
          {/* Priority Dot paired with accessibility label */}
          <span className={`w-2 h-2 rounded-full ${priorityDotColor} flex-shrink-0 animate-pulse`} title={`Priority: ${card.priority || 'NORMAL'}`} />
          
          {/* Uniform Neutral Blue Type Pill across ALL signal types */}
          <span className="text-[9.5px] font-mono font-bold tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/40 uppercase flex-shrink-0">
            {typeLabel}
          </span>

          <span className="text-[10.5px] font-mono text-gray-500 dark:text-slate-400 truncate">
            · {skuOrCat}
          </span>
        </div>

        <span className="font-mono tabular text-[13px] font-bold text-gray-900 dark:text-white flex-shrink-0">
          {formattedExposure}
        </span>
      </div>

      {/* ── Line 2: Implied Action Description ── */}
      <p className="text-[12.5px] text-gray-700 dark:text-slate-300 line-clamp-2 font-sans leading-snug">
        {description}
      </p>

      {/* ── Line 3: Buttons Row (Always bottom-right, same order) ── */}
      <div className="flex items-center justify-end gap-2 pt-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSimulate) onSimulate(card);
          }}
          className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-[11px] font-semibold transition-colors shadow-2xs"
        >
          Simulate
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onTakeAction) onTakeAction(card);
          }}
          className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors shadow-2xs"
        >
          Take Action
        </button>
      </div>
    </div>
  );
};

export default React.memo(InsightCard);
