

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
