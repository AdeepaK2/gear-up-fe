import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Wrench, MessageCircle } from "lucide-react";

/**
 * QuickActionButton Component
 *
 * Renders a single quick action button with an icon and label.
 *
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination
 * @param {LucideIcon} props.icon - Icon component to display
 * @param {string} props.label - Button label text
 * @param {string} props.variant - Button style variant
 * @param {string} props.colorClasses - Tailwind color classes for styling
 * @returns {JSX.Element} Rendered quick action button
 */
interface QuickActionButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
  variant: "default" | "outline";
  colorClasses: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = React.memo(
  ({ href, icon: Icon, label, variant, colorClasses }) => (
    <Link href={href} className="block">
      <Button
        className={`w-full justify-start h-12 transition-all duration-200 shadow-md ${colorClasses}`}
        variant={variant}
        aria-label={label}
      >
        <Icon className="w-5 h-5 mr-3" />
        {label}
      </Button>
    </Link>
  )
);

QuickActionButton.displayName = "QuickActionButton";

/**
 * QuickActions Component
 *
 * Displays a set of quick action buttons for common customer tasks.
 * Provides easy access to booking appointments, requesting services, etc.
 *
 * @returns {JSX.Element} Rendered quick actions card
 */
const QUICK_ACTIONS = [
  {
    href: "/customer/appointments",
    icon: Calendar,
    label: "Book New Appointment",
    variant: "default" as const,
    colorClasses:
      "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary",
  },
  {
    href: "/customer/projects#additional-service-request",
    icon: Plus,
    label: "Request Custom Service",
    variant: "outline" as const,
    colorClasses:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  },
  {
    href: "/customer/projects",
    icon: Wrench,
    label: "Track Ongoing Projects",
    variant: "outline" as const,
    colorClasses:
      "border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white",
  },
  {
    href: "/customer/chatbot",
    icon: MessageCircle,
    label: "Chat with Support",
    variant: "outline" as const,
    colorClasses:
      "border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
  },
];

const QuickActions: React.FC = () => {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
        <div className="flex items-center justify-between min-h-[32px]">
          <CardTitle className="flex items-center text-white font-semibold">
            Quick Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionButton
            key={action.href}
            href={action.href}
            icon={action.icon}
            label={action.label}
            variant={action.variant}
            colorClasses={action.colorClasses}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
