import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import useClickOutside from '../../hooks/useClickOutside';

const MODELS = [
  { id: 'base',       label: 'Base',       locked: false },
  { id: 'pro',        label: 'Pro',        locked: true  },
  { id: 'enterprise', label: 'Enterprise', locked: true  },
];

const ModelSelector = ({ variant = 'default' }) => {
  const [open, setOpen]           = useState(false);
  const [selected, setSelected]   = useState(MODELS.find(m => !m.locked) || MODELS[0]);
  const [dropdownPos, setPos]     = useState({ bottom: 0, left: 0 });
  const triggerRef                = useRef(null);
  const dropdownRef               = useRef(null);

  useClickOutside(triggerRef, open, () => setOpen(false), dropdownRef);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 224;
      const safeLeft = Math.min(
        window.innerWidth - dropdownWidth - 8,
        Math.max(8, rect.right - dropdownWidth)
      );
      setPos({ bottom: window.innerHeight - rect.top + 8, left: safeLeft });
    }
    setOpen(v => !v);
  };

  const triggerClass = variant === 'compact'
    ? 'flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors whitespace-nowrap'
    : 'flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all';

  return (
    <div ref={triggerRef} className="relative">
      <button onClick={handleToggle} className={triggerClass}>
        <span className="text-gray-400 dark:text-slate-500 font-medium">Model</span>
        <span className="text-gray-300 dark:text-slate-600 mx-0.5">|</span>
        <span className="text-gray-700 dark:text-slate-200 font-semibold">{selected.label}</span>
        <i className="fa-solid fa-chevron-down text-[8px]"></i>
      </button>

      {open && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', bottom: dropdownPos.bottom, left: dropdownPos.left, zIndex: 99999 }}
          className="w-56 bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl py-1.5"
        >
          {/* Section label */}
          <div className="px-4 pt-1.5 pb-2">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest uppercase">Select Model</p>
          </div>

          {MODELS.map((model) => {
            const isSelected = selected.id === model.id && !model.locked;
            return (
              <div key={model.id} className="relative group">
                <button
                  onClick={() => {
                    if (!model.locked) { setSelected(model); setOpen(false); }
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100'
                      : model.locked
                      ? 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/60 cursor-default'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 cursor-pointer'
                  }`}
                >
                  <span className={`font-medium ${isSelected ? 'text-gray-900 dark:text-slate-100' : ''}`}>
                    {model.label}
                  </span>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {isSelected && (
                      <i className="fa-solid fa-check text-gray-700 dark:text-slate-300 text-[10px]"></i>
                    )}
                    {model.locked && (
                      <i className="fa-solid fa-lock text-[9px] text-gray-300 dark:text-slate-600"></i>
                    )}
                  </div>
                </button>

                {/* Locked upgrade popover — slides in from left on row hover */}
                {model.locked && (
                  <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 w-52 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-3.5 z-[10000] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 mb-1.5 leading-snug">
                      Upgrade your plan
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                      Unlock advanced features by upgrading your plan today.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ModelSelector;
