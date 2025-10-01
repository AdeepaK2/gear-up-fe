"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { UserRole } from "../types/Auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        router.push(redirectTo);
        return;
      }

      // Check if user has required role
      if (allowedRoles.length > 0 && !authService.hasAnyRole(allowedRoles)) {
        // Redirect to appropriate dashboard based on user's actual role
        const userRole = authService.getUserRole();
        switch (userRole) {
          case UserRole.CUSTOMER:
            router.push("/customer");
            break;
          case UserRole.EMPLOYEE:
            router.push("/employee");
            break;
          case UserRole.ADMIN:
            router.push("/admin");
            break;
          default:
            router.push("/login");
        }
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}