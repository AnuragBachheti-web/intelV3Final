import React, { useMemo, useRef, useEffect, useState } from 'react';

/**
 * Individual Business Health Metric Card Column (Master Prompt v6)
 * 
 * Card Tint Backgrounds:
 * - Positive trend: Pale green tint (bg-emerald-50/70)
 * - Flat / neutral: Pale grey background (bg-gray-50/60)
 * - Concerning negative: Muted pale rust tint (bg-amber-50/60)
 */
const KpiMetricColumn = ({ label, valueText, deltaText, isPositive, rawValue, isLast }) => {
  const prevValueRef = useRef(rawValue);
  const [isDiffed, setIsDiffed] = useState(false);

  useEffect(() => {
    if (prevValueRef.current !== undefined && prevValueRef.current !== rawValue) {
      setIsDiffed(true);
      const timer = setTimeout(() => setIsDiffed(false), 1200);
      prevValueRef.current = rawValue;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = rawValue;
  }, [rawValue]);

  // Card Tint Styling based on Trend Direction
  const cardTintStyle = isPositive
    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
    : deltaText && deltaText !== '0%'
    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40'
    : 'bg-gray-50/60 dark:bg-slate-900/80 border-ws-line dark:border-slate-800';

  return (
    <div className={`p-4 sm:p-4.5 rounded-xl border flex flex-col justify-between h-full transition-all duration-300 ${cardTintStyle} ${
      isDiffed ? 'ring-2 ring-emerald-500/40' : ''
    }`}>
      <span className="label-caps block text-[10px] font-semibold text-ws-muted dark:text-slate-400 truncate" title={label}>
        {label}
      </span>

      <div className="mt-2.5 flex items-baseline justify-between gap-1.5 flex-wrap sm:flex-nowrap">
        <strong className="font-sans tabular text-[20px] sm:text-[22px] font-bold text-ws-ink dark:text-white leading-none tracking-tight whitespace-nowrap">
          {valueText}
        </strong>

        {deltaText && (
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono tabular text-[10.5px] font-semibold whitespace-nowrap ${
            isPositive
              ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-amber-100/80 text-[#99401F] dark:bg-amber-950/60 dark:text-amber-300'
          }`}>
            <span aria-hidden="true">{isPositive ? '↑' : '↓'}</span>
            <span>{deltaText}</span>
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Business Health — 5 Boxed Cards with Tint Styling (Master Prompt v6)
 */
const KpiRibbon = ({ metrics = [], isLoading = false }) => {
  const formattedMetrics = useMemo(() => {
    if (!metrics || !Array.isArray(metrics)) return [];

    const formatValue = (val, format) => {
      if (val === undefined || val === null) return '—';
      if (format === 'currency') {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
        return `₹${val.toFixed(0)}`;
      }
      if (format === 'percent') return `${val}%`;
      if (format === 'days') return `${val}d`;
      if (format === 'x') return `${val}x`;
      return val.toLocaleString();
    };

    return metrics.slice(0, 5).map(m => ({
      id: m.id || m.label,
      label: m.label,
      rawValue: m.value,
      valueText: formatValue(m.value, m.format),
      deltaText: m.deltaPct !== undefined && m.deltaPct !== null
        ? `${Math.abs(m.deltaPct)}%`
        : '',
      isPositive: m.isPositive !== undefined ? m.isPositive : (m.deltaPct >= 0)
    }));
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-4 py-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="mt-2.5 h-6 w-28 bg-gray-200/80 dark:bg-slate-700/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {formattedMetrics.map((m, index) => (
        <KpiMetricColumn
          key={m.id}
          label={m.label}
          valueText={m.valueText}
          deltaText={m.deltaText}
          isPositive={m.isPositive}
          rawValue={m.rawValue}
          isLast={index === formattedMetrics.length - 1}
        />
      ))}
    </div>
  );
};

const areMetricsEqual = (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (!prevProps.metrics && !nextProps.metrics) return true;
  if (!prevProps.metrics || !nextProps.metrics) return false;
  if (prevProps.metrics.length !== nextProps.metrics.length) return false;

  return prevProps.metrics.every((m, i) => {
    const next = nextProps.metrics[i];
    return (
      m.value === next.value &&
      m.deltaPct === next.deltaPct &&
      m.label === next.label &&
      m.id === next.id
    );
  });
};

export default React.memo(KpiRibbon, areMetricsEqual);
