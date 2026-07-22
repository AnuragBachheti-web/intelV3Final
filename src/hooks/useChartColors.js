import { useState, useEffect } from 'react';

/**
 * Returns chart chrome colors that adapt to the current dark/light mode.
 * Uses a MutationObserver on <html class="dark"> so updates are instant.
 *
 * Usage:
 *   const { gridStroke, axisColor } = useChartColors();
 *   <CartesianGrid stroke={gridStroke} />
 *   <XAxis tick={{ fill: axisColor }} />
 *   <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} />
 */
export function useChartColors() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return {
    gridStroke:    isDark ? '#334155' : '#e2e8f0',  // slate-700 / slate-200
    axisColor:     isDark ? '#94a3b8' : '#64748b',  // slate-400 / slate-500
    tooltipBg:     isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText:   isDark ? '#f1f5f9' : '#0f172a',
  };
}
