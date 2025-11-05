'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Car,
  Calendar,
  UserCog,
  CalendarCheck,
  AlertTriangle,
} from 'lucide-react';
import ProjectHeader from '@/components/customer/ProjectHeader';
import ProjectInfoTile from '@/components/customer/ProjectInfoTile';
import ServiceStatsRow from '@/components/customer/ServiceStatsRow';
import RecommendedServicesSection from '@/components/customer/RecommendedServicesSection';
import SelectionReviewCard from '@/components/customer/SelectionReviewCard';
import AcceptedServicesSection from '@/components/customer/AcceptedServicesSection';
import ProjectActionsCard from '@/components/customer/ProjectActionsCard';
import AdditionalServiceRequest from '@/components/customer/AdditionalServiceRequest';
import { ProjectData, Service } from '@/lib/types/Project';
import { cn } from '@/lib/utils';
import { formatCurrencyLKR } from '@/lib/utils/currency';
import { formatDateLK } from '@/lib/utils/datetime';
import { projectStatusConfig, getStatusIcon } from '@/lib/config/projectStatus';
import type { ServiceProgress } from '@/components/customer/ServiceProgressBadge';
import { projectService } from '@/lib/services/projectService';

/**
 * Mock project data - acts as initial state until backend integration.
 * Keep this structure stable to maintain UI contract with future API endpoints.
 */
const mockProject: ProjectData = {
  id: 'proj_001',
  appointmentId: 'apt_001',
  customerId: 'cust_001',
  vehicleId: 'veh_001',
  vehicleName: '2020 Toyota Camry',
  vehicleDetails: 'License: ABC-123',
  consultationType: 'general-checkup',
  consultationDate: '2025-10-15',
  employeeId: 'emp_001',
  employeeName: 'John Smith',
  status: 'waiting-confirmation',
  services: [
    {
      id: 'srv_001',
      name: 'Engine Oil Change',
      description:
        'Replace engine oil and filter with high-quality synthetic oil. Includes inspection of oil levels and engine condition.',
      estimatedDuration: '45 minutes',
      estimatedCost: 15000.0,
      status: 'accepted',
      category: 'Maintenance',
      priority: 'high',
      notes:
        'Due for oil change based on mileage. Recommend synthetic oil for better engine protection.',
      requestedBy: 'employee',
      createdAt: '2025-10-15T10:00:00Z',
    },
    {
      id: 'srv_002',
      name: 'Brake Pad Replacement',
      description:
        'Replace front brake pads with OEM parts. Includes rotor inspection and brake fluid level check.',
      estimatedDuration: '2 hours',
      estimatedCost: 45000.0,
      status: 'accepted',
      category: 'Safety',
      priority: 'medium',
      notes:
        'Front brake pads are at 20% remaining. Recommend replacement soon for optimal braking performance.',
      requestedBy: 'employee',
      createdAt: '2025-10-15T10:00:00Z',
    },
    {
      id: 'srv_003',
      name: 'Air Filter Replacement',
      description:
        'Replace engine air filter to improve air flow and engine efficiency.',
      estimatedDuration: '20 minutes',
      estimatedCost: 8500.0,
      status: 'recommended',
      category: 'Maintenance',
      priority: 'low',
      notes:
        'Air filter is moderately dirty. Replacement will improve fuel efficiency.',
      requestedBy: 'employee',
      createdAt: '2025-10-15T10:00:00Z',
    },
    {
      id: 'srv_004',
      name: 'Battery Test & Clean',
      description:
        'Test battery performance and clean battery terminals for optimal electrical connection.',
      estimatedDuration: '30 minutes',
      estimatedCost: 5000.0,
      status: 'recommended',
      category: 'Electrical',
      priority: 'low',
      requestedBy: 'employee',
      createdAt: '2025-10-15T10:00:00Z',
    },
  ],
  additionalRequests: [],
  totalEstimatedCost: 73500.0,
  totalAcceptedCost: 0,
  acceptedServicesCount: 0,
  createdAt: '2025-10-15T10:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
};

/**
 * ProjectsPage - Customer project management dashboard.
 *
 * @description Orchestrates state for project service selection and management.
 * Delegates presentation to extracted components following SRP. Uses mock data
 * until backend API endpoints are available.
 */
