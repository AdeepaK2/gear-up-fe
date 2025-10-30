import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * NotificationItem Component
 *
 * Renders a single notification with message and timestamp.
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Notification message text
 * @param {string} props.time - Time string for when notification was created
 * @returns {JSX.Element} Rendered notification item
 */
interface NotificationItemProps {
  message: string;
  time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = React.memo(
  ({ message, time }) => (
    <div className="p-4 rounded-xl border-l-4 bg-secondary/10 border-primary shadow-sm transition-all duration-200 hover:shadow-md">
      <p className="text-sm font-semibold text-gray-800">{message}</p>
      <p className="text-xs text-gray-600 mt-2">{time}</p>
    </div>
  )
);

NotificationItem.displayName = "NotificationItem";

/**
 * NotificationsList Component
 *
 * Displays a list of recent notifications with a link to view all.
 * Shows a fallback message when no notifications are available.
 *
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notification objects
 * @param {number} [props.maxItems=3] - Maximum number of notifications to display
 * @returns {JSX.Element} Rendered notifications list card
 */
interface Notification {
  id: number;
  message: string;
  type: string;
  time: string;
  urgent: boolean;
}

interface NotificationsListProps {
  notifications: Notification[];
  maxItems?: number;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  maxItems = 3,
}) => {
  const displayedNotifications = notifications.slice(0, maxItems);
  const hasNotifications = displayedNotifications.length > 0;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
        <div className="flex items-center justify-between min-h-[32px]">
          <CardTitle className="flex items-center text-white font-semibold">
            Notifications
          </CardTitle>
          <Link href="/customer/notifications">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white"
              aria-label="View all notifications"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {hasNotifications ? (
          displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              message={notification.message}
              time={notification.time}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No notifications available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
