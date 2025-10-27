import { ProjectStatus } from "@/lib/types/Project";
import {
  Clock,
  CheckCircle,
  Activity,
  X,
  Settings,
  type LucideIcon,
} from "lucide-react";

/**
 * Configuration for project status display.
 *
 * @description Centralized status configuration to avoid inline conditionals.
 * Maps each status to its display properties (label, colors).
 */

export interface ProjectStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  iconName: "clock" | "check-circle" | "settings" | "x" | "activity";
}

export const projectStatusConfig: Record<ProjectStatus, ProjectStatusConfig> = {
  "waiting-confirmation": {
    label: "Waiting for Confirmation",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-300",
    iconName: "clock",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-primary",
    bgColor: "bg-primary/20 border-primary/50",
    iconName: "check-circle",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-primary",
    bgColor: "bg-primary/30 border-primary/60",
    iconName: "settings",
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    iconName: "check-circle",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    iconName: "x",
  },
};

/**
 * Get the Lucide icon component for a given project status
 * @param status - The project status
 * @returns The corresponding Lucide icon component
 */
export function getStatusIcon(status: ProjectStatus): LucideIcon {
  const iconMap: Record<ProjectStatus, LucideIcon> = {
    "waiting-confirmation": Clock,
    confirmed: CheckCircle,
    "in-progress": Activity,
    completed: CheckCircle,
    cancelled: X,
  };

  return iconMap[status] || Clock;
}