export default function ProjectsPage() {
  const [project, setProject] = useState<ProjectData>(mockProject);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProjects, setHasProjects] = useState(false);
  const [serviceProgress, setServiceProgress] = useState<
    Record<string, ServiceProgress>
  >({});

  /**
   * Memoized status configuration lookup.
   * Avoids repeated object lookups on every render.
   */
  const statusInfo = useMemo(
    () => projectStatusConfig[project.status],
    [project.status]
  );

  /**
   * Memoized list of accepted services.
   * Recalculates only when services array changes.
   */
  const acceptedServices = useMemo(
    () => project.services.filter((s) => s.status === 'accepted'),
    [project.services]
  );

  /**
   * Memoized total cost calculation.
   * Sums up costs only when accepted services change.
   */
  const totalAcceptedCost = useMemo(
    () =>
      acceptedServices.reduce((sum, service) => sum + service.estimatedCost, 0),
    [acceptedServices]
  );

  /**
   * Accepts a recommended service, adding it to customer's selection.
   */
  const acceptService = useCallback(async (serviceId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === serviceId
            ? { ...service, status: 'accepted' as const }
            : service
        ),
        updatedAt: new Date().toISOString(),
      }));

      // Initialize service progress as not-started
      setServiceProgress((prev) => ({
        ...prev,
        [serviceId]: 'not-started',
      }));
    } catch (error) {
      console.error('Error accepting service:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Rejects an accepted service, removing it from selection.
   */
  const rejectService = useCallback(async (serviceId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === serviceId
            ? { ...service, status: 'recommended' as const }
            : service
        ),
        updatedAt: new Date().toISOString(),
      }));

      // Remove from progress tracking when unselected
      setServiceProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[serviceId];
        return newProgress;
      });
    } catch (error) {
      console.error('Error unselecting service:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cancels an accepted service with validation.
   * Only allows cancellation if service hasn't started.
   */
  const cancelService = useCallback(
    async (serviceId: string) => {
      const progress = serviceProgress[serviceId] || 'not-started';

      // Business rule: cannot cancel services that have started
      if (progress !== 'not-started') {
        return;
      }

      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setProject((prev) => ({
          ...prev,
          services: prev.services.map((service) =>
            service.id === serviceId
              ? { ...service, status: 'cancelled' as const }
              : service
          ),
          updatedAt: new Date().toISOString(),
        }));

        // Remove from progress tracking
        setServiceProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[serviceId];
          return newProgress;
        });
      } catch (error) {
        console.error('Error cancelling service:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [serviceProgress]
  );

  /**
   * Confirms all selected services, moving project to confirmed status.
   */
  const confirmServices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProject((prev) => ({
        ...prev,
        status: 'confirmed',
        totalAcceptedCost,
        acceptedServicesCount: acceptedServices.length,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error confirming services:', error);
    } finally {
      setIsLoading(false);
    }
  }, [totalAcceptedCost, acceptedServices.length]);

  /**
   * Handles additional service request submission.
   */
  const submitAdditionalRequest = useCallback(
    async (request: { customRequest: string; referenceFile?: File }) => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newService: Service = {
          id: crypto.randomUUID ? crypto.randomUUID() : `srv_${Date.now()}`,
          name: 'Custom Service Request',
          description: request.customRequest,
          estimatedDuration: 'TBD',
          estimatedCost: 0,
          status: 'requested',
          category: 'Custom',
          requestedBy: 'customer',
          createdAt: new Date().toISOString(),
        };

        setProject((prev) => ({
          ...prev,
          services: [...prev.services, newService],
          updatedAt: new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error submitting additional service request:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Cancels the entire project.
   * Only allowed if no services have been accepted.
   */
  const cancelProject = useCallback(async () => {
    // Business rule: cannot cancel if services accepted
    if (acceptedServices.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error cancelling project:', error);
    } finally {
      setIsLoading(false);
    }
  }, [acceptedServices.length]);

  /**
   * Fetch projects from backend on component mount
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await projectService.getAllProjectsForCurrentCustomer();
        setProjects(projectsData);
        setHasProjects(projectsData.length > 0);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setHasProjects(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Show loading state
  if (isLoading && !hasProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no projects
  if (!hasProjects || projects.length === 0) {
    return (
      <div className="min-h-screen space-y-6 p-6">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <div className="text-white/90 font-normal mt-2">
                No projects available yet
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Projects Found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any projects yet. Projects are created after appointments are completed
              and service reports are submitted by employees.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/customer/appointments"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book an Appointment
              </a>
              <a
                href="/customer/dashboard"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <ProjectHeader />

      {/* Project Details Card */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-8">
          <CardTitle className="flex items-center gap-4">
            <div
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
              aria-hidden="true"
            >
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Project Details</h2>
              <div className="text-white/90 font-normal flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Based on your consultation on{' '}
                {new Date(project.consultationDate).toLocaleDateString()}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          {/* Project Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ProjectInfoTile
              Icon={Car}
              label={project.vehicleName}
              sublabel={project.vehicleDetails}
            />

            <ProjectInfoTile
              Icon={UserCog}
              label={project.employeeName}
              sublabel="Your Technician"
            />

            <ProjectInfoTile
              Icon={CalendarCheck}
              label={new Date(project.consultationDate).toLocaleDateString()}
              sublabel="Consultation Date"
            />

            <ProjectInfoTile
              Icon={getStatusIcon(project.status) as any}
              label=""
              sublabel="Current Status"
            >
              <Badge
                className={cn(
                  'text-sm font-semibold px-3 py-1 mb-2',
                  statusInfo.color,
                  statusInfo.bgColor,
                  'border-2'
                )}
                aria-label={`Project status: ${statusInfo.label}`}
              >
                {statusInfo.label}
              </Badge>
            </ProjectInfoTile>
          </div>

          {/* Service Statistics */}
          <ServiceStatsRow
            totalServices={project.services.length}
            selectedServices={acceptedServices.length}
            totalCost={totalAcceptedCost}
          />
        </CardContent>
      </Card>

      {/* Recommended Services */}
      <RecommendedServicesSection
        services={project.services}
        projectStatus={project.status}
        onSelect={acceptService}
        isLoading={isLoading}
      />

      {/* Service Confirmation Review */}
      {acceptedServices.length > 0 &&
        project.status === 'waiting-confirmation' && (
          <SelectionReviewCard
            acceptedServices={acceptedServices}
            totalCost={totalAcceptedCost}
            onUnselect={rejectService}
            onConfirm={confirmServices}
            isLoading={isLoading}
          />
        )}

      {/* Accepted Services with Progress */}
      {acceptedServices.length > 0 &&
        project.status !== 'waiting-confirmation' && (
          <AcceptedServicesSection
            acceptedServices={acceptedServices}
            projectStatus={project.status}
            serviceProgress={serviceProgress}
            onCancel={cancelService}
            isLoading={isLoading}
          />
        )}

      {/* Additional Service Request */}
      {project.status === 'waiting-confirmation' &&
        acceptedServices.length > 0 && (
          <AdditionalServiceRequest
            onSubmit={submitAdditionalRequest}
            isLoading={isLoading}
            disabled={project.status !== 'waiting-confirmation'}
          />
        )}

      {/* Project Actions - No Services Selected */}
      {project.status === 'waiting-confirmation' &&
        acceptedServices.length === 0 && (
          <ProjectActionsCard
            onCancelProject={cancelProject}
            isLoading={isLoading}
          />
        )}

      {/* Service Status Information */}
      {(project.status === 'confirmed' || acceptedServices.length > 0) && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg" aria-hidden="true">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Service Progress Information
                </h3>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>
                    • <strong>Not Started:</strong> You can still cancel these
                    services without any charges
                  </p>
                  <p>
                    • <strong>In Progress:</strong> Service work has begun -
                    cancellation may incur charges
                  </p>
                  <p>
                    • <strong>Completed:</strong> Service has been finished and
                    quality checked
                  </p>
                </div>
                <p className="text-blue-700 text-sm mt-3 font-medium">
                  All prices are displayed in Sri Lankan Rupees (LKR)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
