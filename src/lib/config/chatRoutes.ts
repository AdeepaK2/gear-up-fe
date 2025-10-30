/**
 * Chat route configuration
 * Centralized mapping of quick actions to route paths
 * Prevents unexpected navigation and provides whitelist for valid routes
 */

import type { QuickAction } from "@/lib/types/Chatbot";

/**
 * Route map for quick action navigation
 * null value means the action is handled internally by the chatbot
 */
export const CHAT_ROUTE_MAP: Record<QuickAction["action"], string | null> = {
  view_appointments: "/customer/appointments",
  view_services: "/services",
  request_service: "/services",
  update_profile: "/customer/profile",
  contact_support: null, // Handled internally by Chatbot
  custom: null, // Custom actions must specify their own navigation
};

/**
 * Get the route path for a given action
 * Returns null if the action should be handled internally
 */
export function getRouteForAction(
  action: QuickAction["action"]
): string | null {
  return CHAT_ROUTE_MAP[action] ?? null;
}
