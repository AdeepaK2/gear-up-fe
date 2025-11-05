"use client";

import { useState, useCallback, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ChangePasswordDialog } from "@/components/ui/change-password-dialog";
import { NotificationPreferencesDialog } from "@/components/ui/notification-preferences-dialog";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoCard } from "@/components/profile/BasicInfoCard";
import { SecuritySettingsCard } from "@/components/profile/SecuritySettingsCard";
import { SupportHelpCard } from "@/components/profile/SupportHelpCard";
import { customerService, type Customer } from "@/lib/services/customerService";
import { useToast } from "@/contexts/ToastContext";

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
  // Separate fields for backend
  addressLine?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const [profile, setProfile] = useState<CustomerProfile>({
    id: "",
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    addressLine: "",
    city: "",
    country: "",
    postalCode: "",
    nic: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });

  // Fetch customer profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const customerData: Customer = await customerService.getCurrentCustomerProfile();
      
      // Map backend Customer to frontend CustomerProfile
      setProfile({
        id: customerData.customerId.toString(),
        fullName: customerData.name || "",
        email: customerData.email || "",
        mobile: customerData.phoneNumber || "",
        address: `${customerData.address || ''}, ${customerData.city || ''}, ${customerData.country || ''} ${customerData.postalCode || ''}`.trim().replace(/^,\s*|,\s*$/g, '').replace(/\s+/g, ' '),
        // Store individual fields for editing
        addressLine: customerData.address || "",
        city: customerData.city || "",
        country: customerData.country || "",
        postalCode: customerData.postalCode || "",
        // These fields are not in backend yet - use empty string instead of undefined
        nic: "",
        gender: "",
        dateOfBirth: "",
        profilePicture: "",
      });
    } catch (error: any) {
      showToast("Failed to load profile: " + error.message, "error");
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stable handlers using useCallback
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const saveProfile = useCallback(async (updatedProfile: CustomerProfile) => {
    try {
      // Parse the address field - user edits it as a single textarea
      // Expected format: "address, city, country postalCode"
      let addressLine = "";
      let city = "";
      let country = "";
      let postalCode = "";

      if (updatedProfile.address) {
        // Try to parse the combined address string
        const parts = updatedProfile.address.split(',').map(p => p.trim());
        
        if (parts.length >= 1) {
          addressLine = parts[0] || "";
        }
        if (parts.length >= 2) {
          city = parts[1] || "";
        }
        if (parts.length >= 3) {
          // Last part might be "country postalCode"
          const lastPart = parts[2];
          const words = lastPart.split(' ').filter(w => w);
          if (words.length > 1) {
            // Assume last word is postal code
            postalCode = words[words.length - 1];
            country = words.slice(0, -1).join(' ');
          } else {
            // If only one word, it's the country
            country = lastPart;
          }
        }
      }

      console.log('Sending update:', {
        name: updatedProfile.fullName,
        phoneNumber: updatedProfile.mobile,
        address: addressLine,
        city: city,
        country: country,
        postalCode: postalCode,
      });

      // Send update with all fields (only include non-empty optional fields)
      const updateData: any = {
        name: updatedProfile.fullName,
        phoneNumber: updatedProfile.mobile,
      };

      // Only include optional fields if they have values
      if (addressLine) updateData.address = addressLine;
      if (city) updateData.city = city;
      if (country) updateData.country = country;
      if (postalCode) updateData.postalCode = postalCode;

      await customerService.updateCurrentCustomerProfile(updateData);
      
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
      
      // Refresh profile from backend to get latest data
      await fetchProfile();
    } catch (error: any) {
      showToast("Failed to update profile: " + error.message, "error");
      console.error('Error updating profile:', error);
    }
  }, [showToast]);

  const handleProfileChange = useCallback((updatedProfile: CustomerProfile) => {
    setProfile(updatedProfile);
  }, []);

  const deactivateAccount = useCallback(() => {
    setShowDeactivateConfirm(true);
  }, []);

  const confirmDeactivateAccount = useCallback(async () => {
    try {
      const customerData = await customerService.getCurrentCustomerProfile();
      await customerService.deactivateCustomer(customerData.customerId, "User requested deactivation");
      showToast("Account deactivated successfully", "success");
      setShowDeactivateConfirm(false);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error: any) {
      showToast("Failed to deactivate account: " + error.message, "error");
      console.error('Error deactivating account:', error);
    }
  }, [showToast]);

  const openPasswordDialog = useCallback(() => {
    setShowPasswordDialog(true);
  }, []);

  const openNotificationDialog = useCallback(() => {
    setShowNotificationDialog(true);
  }, []);

  const manageLoginSessions = useCallback(() => {
    // Future implementation
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

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
