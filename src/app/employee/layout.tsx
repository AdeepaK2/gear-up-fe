import React from "react";
import Sidebar from "../../components/employee/Sidebar";
import Header from "../../components/employee/Header";
export const metadata = {
  title: "Employee - Gear Up",
};

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="admin-layout min-h-screen bg-gray-50 overflow-x-hidden w-full max-w-full">
        <Sidebar />
        <Header />
        <main className="ml-64 pt-24 p-6 overflow-y-auto overflow-x-hidden min-h-screen">
          <div className="overflow-x-hidden w-full max-w-full">{children}</div>
        </main>
      </div>
    );
}
