"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "../../lib/services/authService";
import { UserRole } from "../../lib/types/Auth";
import { DEMO_ACCOUNTS, performDemoLogin, getRedirectPath } from "../../lib/services/demoAuthService";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Call the backend login API
      const { user, token } = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Debug: Log user role
      console.log("User logged in:", user);
      console.log("User role:", user.role);

      // Route user based on their role from backend
      switch (user.role) {
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
          setError(`Invalid user role: "${user.role}". Expected CUSTOMER, EMPLOYEE, or ADMIN. Please contact support.`);
          console.error("Invalid role detected:", user.role);
          setIsLoading(false);
          return;
      }

    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const demoCredentials = DEMO_ACCOUNTS;

  const fillDemoCredentials = (demo: typeof demoCredentials[0]) => {
    setFormData({
      email: demo.email,
      password: demo.password
    });
  };

  // Direct demo login without authentication
  const handleDemoLogin = async (demo: typeof demoCredentials[0]) => {
    setIsLoading(true);
    setError("");

    try {
      // Perform demo login (creates mock token)
      performDemoLogin(demo);

      console.log("✅ Demo login successful:", demo.name);

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Route user based on their role
      const redirectPath = getRedirectPath(demo.roleEnum);
      router.push(redirectPath);

    } catch (err: any) {
      setError(err.message || "Demo login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Image
              src="/Logo.png"
              alt="Gear Up Logo"
              width={60}
              height={60}
              className="h-15 w-auto"
            />
            <span className="text-3xl font-bold text-white">Gear Up</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-ternary">
            Sign in with your credentials to access your personalized dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}



            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
              </svg>
              Demo Accounts (Quick Access):
            </h4>
            <div className="space-y-2">
              {demoCredentials.map((demo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-primary capitalize text-sm">{demo.name}</div>
                    <div className="text-gray-600 text-xs truncate">{demo.email}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{demo.description}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials(demo)}
                      className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                      title="Auto-fill login form"
                    >
                      Fill
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin(demo)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      title="Login instantly without authentication"
                    >
                      Login →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-xs text-amber-800 flex items-start">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <span>
                  <strong>Demo Mode:</strong> Click "Login →" to instantly access demo accounts without backend authentication. 
                  Click "Fill" to auto-fill credentials for regular login testing.
                </span>
              </p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-secondary font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-ternary hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
