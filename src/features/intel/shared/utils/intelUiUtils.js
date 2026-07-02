// ─── Pure presentation helpers for the Intel (AI View) page's Insights panel ───

export const getPriorityDotClass = (type) => {
  if (type === 'CRITICAL') return 'bg-red-500';
  if (['HIGH', 'OPPORTUNITY', 'ALERT', 'REVIEW'].includes(type)) return 'bg-amber-400';
  if (type === 'MARKET') return 'bg-purple-500';
  return 'bg-blue-500';
};

export const getStepPriority = (type) => {
  if (type === 'CRITICAL' || type === 'HIGH') return 'High';
  if (type === 'OPPORTUNITY' || type === 'INSIGHT') return 'Medium';
  return 'Low';
};

export const getInsightKeyMetrics = (block, idx) => {
  const type = block.type;
  const riskLevel = (type === 'CRITICAL' || type === 'ALERT') ? 'High' : (type === 'REVIEW' || type === 'MARKET') ? 'Medium' : 'Low';
  const riskColor = riskLevel === 'High' ? 'text-red-600 dark:text-red-400' : riskLevel === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400';
  const revenues = ['+$12,400', '+$8,200', '+$15,600', '+$6,800', '+$9,500', '+$11,200', '+$7,400'];
  const sensitivities = ['< 24h', '< 48h', '< 72h', '2 days', '3 days', '< 24h', '< 48h'];
  const confidences = ['94%', '87%', '91%', '83%', '96%', '88%', '92%'];
  const tsColor = riskLevel === 'High' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400';
  return [
    { label: 'Risk Level',         value: riskLevel,                       color: riskColor },
    { label: 'Est. Revenue Saved', value: revenues[idx % revenues.length],  color: 'text-green-600 dark:text-green-400' },
    { label: 'Time Sensitivity',   value: sensitivities[idx % sensitivities.length], color: tsColor },
    { label: 'Confidence',         value: confidences[idx % confidences.length],     color: 'text-blue-600 dark:text-blue-400' },
  ];
};
