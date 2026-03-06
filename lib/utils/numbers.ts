/**
 * Helper to parse Brazilian formatted numbers (e.g., "1.234,56" or "1234,56")
 * to a standard JavaScript number.
 */
export const parseNum = (val: string): number => {
  if (!val) return 0;
  const normalized = val.replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized) || 0;
};

/**
 * Helper to format numbers to Brazilian standard (e.g., 1234.56 to "1.234,56").
 */
export const formatNum = (val: number, decimals: number = 2): string => {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
};

/**
 * Helper to display empty if zero or near zero, otherwise format.
 */
export const displayValue = (val: number, decimals: number = 2): string => {
  if (val === undefined || val === null || isNaN(val)) return '';
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  if (rounded === 0) return '';
  return formatNum(val, decimals);
};
