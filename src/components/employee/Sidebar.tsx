"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { Home, UserCog, User, Briefcase, Calendar, Bell, LogOut} from "lucide-react";

const navItems = [
  { href: "/employee", label: "Dashboard", icon: <Home size={18} /> },
  { href: "/employee/profile", label: "Profile", icon: <UserCog size={18} /> },
  { href: "/employee/projects", label: "Projects", icon: <Briefcase size={18} /> },
  { href: "/employee/appointments", label: "Appointments", icon: <Calendar size={18} /> },
   { href: "/employee/notifications", label: "Notifications", icon: <Bell size={18} /> },


];

export default function EmployeeSidebar() {
  const pathname = usePathname() || "/employee";

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm px-4 py-6 flex flex-col">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center bg-gray-100 rounded px-2 py-1 mx-auto">
          <Image src="/Logo.png" alt="Company Logo" width={110} height={32} className="block" />
        </div>
      </div>

      {/* <div className="mb-4 text-center font-semibold">Company</div> */}

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href === "/employee" && pathname === "/employee");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                active ? "bg-gray-100 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-gray-700">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Link href="/" className="flex items-center gap-3 text-gray-700 hover:text-black">
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
