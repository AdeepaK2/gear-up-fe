"use client";

import React from "react";
import EmployeeSidebar from "../../components/employee/Sidebar";
import Header from "../../components/employee/Header";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import { UserRole } from "../../lib/types/Auth";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.EMPLOYEE} redirectTo="/login">
      <div className="min-h-screen flex bg-gray-50">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
