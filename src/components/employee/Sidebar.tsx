"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { Home, UserCog, User, Briefcase, Calendar, Bell, LogOut} from "lucide-react";

const navItems = [
  { href: "/employee", label: "Dashboard", icon: Home },
  { href: "/employee/profile", label: "Profile", icon: UserCog },
  { href: "/employee/projects", label: "Projects", icon: Briefcase },
  { href: "/employee/appointments", label: "Appointments", icon: Calendar },
  { href: "/employee/notifications", label: "Notifications", icon: Bell },
];

export default function EmployeeSidebar() {
  const rawPathname = usePathname() || "/employee";
  // Remove trailing slash to normalize the pathname
  const pathname = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white p-4 flex flex-col z-50">
      <div className="mb-8 flex justify-center">
        <Image
          src="/Logo.png"
          alt="Company Logo"
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
            (pathname?.startsWith(item.href + "/") &&
              item.href !== "/employee");

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
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-red-400 text-white hover:bg-red-500 transition-colors duration-200"
        >
          <LogOut size={16} className="text-white" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
  