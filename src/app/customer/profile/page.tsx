"use client";

import { useState, useCallback } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ChangePasswordDialog } from "@/components/ui/change-password-dialog";
import { NotificationPreferencesDialog } from "@/components/ui/notification-preferences-dialog";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoCard } from "@/components/profile/BasicInfoCard";
import { SecuritySettingsCard } from "@/components/profile/SecuritySettingsCard";
import { SupportHelpCard } from "@/components/profile/SupportHelpCard";

interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  nic?: string;
  gender?: string;
  dateOfBirth?: string;
  address: string;
  profilePicture?: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  // Mock data - in a real app, this would come from an API or state management
  const [profile, setProfile] = useState<CustomerProfile>({
    id: "1",
    fullName: "John Doe",
    email: "john.doe@email.com",
    mobile: "+1 (555) 123-4567",
    nic: "123456789V",
    gender: "Male",
    dateOfBirth: "1990-05-15",
    address: "123 Main Street, City, State 12345",
    profilePicture: "/api/placeholder/150/150",
  });

  // Stable handlers using useCallback
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const saveProfile = useCallback((updatedProfile: CustomerProfile) => {
    // In a real app, this would make an API call
    setProfile(updatedProfile);
    setIsEditing(false);
  }, []);

  const handleProfileChange = useCallback((updatedProfile: CustomerProfile) => {
    setProfile(updatedProfile);
  }, []);

  const deactivateAccount = useCallback(() => {
    setShowDeactivateConfirm(true);
  }, []);

  const confirmDeactivateAccount = useCallback(() => {
    // In a real app, this would make an API call to deactivate the account
    // Redirect to login or homepage
    setShowDeactivateConfirm(false);
  }, []);

  const openPasswordDialog = useCallback(() => {
    setShowPasswordDialog(true);
  }, []);

  const openNotificationDialog = useCallback(() => {
    setShowNotificationDialog(true);
  }, []);

  const manageLoginSessions = useCallback(() => {
    // Future implementation
  }, []);

  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          <BasicInfoCard
            profile={profile}
            isEditing={isEditing}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onSaveProfile={saveProfile}
            onProfileChange={handleProfileChange}
          />
        </div>

        {/* Right Column - Settings & Support */}
        <div className="space-y-6">
          <SecuritySettingsCard
            onChangePassword={openPasswordDialog}
            onNotificationPreferences={openNotificationDialog}
            onManageSessions={manageLoginSessions}
            onDeactivateAccount={deactivateAccount}
          />

          <SupportHelpCard />
        </div>
      </div>

      {/* Dialogs */}
      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />

      <NotificationPreferencesDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      />

      <ConfirmationDialog
        open={showDeactivateConfirm}
        onOpenChange={setShowDeactivateConfirm}
        title="Deactivate Account"
        description="Are you sure you want to deactivate your account? You will lose access to all your data and this action cannot be undone."
        confirmText="Deactivate Account"
        variant="destructive"
        onConfirm={confirmDeactivateAccount}
      />
    </div>
  );
}
