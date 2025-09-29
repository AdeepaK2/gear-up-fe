"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Car,
  Calendar,
  Folder,
  User,
  MessageSquare,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/customer/dashboard", label: "Dashboard", icon: Home },
  { href: "/customer/vehicles", label: "My Vehicles", icon: Car },
  { href: "/customer/appointments", label: "My Appointments", icon: Calendar },
  { href: "/customer/projects", label: "My Projects", icon: Folder },
  { href: "/customer/profile", label: "Profile", icon: User },
  { href: "/customer/chatbot", label: "Chatbot", icon: MessageSquare },
];

export default function CustomerSidebar() {
  const rawPathname = usePathname() || "/customer/dashboard";
  // Remove trailing slash to normalize the pathname
  const pathname = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;

  // Debug: Let's see what pathname we're getting
  console.log("Current pathname:", pathname, "Raw pathname:", rawPathname);

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm px-4 py-6 flex flex-col">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center bg-gray-100 rounded px-2 py-1 mx-auto">
          <Image
            src="/Logo.png"
            alt="Company Logo"
            width={110}
            height={32}
            className="block"
          />
        </div>
      </div>

      <div className="mb-4 text-center font-semibold">User Name</div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          // Proper logic: exact match OR sub-route match (except for dashboard which is exact only)
          const active =
            pathname === item.href ||
            (pathname?.startsWith(item.href + "/") &&
              item.href !== "/customer/dashboard");

          // Debug: Let's see the active state for each item
          console.log(
            `Item: ${item.label}, href: ${item.href}, active: ${active}, pathname: ${pathname}`
          );

          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ease-in-out ${
                active
                  ? "bg-primary text-white font-medium shadow-lg border-l-4 border-secondary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              <Icon
                size={16}
                className={`transition-colors duration-200 ${
                  active ? "text-white" : "text-gray-500"
                }`}
              />
              <span
                className={`transition-colors duration-200 ${
                  active ? "text-white" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Link
          href="/customer/login"
          className={`flex items-center gap-3 rounded-md px-3 py-2 bg-red-600 text-white`}
        >
          <LogOut size={16} className="text-white" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
