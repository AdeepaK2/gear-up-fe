import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * ServiceProgressBadge - Displays the progress status of an accepted service.
 * 
 * @description Shows progress state with appropriate styling. Only renders
 * for accepted services. Memoized to prevent unnecessary re-renders.
 * 
 * @param {string} status - Service status (only shows for "accepted")
 * @param {ServiceProgress} progress - Current progress state
 */

export type ServiceProgress = "not-started" | "in-progress" | "completed";

interface ServiceProgressBadgeProps {
  status: string;
  progress: ServiceProgress | undefined;
}

// Static configuration outside component for performance
const PROGRESS_CONFIG = {
  "not-started": {
    label: "Not Started",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-700 border-green-200",
  },
} as const;

const ServiceProgressBadge: React.FC<ServiceProgressBadgeProps> = React.memo(
  ({ status, progress }) => {
    // Only show progress for accepted services
    if (status !== "accepted") return null;

    const config = PROGRESS_CONFIG[progress || "not-started"];

    return (
      <Badge
        variant="outline"
        className={`${config.color} border-2 font-medium`}
        aria-label={`Service progress: ${config.label}`}
      >
        {config.label}
      </Badge>
    );
  }
);

ServiceProgressBadge.displayName = "ServiceProgressBadge";

export default ServiceProgressBadge;
