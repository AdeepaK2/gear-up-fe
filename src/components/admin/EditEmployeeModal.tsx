"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  employeeService,
  Employee,
  UpdateEmployeeRequest,
} from "@/lib/services/employeeService";
import { useToast } from "@/contexts/ToastContext";

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employee: Employee | null;
}

export default function EditEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
  employee,
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState<UpdateEmployeeRequest>({
    name: "",
    specialization: "",
    hireDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  // Populate form when employee changes or modal opens
  useEffect(() => {
    if (open && employee) {
      setFormData({
        name: employee.name || "",
        specialization: employee.specialization || "",
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : "",
      });
      setError("");
      setIsLoading(false);
    }
  }, [open, employee]);

  const handleChange = (field: keyof UpdateEmployeeRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employee) {
      setError("No employee selected");
      return;
    }

    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.name?.trim()) {
      setError("Employee name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.specialization?.trim()) {
      setError("Specialization is required");
      setIsLoading(false);
      return;
    }

    try {
      await employeeService.updateEmployee(employee.employeeId, formData);
      toast.success(`Employee ${formData.name} updated successfully`);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to update employee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      specialization: "",
      hireDate: "",
    });
    setError("");
    setIsLoading(false);
    onOpenChange(false);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee information. Email cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={employee.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-specialization">Specialization *</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => handleChange("specialization", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="edit-specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automobile">
                    Automobile (General)
                  </SelectItem>
                  <SelectItem value="Engine">Engine Specialist</SelectItem>
                  <SelectItem value="Transmission">Transmission</SelectItem>
                  <SelectItem value="Electrical">
                    Electrical Systems
                  </SelectItem>
                  <SelectItem value="Brake">Brake Systems</SelectItem>
                  <SelectItem value="Suspension">
                    Suspension & Steering
                  </SelectItem>
                  <SelectItem value="AC">Air Conditioning</SelectItem>
                  <SelectItem value="Bodywork">Bodywork & Paint</SelectItem>
                  <SelectItem value="Diagnostic">
                    Diagnostic Specialist
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-hireDate">Hire Date *</Label>
              <Input
                id="edit-hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleChange("hireDate", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
