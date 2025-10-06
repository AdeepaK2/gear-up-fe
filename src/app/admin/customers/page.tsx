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
    name: "Sophia Carter",
    email: "sophia.carter@email.com",
    phone: "0711234567",
    membership: "3 years",
  },
  {
    name: "Ethan Bennett",
    email: "ethan.bennett@email.com",
    phone: "0711234567",
    membership: "2 years",
  },
  {
    name: "Olivia Hayes",
    email: "olivia.hayes@email.com",
    phone: "0711234567",
    membership: "4 years",
  },
  {
    name: "Liam Foster",
    email: "liam.foster@email.com",
    phone: "0711234567",
    membership: "1 years",
  },
  {
    name: "Ava Morgan",
    email: "ava.morgan@email.com",
    phone: "0711234567",
    membership: "5 years",
  },
];

export default function CustomersPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 mt-6">Manage Customers</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search customers"
          className="pl-10 w-full max-w-sm" // Add padding for the icon
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Membership Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customersData.map((customer) => (
              <TableRow key={customer.email}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.membership}</TableCell>
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
