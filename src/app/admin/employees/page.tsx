"use client"; // This is a client component to manage the dialog state

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PlusCircle, UserPlus } from "lucide-react";

// Dummy data for the employees table
const employeesData = [
  {
    name: "Ethan Harper",
    email: "ethan.harper@example.com",
    role: "Manager",
    specialization: "Automobile",
    joinedDate: "2024-01-15",
  },
  {
    name: "Olivia Bennett",
    email: "olivia.bennett@example.com",
    role: "Developer",
    specialization: "Automobile",
    joinedDate: "2024-02-20",
  },
  {
    name: "Noah Carter",
    email: "noah.carter@example.com",
    role: "Designer",
    specialization: "Automobile",
    joinedDate: "2024-03-10",
  },
  {
    name: "Ava Mitchell",
    email: "ava.mitchell@example.com",
    role: "Analyst",
    specialization: "Automobile",
    joinedDate: "2024-04-05",
  },
  {
    name: "Liam Foster",
    email: "liam.foster@example.com",
    role: "Intern",
    specialization: "Automobile",
    joinedDate: "2024-05-12",
  },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Manage Employees
        </h1>
        <p className="text-lg text-gray-600">
          Manage employee accounts and team information
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-12 w-96 h-12 text-base"
          />
        </div>

        {/* Add Employee Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 h-12 px-6 text-base font-semibold">
              <UserPlus className="mr-3 h-7 w-7" />
              Add New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-2xl backdrop-blur-sm">
            <div className="relative">
              {/* Decorative accent */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-100/40 rounded-full blur-lg"></div>

              <DialogHeader className="space-y-4 pb-6 border-b border-blue-200/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                      Add New Employee
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1 text-base">
                      Create a new employee account
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200">
                      <SelectValue placeholder="Select employee role" />
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

                <div className="space-y-2">
                  <Label
                    htmlFor="specialization"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    placeholder="Enter specialization area"
                    className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                </div>
              </div>

              <DialogFooter className="border-t border-blue-200/30 pt-6 gap-3">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-8 bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:text-red-900 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Add Employee
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Card className="bg-white shadow-lg border-0">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">
              All Employees
            </h3>
            <p className="text-gray-600 text-md">
              Manage employee accounts and team information
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700">
                  Employee Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Specialization
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Joined Date
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData.map((employee) => (
                <TableRow
                  key={employee.email}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-6 text-gray-900 font-medium">
                    {employee.name}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {employee.email}
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {employee.specialization}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {employee.joinedDate}
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Deactivate Account
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
