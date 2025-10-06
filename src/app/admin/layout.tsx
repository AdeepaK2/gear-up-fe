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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-24 p-6 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
