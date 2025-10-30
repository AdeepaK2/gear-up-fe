import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

/**
 * VehicleFormModal - Modal dialog for creating or editing vehicle information.
 *
 * @description Encapsulates form state, validation, and accessibility concerns.
 * Implements focus trapping and keyboard navigation per WCAG 2.1 guidelines.
 * Validates inputs client-side to provide immediate feedback before submission.
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {function} onSubmit - Callback with validated VehicleFormData
 * @param {VehicleFormData | null} defaultValues - Pre-fill for edit mode
 */

export type VehicleFormData = {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
};

type ValidationErrors = Partial<Record<keyof VehicleFormData, string>>;

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
  defaultValues?: VehicleFormData | null;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1980;
const MAX_YEAR = CURRENT_YEAR + 1;

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = null,
}) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with default values when editing
  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    } else {
      setFormData({
        make: "",
        model: "",
        year: "",
        licensePlate: "",
      });
    }
    setErrors({});
  }, [defaultValues, isOpen]);

  // Focus management: trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus first input when modal opens
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      // Simple focus trap: keep Tab cycling within modal
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Return focus to triggering element on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  /**
   * Validates form data according to business rules.
   * @returns {boolean} true if valid, false otherwise
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    const trimmedMake = formData.make.trim();
    const trimmedModel = formData.model.trim();
    const trimmedPlate = formData.licensePlate.trim();
    const yearNum = Number(formData.year);

    if (!trimmedMake) {
      newErrors.make = "Make is required";
    }

    if (!trimmedModel) {
      newErrors.model = "Model is required";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    } else if (isNaN(yearNum) || yearNum < MIN_YEAR || yearNum > MAX_YEAR) {
      newErrors.year = `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
    }

    if (!trimmedPlate) {
      newErrors.licensePlate = "License plate is required";
    } else if (trimmedPlate.length < 3 || trimmedPlate.length > 12) {
      newErrors.licensePlate = "License plate must be 3-12 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      let processedValue = value;

      // Normalize license plate to uppercase
      if (name === "licensePlate") {
        processedValue = value.toUpperCase();
      }

      setFormData((prev) => ({ ...prev, [name]: processedValue }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof VehicleFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      // Sanitize data before submission
      const sanitizedData: VehicleFormData = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: formData.year,
        licensePlate: formData.licensePlate.trim().toUpperCase(),
      };

      onSubmit(sanitizedData);
    },
    [formData, validateForm, onSubmit]
  );

  if (!isOpen) return null;

  const isFormValid = Object.keys(errors).length === 0;
  const modalTitle = defaultValues ? "Edit Vehicle" : "Add Vehicle";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="modal-title" className="text-primary font-bold text-xl">
            {modalTitle}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="make"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Make <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="make"
              name="make"
              type="text"
              value={formData.make}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border ${
                errors.make ? "border-red-500" : "border-gray-300"
              } bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400`}
              placeholder="e.g., Toyota"
              aria-invalid={!!errors.make}
              aria-describedby={errors.make ? "make-error" : undefined}
            />
            {errors.make && (
              <p
                id="make-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.make}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="model"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Model <span className="text-red-500">*</span>
            </label>
            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border ${
                errors.model ? "border-red-500" : "border-gray-300"
              } bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400`}
              placeholder="e.g., Corolla"
              aria-invalid={!!errors.model}
              aria-describedby={errors.model ? "model-error" : undefined}
            />
            {errors.model && (
              <p
                id="model-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.model}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="year"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Year <span className="text-red-500">*</span>
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={formData.year}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border ${
                errors.year ? "border-red-500" : "border-gray-300"
              } bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400`}
              placeholder={`${MIN_YEAR}-${MAX_YEAR}`}
              aria-invalid={!!errors.year}
              aria-describedby={errors.year ? "year-error" : undefined}
            />
            {errors.year && (
              <p
                id="year-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.year}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="licensePlate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              License Plate <span className="text-red-500">*</span>
            </label>
            <input
              id="licensePlate"
              name="licensePlate"
              type="text"
              value={formData.licensePlate}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border ${
                errors.licensePlate ? "border-red-500" : "border-gray-300"
              } bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400 uppercase`}
              placeholder="e.g., ABC-123"
              maxLength={12}
              aria-invalid={!!errors.licensePlate}
              aria-describedby={
                errors.licensePlate ? "licensePlate-error" : undefined
              }
            />
            {errors.licensePlate && (
              <p
                id="licensePlate-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.licensePlate}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid && Object.keys(errors).length > 0}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {defaultValues ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;
