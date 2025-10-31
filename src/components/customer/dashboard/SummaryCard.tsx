import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

/**
 * SummaryCard Component
 *
 * Displays a metric card with an icon, count, and additional information.
 * Used for dashboard summary statistics like appointments, projects, etc.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title/label of the metric
 * @param {number} props.count - The numeric value to display
 * @param {string} props.subtitle - Additional context information
 * @param {LucideIcon} props.icon - Icon component to display
 * @param {string} [props.href] - Optional link destination
 * @returns {JSX.Element} Rendered summary card
 */
interface SummaryCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon: LucideIcon;
  href?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = React.memo(
  ({ title, count, subtitle, icon: Icon, href }) => {
    const cardContent = (
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">{title}</p>
              <p className="text-3xl font-bold text-primary mt-2">{count}</p>
              <p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
                {subtitle}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link href={href}>{cardContent}</Link> : cardContent;
  }
);

SummaryCard.displayName = "SummaryCard";

export default SummaryCard;
