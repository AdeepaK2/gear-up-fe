"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/customer/Sidebar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Handle both /customer/login and /customer/login/ (with trailing slash)
  const isLoginPage =
    pathname === "/customer/login" || pathname === "/customer/login/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar column (fixed width) */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content column */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
