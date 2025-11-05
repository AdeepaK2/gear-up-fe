"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ChangePasswordDialog } from "@/components/ui/change-password-dialog";
import { NotificationPreferencesDialog } from "@/components/ui/notification-preferences-dialog";
import {
  User,
  Shield,
  HelpCircle,
  Edit3,
  Camera,
  Settings,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Save,
  X,
  Bell,
  LogOut,
  ExternalLink,
  Trash2,
} from "lucide-react";

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

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    setIsEditing(false);
  };

  const handleDeactivateAccount = () => {
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivateAccount = () => {
    // In a real app, this would make an API call to deactivate the account
    console.log("Account deactivated");
    // Redirect to login or homepage
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, profilePicture: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-white/80 mt-1">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
              <div className="flex items-center justify-between min-h-[32px]">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-white" />
                  <CardTitle className="text-white font-semibold">Basic Information</CardTitle>
                </div>
                <CardAction>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 hover:text-white"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleSaveProfile}
                        className="bg-white text-primary hover:bg-white/90"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 hover:text-white"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardAction>
              </div>
            </CardHeader>
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <div className="md:col-span-2 flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                      {profile.profilePicture ? (
                        <img
                          src={profile.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profile.fullName}
                    </h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900">{profile.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{profile.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  {isEditing ? (
                    <Input
                      id="mobile"
                      value={profile.mobile}
                      onChange={(e) =>
                        setProfile({ ...profile, mobile: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{profile.mobile}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nic">NIC / National ID</Label>
                  {isEditing ? (
                    <Input
                      id="nic"
                      value={profile.nic || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, nic: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {profile.nic || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <select
                      id="gender"
                      value={profile.gender || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                      className="w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.gender || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, dateOfBirth: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <textarea
                      id="address"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span className="text-gray-900">{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security & Account Settings */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
              <div className="flex items-center justify-between min-h-[32px]">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-white" />
                  <CardTitle className="text-white font-semibold">Security Settings</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <Settings className="w-4 h-4" />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  onClick={() => setShowNotificationDialog(true)}
                >
                  <Bell className="w-4 h-4" />
                  Notification Preferences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Manage Login Sessions
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start bg-red-500 hover:bg-red-600 transition-all duration-200"
                  onClick={handleDeactivateAccount}
                >
                  <Trash2 className="w-4 h-4" />
                  Deactivate Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support & Feedback */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
              <div className="flex items-center justify-between min-h-[32px]">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-white" />
                  <CardTitle className="text-white font-semibold">Support & Help</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
                  onClick={() => window.open("tel:+1-555-SUPPORT", "_self")}
                >
                  <Phone className="w-4 h-4" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
                  onClick={() => window.open("/help", "_blank")}
                >
                  <HelpCircle className="w-4 h-4" />
                  Help Center & FAQs
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200"
                  onClick={() => window.open("/contact", "_blank")}
                >
                  <Mail className="w-4 h-4" />
                  Submit Feedback
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}
