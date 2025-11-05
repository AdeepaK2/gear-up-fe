"use client";

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
  Search,
  PlusCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddEmployeeModal from "@/components/admin/AddEmployeeModal";
import {
  employeeService,
  Employee,
  EmployeeDependencies,
} from "@/lib/services/employeeService";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Delete confirmation states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [deleteDependencies, setDeleteDependencies] =
    useState<EmployeeDependencies | null>(null);
  const [isCheckingDependencies, setIsCheckingDependencies] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredEmployees(filtered);
  }, [employees, searchQuery]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
      toast.success("Employees loaded successfully");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load employees";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsCheckingDependencies(true);
    setShowDeleteDialog(true);

    try {
      const dependencies = await employeeService.checkDependencies(
        employee.employeeId
      );
      setDeleteDependencies(dependencies);
    } catch (err: any) {
      toast.error(err.message || "Failed to check employee dependencies");
      setShowDeleteDialog(false);
    } finally {
      setIsCheckingDependencies(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    // If employee cannot be deleted due to dependencies, show error
    if (deleteDependencies && !deleteDependencies.canDelete) {
      toast.error(
        deleteDependencies.warningMessage ||
          "Cannot delete employee with active assignments"
      );
      setShowDeleteDialog(false);
      return;
    }

    setActionLoading(employeeToDelete.employeeId);
    try {
      await employeeService.deleteEmployee(employeeToDelete.employeeId);
      toast.success(`Employee ${employeeToDelete.name} deleted successfully`);
      await fetchEmployees();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete employee");
    } finally {
      setActionLoading(null);
      setShowDeleteDialog(false);
      setEmployeeToDelete(null);
      setDeleteDependencies(null);
    }
  };

  const handleModalSuccess = () => {
    // Refresh the employee list but do NOT auto-close the modal.
    // Admin should manually close the dialog after reading the success message.
    fetchEmployees();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate delete dialog description based on dependencies
  const getDeleteDialogDescription = () => {
    if (isCheckingDependencies) {
      return "Checking employee dependencies...";
    }

    if (!deleteDependencies) {
      return "Are you sure you want to delete this employee?";
    }

    if (!deleteDependencies.canDelete) {
      return `Cannot delete this employee!\n\n${deleteDependencies.warningMessage}\n\nPlease reassign or complete their appointments before deleting this employee.`;
    }

    return `Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Manage Employees
          </h1>
          <p className="text-lg text-gray-600">
            View and manage employee accounts and assignments
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name, email, or specialization"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="whitespace-nowrap"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Employee
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchEmployees}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Employees Table */}
      <Card className="bg-white shadow-lg border-0">
        <div className="">
          <div className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
            <h3 className="text-2xl font-semibold text-white">
              All Employees
            </h3>
            <p className="text-white text-md">
              Manage employee accounts and team information
            </p>
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Loading employees...</span>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No employees found</p>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search criteria
              </p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.specialization}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(employee.hireDate)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(employee.createdAt)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={actionLoading === employee.employeeId}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(employee)}
                      disabled={actionLoading === employee.employeeId}
                    >
                      {actionLoading === employee.employeeId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <AddEmployeeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleModalSuccess}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={
          isCheckingDependencies ? "Checking Dependencies" : "Delete Employee"
        }
        description={getDeleteDialogDescription()}
        confirmText={
          isCheckingDependencies
            ? "Checking..."
            : deleteDependencies && !deleteDependencies.canDelete
            ? "Close"
            : "Delete"
        }
        cancelText={
          deleteDependencies && !deleteDependencies.canDelete
            ? undefined
            : "Cancel"
        }
        variant={
          deleteDependencies && !deleteDependencies.canDelete
            ? "default"
            : "destructive"
        }
        onConfirm={
          deleteDependencies && !deleteDependencies.canDelete
            ? () => setShowDeleteDialog(false)
            : handleDeleteConfirm
        }
      />
    </div>
  );
}
