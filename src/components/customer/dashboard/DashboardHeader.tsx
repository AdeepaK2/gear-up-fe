import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit } from "lucide-react";

/**
 * DashboardHeader Component
 *
 * Displays a personalized greeting card with customer information
 * and a link to edit profile.
 *
 * @param {Object} props - Component props
 * @param {string} props.customerName - Name of the customer
 * @returns {JSX.Element} Rendered dashboard header card
 */
interface DashboardHeaderProps {
  customerName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ customerName }) => {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {customerName}!
              </h1>
              <p className="text-white/80 mt-1">
                Ready to keep your vehicles in top shape?
              </p>
            </div>
          </div>
          <Link href="/customer/profile">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-primary hover:bg-white/90 transition-all duration-200"
              aria-label="Edit profile"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
