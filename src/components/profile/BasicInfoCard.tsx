import React, { useRef, useEffect, useState } from "react";
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
import {
  User,
  Edit3,
  Camera,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Save,
  X,
} from "lucide-react";
import {
  validateFullName,
  validateEmail,
  validateMobile,
  validateNIC,
  validateDateOfBirth,
  validateAddress,
  validateImageFile,
  normalizeFullName,
  normalizeEmail,
} from "@/lib/utils/validators";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

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

interface BasicInfoCardProps {
  profile: CustomerProfile;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveProfile: (profile: CustomerProfile) => void;
  onProfileChange: (profile: CustomerProfile) => void;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  nic?: string;
  dateOfBirth?: string;
  address?: string;
  profilePicture?: string;
}

/**
 * BasicInfoCard component
 * Displays and allows editing of user's basic information
 * Includes profile picture, personal details, and form validation
 */
export const BasicInfoCard = React.memo<BasicInfoCardProps>(
  ({
    profile,
    isEditing,
    onStartEditing,
    onCancelEditing,
    onSaveProfile,
    onProfileChange,
  }) => {
    const [errors, setErrors] = useState<FieldErrors>({});
    const [picturePreview, setPicturePreview] = useState<string | null>(null);
    const fullNameInputRef = useRef<HTMLInputElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debounce validation for better UX
    const debouncedFullName = useDebouncedValue(profile.fullName, 300);
    const debouncedMobile = useDebouncedValue(profile.mobile, 300);

    // Focus management
    useEffect(() => {
      if (isEditing && fullNameInputRef.current) {
        fullNameInputRef.current.focus();
      }
    }, [isEditing]);

    // Validate debounced fields
    useEffect(() => {
      if (isEditing) {
        const fullNameResult = validateFullName(debouncedFullName);
        setErrors((prev) => ({
          ...prev,
          fullName: fullNameResult.error,
        }));
      }
    }, [debouncedFullName, isEditing]);

    useEffect(() => {
      if (isEditing) {
        const mobileResult = validateMobile(debouncedMobile);
        setErrors((prev) => ({
          ...prev,
          mobile: mobileResult.error,
        }));
      }
    }, [debouncedMobile, isEditing]);

    // Cleanup preview URL on unmount
    useEffect(() => {
      return () => {
        if (picturePreview) {
          URL.revokeObjectURL(picturePreview);
        }
      };
    }, [picturePreview]);

    const handleFieldChange = (field: keyof CustomerProfile, value: string) => {
      onProfileChange({ ...profile, [field]: value });

      // Immediate validation for some fields
      if (field === "nic") {
        const result = validateNIC(value);
        setErrors((prev) => ({ ...prev, nic: result.error }));
      } else if (field === "dateOfBirth") {
        const result = validateDateOfBirth(value);
        setErrors((prev) => ({ ...prev, dateOfBirth: result.error }));
      } else if (field === "address") {
        const result = validateAddress(value);
        setErrors((prev) => ({ ...prev, address: result.error }));
      }
    };

    const handleProfilePictureChange = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate image
      const validationResult = await validateImageFile(file);
      if (!validationResult.isValid) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: validationResult.error,
        }));
        return;
      }

      // Clear previous error
      setErrors((prev) => ({ ...prev, profilePicture: undefined }));

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setPicturePreview(url);
      onProfileChange({ ...profile, profilePicture: url });
    };

    const handleSave = () => {
      // Validate all fields except email (read-only)
      const fullNameResult = validateFullName(profile.fullName);
      const mobileResult = validateMobile(profile.mobile);
      const nicResult = validateNIC(profile.nic || "");
      const dobResult = validateDateOfBirth(profile.dateOfBirth || "");
      const addressResult = validateAddress(profile.address);

      const newErrors: FieldErrors = {
        fullName: fullNameResult.error,
        mobile: mobileResult.error,
        nic: nicResult.error,
        dateOfBirth: dobResult.error,
        address: addressResult.error,
      };

      setErrors(newErrors);

      // Check if form is valid
      const hasErrors = Object.values(newErrors).some((error) => error);
      if (hasErrors) {
        return;
      }

      // Normalize data before saving (email is not normalized since it's read-only)
      const normalizedProfile = {
        ...profile,
        fullName: normalizeFullName(profile.fullName),
        nic: profile.nic?.trim().toUpperCase(),
      };

      onSaveProfile(normalizedProfile);

      // Return focus to edit button
      setTimeout(() => {
        editButtonRef.current?.focus();
      }, 100);
    };

    const handleCancel = () => {
      setErrors({});
      onCancelEditing();

      // Return focus to edit button
      setTimeout(() => {
        editButtonRef.current?.focus();
      }, 100);
    };

    const isFormValid = !Object.values(errors).some((error) => error);
    const displayPicture = picturePreview || profile.profilePicture;

    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between min-h-[32px]">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" aria-hidden="true" />
              <CardTitle className="text-white font-semibold">
                Basic Information
              </CardTitle>
            </div>
            <CardAction>
              {!isEditing ? (
                <Button
                  ref={editButtonRef}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white"
                  onClick={onStartEditing}
                  aria-label="Edit profile information"
                >
                  <Edit3 className="w-4 h-4" aria-hidden="true" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className="bg-white text-primary hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Save profile changes"
                  >
                    <Save className="w-4 h-4" aria-hidden="true" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 hover:text-white"
                    onClick={handleCancel}
                    aria-label="Cancel editing"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div className="md:col-span-2 flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  {displayPicture ? (
                    <img
                      src={displayPicture}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User
                        className="w-10 h-10 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                    aria-label="Upload profile picture"
                  >
                    <Camera className="w-4 h-4 text-white" aria-hidden="true" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                      aria-label="Choose profile picture file"
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                <p className="text-gray-600">{profile.email}</p>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    PNG/JPG, max 2MB, min 128×128px
                  </p>
                )}
                {errors.profilePicture && (
                  <p className="text-xs text-red-600 mt-1" role="alert">
                    {errors.profilePicture}
                  </p>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              {isEditing ? (
                <>
                  <Input
                    ref={fullNameInputRef}
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) =>
                      handleFieldChange("fullName", e.target.value)
                    }
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="text-xs text-red-600"
                      role="alert"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-900">{profile.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span className="text-gray-900">{profile.email}</span>
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500">
                  Email cannot be changed
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              {isEditing ? (
                <>
                  <Input
                    id="mobile"
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) =>
                      handleFieldChange("mobile", e.target.value)
                    }
                    placeholder="+94771234567"
                    aria-invalid={!!errors.mobile}
                    aria-describedby={
                      errors.mobile ? "mobile-error" : undefined
                    }
                  />
                  {errors.mobile && (
                    <p
                      id="mobile-error"
                      className="text-xs text-red-600"
                      role="alert"
                    >
                      {errors.mobile}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  <span className="text-gray-900">{profile.mobile}</span>
                </div>
              )}
            </div>

            {/* NIC */}
            <div className="space-y-2">
              <Label htmlFor="nic">NIC / National ID</Label>
              {isEditing ? (
                <>
                  <Input
                    id="nic"
                    value={profile.nic || ""}
                    onChange={(e) => handleFieldChange("nic", e.target.value)}
                    placeholder="123456789V or 200012345678"
                    aria-invalid={!!errors.nic}
                    aria-describedby={errors.nic ? "nic-error" : undefined}
                  />
                  {errors.nic ? (
                    <p
                      id="nic-error"
                      className="text-xs text-red-600"
                      role="alert"
                    >
                      {errors.nic}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Format: 9 digits + V/X or 12 digits
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <IdCard
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900">
                    {profile.nic || "Not provided"}
                  </span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <select
                  id="gender"
                  value={profile.gender || ""}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                  className="w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Select gender"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {profile.gender || "Not provided"}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth || ""}
                    onChange={(e) =>
                      handleFieldChange("dateOfBirth", e.target.value)
                    }
                    aria-invalid={!!errors.dateOfBirth}
                    aria-describedby={
                      errors.dateOfBirth ? "dob-error" : undefined
                    }
                  />
                  {errors.dateOfBirth ? (
                    <p
                      id="dob-error"
                      className="text-xs text-red-600"
                      role="alert"
                    >
                      {errors.dateOfBirth}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Must be 16+ years old
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-900">
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <>
                  <textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) =>
                      handleFieldChange("address", e.target.value)
                    }
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-invalid={!!errors.address}
                    aria-describedby={
                      errors.address ? "address-error" : undefined
                    }
                  />
                  {errors.address && (
                    <p
                      id="address-error"
                      className="text-xs text-red-600"
                      role="alert"
                    >
                      {errors.address}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-2">
                  <MapPin
                    className="w-4 h-4 text-gray-500 mt-1"
                    aria-hidden="true"
                  />
                  <span className="text-gray-900">{profile.address}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

BasicInfoCard.displayName = "BasicInfoCard";
