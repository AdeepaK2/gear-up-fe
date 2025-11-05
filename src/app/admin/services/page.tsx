"use client"; // This is a client component to manage the dialog state

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/contexts/ToastContext";

interface Service {
  taskId: number; // Backend uses taskId, not id
  name: string;
  description: string;
  estimatedHours: number;
  estimatedCost: number;
  category: string;
  priority: string;
  notes: string;
  requestedBy: string;
  status: string;
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedHours: "",
    estimatedCost: "",
    category: "General",
    priority: "Medium",
    notes: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const getAuthToken = () => {
    // Check both possible token storage keys
    return localStorage.getItem("accessToken") || localStorage.getItem("token");
  };

  const fetchServices = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch("http://localhost:8080/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const apiResponse = await response.json();
      setServices(apiResponse.data || []);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load services";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch("http://localhost:8080/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          estimatedHours: parseInt(formData.estimatedHours) || 0,
          estimatedCost: parseFloat(formData.estimatedCost) || 0.0,
          category: formData.category,
          priority: formData.priority,
          notes: formData.notes || "No additional notes",
          requestedBy: "Admin",
          appointmentId: null, // No appointment for standalone services
        }),
      });

      if (response.status === 401) {
        localStorage.clear();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add service");
      }

      toast.success("Service added successfully!");
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        estimatedHours: "",
        estimatedCost: "",
        category: "General",
        priority: "Medium",
        notes: "",
      });
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/tasks/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      toast.success("Service deleted successfully!");
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service");
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manage Services
        </h1>
        <p className="text-lg text-gray-600">
          Create and manage vehicle services and maintenance options
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for a service"
            className="pl-12 w-96 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Service Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 h-12 px-6 text-base font-semibold">
              <PlusCircle className="mr-3 h-7 w-7" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-2xl backdrop-blur-sm p-0">
            <form onSubmit={handleAddService} className="flex flex-col max-h-[85vh]">
              {/* Decorative accent */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-200/30 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-100/40 rounded-full blur-lg pointer-events-none"></div>

              <DialogHeader className="space-y-4 pb-4 border-b border-blue-200/30 px-6 pt-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                      Add New Service
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1 text-base">
                      Create a new service for your catalog - employees will select services later
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="overflow-y-auto flex-1 px-6 py-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Service Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter service name (e.g., Oil Change Service)"
                      className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Service Description *
                    </Label>
                    <Input
                      id="description"
                      placeholder="Enter service description"
                      className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="hours"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Estimated Hours *
                      </Label>
                      <Input
                        id="hours"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="e.g., 2"
                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        value={formData.estimatedHours}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedHours: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="cost"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Estimated Cost *
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 99.99"
                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        value={formData.estimatedCost}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedCost: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Category
                      </Label>
                      <select
                        id="category"
                        className="h-12 w-full border-gray-200 rounded-lg px-4 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="General">General</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Repair">Repair</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Diagnostic">Diagnostic</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="priority"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Priority
                      </Label>
                      <select
                        id="priority"
                        className="h-12 w-full border-gray-200 rounded-lg px-4 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Additional Notes
                    </Label>
                    <Input
                      id="notes"
                      placeholder="Any additional information"
                      className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-blue-200/30 px-6 py-4 gap-3 flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-8 bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:text-red-900 transition-all duration-200 font-medium"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Service"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Table */}
      <Card className="bg-white shadow-lg border-0">
        <div className="">
          <div className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6 space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              All Services
            </h3>
            <p className="text-gray-200 text-md">
              Manage and organize your vehicle service offerings
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700">
                  Service Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Service Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Estimated Hours
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Created Date
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesData.map((service) => (
                <TableRow
                  key={service.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-6 text-gray-900 font-medium">
                    {service.name}
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-gray-600">Loading services...</span>
        </div>
      ) : (
        <Card className="bg-white shadow-lg border-0">
          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">
                All Services
              </h3>
              <p className="text-gray-600 text-md">
                Manage and organize your vehicle service offerings
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="font-semibold text-gray-700">
                    Service Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Estimated Hours
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Created Date
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <TableRow
                      key={service.taskId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-6 text-gray-900 font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell className="py-6 max-w-xs">
                        <div className="text-sm text-gray-600 truncate">
                          {service.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 text-gray-700">
                        {service.estimatedHours}h
                      </TableCell>
                      <TableCell className="py-6 text-gray-700">
                        {formatDate(service.createdAt)}
                      </TableCell>
                      <TableCell className="text-center py-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeleteService(service.taskId)}
                        >
                          Delete Service
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No services found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
