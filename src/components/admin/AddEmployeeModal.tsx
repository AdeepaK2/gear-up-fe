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
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import {
  employeeService,
  CreateEmployeeRequest,
  CreateEmployeeResponse,
} from "@/lib/services/employeeService";
import { useToast } from "@/contexts/ToastContext";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
}: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    name: "",
    email: "",
    specialization: "",
    role: "Technician",
    // password will be auto-generated
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<CreateEmployeeResponse | null>(null);
  const toast = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        specialization: "",
        role: "Technician",
      });
      setError("");
      setSuccess(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleChange = (field: keyof CreateEmployeeRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Employee name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Valid email is required");
      setIsLoading(false);
      return;
    }

    if (!formData.specialization.trim()) {
      setError("Specialization is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await employeeService.createEmployee(formData);

      setSuccess({
        email: response.email,
        name: response.name,
        temporaryPassword: response.temporaryPassword,
        message: response.message || "Employee account created successfully!",
      });

      // Call onSuccess to refresh the employee list
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create employee account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset all states when closing
    setFormData({
      name: "",
      email: "",
      specialization: "",
      role: "Technician",
    });
    setError("");
    setSuccess(null);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee account. A temporary password will be
            generated and sent to their email.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4 py-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                {success.message}
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 text-blue-800">
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Credentials Sent</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  The temporary login credentials have been sent to:
                </p>
                <div className="bg-white px-4 py-3 rounded border">
                  <p className="font-medium text-gray-900">{success.email}</p>
                </div>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-xs ml-2">
                  The employee should check their email for login credentials
                  and change their password after first login.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@gearup.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Employee Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Service Advisor">
                      Service Advisor
                    </SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) =>
                    handleChange("specialization", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="specialization">
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

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-xs">
                  A secure temporary password will be automatically generated
                  and sent to the employee's email address.
                </AlertDescription>
              </Alert>
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
                    Creating Account...
                  </>
                ) : (
                  "Create Employee"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
