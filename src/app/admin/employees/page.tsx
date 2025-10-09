"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, PlusCircle, Loader2, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AddEmployeeModal from '@/components/admin/AddEmployeeModal';
import { employeeService, Employee } from '@/lib/services/employeeService';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search and role
  useEffect(() => {
    let filtered = employees;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, roleFilter]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
      // Use dummy data as fallback for demo
      const dummyData: Employee[] = [
        { 
          id: '1', 
          name: 'Ethan Harper', 
          email: 'ethan.harper@example.com', 
          role: 'Manager', 
          specialization: 'Automobile',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        { 
          id: '2', 
          name: 'Olivia Bennett', 
          email: 'olivia.bennett@example.com', 
          role: 'Technician', 
          specialization: 'Engine',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        { 
          id: '3', 
          name: 'Noah Carter', 
          email: 'noah.carter@example.com', 
          role: 'Mechanic', 
          specialization: 'Transmission',
          createdAt: new Date().toISOString(),
          isActive: true
        },
      ];
      setEmployees(dummyData);
      setFilteredEmployees(dummyData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async (employeeId: string) => {
    if (!confirm('Are you sure you want to deactivate this employee account?')) {
      return;
    }

    setActionLoading(employeeId);
    try {
      await employeeService.deactivateEmployee(employeeId);
      await fetchEmployees();
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate employee');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendPassword = async (employeeId: string) => {
    if (!confirm('Send a new temporary password to this employee?')) {
      return;
    }

    setActionLoading(employeeId);
    try {
      await employeeService.resendTemporaryPassword(employeeId);
      alert('Temporary password sent successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to resend password');
    } finally {
      setActionLoading(null);
    }
  };

  const handleModalSuccess = () => {
    fetchEmployees();
    setTimeout(() => {
      setIsModalOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Employees</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Employee
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter and Search Section */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search employees by name or email"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Filter by Role:</span>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
              <SelectItem value="Mechanic">Mechanic</SelectItem>
              <SelectItem value="Service Advisor">Service Advisor</SelectItem>
              <SelectItem value="Specialist">Specialist</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchEmployees}
            disabled={isLoading}
            title="Refresh employees list"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Employees Table */}
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
            <p className="text-sm">
              {searchQuery || roleFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Click "Add New Employee" to create your first employee account'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{employee.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.specialization}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.isActive ? "default" : "destructive"}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResendPassword(employee.id)}
                      disabled={actionLoading === employee.id}
                      title="Resend temporary password"
                    >
                      {actionLoading === employee.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className={employee.isActive ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}
                      onClick={() => handleDeactivate(employee.id)}
                      disabled={actionLoading === employee.id}
                    >
                      {employee.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Employees</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Employee
        </Button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search employees"
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Filter Employees by Role</span>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employees Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesData.map((employee) => (
              <TableRow key={employee.email}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{employee.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{employee.specialization}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="link" className="text-red-600 hover:text-red-800">
                    Deactivate Account
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
