import { toMinutes } from "./datetime";

/**
 * Appointment utility functions for business logic validation.
 *
 * @description Provides pure functions for appointment scheduling rules,
 * overlap detection, and consultation type labeling.
 */

export type ConsultationType =
  | "GENERAL_CHECKUP"
  | "SPECIFIC_ISSUE"
  | "MAINTENANCE_ADVICE"
  | "PERFORMANCE_ISSUE"
  | "SAFETY_CONCERN"
  | "OTHER";

/**
 * Map of consultation types to their display labels.
 * Using a const object instead of switch statement for better maintainability.
 */
const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
  "GENERAL_CHECKUP": "General Vehicle Checkup",
  "SPECIFIC_ISSUE": "Specific Issue Consultation",
  "MAINTENANCE_ADVICE": "Maintenance Advice",
  "PERFORMANCE_ISSUE": "Performance Issue",
  "SAFETY_CONCERN": "Safety Concern",
  "OTHER": "Other Consultation",
};

/**
 * Returns the human-readable label for a consultation type.
 *
 * @param type - The consultation type enum value
 * @returns Display label for the consultation type
 *
 * @example
 * getConsultationLabel("general-checkup") // "General Vehicle Checkup"
 */
export function getConsultationLabel(type: ConsultationType): string {
  return CONSULTATION_TYPE_LABELS[type] || "General Consultation";
}

/**
 * Determines if two time ranges overlap on the same date.
 *
 * @description Uses minute-based arithmetic for precise overlap detection.
 * Two ranges overlap if they share any moment in time (inclusive at start, exclusive at end).
 *
 * @param aStart - Start time of range A in "HH:mm" format
 * @param aEnd - End time of range A in "HH:mm" format
 * @param bStart - Start time of range B in "HH:mm" format
 * @param bEnd - End time of range B in "HH:mm" format
 * @returns true if the ranges overlap, false otherwise
 *
 * @example
 * timeRangesOverlap("09:00", "10:00", "09:30", "10:30") // true
 * timeRangesOverlap("09:00", "10:00", "10:00", "11:00") // false (adjacent, not overlapping)
 * timeRangesOverlap("09:00", "10:00", "08:00", "11:00") // true (B contains A)
 */
export function timeRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  try {
    const aStartMin = toMinutes(aStart);
    const aEndMin = toMinutes(aEnd);
    const bStartMin = toMinutes(bStart);
    const bEndMin = toMinutes(bEnd);

    // Two ranges [a1, a2) and [b1, b2) overlap if:
    // a1 < b2 AND b1 < a2
    return aStartMin < bEndMin && bStartMin < aEndMin;
  } catch {
    // If time parsing fails, assume no overlap (defensive)
    return false;
  }
}

/**
 * Validates appointment time range.
 *
 * @param startTime - Start time in "HH:mm" format
 * @param endTime - End time in "HH:mm" format
 * @returns Validation result with error message if invalid
 */
export function validateTimeRange(
  startTime: string,
  endTime: string
): { valid: boolean; error?: string } {
  if (!startTime || !endTime) {
    return { valid: false, error: "Both start and end times are required" };
  }

  try {
    const startMin = toMinutes(startTime);
    const endMin = toMinutes(endTime);

    if (startMin >= endMin) {
      return { valid: false, error: "End time must be after start time" };
    }

    // Optional: enforce minimum duration (e.g., 30 minutes)
    const durationMin = endMin - startMin;
    if (durationMin < 30) {
      return {
        valid: false,
        error: "Appointment must be at least 30 minutes long",
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid time format" };
  }
}
