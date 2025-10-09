"use client";

import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../../components/employee/Sidebar";
import Header from "../../components/employee/Header";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import ChangePasswordModal from "../../components/shared/ChangePasswordModal";
import { UserRole } from "../../lib/types/Auth";
import { authService } from "../../lib/services/authService";
import { useRouter } from "next/navigation";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if password change is required
    if (authService.requiresPasswordChange()) {
      setShowPasswordModal(true);
    }
  }, []);

  const handlePasswordChangeSuccess = () => {
    setShowPasswordModal(false);
    // Refresh the page or update the token
    router.refresh();
  };

  return (
    <ProtectedRoute requiredRole={UserRole.EMPLOYEE} redirectTo="/login">
      <div className="min-h-screen flex bg-gray-50">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
      
      {/* Password Change Modal - Required for temporary passwords */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordChangeSuccess}
        isRequired={true} // Can't be closed until password is changed
      />
    </ProtectedRoute>
  );
}

