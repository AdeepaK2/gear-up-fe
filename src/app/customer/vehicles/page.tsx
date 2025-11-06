"use client";

import React from "react";
import { Car, Edit2, Trash2, Plus } from "lucide-react";
import { vehicleService } from "@/lib/services/vehicleService";
import type { Vehicle, VehicleCreateRequest } from "@/lib/types/Vehicle";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function VehiclesPage() {
  const toast = useToast();
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingVehicleId, setEditingVehicleId] = React.useState<number | null>(
    null
  );
  const [deleteVehicleId, setDeleteVehicleId] = React.useState<number | null>(
    null
  );
  const [form, setForm] = React.useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>(
    {}
  );

  // Fetch vehicles on component mount
  React.useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getCurrentCustomerVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vehicles");
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsEditMode(false);
    setEditingVehicleId(null);
    setForm({ make: "", model: "", year: "", licensePlate: "", vin: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setIsEditMode(true);
    setEditingVehicleId(vehicle.id);
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      year: String(vehicle.year),
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingVehicleId(null);
    setForm({ make: "", model: "", year: "", licensePlate: "", vin: "" });
    setFormErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // If editing make field, allow letters, numbers, spaces and hyphens; trim and limit length
    if (name === "make") {
      // remove disallowed characters, collapse multiple spaces, trim ends, limit to 40
      const sanitized = value
        .replace(/[^A-Za-z0-9\s-]/g, "")
        .replace(/\s+/g, " ")
        .slice(0, 40);
      const trimmed = sanitized.replace(/^\s+|\s+$/g, "");
      setForm((f) => ({ ...f, [name]: trimmed }));
      if (value !== sanitized) {
        const msg =
          value.length > 40
            ? "Make must be 2–40 characters."
            : "Only letters, numbers, spaces and hyphens are allowed.";
        setFormErrors((prev) => ({ ...prev, make: msg }));
      } else {
        setFormErrors((prev) => ({ ...prev, make: "" }));
      }
      return;
    }
    // If editing the model field, sanitize to allowed chars and limit length
    if (name === "model") {
      // allow letters, digits, slashes and hyphens only
      const sanitized = value.replace(/[^A-Za-z0-9\/-]/g, "").slice(0, 40);
      setForm((f) => ({ ...f, [name]: sanitized }));
      if (value !== sanitized) {
        const msg =
          value.length > 40
            ? "Model must be 1–40 characters."
            : "Only letters, digits, slashes and hyphens are allowed.";
        setFormErrors((prev) => ({ ...prev, model: msg }));
      } else {
        setFormErrors((prev) => ({ ...prev, model: "" }));
      }
      return;
    }

    // If editing year field, sanitize to digits and validate range inline
    if (name === "year") {
      const digits = value.replace(/\D/g, "");
      const currentYear = new Date().getFullYear();
      const minYear = 1900;
      const maxYear = currentYear + 1;
      setForm((f) => ({ ...f, [name]: digits }));
      // clear previous year error
      setFormErrors((prev) => ({ ...prev, year: "" }));
      if (digits) {
        const num = Number(digits);
        if (!Number.isInteger(num) || num < minYear || num > maxYear) {
          setFormErrors((prev) => ({
            ...prev,
            year: `Year must be an integer between ${minYear} and ${maxYear}`,
          }));
        }
      }
      return;
    }

    // If editing VIN field, trim spaces, auto-uppercase, limit length and show inline errors
    if (name === "vin") {
      const trimmed = value.replace(/\s+/g, "");
      const upper = trimmed.toUpperCase();
      // remove any non alphanumeric chars (keeps letters and digits)
      const sanitized = upper.replace(/[^A-Z0-9]/g, "").slice(0, 17);
      setForm((f) => ({ ...f, [name]: sanitized }));

      // determine inline error messages
      let vinError = "";
      if (/[IOQ]/.test(upper)) {
        vinError = "VIN must not contain the letters I, O or Q.";
      } else if (/[^A-Za-z0-9\s]/.test(value)) {
        vinError =
          "VIN may only contain letters and digits; special characters were removed.";
      } else if (trimmed.length > 17) {
        vinError = "VIN was truncated to 17 characters.";
      }

      setFormErrors((prev) => ({ ...prev, vin: vinError }));
      return;
    }

    // If editing licensePlate, trim, uppercase and validate inline (Sri Lanka formats)
    if (name === "licensePlate") {
      const upper = value.toUpperCase();
      const trimmed = upper.trim().replace(/\s+/g, " ");
      // remove characters except letters, digits, spaces and hyphen
      const sanitized = trimmed.replace(/[^A-Z0-9\s-]/g, "");
      setForm((f) => ({ ...f, [name]: sanitized }));
      // inline validation: if non-empty and not matching allowed formats, show hint
      if (sanitized && !isValidLicensePlate(sanitized)) {
        setFormErrors((prev) => ({
          ...prev,
          licensePlate:
            "License plate must match Sri Lanka formats (e.g. WP ABC 1234 or 19-4567).",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, licensePlate: "" }));
      }
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  // Validate year: integer only, range 1900 -> currentYear + 1
  const isValidYear = (yearStr: string) => {
    if (!yearStr) return false;
    // only digits, no decimals or text
    if (!/^\d+$/.test(yearStr)) return false;
    const yearNum = Number(yearStr);
    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    const maxYear = currentYear + 1;
    if (!Number.isInteger(yearNum)) return false;
    if (yearNum < minYear || yearNum > maxYear) return false;
    return true;
  };

  // Validate model: letters, digits, slashes, hyphens only; length 1-40
  const isValidModel = (modelStr: string) => {
    if (!modelStr) return false;
    // allowed characters A-Z a-z 0-9 / - , no spaces
    if (!/^[A-Za-z0-9\/-]{1,40}$/.test(modelStr)) return false;
    return true;
  };

  // Validate make: letters, numbers, spaces or hyphens allowed; length 2-40
  const isValidMake = (makeStr: string) => {
    if (!makeStr) return false;
    const trimmed = makeStr.trim();
    if (trimmed.length < 2 || trimmed.length > 40) return false;
    if (!/^[A-Za-z0-9\s-]{2,40}$/.test(trimmed)) return false;
    return true;
  };

  // Validate VIN: exactly 17 chars, uppercase letters & digits only, exclude I,O,Q
  const isValidVin = (vinStr: string) => {
    if (!vinStr) return false;
    // already expected to be trimmed and uppercased
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vinStr)) return false;
    return true;
  };

  // Validate Sri Lanka license plate: new or old formats
  const isValidLicensePlate = (plate: string) => {
    if (!plate) return false;
    const normalized = plate.toUpperCase().trim();
    const newFmt = /^[A-Z]{1,2}\s?[A-Z]{1,3}\s?[0-9]{4}$/; // WP ABC 1234
    const oldFmt = /^([0-9]{1,2}-[0-9]{1,4}|[0-9]{1,2}\s?SRI\s?[0-9]{1,4})$/; // 19-4567 or 18 SRI 3456
    return newFmt.test(normalized) || oldFmt.test(normalized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.make ||
      !form.model ||
      !form.year ||
      !form.licensePlate ||
      !form.vin
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    // Make validation: ensure allowed chars and length
    if (!isValidMake(form.make)) {
      setFormErrors({
        make: "Make must be 2–40 characters and may only contain letters, numbers, spaces and hyphens.",
      });
      const el = document.querySelector(
        'input[name="make"]'
      ) as HTMLInputElement | null;
      el?.focus();
      return;
    }

    // Model validation: ensure allowed chars and length
    if (!isValidModel(form.model)) {
      setFormErrors({
        model:
          "Model must be 1–40 characters and may only contain letters, digits, slashes and hyphens.",
      });
      const el = document.querySelector(
        'input[name="model"]'
      ) as HTMLInputElement | null;
      el?.focus();
      return;
    }

    // VIN validation: must be exactly 17 chars, uppercase letters & digits only, exclude I,O,Q
    if (!isValidVin(form.vin)) {
      setFormErrors({
        vin: "VIN must be exactly 17 characters and may contain only uppercase letters (no I, O, Q) and digits.",
      });
      const elVin = document.querySelector(
        'input[name="vin"]'
      ) as HTMLInputElement | null;
      elVin?.focus();
      return;
    }

    // License Plate validation (Sri Lanka): new or old formats
    if (!isValidLicensePlate(form.licensePlate)) {
      setFormErrors({
        licensePlate:
          "License plate must match Sri Lanka formats (e.g. WP ABC 1234 or 19-4567).",
      });
      const el = document.querySelector(
        'input[name="licensePlate"]'
      ) as HTMLInputElement | null;
      el?.focus();
      return;
    }

    // Year specific validation: integer only, range 1900 -> currentYear + 1
    const currentYear = new Date().getFullYear();
    const maxAllowed = currentYear + 1;
    if (!isValidYear(form.year)) {
      setFormErrors({
        year: `Year must be an integer between 1900 and ${maxAllowed}`,
      });
      const el = document.querySelector(
        'input[name="year"]'
      ) as HTMLInputElement | null;
      el?.focus();
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode && editingVehicleId) {
        // Update existing vehicle
        const updatedVehicle = await vehicleService.updateVehicle(
          editingVehicleId,
          {
            make: form.make,
            model: form.model,
            year: Number(form.year),
            licensePlate: form.licensePlate,
            vin: form.vin,
          }
        );
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicleId ? updatedVehicle : v))
        );
        toast.success("Vehicle updated successfully");
      } else {
        // Create new vehicle
        const vehicleData: VehicleCreateRequest = {
          make: form.make,
          model: form.model,
          year: Number(form.year),
          licensePlate: form.licensePlate,
          vin: form.vin,
        };
        const newVehicle = await vehicleService.createVehicle(vehicleData);
        setVehicles((prev) => [newVehicle, ...prev]);
        toast.success("Vehicle added successfully");
      }

      closeModal();
    } catch (err: any) {
      toast.error(
        err.message || `Failed to ${isEditMode ? "update" : "create"} vehicle`
      );
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} vehicle:`,
        err
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id: number) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (vehicle) {
      openEditModal(vehicle);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteVehicleId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteVehicleId) return;

    try {
      await vehicleService.deleteVehicle(deleteVehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteVehicleId));
      toast.success("Vehicle deleted successfully");
      setDeleteVehicleId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete vehicle");
      console.error("Error deleting vehicle:", err);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-primary font-bold text-2xl">My Vehicles</h1>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
          >
            <Plus size={16} />
            Add Vehicle
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading vehicles</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchVehicles}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No vehicles
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by adding your first vehicle.
            </p>
            <button
              onClick={openModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
            >
              <Plus size={16} />
              Add Vehicle
            </button>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary/20 group"
              >
                <div className="flex flex-col h-full">
                  {/* Header with icon and title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Car className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {v.make} {v.model}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                          {v.year}
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
                        {v.licensePlate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        Model Year
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {v.year}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(v.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-secondary transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(v.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-custom rounded-lg shadow-lg p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary font-bold text-xl">
                {isEditMode ? "Edit Vehicle" : "Add Vehicle"}
              </h3>
              <button onClick={closeModal} className="hover:text-secondary">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  VIN <span className="text-red-500">*</span>
                </label>
                <input
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  placeholder="e.g., 1HGBH41JXMN109186"
                  minLength={17}
                  maxLength={17}
                  className="mt-1 w-full rounded-md border border-ternary bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-gray-400"
                  aria-invalid={!!formErrors.vin}
                  aria-describedby={formErrors.vin ? "vin-error" : undefined}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Vehicle Identification Number (17 characters, uppercase
                  letters and digits only — no I, O, Q)
                </p>
                {formErrors.vin && (
                  <p id="vin-error" className="mt-1 text-sm text-red-600">
                    {formErrors.vin}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  name="make"
                  value={form.make}
                  onChange={handleChange}
                  placeholder="e.g., Toyota"
                  className="mt-1 w-full rounded-md border border-ternary bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-gray-400"
                  aria-invalid={!!formErrors.make}
                  aria-describedby={formErrors.make ? "make-error" : undefined}
                />
                {formErrors.make && (
                  <p id="make-error" className="mt-1 text-sm text-red-600">
                    {formErrors.make}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="e.g., Camry"
                  className="mt-1 w-full rounded-md border border-ternary bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-gray-400"
                  aria-invalid={!!formErrors.model}
                  aria-describedby={
                    formErrors.model ? "model-error" : undefined
                  }
                />
                {formErrors.model && (
                  <p id="model-error" className="mt-1 text-sm text-red-600">
                    {formErrors.model}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 2022"
                  min="1900"
                  max={String(new Date().getFullYear() + 1)}
                  step={1}
                  inputMode="numeric"
                  pattern="\\d*"
                  onKeyDown={(e) => {
                    // Prevent entering 'e', '.', '+', '-' in number input
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "." ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => {
                    // Prevent changing the number with wheel scroll
                    (e.target as HTMLInputElement).blur();
                  }}
                  className="mt-1 w-full rounded-md border border-ternary bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-gray-400"
                  aria-invalid={!!formErrors.year}
                  aria-describedby={formErrors.year ? "year-error" : undefined}
                />
                {formErrors.year && (
                  <p id="year-error" className="mt-1 text-sm text-red-600">
                    {formErrors.year}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  License Plate <span className="text-red-500">*</span>
                </label>
                <input
                  name="licensePlate"
                  value={form.licensePlate}
                  onChange={handleChange}
                  placeholder="e.g., ABC-1234"
                  className="mt-1 w-full rounded-md border border-ternary bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-gray-400"
                  aria-invalid={!!formErrors.licensePlate}
                  aria-describedby={
                    formErrors.licensePlate ? "license-error" : undefined
                  }
                />
                {formErrors.licensePlate && (
                  <p id="license-error" className="mt-1 text-sm text-red-600">
                    {formErrors.licensePlate}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update"
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={deleteVehicleId !== null}
        onOpenChange={(open) => !open && setDeleteVehicleId(null)}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
