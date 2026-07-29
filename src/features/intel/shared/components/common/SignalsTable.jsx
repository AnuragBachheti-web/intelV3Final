import React from 'react';
import { getSignalColumns } from './signalColumns';

const alignClass = (align) => (align === 'right' ? 'text-right' : 'text-left');

const SignalRow = React.memo(({ signal, columns, isSelected, onSelect, ctx }) => (
  <tr
    onClick={() => onSelect?.(signal)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(signal); }
    }}
    tabIndex={0}
    aria-selected={isSelected}
    className={`cursor-pointer transition-colors focus-ring ${isSelected
      ? 'bg-blue-50/70 dark:bg-blue-950/40'
      : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
      }`}
  >
    {columns.map((col) => (
      <td
        key={col.key}
        className={`px-2 sm:px-2.5 py-2.5 ${alignClass(col.align)} ${col.className || ''}`}
        onClick={col.stopRowClick ? (e) => e.stopPropagation() : undefined}
      >
        {col.render(signal, ctx)}
      </td>
    ))}
  </tr>
));

/**
 * Actions listing for the Workspace — one flat table row per signal.
 */
const SignalsTable = ({
  signals = [],
  columns,
  selectedId,
  onSelect,
  onSimulate,
  onTakeAction,
  isCollapsed = false,
  executedSignalIds = [],
}) => {
  const activeColumns = columns || getSignalColumns(isCollapsed);
  const ctx = { onSimulate, onTakeAction, executedSignalIds };

  return (
    <div className="overflow-hidden w-full">
      <table className="w-full table-fixed">
        <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
          <tr className="border-b border-gray-100 dark:border-slate-800">
            {activeColumns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-2 sm:px-2.5 py-2 text-[9.5px] font-mono font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap ${alignClass(col.align)} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
          {signals.map((signal) => (
            <SignalRow
              key={signal.id}
              signal={signal}
              columns={activeColumns}
              isSelected={selectedId === signal.id}
              onSelect={onSelect}
              ctx={ctx}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(SignalsTable);
