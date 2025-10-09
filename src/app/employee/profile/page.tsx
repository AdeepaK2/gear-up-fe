"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

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
      {tab === "profile" && (
        <div className="flex gap-12 items-start">
          <form className="max-w-xl flex-1">
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full border-secondary border-2 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-base" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="w-full border-secondary border-2 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                type="email"
                autoComplete="off"
              />
            </div>
            <div className="mb-12">
              <label className="block mb-2 font-medium text-base" htmlFor="contact">
                Contact Number
              </label>
              <input
                id="contact"
                className="w-full border-secondary border-2 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                type="text"
                autoComplete="off"
              />
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
