/**
 * Currency formatting utilities.
 * 
 * @description Provides consistent currency formatting across the application.
 * All amounts should be formatted using these utilities to maintain consistency.
 */

/**
 * Formats an amount in Sri Lankan Rupees (LKR) with proper locale formatting.
 * 
 * @param amount - The amount to format in LKR
 * @returns Formatted currency string (e.g., "LKR 15,000.00")
 * 
 * @example
 * formatCurrencyLKR(15000) // "LKR 15,000.00"
 * formatCurrencyLKR(1234.56) // "LKR 1,234.56"
 */
export function formatCurrencyLKR(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parses a currency string back to a number.
 * Useful for form inputs or calculations.
 * 
 * @param currencyString - Currency string to parse
 * @returns The numeric value or 0 if parsing fails
 */
export function parseCurrencyLKR(currencyString: string): number {
  const cleaned = currencyString.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
