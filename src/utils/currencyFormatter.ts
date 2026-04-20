/**
 * Currency formatting utility for Golden Life Platform
 * All currency values should use BDT (Bangladeshi Taka)
 * 
 * Usage:
 * - formatBDT(100) => "100 BDT"
 * - formatBDT(100, { showSymbol: false }) => "100"
 * - formatBDT(100, { prefix: true }) => "BDT 100"
 * - formatBDT(100, { compact: true }) => "100৳"
 */

interface FormatBDTOptions {
  showSymbol?: boolean;      // Show "BDT" text (default: true)
  prefix?: boolean;          // Place symbol before number (default: false)
  compact?: boolean;         // Use compact format "৳" (default: false)
  decimals?: number;         // Number of decimal places (default: 2)
  showDecimals?: boolean;    // Always show decimals (default: true)
  locale?: string;           // Locale for number formatting (default: 'en-BD')
}

/**
 * Format amount as BDT currency
 */
export const formatBDT = (
  amount: number | string | undefined | null,
  options: FormatBDTOptions = {}
): string => {
  const {
    showSymbol = true,
    prefix = false,
    compact = false,
    decimals = 2,
    showDecimals = true,
    locale = 'en-BD',
  } = options;

  // Handle null, undefined, or empty values
  if (amount === undefined || amount === null || amount === '') {
    return showSymbol ? (compact ? '৳0' : '0 BDT') : '0';
  }

  // Convert to number if string
  let numericAmount: number;
  if (typeof amount === 'string') {
    // Remove any existing currency symbols and commas
    const cleaned = amount.replace(/[৳BDT\$,]/gi, '').trim();
    numericAmount = parseFloat(cleaned);
  } else {
    numericAmount = amount;
  }
  
  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return showSymbol ? (compact ? '৳0' : '0 BDT') : '0';
  }

  // Format number with locale
  const formattedNumber = showDecimals
    ? numericAmount.toFixed(decimals)
    : Math.round(numericAmount).toString();

  // Add thousand separators
  const withSeparators = Number(formattedNumber).toLocaleString(locale, {
    minimumFractionDigits: showDecimals ? decimals : 0,
    maximumFractionDigits: decimals,
  });

  // Build final string
  if (compact) {
    return `৳${withSeparators}`;
  }

  if (!showSymbol) {
    return withSeparators;
  }

  return prefix ? `BDT ${withSeparators}` : `${withSeparators} BDT`;
};

/**
 * Remove $ sign from any string and convert to BDT format
 * Useful for cleaning API responses or hardcoded strings
 */
export const cleanCurrencyString = (str: string | undefined | null): string => {
  if (!str) return formatBDT(0);
  
  // Remove $ sign and trim
  const cleaned = str.replace(/\$/g, '').trim();
  
  // Try to parse as number
  const num = parseFloat(cleaned.replace(/,/g, ''));
  
  if (!isNaN(num)) {
    return formatBDT(num);
  }
  
  // If not a number, just return cleaned string
  return cleaned;
};

/**
 * Format price range
 * Example: formatPriceRange(10, 20) => "10 - 20 BDT"
 */
export const formatPriceRange = (
  min: number | string | undefined | null,
  max: number | string | undefined | null,
  options?: FormatBDTOptions
): string => {
  const minFormatted = formatBDT(min, { ...options, showSymbol: false });
  const maxFormatted = formatBDT(max, { ...options, showSymbol: false });
  
  return `${minFormatted} - ${maxFormatted} BDT`;
};

/**
 * Format discount price with original and discounted
 * Example: formatDiscount(100, 80) => { original: "100 BDT", discounted: "80 BDT", savings: "20 BDT" }
 */
export const formatDiscount = (
  originalPrice: number | string | undefined | null,
  discountedPrice: number | string | undefined | null
) => {
  // Helper function to safely parse price
  const parsePrice = (price: number | string | undefined | null): number => {
    if (price === undefined || price === null || price === '') return 0;
    if (typeof price === 'number') return price;
    const cleaned = price.replace(/[৳BDT\$,]/gi, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const original = parsePrice(originalPrice);
  const discounted = parsePrice(discountedPrice);
  
  const savings = original - discounted;
  const percentage = original > 0 ? ((savings / original) * 100).toFixed(0) : 0;

  return {
    original: formatBDT(original),
    discounted: formatBDT(discounted),
    savings: formatBDT(savings),
    percentage: parseInt(percentage as string),
  };
};

/**
 * Extract number from currency string
 * Example: extractCurrencyNumber("$100") => 100
 * Example: extractCurrencyNumber("৳1,234.56") => 1234.56
 * Example: extractCurrencyNumber("100 BDT") => 100
 */
export const extractCurrencyNumber = (str: string | undefined | null): number => {
  if (!str || str === '') return 0;
  
  // Remove currency symbols, BDT text, commas, and spaces
  const cleaned = String(str).replace(/[৳BDT\$,]/gi, '').trim();
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? 0 : num;
};

/**
 * Legacy formatPrice function (updated to use BDT)
 * For backward compatibility with existing code
 */
export const formatPrice = (
  price: number | string | undefined | null,
  currency: string = 'BDT'
): string => {
  return formatBDT(price, { compact: currency === '৳' });
};

/**
 * Quick formatting presets
 */
export const CurrencyPresets = {
  // Full format: "1,234.56 BDT"
  full: (amount: number | string | undefined | null) => formatBDT(amount, { showSymbol: true, prefix: false }),
  
  // Compact format: "৳1,234.56"
  compact: (amount: number | string | undefined | null) => formatBDT(amount, { compact: true }),
  
  // Number only: "1,234.56"
  number: (amount: number | string | undefined | null) => formatBDT(amount, { showSymbol: false }),
  
  // Prefix format: "BDT 1,234.56"
  prefix: (amount: number | string | undefined | null) => formatBDT(amount, { prefix: true }),
  
  // No decimals: "1,235 BDT"
  noDecimals: (amount: number | string | undefined | null) => formatBDT(amount, { showDecimals: false }),
  
  // For charts/graphs (compact, no decimals)
  chart: (amount: number | string | undefined | null) => formatBDT(amount, { compact: true, showDecimals: false }),
};

// Default export
const currencyFormatter = {
  formatBDT,
  cleanCurrencyString,
  formatPriceRange,
  formatDiscount,
  extractCurrencyNumber,
  formatPrice,
  CurrencyPresets,
};

export default currencyFormatter;