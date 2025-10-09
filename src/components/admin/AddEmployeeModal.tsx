"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2, Copy, Mail } from 'lucide-react';
import { employeeService, CreateEmployeeRequest } from '@/lib/services/employeeService';

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({ open, onOpenChange, onSuccess }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    name: '',
    email: '',
    specialization: '',
    role: 'Technician',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{
    temporaryPassword: string;
    message: string;
  } | null>(null);

  const handleChange = (field: keyof CreateEmployeeRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Employee name is required');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Valid email is required');
      setIsLoading(false);
      return;
    }

    if (!formData.specialization.trim()) {
      setError('Specialization is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await employeeService.createEmployee(formData);
      
      setSuccess({
        temporaryPassword: response.temporaryPassword,
        message: response.message || 'Employee account created successfully!',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        specialization: '',
        role: 'Technician',
      });

      // Call onSuccess after a delay to show the success message
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to create employee account');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      specialization: '',
      role: 'Technician',
    });
    setError('');
    setSuccess(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee account. A temporary password will be generated and sent to their email.
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
                <span className="font-semibold">Temporary Login Credentials</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-600">Email</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                      {formData.email}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formData.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Temporary Password</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                      {success.temporaryPassword}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(success.temporaryPassword)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-xs ml-2">
                  These credentials have been sent to the employee's email. They should change their password after first login.
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
                  onChange={(e) => handleChange('name', e.target.value)}
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
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Employee Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange('role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Service Advisor">Service Advisor</SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleChange('specialization', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automobile">Automobile (General)</SelectItem>
                    <SelectItem value="Engine">Engine Specialist</SelectItem>
                    <SelectItem value="Transmission">Transmission</SelectItem>
                    <SelectItem value="Electrical">Electrical Systems</SelectItem>
                    <SelectItem value="Brake">Brake Systems</SelectItem>
                    <SelectItem value="Suspension">Suspension & Steering</SelectItem>
                    <SelectItem value="AC">Air Conditioning</SelectItem>
                    <SelectItem value="Bodywork">Bodywork & Paint</SelectItem>
                    <SelectItem value="Diagnostic">Diagnostic Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-xs">
                  A secure temporary password will be automatically generated and sent to the employee's email address.
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
                  'Create Employee'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
