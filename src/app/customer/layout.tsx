"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/customer/Sidebar";
import Header from "@/components/customer/Header";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { UserRole } from "@/lib/types/Auth";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Handle both /customer/login and /customer/login/ (with trailing slash)
  const isLoginPage =
    pathname === "/customer/login" || pathname === "/customer/login/";
  
  // Handle chatbot page - full screen without header/sidebar
  const isChatbotPage = 
    pathname === "/customer/chatbot" || pathname === "/customer/chatbot/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isChatbotPage) {
    return (
      <ProtectedRoute requiredRole={UserRole.CUSTOMER} redirectTo="/login">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.CUSTOMER} redirectTo="/login">
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Page wrapper: reserve top space for header (h-16) and apply left margin on md+ to avoid sidebar overlap */}
        <div className="ml-0 md:ml-64 pt-16">
          <Header />
          <main className="p-4 max-w-full">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
