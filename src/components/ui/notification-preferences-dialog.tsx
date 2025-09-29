"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, Phone } from "lucide-react";

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  serviceUpdates: boolean;
  promotionalEmails: boolean;
  emergencyAlerts: boolean;
}

export function NotificationPreferencesDialog({
  open,
  onOpenChange,
}: NotificationPreferencesDialogProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    serviceUpdates: true,
    promotionalEmails: false,
    emergencyAlerts: true,
  });

  const handleSave = () => {
    // In a real app, this would make an API call to save preferences
    console.log("Notification preferences saved:", settings);
    onOpenChange(false);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const Switch = ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Notification Preferences</DialogTitle>
              <DialogDescription>
                Choose how you want to receive notifications from us.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Communication Methods */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Communication Methods
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Label className="text-sm">Email Notifications</Label>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("emailNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <Label className="text-sm">SMS Notifications</Label>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("smsNotifications", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Notification Types
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Appointment Reminders
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get reminded about upcoming appointments
                  </p>
                </div>
                <Switch
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) =>
                    updateSetting("appointmentReminders", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Service Updates</Label>
                  <p className="text-xs text-gray-500">
                    Updates on your vehicle service progress
                  </p>
                </div>
                <Switch
                  checked={settings.serviceUpdates}
                  onCheckedChange={(checked) =>
                    updateSetting("serviceUpdates", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Promotional Emails
                  </Label>
                  <p className="text-xs text-gray-500">
                    Special offers and promotions
                  </p>
                </div>
                <Switch
                  checked={settings.promotionalEmails}
                  onCheckedChange={(checked) =>
                    updateSetting("promotionalEmails", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Emergency Alerts
                  </Label>
                  <p className="text-xs text-gray-500">
                    Critical service and safety alerts
                  </p>
                </div>
                <Switch
                  checked={settings.emergencyAlerts}
                  onCheckedChange={(checked) =>
                    updateSetting("emergencyAlerts", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
