import React, { useEffect, useMemo, useState } from 'react';
import {
  getSimulationInputs,
  computeSimulation,
  ASSUMPTION_PRESETS,
} from '../data/simulationModalData';

const SimulateModal = ({ isOpen, onClose, insight }) => {
  // Resolve the base inputs for whichever insight opened the modal.
  const baseInputs = useMemo(() => getSimulationInputs(insight), [insight]);

  // Editable assumptions (start from the insight's defaults).
  const [capturePct, setCapturePct] = useState(baseInputs.capturePct);
  const [marginPct, setMarginPct] = useState(baseInputs.marginPct);
  const [rampDays, setRampDays] = useState(baseInputs.rampDays);
  const [activePreset, setActivePreset] = useState('expected');

  // Which formula panel (if any) is open. null = closed.
  const [activeFormula, setActiveFormula] = useState(null);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Recompute everything from the current assumptions.
  const sim = useMemo(
    () => computeSimulation({ ...baseInputs, capturePct, marginPct, rampDays }),
    [baseInputs, capturePct, marginPct, rampDays]
  );

  if (!isOpen) return null;

  const applyPreset = (key) => {
    const preset = ASSUMPTION_PRESETS[key];
    if (!preset) return;
    setActivePreset(key);
    setCapturePct(preset.capturePct);
    setMarginPct(preset.marginPct);
    setRampDays(preset.rampDays);
    setActiveFormula(null);
  };

  const openFormula = (key) => setActiveFormula((prev) => (prev === key ? null : key));

  const renderInfoButton = (formulaKey) => (
    <button
      type="button"
      onClick={() => openFormula(formulaKey)}
      className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full border border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-300 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors align-middle shrink-0"
      aria-label="Show the math behind this number"
    >
      <span className="text-[9px] font-sans italic leading-none">i</span>
    </button>
  );

  const formula = activeFormula ? sim.formulas[activeFormula] : null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-[1280px] max-h-[96vh] rounded-[18px] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="px-8 pt-7 pb-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-3">
                <i className="fa-solid fa-sparkles text-[11px]" />
                {/* <span className="text-[11px] font-sans font-bold uppercase tracking-[0.18em]">
                  {baseInputs.signalLabel}
                </span> */}
              </div>
              <h2 className="text-[20px] leading-tight font-bold text-gray-900 dark:text-white font-sans max-w-[760px]">
                {baseInputs.title}
              </h2>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-[12px] font-sans whitespace-nowrap">
                {baseInputs.badge}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body (fits without scrolling) ──────────────────── */}
        <div className="flex-1 overflow-hidden px-8 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-x-8 gap-y-5">

            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-5">
              {formula ? (
                /* Formula panel (SS2) replaces the derived-number card */
                <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/40">
                    <span className="text-[12px] font-sans font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">
                      L1 · Deterministic: how this number is derived
                    </span>
                    <button
                      onClick={() => setActiveFormula(null)}
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-amber-200 dark:border-amber-800 text-gray-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                      aria-label="Close formula"
                    >
                      <i className="fa-solid fa-xmark text-[11px]" />
                    </button>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-800/40">
                    <dl className="flex flex-col">
                      <div className="flex items-start gap-6 py-2">
                        <dt className="w-40 shrink-0 text-[13px] text-gray-500 dark:text-slate-400">Formula</dt>
                        <dd className="flex-1 rounded-md border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-[13px] font-sans text-gray-800 dark:text-slate-200">
                          {formula.expression}
                        </dd>
                      </div>
                      {formula.rows.map((row) => (
                        <div key={row.label} className="flex items-center gap-6 py-2 border-t border-gray-50 dark:border-slate-800/60">
                          <dt className="w-40 shrink-0 text-[13px] text-gray-500 dark:text-slate-400">{row.label}</dt>
                          <dd className={`flex-1 text-[15px] font-bold flex items-center gap-2 ${row.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                            {row.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-sans font-bold">
                                {row.badge}
                              </span>
                            )}
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-[13px] italic text-amber-700 dark:text-amber-500">
                      {formula.footnote}
                    </p>
                  </div>
                </div>
              ) : (
                /* Contribution card (SS1) */
                <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-[#faf9f7] dark:bg-slate-800/40 p-5">
                  <p className="text-[11px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-3">
                    Contribution from capturing the gap / mo
                  </p>
                  <div className="flex items-end justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[38px] leading-none font-bold text-gray-900 dark:text-white">
                          {sim.contribution.value}
                        </span>
                        {renderInfoButton('contribution')}
                      </div>
                      <p className="mt-3 text-[12px] text-gray-500 dark:text-slate-400">
                        Range: conservative {sim.contribution.range.conservative} · expected {sim.contribution.range.expected} · optimistic {sim.contribution.range.optimistic}
                      </p>
                    </div>
                    <div className="flex items-center gap-8 shrink-0">
                      <div>
                        <div className="text-[10px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Do-nothing D90</div>
                        <div className="text-[17px] font-bold text-gray-800 dark:text-slate-200">{sim.contribution.doNothingD90}</div>
                      </div>
                      <div className="pl-8 border-l border-gray-200 dark:border-slate-700">
                        <div className="text-[10px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Do-this D90</div>
                        <div className="text-[17px] font-bold text-blue-600 dark:text-blue-400">{sim.contribution.doThisD90}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Intervention + Projection — hidden while the formula panel is open */}
              {!formula && (
                <>
                  {/* Intervention */}
                  <div>
                    <p className="text-[11px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-2">
                      Intervention
                    </p>
                    <p className="text-[14px] text-gray-700 dark:text-slate-300 leading-relaxed">
                      {sim.intervention}
                    </p>
                  </div>

                  {/* Projection table */}
                  <div>
                    <p className="text-[11px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-3">
                      30 / 60 / 90 projection: click any number for its math
                    </p>
                    <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/70 dark:bg-slate-800/60">
                          <tr>
                            <th className="px-4 py-2.5 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">Metric</th>
                            <th className="px-4 py-2.5 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider text-right">Now</th>
                            <th className="px-4 py-2.5 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider text-right">D-Nothing</th>
                            {sim.projection.cells.map((c) => (
                              <th key={c.key} className="px-4 py-2.5 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider text-right">{c.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-100 dark:border-slate-800">
                            <td className="px-4 py-3 text-[13px] font-medium text-gray-700 dark:text-slate-300">{sim.projection.metric}</td>
                            <td className="px-4 py-3 text-[13px] font-medium text-gray-400 text-right">{sim.projection.now}</td>
                            <td className="px-4 py-3 text-[13px] font-medium text-gray-400 text-right">{sim.projection.doNothing}</td>
                            {sim.projection.cells.map((c) => (
                              <td key={c.key} className="px-4 py-3 text-right align-bottom">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className="text-[13px] font-bold text-gray-900 dark:text-white">{c.value}</span>
                                  {renderInfoButton(c.key)}
                                </div>
                                <div className="mt-1.5 h-1 w-full rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.pct}%` }} />
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex flex-col gap-6">
              {/* What could go wrong */}
              <div>
                <p className="text-[11px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-3">
                  What could go wrong
                </p>
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800">
                  {baseInputs.whatCouldGoWrong.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 py-3 first:pt-0">
                      <i className="fa-solid fa-triangle-exclamation text-amber-500 text-[13px] mt-0.5 shrink-0" />
                      <p className="text-[13px] text-gray-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-gray-900 dark:text-white">{item.title}</span>: {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assumptions */}
              <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-[#faf9f7] dark:bg-slate-800/40 p-5">
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <p className="text-[11px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.14em]">
                    Assumptions
                  </p>
                  {/* <div className="flex items-center gap-2">
                    {['conservative', 'expected', 'optimistic'].map((key) => (
                      <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className={`px-3 py-1 rounded-full border text-[11px] font-medium capitalize transition-colors ${activePreset === key
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div> */}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {['conservative', 'expected', 'optimistic'].map((key) => (
                      <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className={`px-3 py-1 rounded-full border text-[11px] font-medium capitalize transition-colors ${activePreset === key
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'CAPTURE_PCT', value: capturePct, setter: setCapturePct },
                    { label: 'MARGIN_PCT', value: marginPct, setter: setMarginPct },
                    { label: 'RAMP_DAYS', value: rampDays, setter: setRampDays },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-[10px] font-sans font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.setter(e.target.value === '' ? '' : Number(e.target.value));
                          setActivePreset(null);
                        }}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg text-[15px] text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
                  <p className="text-[12px] text-gray-400 dark:text-slate-500">
                    Defaults: 10% capture · 20% margin · 90-day ramp.
                  </p>
                  <button
                    onClick={() => setActiveFormula(null)}
                    className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-sm"
                  >
                    Re-simulate
                  </button>
                </div>
              </div>
            </div>

            {/* ── MONITORING PLAN (full width) ── */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-gray-50/70 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800">
                <i className="fa-regular fa-clock text-gray-400 text-[12px]" />
                <span className="text-[11px] font-sans font-bold text-gray-500 dark:text-slate-400 uppercase tracking-[0.14em]">
                  Monitoring plan: what to watch, by when, and the tripwire that means revert
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-slate-800">
                {baseInputs.monitoring.days.map((day) => (
                  <div key={day} className="p-5">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-sans font-bold uppercase tracking-wider mb-3">
                      Day {day}
                    </span>
                    <p className="text-[13px] text-gray-800 dark:text-slate-200 mb-2">
                      <span className="font-bold">{baseInputs.monitoring.metric}</span>: {baseInputs.monitoring.detail}
                    </p>
                    <p className="text-[12px] text-red-600 dark:text-red-400 leading-relaxed">
                      <span className="font-bold">Tripwire:</span> {baseInputs.monitoring.tripwire}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Footer (dark bar) ──────────────────────────────── */}
        <div className="shrink-0 px-6 py-4 bg-[rgb(250_249_247_/_var(--tw-bg-opacity))] flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-gray-800 text-[13px] font-semibold hover:bg-slate-800 transition-colors">
            <i className="fa-solid fa-download text-[12px]" />
            Download CSV
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulateModal;
