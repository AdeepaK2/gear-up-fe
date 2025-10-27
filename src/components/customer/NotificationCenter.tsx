import React, { useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

/**
 * NotificationCenter - Manages and displays toast notifications with auto-dismiss.
 *
 * @description Provides accessible notification display with ARIA live regions,
 * keyboard support, and automatic cleanup. Follows WCAG 2.1 guidelines for
 * non-critical messaging that doesn't require immediate user action.
 *
 * @param {Notification[]} notifications - Array of active notifications to display
 * @param {function} onRemove - Callback to remove a notification by ID
 */

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

// Static configuration outside component to avoid recreating on each render
const NOTIFICATION_CONFIG = {
  success: {
    icon: CheckCircle,
    colors: "bg-green-50 border-green-200 text-green-800",
    label: "Success",
  },
  error: {
    icon: XCircle,
    colors: "bg-red-50 border-red-200 text-red-800",
    label: "Error",
  },
  info: {
    icon: AlertCircle,
    colors: "bg-blue-50 border-blue-200 text-blue-800",
    label: "Information",
  },
} as const;

const AUTO_DISMISS_DELAY = 5000; // 5 seconds

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onRemove,
}) => {
  /**
   * Auto-dismiss notifications after delay.
   * Each notification gets its own timer to allow staggered dismissal.
   */
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, AUTO_DISMISS_DELAY);

      timers.push(timer);
    });

    // Cleanup timers on unmount or when notifications change
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, onRemove]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, notificationId: string) => {
      // Allow closing notification with Enter or Space on the close button
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRemove(notificationId);
      }
    },
    [onRemove]
  );

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) => {
        const config = NOTIFICATION_CONFIG[notification.type];
        const Icon = config.icon;

        return (
          <Card
            key={notification.id}
            className={`w-96 border-2 ${config.colors} animate-in slide-in-from-right duration-300`}
            role="alert"
            aria-labelledby={`notification-title-${notification.id}`}
            aria-describedby={`notification-message-${notification.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <h4
                    id={`notification-title-${notification.id}`}
                    className="font-semibold"
                  >
                    {notification.title}
                  </h4>
                  <p
                    id={`notification-message-${notification.id}`}
                    className="text-sm mt-1"
                  >
                    {notification.message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(notification.id)}
                  onKeyDown={(e) => handleKeyDown(e, notification.id)}
                  className="text-current hover:bg-black/10 flex-shrink-0 h-6 w-6 p-0"
                  aria-label={`Dismiss ${config.label.toLowerCase()} notification`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NotificationCenter;

/**
 * Factory function to create a notification object with a unique ID.
 *
 * @param type - The type of notification (success, error, info)
 * @param title - The notification title
 * @param message - The notification message
 * @returns A complete Notification object with generated ID
 */
export function createNotification(
  type: NotificationType,
  title: string,
  message: string
): Notification {
  // Use crypto.randomUUID if available, fallback to timestamp-based ID
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    type,
    title,
    message,
  };
}
