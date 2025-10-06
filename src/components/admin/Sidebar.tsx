"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

export default function Sidebar() {
  const rawPathname = usePathname() || "/admin";
  // Remove trailing slash to normalize the pathname
  const pathname = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;

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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r p-4 shadow-sm flex flex-col z-50">
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
        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-red-400 text-white hover:bg-red-500 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 text-white" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
