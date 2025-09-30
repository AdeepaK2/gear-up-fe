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
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content with left padding to accommodate fixed sidebar */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
