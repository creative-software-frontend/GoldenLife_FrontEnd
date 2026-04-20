/**
 * Invoice Formatter Utilities
 * Helper functions for formatting invoice data
 */

/**
 * Format currency in BDT (Bangladeshi Taka)
 * @param amount - The amount to format (number or string)
 * @returns Formatted string with ৳ symbol and 2 decimal places
 */
export const formatBDT = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '৳0.00';
  return `৳${num.toFixed(2)}`;
};

/**
 * Format date to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "April 7, 2026")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate subtotal from products array
 * @param products - Array of products with subtotal field
 * @returns Total subtotal amount
 */
export const calculateSubtotal = (products: Array<{ subtotal: string | number }>): number => {
  if (!products || products.length === 0) return 0;
  return products.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
};

/**
 * Format address safely, handling edge cases
 * @param address - The address string or undefined
 * @returns Formatted address or default message
 */
export const formatAddress = (address: string | undefined): string => {
  if (!address) return 'Not provided';
  if (!isNaN(Number(address))) {
    return 'Address not available';
  }
  return address;
};

/**
 * Get current date and time formatted for print timestamp
 * @returns Formatted datetime string (e.g., "April 7, 2026 10:30 AM")
 */
export const getCurrentDateTime = (): string => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
