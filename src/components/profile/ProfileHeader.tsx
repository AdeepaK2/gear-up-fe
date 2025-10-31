import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * ProfileHeader component
 * Displays page title and subtitle
 */
export const ProfileHeader = React.memo(() => {
  return (
    <Card className="bg-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary font-bold text-3xl">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProfileHeader.displayName = "ProfileHeader";
