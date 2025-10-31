/**
 * Form validation utilities
 * Provides client-side validation for profile and form fields
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate full name
 * Requirements: 2-80 characters, trimmed, no excessive whitespace
 */
export function validateFullName(name: string): ValidationResult {
  const trimmed = name.trim().replace(/\s+/g, " ");

  if (trimmed.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (trimmed.length > 80) {
    return { isValid: false, error: "Name must be less than 80 characters" };
  }

  return { isValid: true };
}

/**
 * Validate email address
 * RFC 5322-compliant regex pattern
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { isValid: false, error: "Email is required" };
  }

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Validate mobile number
 * Requirements: 8-15 digits, may include + prefix
 */
export function validateMobile(mobile: string): ValidationResult {
  const cleaned = mobile.replace(/\s/g, "");
  const mobileRegex = /^\+?\d{8,15}$/;

  if (!cleaned) {
    return { isValid: false, error: "Mobile number is required" };
  }

  if (!mobileRegex.test(cleaned)) {
    return {
      isValid: false,
      error: "Mobile must be 8-15 digits (e.g., +94771234567)",
    };
  }

  return { isValid: true };
}

/**
 * Validate Sri Lankan NIC
 * Supports old format (9 digits + V/X) and new format (12 digits)
 */
export function validateNIC(nic: string): ValidationResult {
  if (!nic) {
    return { isValid: true }; // NIC is optional
  }

  const trimmed = nic.trim().toUpperCase();
  const oldFormatRegex = /^\d{9}[VX]$/;
  const newFormatRegex = /^\d{12}$/;

  if (!oldFormatRegex.test(trimmed) && !newFormatRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "NIC must be 9 digits + V/X or 12 digits",
    };
  }

  return { isValid: true };
}

/**
 * Validate date of birth
 * Requirements: Valid past date, age >= 16 years
 */
export function validateDateOfBirth(dob: string): ValidationResult {
  if (!dob) {
    return { isValid: true }; // DOB is optional
  }

  const date = new Date(dob);
  const today = new Date();

  // Check if valid date
  if (Number.isNaN(date.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  // Check if in the past
  if (date >= today) {
    return { isValid: false, error: "Date of birth must be in the past" };
  }

  // Check if age >= 16
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();

  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (actualAge < 16) {
    return { isValid: false, error: "You must be at least 16 years old" };
  }

  return { isValid: true };
}

/**
 * Validate address
 * Requirements: 5-200 characters
 */
export function validateAddress(address: string): ValidationResult {
  const trimmed = address.trim();

  if (trimmed.length < 5) {
    return { isValid: false, error: "Address must be at least 5 characters" };
  }

  if (trimmed.length > 200) {
    return {
      isValid: false,
      error: "Address must be less than 200 characters",
    };
  }

  return { isValid: true };
}

/**
 * Validate image file
 * Requirements: image/* type, <= 2MB, >= 128x128 dimensions
 */
export function validateImageFile(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      resolve({ isValid: false, error: "File must be an image" });
      return;
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      resolve({ isValid: false, error: "Image must be less than 2MB" });
      return;
    }

    // Check dimensions
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width < 128 || img.height < 128) {
        resolve({
          isValid: false,
          error: "Image must be at least 128x128 pixels",
        });
        return;
      }

      resolve({ isValid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isValid: false, error: "Failed to load image" });
    };

    img.src = url;
  });
}

/**
 * Sanitize and normalize full name
 */
export function normalizeFullName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/**
 * Sanitize and normalize email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
