"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Car,
  Calendar,
  Folder,
  User,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { authService } from "@/lib/services/authService";
import type { User as UserType } from "@/lib/types/Auth";

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
  const router = useRouter();

  // Remove trailing slash to normalize the pathname
  const pathname = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;

  const [user, setUser] = React.useState<UserType | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Fetch authenticated user on component mount
  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // If not authenticated, redirect to login
    if (!currentUser || !authService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Still redirect to login even if logout API fails
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r shadow-sm px-4 py-6 flex flex-col overflow-y-auto z-50">
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

      <div className="mb-4 text-center">
        <p className="font-semibold text-gray-800">{user?.name || "Loading..."}</p>
        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          // Proper logic: exact match OR sub-route match (except for dashboard which is exact only)
          const active =
            pathname === item.href ||
            (pathname?.startsWith(item.href + "/") &&
              item.href !== "/customer/dashboard");

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
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center gap-3 rounded-md px-3 py-2 w-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <LogOut size={16} className="text-white" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
