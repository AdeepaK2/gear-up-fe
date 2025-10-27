import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Phone, FileText, LogOut } from "lucide-react";

/**
 * DashboardFooter Component
 *
 * Displays footer navigation links for settings, support, policies, and logout.
 * Provides quick access to important utility pages.
 *
 * @returns {JSX.Element} Rendered footer navigation card
 */
const FOOTER_LINKS = [
  {
    href: "/customer/profile",
    icon: Settings,
    label: "Profile Settings",
  },
  {
    href: "/contact",
    icon: Phone,
    label: "Support Center",
  },
  {
    href: "#",
    icon: FileText,
    label: "Terms & Policies",
  },
];

const DashboardFooter: React.FC = () => {
  return (
    <Card className="mt-8">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              <link.icon className="w-4 h-4 mr-1" />
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 transition-all duration-200"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFooter;
