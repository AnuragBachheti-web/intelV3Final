

export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(safeValue);
};

export const formatNumber = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatCompactNumber = (value, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

export const formatDate = (date, options = {}, locale = 'en-US') => {
  const defaultOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
};

export const formatPercentage = (value, decimals = 1, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatCompactCurrency = (val) => `$${(val / 1000).toFixed(0)}k`;

// Cuts text to the longest whole-word prefix that fits within maxChars — no
// ellipsis, no partial trailing word (unlike CSS text-overflow: ellipsis).
export const truncateAtWordBoundary = (text, maxChars = 20) => {
  if (!text || text.length <= maxChars) return text;
  const words = text.split(' ');
  let result = '';
  for (const word of words) {
    const next = result ? `${result} ${word}` : word;
    if (next.length > maxChars) break;
    result = next;
  }
  return result || text.slice(0, maxChars);
};
