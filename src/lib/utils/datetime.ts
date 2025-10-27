/**
 * DateTime utility functions for appointment time handling.
 *
 * @description Provides pure functions for time comparison and validation.
 * Uses minutes-based arithmetic to avoid string comparison pitfalls.
 */

/**
 * Converts a time string in "HH:mm" format to total minutes since midnight.
 *
 * @param time - Time string in "HH:mm" format (e.g., "14:30")
 * @returns Total minutes since midnight (e.g., 870 for "14:30")
 * @throws Error if time format is invalid
 *
 * @example
 * toMinutes("14:30") // returns 870
 * toMinutes("09:00") // returns 540
 */
export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return hours * 60 + minutes;
}

/**
 * Validates that start time is before end time.
 *
 * @param startTime - Start time in "HH:mm" format
 * @param endTime - End time in "HH:mm" format
 * @returns true if start is before end, false otherwise
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  try {
    return toMinutes(startTime) < toMinutes(endTime);
  } catch {
    return false;
  }
}

/**
 * Checks if a given date string is today or in the future.
 *
 * @param dateString - Date in "YYYY-MM-DD" format
 * @returns true if date is today or future, false if past
 */
export function isTodayOrFuture(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(dateString);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate >= today;
}

/**
 * Formats a date string for display.
 *
 * @param dateString - Date in "YYYY-MM-DD" format
 * @returns Formatted date string (e.g., "October 15, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a time string for display.
 *
 * @param timeString - Time in "HH:mm" format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Formats an ISO date string for display in Sri Lankan locale.
 * 
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string (e.g., "15/10/2025")
 * 
 * @example
 * formatDateLK("2025-10-15T10:00:00Z") // "15/10/2025"
 */
export function formatDateLK(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
