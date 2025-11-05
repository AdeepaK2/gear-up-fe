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
import { Search, Loader2, AlertCircle, RefreshCw, Ban, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { customerService, Customer } from "@/lib/services/customerService";
import { useToast } from "@/contexts/ToastContext";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = customers;
    if (searchQuery.trim()) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery)
      );
    }
    setFilteredCustomers(filtered);
  }, [customers, searchQuery]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load customers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBlockClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setBlockReason('');
    setBlockDialogOpen(true);
  };

  const handleBlockConfirm = async () => {
    if (!selectedCustomer || !blockReason.trim()) {
      toast.error('Please provide a reason for blocking');
      return;
    }

    setActionLoading(selectedCustomer.customerId);
    try {
      await customerService.deactivateCustomer(selectedCustomer.customerId, blockReason);
      toast.success(`Customer ${selectedCustomer.name} has been blocked and notified via email`);
      setBlockDialogOpen(false);
      setBlockReason('');
      setSelectedCustomer(null);
      await fetchCustomers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to block customer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (customer: Customer) => {
    setActionLoading(customer.customerId);
    try {
      await customerService.reactivateCustomer(customer.customerId);
      toast.success(`Customer ${customer.name} has been unblocked`);
      await fetchCustomers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unblock customer');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Manage Customers
          </h1>
          <p className="text-lg text-gray-600">
            View and manage customer accounts and membership information
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
            placeholder="Search by name, email, or phone"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchCustomers}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Customers Table */}
      <Card className="bg-white shadow-lg border-0">
        <div className="">
          <div className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6 space-y-2 mb-8">
            <h3 className="text-2xl font-semibold text-white">
              All Customers
            </h3>
            <p className="text-gray-200 text-md">
              Manage customer accounts and view membership details
            </p>
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Loading customers...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No customers found</p>
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
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    <Badge variant={customer.isActive ? "default" : "destructive"}>
                      {customer.isActive ? "Active" : "Blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {customer.isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleBlockClick(customer)}
                        disabled={actionLoading === customer.customerId}
                      >
                        {actionLoading === customer.customerId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Ban className="h-4 w-4 mr-2" />
                            Block
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleUnblock(customer)}
                        disabled={actionLoading === customer.customerId}
                      >
                        {actionLoading === customer.customerId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unblock
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Block Customer Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Customer Account</DialogTitle>
            <DialogDescription>
              You are about to block <strong>{selectedCustomer?.name}</strong>'s account.
              They will be notified via email with the reason provided below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Blocking *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for blocking this customer..."
                value={blockReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBlockReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                This reason will be included in the email notification sent to the customer.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBlockDialogOpen(false);
                setBlockReason('');
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockConfirm}
              disabled={!blockReason.trim() || actionLoading !== null}
            >
              {actionLoading !== null ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Blocking...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Block Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
