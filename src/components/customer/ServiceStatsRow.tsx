import React from "react";
import { Wrench, CheckCircle, FileText } from "lucide-react";
import { formatCurrencyLKR } from "@/lib/utils/currency";

/**
 * ServiceStatsRow - Displays project service statistics.
 * 
 * @description Shows three summary cards: total services, selected services,
 * and total cost. Memoized to prevent recalculation unless props change.
 * 
 * @param {number} totalServices - Total number of recommended services
 * @param {number} selectedServices - Number of accepted services
 * @param {number} totalCost - Total cost of accepted services
 */

interface ServiceStatsRowProps {
  totalServices: number;
  selectedServices: number;
  totalCost: number;
}

const ServiceStatsRow: React.FC<ServiceStatsRowProps> = React.memo(
  ({ totalServices, selectedServices, totalCost }) => {
    return (
      <div
        className="border-t border-gray-200 pt-6"
        role="region"
        aria-labelledby="service-summary-heading"
      >
        <h3 id="service-summary-heading" className="text-lg font-semibold text-gray-900 mb-4">
          Service Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Services */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-[#163172] rounded-lg" aria-hidden="true">
                <Wrench className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#163172]" aria-label={`${totalServices} total services`}>
              {totalServices}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Total Services Recommended
            </div>
          </div>

          {/* Selected Services */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-[#163172] rounded-lg" aria-hidden="true">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#163172]" aria-label={`${selectedServices} services selected`}>
              {selectedServices}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Services You've Selected
            </div>
          </div>

          {/* Total Cost */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-[#163172] rounded-lg" aria-hidden="true">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#163172]" aria-label={`Total cost ${formatCurrencyLKR(totalCost)}`}>
              {formatCurrencyLKR(totalCost)}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Total Cost for Selected Services
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ServiceStatsRow.displayName = "ServiceStatsRow";

export default ServiceStatsRow;
