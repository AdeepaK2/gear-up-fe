"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home,UserCog, User, Briefcase, Package, Calendar as CalendarIcon, FileText, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: <Home className="h-5 w-5" />, text: 'Dashboard' },
    { href: '/admin/employees', icon: <UserCog className="h-5 w-5" />, text: 'Employees' },
    { href: '/admin/customers', icon: <User className="h-5 w-5" />, text: 'Customers' },
    { href: '/admin/projects', icon: <Briefcase className="h-5 w-5" />, text: 'Projects' },
    { href: '/admin/services', icon: <Package className="h-5 w-5" />, text: 'Services' },
    { href: '/admin/appointments', icon: <CalendarIcon className="h-5 w-5" />, text: 'Appointments' },
    { href: '/admin/modification-requests', icon: <FileText className="h-5 w-5" />, text: 'Modification Requests' },
  ];

  return (
    <aside className="w-64 bg-white border-r p-4 shadow-sm flex flex-col">
      <div className="mb-8 text-xl font-bold">Company Logo</div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              active={pathname === item.href}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <SidebarLink icon={<LogOut className="h-5 w-5" />} text="Logout" href="/logout" />
      </div>
    </aside>
  );
}

// Helper component for sidebar links
interface SidebarLinkProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
}

function SidebarLink({ icon, text, href, active }: SidebarLinkProps) {
  const baseClasses = "flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 mb-2";
  const activeClasses = "bg-gray-100 font-semibold";
  return (
    <li>
      <Link href={href} className={`${baseClasses} ${active ? activeClasses : ''}`}>
        <span className="mr-3">{icon}</span>
        {text}
      </Link>
    </li>
  );
}