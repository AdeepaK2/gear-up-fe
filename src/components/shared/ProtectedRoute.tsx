"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "../../lib/types/Auth";
import { authService, getUserFromToken } from "../../lib/services/authService";
import { isDemoMode } from "../../lib/services/demoAuthService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if user is authenticated
        const isAuth = authService.isAuthenticated();
        
        if (!isAuth) {
          console.warn("⚠️ Not authenticated, redirecting to login");
          router.push(redirectTo);
          return;
        }

        // Get current user from token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn("⚠️ No token found, redirecting to login");
          router.push(redirectTo);
          return;
        }

        const user = getUserFromToken(token);
        
        if (!user || !user.role) {
          console.warn("⚠️ Invalid token, redirecting to login");
          router.push(redirectTo);
          return;
        }

        // Check if user has required role
        if (user.role !== requiredRole) {
          console.warn(`⚠️ Insufficient permissions. Required: ${requiredRole}, Got: ${user.role}`);
          
          // Redirect to appropriate dashboard based on user's actual role
          switch (user.role) {
            case UserRole.CUSTOMER:
              router.push('/customer');
              break;
            case UserRole.EMPLOYEE:
              router.push('/employee');
              break;
            case UserRole.ADMIN:
              router.push('/admin');
              break;
            default:
              router.push(redirectTo);
          }
          return;
        }

        // Check if in demo mode
        const inDemoMode = isDemoMode();
        if (inDemoMode) {
          console.log("🎭 Demo mode active for role:", user.role);
        } else {
          console.log("✅ Authenticated as:", user.role);
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("❌ Auth check error:", error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthorized) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
