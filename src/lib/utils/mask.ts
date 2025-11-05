/**
 * Data masking utilities for sensitive information (PII)
 * Provides functions to mask or partially hide sensitive data
 */

/**
 * Mask NIC/National ID number
 * Shows first 5 and last character, masks middle
 * Example: 123456789V -> 12345****V
 */
export function maskNIC(nic: string): string {
  if (!nic || nic.length < 7) {
    return nic;
  }

  const firstPart = nic.substring(0, 5);
  const lastChar = nic.substring(nic.length - 1);
  const maskedMiddle = "*".repeat(nic.length - 6);

  return `${firstPart}${maskedMiddle}${lastChar}`;
}

/**
 * Mask email address
 * Shows first 3 chars and domain, masks the rest
 * Example: john.doe@example.com -> joh*****@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return email;
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 3) {
    return `${localPart[0]}***@${domain}`;
  }

  const visiblePart = localPart.substring(0, 3);
  const maskedPart = "*".repeat(Math.min(localPart.length - 3, 5));

  return `${visiblePart}${maskedPart}@${domain}`;
}

/**
 * Mask mobile number
 * Shows first 3 and last 2 digits, masks middle
 * Example: +94771234567 -> +947*****67
 */
export function maskMobile(mobile: string): string {
  if (!mobile || mobile.length < 6) {
    return mobile;
  }

  const cleaned = mobile.replace(/\s/g, "");
  const prefix = cleaned.startsWith("+") ? "+" : "";
  const digits = cleaned.replace(/\+/g, "");

  if (digits.length < 6) {
    return mobile;
  }

  const firstPart = digits.substring(0, 3);
  const lastPart = digits.substring(digits.length - 2);
  const maskedMiddle = "*".repeat(Math.min(digits.length - 5, 5));

  return `${prefix}${firstPart}${maskedMiddle}${lastPart}`;
}
