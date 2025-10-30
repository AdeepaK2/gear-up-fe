import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Settings, Bell, LogOut, Trash2 } from "lucide-react";

interface SecuritySettingsCardProps {
  onChangePassword: () => void;
  onNotificationPreferences: () => void;
  onManageSessions: () => void;
  onDeactivateAccount: () => void;
}

/**
 * SecuritySettingsCard component
 * Displays security and account management options
 */
export const SecuritySettingsCard = React.memo<SecuritySettingsCardProps>(
  ({
    onChangePassword,
    onNotificationPreferences,
    onManageSessions,
    onDeactivateAccount,
  }) => {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between min-h-[32px]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" aria-hidden="true" />
              <CardTitle className="text-white font-semibold">
                Security Settings
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
              onClick={onChangePassword}
              aria-label="Change your password"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
              onClick={onNotificationPreferences}
              aria-label="Manage notification preferences"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              Notification Preferences
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
              onClick={onManageSessions}
              aria-label="Manage active login sessions"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Manage Login Sessions
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start bg-red-500 hover:bg-red-600 transition-all duration-200"
              onClick={onDeactivateAccount}
              aria-label="Deactivate your account"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Deactivate Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

SecuritySettingsCard.displayName = "SecuritySettingsCard";
