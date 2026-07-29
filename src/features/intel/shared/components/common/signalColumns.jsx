import React from 'react';
import { getActionCta } from '../../config/actionTypeConfig';

const exposureText = (signal) =>
  typeof signal.exposure === 'number'
    ? `₹${(signal.exposure / 100000).toFixed(1)}L`
    : (signal.exposureFormatted || '—');

const renderChannelBadge = (signal, isCollapsed) => {
  const channelRaw = (signal.sourceOwn || signal.channel || signal.marketplace || 'amazon').toLowerCase();

  if (channelRaw.includes('shopify')) {
    if (isCollapsed) {
      return (
        <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center text-xs" title="Shopify">
          <i className="fa-brands fa-shopify text-[11px]" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
        <i className="fa-brands fa-shopify text-[11px]" />
        Shopify
      </span>
    );
  }

  if (channelRaw.includes('amazon')) {
    if (isCollapsed) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 inline-flex items-center justify-center text-xs" title="Amazon">
          <i className="fa-brands fa-amazon text-[11px]" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
        <i className="fa-brands fa-amazon text-[11px]" />
        Amazon
      </span>
    );
  }

  // Walmart / Default
  if (isCollapsed) {
    return (
      <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center text-xs" title="Walmart">
        <i className="fa-solid fa-store text-[10px]" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
      <i className="fa-solid fa-store text-[10px]" />
      Walmart
    </span>
  );
};

/**
 * ── Responsive Column config for the Workspace Actions table ──
 * Dynamically adapts depending on whether the panel is in collapsed split view or full width mode.
 */
export const getSignalColumns = (isCollapsed = false) => [
  {
    key: 'action',
    header: 'Description',
    className: 'min-w-0',
    render: (signal) => (
      <div className="min-w-0 pr-2">
        <p className="text-[12px] font-semibold text-gray-900 dark:text-slate-100 truncate leading-snug" title={signal.headlineHighlight || signal.headline}>
          {signal.headlineHighlight || signal.headline || ''}
        </p>
      </div>
    ),
  },
  {
    key: 'channel',
    header: 'Channel',
    className: isCollapsed ? 'w-[70px] px-2 whitespace-nowrap align-middle text-center' : 'w-[110px] whitespace-nowrap align-middle',
    render: (signal) => renderChannelBadge(signal, isCollapsed),
  },
  {
    key: 'sku',
    header: 'SKUs',
    className: isCollapsed ? 'w-[70px] whitespace-nowrap align-middle text-center' : 'w-[75px] whitespace-nowrap align-middle text-center',
    render: (signal) => {
      const count = signal.skuCount || signal.affectedSkusCount || 1;
      return (
        <span className="text-[10px] font-sans bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium inline-block text-center">
          {count} {count === 1 ? 'SKU' : 'SKUs'}
        </span>
      );
    },
  },
  ...(!isCollapsed ? [{
    key: 'category',
    header: 'Category',
    className: 'whitespace-nowrap align-middle w-[110px] hidden md:table-cell',
    render: (signal) => (
      <span className="text-[11.5px] font-medium text-gray-600 dark:text-slate-400 truncate block max-w-[100px]">
        {signal.category || '—'}
      </span>
    ),
  }] : []),
  {
    key: 'impact',
    header: 'Impact',
    align: 'right',
    className: isCollapsed ? 'w-[62px] whitespace-nowrap align-middle text-right pr-1' : 'w-[80px] whitespace-nowrap align-middle text-right pr-2',
    render: (signal) => (
      <span className="font-sans tabular text-[12px] font-bold text-gray-900 dark:text-white">
        {exposureText(signal)}
      </span>
    ),
  },
  {
    key: 'cta',
    header: 'Actions',
    align: 'right',
    className: isCollapsed ? 'w-[105px] whitespace-nowrap align-middle text-right' : 'w-[125px] whitespace-nowrap align-middle text-right',
    stopRowClick: true,
    render: (signal, ctx) => {
      const isExecuted = ctx.executedSignalIds?.includes(signal.id);
      const cta = getActionCta({ signalType: signal.type });

      if (isExecuted) {
        return (
          <div className="flex justify-end">
            <span className={`${isCollapsed ? 'w-[96px] text-[10px] px-1.5 py-0.5' : 'w-[110px] text-[11px] px-2.5 py-1'} bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold transition-all truncate whitespace-nowrap shadow-2xs inline-flex items-center justify-center gap-1 text-center`}>
              <i className="fa-solid fa-check text-[9px]" />
              Executed
            </span>
          </div>
        );
      }

      return (
        <div className="flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); ctx.onTakeAction?.(signal); }}
            className={`${isCollapsed ? 'w-[96px] text-[10.5px] px-1.5 py-0.5' : 'w-[110px] text-[11px] px-2.5 py-1'} bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors truncate whitespace-nowrap shadow-2xs inline-block text-center`}
          >
            {cta.label || 'Take Action'}
          </button>
        </div>
      );
    },
  },
];

export const SIGNAL_COLUMNS = getSignalColumns(false);
