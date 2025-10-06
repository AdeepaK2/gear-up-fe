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

import { Search } from "lucide-react";

// Dummy data to populate the table
const customersData = [
  {
    id: "#CUS001",
    name: "Sophia Carter",
    email: "sophia.carter@email.com",
    phone: "0711234567",
    membership: "3 years",
    status: "Active",
    joinedDate: "2021-08-15",
  },
  {
    id: "#CUS002",
    name: "Ethan Bennett",
    email: "ethan.bennett@email.com",
    phone: "0711234568",
    membership: "2 years",
    status: "Active",
    joinedDate: "2022-03-20",
  },
  {
    id: "#CUS003",
    name: "Olivia Hayes",
    email: "olivia.hayes@email.com",
    phone: "0711234569",
    membership: "4 years",
    status: "Active",
    joinedDate: "2020-12-10",
  },
  {
    id: "#CUS004",
    name: "Liam Foster",
    email: "liam.foster@email.com",
    phone: "0711234570",
    membership: "1 year",
    status: "Inactive",
    joinedDate: "2023-06-05",
  },
  {
    id: "#CUS005",
    name: "Ava Morgan",
    email: "ava.morgan@email.com",
    phone: "0711234571",
    membership: "5 years",
    status: "Active",
    joinedDate: "2019-09-30",
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Manage Customers
        </h1>
        <p className="text-lg text-gray-600">
          View and manage customer accounts and membership information
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-12 w-96 h-12 text-base"
          />
        </div>
      </div>

      {/* Customers Table */}
      <Card className="bg-white shadow-lg border-0">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">
              All Customers
            </h3>
            <p className="text-gray-600 text-md">
              Manage customer accounts and view membership details
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700">
                  Customer Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Phone Number
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
              {customersData.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-6 text-gray-900 font-medium">
                    {customer.name}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {customer.email}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {customer.joinedDate}
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
