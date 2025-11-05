"use client";

import React from "react";
import Sidebar from "../../components/admin/Sidebar"; 
import Header from "../../components/admin/Header";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import { UserRole } from "../../lib/types/Auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN} redirectTo="/login">
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}