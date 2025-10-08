import React from "react";
import EmployeeSidebar from "../../components/employee/Sidebar";

export const metadata = {
  title: "Employee - Gear Up",
};

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <EmployeeSidebar />

      {/* Main content with left padding to accommodate fixed sidebar */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
