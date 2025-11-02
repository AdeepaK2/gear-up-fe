"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { employeeService } from '@/lib/services/employeeService';
import type { Employee } from '@/lib/types/Employee';
import { Button } from '@/components/ui/button';

export default function EmployeeProfile() {
  const [tab, setTab] = useState<"profile" | "security">("profile");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  // Profile data state
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
  });

  // Load current employee data on component mount
  useEffect(() => {
    loadCurrentEmployee();
  }, []);

  const loadCurrentEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentEmployee = await employeeService.getCurrentEmployee();
      setEmployee(currentEmployee);
      setFormData({
        name: currentEmployee.name || '',
        email: currentEmployee.email || '',
        specialization: currentEmployee.specialization || '',
      });
    } catch (err) {
      console.error('Failed to load employee profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Only send changed fields
      const updateData: any = {};
      if (formData.name !== employee.name) updateData.name = formData.name;
      if (formData.specialization !== employee.specialization) updateData.specialization = formData.specialization;

      if (Object.keys(updateData).length === 0) {
        setSuccessMessage('No changes to save');
        return;
      }

      const updatedEmployee = await employeeService.updateEmployee(employee.employeeId, updateData);
      setEmployee(updatedEmployee);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  return (
    <div className="container space-y-8 p-6 h-full">
      <h1 className="text-3xl font-bold mb-8 text-primary">Employee Settings</h1>
      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-8 py-2 font-medium border-b-2 focus:outline-none ${tab === "profile"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
            }`}
          onClick={() => setTab("profile")}
          type="button"
        >
          Profile
        </button>
        <button
          className={`px-8 py-2 font-medium border-b-2 focus:outline-none ${tab === "security"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
            }`}
          onClick={() => setTab("security")}
          type="button"
        >
          Security
        </button>
      </div>
      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading profile...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadCurrentEmployee}>Retry</Button>
        </div>
      ) : tab === "profile" && (
        <div className="flex gap-12 items-start">
          <form onSubmit={handleFormSubmit} className="max-w-xl flex-1">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full border-secondary border-2 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                type="text"
                autoComplete="off"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="w-full border-secondary border-2 rounded-full px-4 py-2 bg-gray-100 cursor-not-allowed"
                type="email"
                autoComplete="off"
                value={formData.email}
                disabled
                title="Email cannot be changed"
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="specialization">
                Specialization
              </label>
              <input
                id="specialization"
                className="w-full border-secondary border-2 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                type="text"
                autoComplete="off"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                placeholder="e.g., Engine Repair, Brake Systems, etc."
              />
            </div>
            {employee && (
              <div className="mb-12 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-base mb-2">Employment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Employee ID:</span> {employee.employeeId}
                  </div>
                  <div>
                    <span className="font-medium">Hire Date:</span> {new Date(employee.hireDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(employee.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(employee.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-secondary text-white rounded-full px-6 py-2 font-medium shadow transition-colors duration-200"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
          <div className="flex-shrink-0">
            <Image
              src="/carsettings.jpg"
              alt="Car Settings"
              width={550}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
      {tab === "security" && (
        <div className="flex gap-12 items-start">
          <form className="max-w-xl flex-1">
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  className="w-full border-secondary border-2 rounded-full px-4 py-2 pr-12 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="off"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                {(passwordFocused || passwordValue) && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  className="w-full border-secondary border-2 rounded-full px-4 py-2 pr-12 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  type={newPasswordVisible ? "text" : "password"}
                  autoComplete="off"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
                />
                {(newPasswordFocused || newPasswordValue) && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  >
                    {newPasswordVisible ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="mb-12">
              <label className="block mb-2 font-medium text-base" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  className="w-full border-secondary border-2 rounded-full px-4 py-2 pr-12 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  type={confirmPasswordVisible ? "text" : "password"}
                  autoComplete="off"
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                {(confirmPasswordFocused || confirmPasswordValue) && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white rounded-full px-6 py-2 font-medium shadow transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
          <div className="flex-shrink-0">
            <Image
              src="/carsettings.jpg"
              alt="Car Settings"
              width={550}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
