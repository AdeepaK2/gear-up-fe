import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import type { Vehicle } from '@/lib/types/Vehicle';

/**
 * VehicleCard Component
 *
 * Displays information about a single vehicle including make, model, year,
 * license plate, and next service date.
 *
 * @param {Object} props - Component props
 * @param {string} props.make - Vehicle manufacturer
 * @param {string} props.model - Vehicle model name
 * @param {number} props.year - Vehicle year
 * @param {string} props.licensePlate - Vehicle license plate number
 * @param {string | null} props.nextService - Next scheduled service date (null if up to date)
 * @returns {JSX.Element} Rendered vehicle card
 */
interface VehicleCardProps {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

const VehicleCard: React.FC<VehicleCardProps> = React.memo(
  ({ make, model, year, licensePlate }) => (
    <div className="p-4 border-2 border-gray-100 rounded-xl space-y-3 hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">
          {make} {model}
        </h3>
        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
          {year}
        </span>
      </div>
      <p className="text-sm text-gray-700 font-medium">
        License: <span className="text-primary">{licensePlate}</span>
      </p>
      {/* {nextService ? (
        <div className="flex items-center text-sm bg-orange-50 p-2 rounded-lg">
          <Clock className="w-4 h-4 mr-2 text-orange-500" />
          <span className="text-orange-700 font-medium">
            Next service: {nextService}
          </span>
        </div>
      ) : (
        <div className="flex items-center text-sm bg-green-50 p-2 rounded-lg">
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-green-700 font-medium">Up to date</span>
        </div>
      )} */}
    </div>
  )
);

VehicleCard.displayName = 'VehicleCard';

/**
 * VehiclesList Component
 *
 * Displays a list of customer vehicles with management link.
 * Shows a fallback message when no vehicles are registered.
 *
 * @param {Object} props - Component props
 * @param {Array} props.vehicles - Array of vehicle objects
 * @returns {JSX.Element} Rendered vehicles list card
 */

interface VehiclesListProps {
  vehicles: Vehicle[];
}

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  const hasVehicles = vehicles.length > 0;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
        <div className="flex items-center justify-between min-h-[32px]">
          <CardTitle className="flex items-center text-white font-semibold">
            My Vehicles
          </CardTitle>
          <Link href="/customer/vehicles">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white"
              aria-label="Manage vehicles"
            >
              Manage
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {hasVehicles ? (
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              make={vehicle.make}
              model={vehicle.model}
              year={vehicle.year}
              licensePlate={vehicle.licensePlate}
              // nextService={vehicle.nextService}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No vehicles registered</p>
            <Link href="/customer/vehicles">
              <Button className="mt-4" size="sm">
                Add Vehicle
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehiclesList;
