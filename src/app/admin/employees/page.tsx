import React from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PlusCircle } from "lucide-react";

// Dummy data for the employees table
const employeesData = [
  {
    name: "Ethan Harper",
    email: "ethan.harper@example.com",
    role: "Manager",
    specialization: "Automobile",
  },
  {
    name: "Olivia Bennett",
    email: "olivia.bennett@example.com",
    role: "Developer",
    specialization: "Automobile",
  },
  {
    name: "Noah Carter",
    email: "noah.carter@example.com",
    role: "Designer",
    specialization: "Automobile",
  },
  {
    name: "Ava Mitchell",
    email: "ava.mitchell@example.com",
    role: "Analyst",
    specialization: "Automobile",
  },
  {
    name: "Liam Foster",
    email: "liam.foster@example.com",
    role: "Intern",
    specialization: "Automobile",
  },
];

export default function EmployeesPage() {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 mt-6">
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
          <span className="text-sm font-medium text-gray-600">
            Filter Employees by Role
          </span>
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
                  <Button
                    variant="link"
                    className="text-red-600 hover:text-red-800"
                  >
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
