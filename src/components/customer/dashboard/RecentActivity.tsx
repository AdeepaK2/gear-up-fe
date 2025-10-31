import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

/**
 * ActivityItem Component
 *
 * Renders a single activity entry with icon, action, description, and timestamp.
 *
 * @param {Object} props - Component props
 * @param {React.ElementType} props.icon - Icon component representing the activity type
 * @param {string} props.action - Main action label
 * @param {string} props.description - Detailed description of the activity
 * @param {string} props.time - Time string for when activity occurred
 * @returns {JSX.Element} Rendered activity item
 */
interface ActivityItemProps {
  icon: React.ElementType;
  action: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = React.memo(
  ({ icon: Icon, action, description, time }) => (
    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md">
      <div className="flex-shrink-0">
        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900">{action}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-2">{time}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </div>
  )
);

ActivityItem.displayName = "ActivityItem";

/**
 * RecentActivity Component
 *
 * Displays a chronological list of recent customer activities.
 * Shows a fallback message when no activities are available.
 *
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects
 * @returns {JSX.Element} Rendered recent activity card
 */
interface Activity {
  id: number;
  action: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const hasActivities = activities.length > 0;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
        <div className="flex items-center justify-between min-h-[32px]">
          <CardTitle className="flex items-center text-white font-semibold">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {hasActivities ? (
            activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                icon={activity.icon}
                action={activity.action}
                description={activity.description}
                time={activity.time}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
