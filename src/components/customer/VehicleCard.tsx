import React from "react";
import { Car, Edit2, Trash2 } from "lucide-react";

/**
 * VehicleCard - Displays a single vehicle with its details and action buttons.
 *
 * @description Follows Single Responsibility Principle by encapsulating vehicle
 * presentation logic. Memoized to prevent unnecessary re-renders when parent state
 * changes but this vehicle's data hasn't changed.
 *
 * @param {Vehicle} vehicle - The vehicle data to display
 * @param {function} onEdit - Callback invoked when user clicks Edit
 * @param {function} onDelete - Callback invoked when user clicks Delete
 */

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
};

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = React.memo(
  ({ vehicle, onEdit, onDelete }) => {
    return (
      <article
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary/20 group"
        aria-label={`${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`}
      >
        <div className="flex flex-col h-full">
          {/* Header with icon and title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors"
                aria-hidden="true"
              >
                <Car className="text-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  {vehicle.year}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle details */}
          <div className="flex-1 space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                License Plate
              </span>
              <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-md border">
                {vehicle.licensePlate}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Model Year
              </span>
              <span className="text-sm font-semibold text-primary">
                {vehicle.year}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-secondary transition-all duration-200 font-medium shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
            >
              <Edit2 size={18} aria-hidden="true" />
              Edit
            </button>

            <button
              onClick={() => onDelete(vehicle.id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
            >
              <Trash2 size={18} aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </article>
    );
  }
);

VehicleCard.displayName = "VehicleCard";

export default VehicleCard;
