"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  UserCog,
  User,
  Briefcase,
  Package,
  Calendar as CalendarIcon,
  FileText,
  LogOut,
} from "lucide-react";
import { authService } from "@/lib/services/authService";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function Sidebar() {
  const rawPathname = usePathname() || "/admin";
  const router = useRouter();
  const toast = useToast();
  
  // Remove trailing slash to normalize the pathname
  const pathname = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed, but redirecting to login");
      // Still redirect to login even if logout API fails
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: "/admin", icon: <Home className="h-4 w-4" />, text: "Dashboard" },
    {
      href: "/admin/employees",
      icon: <UserCog className="h-4 w-4" />,
      text: "Employees",
    },
    {
      href: "/admin/customers",
      icon: <User className="h-4 w-4" />,
      text: "Customers",
    },
    {
      href: "/admin/projects",
      icon: <Briefcase className="h-4 w-4" />,
      text: "Projects",
    },
    {
      href: "/admin/services",
      icon: <Package className="h-4 w-4" />,
      text: "Services",
    },
    {
      href: "/admin/appointments",
      icon: <CalendarIcon className="h-4 w-4" />,
      text: "Appointments",
    },
    {
      href: "/admin/modification-requests",
      icon: <FileText className="h-4 w-4" />,
      text: "Modify Requests",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white p-4 flex flex-col z-50">
      <div className="mb-8 flex justify-center">
        <Image
          src="/Logo.png"
          alt="Gear Up Logo"
          width={70}
          height={40}
          className="object-contain"
        />
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          // Proper logic: exact match OR sub-route match (except for dashboard which is exact only)
          const active =
            pathname === item.href ||
            (pathname?.startsWith(item.href + "/") && item.href !== "/admin");

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
              <span
                className={`transition-colors duration-200 ${
                  active ? "text-white" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`transition-colors duration-200 ${
                  active ? "text-white" : ""
                }`}
              >
                {item.text}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-8">
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 w-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4 text-white" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>

      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
}
