import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

export const metadata = {
  title: "Admin - Gear Up",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
