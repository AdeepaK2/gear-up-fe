import React from "react";
import EmployeeSidebar from "../../components/employee/Sidebar";
import Header from "../../components/employee/Header"; 
export const metadata = {
  title: "Employee - Gear Up",
};

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
