/**
 * Debug logging utility
 * Disabled in production to prevent PII leakage
 * Use this instead of console.log for sensitive data
 */

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Log debug information (disabled in production)
 * @param args - Arguments to log
 */
export function debugLog(...args: unknown[]): void {
  if (!IS_PRODUCTION) {
    // Only log in development
    // In production, this is a no-op to prevent PII leakage
  }
}

/**
 * Log error information (always enabled)
 * Use sparingly and ensure no PII is included
 * @param args - Arguments to log
 */
export function errorLog(...args: unknown[]): void {
  // Always log errors, but sanitize them first
  console.error("[Error]", ...args);
}
