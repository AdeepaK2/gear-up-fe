"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Plus, Car } from "lucide-react";
import VehicleCard, { type Vehicle } from "@/components/customer/VehicleCard";
import VehicleFormModal, {
  type VehicleFormData,
} from "@/components/customer/VehicleFormModal";

/**
 * Mock vehicle data - acts as initial state until backend integration.
 * Keep this structure stable to maintain UI contract with future API endpoints.
 */
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    licensePlate: "ABC-123",
  },
  {
    id: "2",
    make: "Honda",
    model: "Civic",
    year: 2020,
    licensePlate: "XYZ-789",
  },
  {
    id: "3",
    make: "Ford",
    model: "Focus",
    year: 2017,
    licensePlate: "FDE-456",
  },
  {
    id: "4",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    licensePlate: "EV-2022",
  },
  { id: "5", make: "BMW", model: "X3", year: 2019, licensePlate: "BMW-900" },
  { id: "6", make: "Audi", model: "A4", year: 2021, licensePlate: "AUD-404" },
];

/**
 * VehiclesPage - Customer vehicle management dashboard.
 *
 * @description Orchestrates state for vehicle CRUD operations. Delegated presentation
 * to VehicleCard and VehicleFormModal for separation of concerns. Uses mock data
 * until backend API endpoints are available.
 */
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /**
   * Opens modal in create mode (no default values).
   */
  const openCreateModal = useCallback(() => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  }, []);

  /**
   * Opens modal in edit mode with pre-filled vehicle data.
   */
  const openEditModal = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  }, []);

  /**
   * Closes modal and resets editing state.
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  }, []);

  /**
   * Handles form submission for both create and edit operations.
   * Generates client-side ID for new vehicles until backend provides proper IDs.
   */
  const submitForm = useCallback(
    (data: VehicleFormData) => {
      if (editingVehicle) {
        // Update existing vehicle
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === editingVehicle.id
              ? {
                  ...v,
                  make: data.make,
                  model: data.model,
                  year: Number(data.year),
                  licensePlate: data.licensePlate,
                }
              : v
          )
        );
      } else {
        // Create new vehicle with temporary client-generated ID
        const newVehicle: Vehicle = {
          id: String(Date.now()),
          make: data.make,
          model: data.model,
          year: Number(data.year),
          licensePlate: data.licensePlate,
        };
        setVehicles((prev) => [newVehicle, ...prev]);
      }

      closeModal();
    },
    [editingVehicle, closeModal]
  );

  /**
   * Deletes a vehicle after user confirmation.
   * In production, this should make a DELETE API call.
   */
  const confirmDelete = useCallback((id: string) => {
    // Use native confirm for now; could be replaced with custom confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle? This action cannot be undone."
    );

    if (confirmed) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  }, []);

  /**
   * Filters and sorts vehicles based on search query and sort order.
   * Memoized to avoid recalculation on every render.
   */
  const filteredAndSortedVehicles = useMemo(() => {
    let result = vehicles;

    // Filter by search query (case-insensitive across make, model, and license plate)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.licensePlate.toLowerCase().includes(query)
      );
    }

    // Sort by year
    result = [...result].sort((a, b) => {
      return sortOrder === "desc" ? b.year - a.year : a.year - b.year;
    });

    return result;
  }, [vehicles, searchQuery, sortOrder]);

  /**
   * Prepare default values for edit modal.
   * Convert Vehicle to VehicleFormData (year as string).
   */
  const modalDefaultValues: VehicleFormData | null = useMemo(() => {
    if (!editingVehicle) return null;
    return {
      make: editingVehicle.make,
      model: editingVehicle.model,
      year: String(editingVehicle.year),
      licensePlate: editingVehicle.licensePlate,
    };
  }, [editingVehicle]);

  return (
    <div className="min-h-screen space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary font-bold text-3xl">My Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your registered vehicles</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Add new vehicle"
        >
          <Plus size={16} aria-hidden="true" />
          Add Vehicle
        </button>
      </div>

      {/* Search and sort controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search vehicles
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by make, model, or license plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">
            Sort by year
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Vehicle grid or empty state */}
      {filteredAndSortedVehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No vehicles found" : "No vehicles yet"}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first vehicle"}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Plus size={18} aria-hidden="true" />
                Add Your First Vehicle
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Your vehicles"
        >
          {filteredAndSortedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={openEditModal}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      {/* Modal for create/edit */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitForm}
        defaultValues={modalDefaultValues}
      />
    </div>
  );
}
