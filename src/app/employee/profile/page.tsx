"use client";

import React, { useState } from "react";

export default function EmployeeProfile() {
  const [tab, setTab] = useState<"profile" | "security">("profile");

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Employee Settings</h1>
      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-8 py-2 font-medium border-b-2 focus:outline-none ${
            tab === "profile"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setTab("profile")}
          type="button"
        >
          Profile
        </button>
        <button
          className={`px-8 py-2 font-medium border-b-2 focus:outline-none ${
            tab === "security"
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
        <form className="max-w-xl">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-base" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="w-full border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white rounded-full px-6 py-2 font-medium shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
      {tab === "security" && (
        <form className="max-w-xl">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-base" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-base" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              className="w-full border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="mb-12">
            <label className="block mb-2 font-medium text-base" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              className="w-full border rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white rounded-full px-6 py-2 font-medium shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
