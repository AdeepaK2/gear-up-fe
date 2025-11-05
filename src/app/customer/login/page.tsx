"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function CustomerLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, any valid email/password combination will work
      if (formData.email && formData.password.length >= 6) {
        // Store user session/token here in real implementation
        localStorage.setItem("customerLoggedIn", "true");
        localStorage.setItem("customerEmail", formData.email);

        // Redirect to customer dashboard
        router.push("/customer/dashboard");
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-primary backdrop-blur-sm bg-white/80 px-3 py-1.5 rounded-full border border-gray-200 transition-all duration-300 hover:bg-white shadow-sm text-sm"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Home
          </Link>
        </div>

        {/* Login Card - Compact Design */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-6">
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-gray-100 backdrop-blur-sm rounded-xl px-4 py-2.5 mb-4 border border-gray-200">
              <Image
                src="/Logo.png"
                alt="Gear Up Logo"
                width={100}
                height={30}
                className="block"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to your customer account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 backdrop-blur-sm border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-700 mr-2" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300 text-gray-900 placeholder-gray-500 text-sm ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-700 mr-2" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300 text-gray-900 placeholder-gray-500 text-sm ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 bg-white text-primary focus:ring-primary/30 focus:ring-offset-0"
                />
                <span className="ml-2 text-xs text-gray-700">Remember me</span>
              </label>
              <Link
                href="/customer/forgot-password"
                className="text-xs text-primary hover:text-secondary transition-colors underline decoration-primary/50 hover:decoration-secondary"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-primary hover:border-secondary hover:shadow-[0_4px_20px_-4px_rgba(22,49,114,0.4)] text-sm"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRight size={16} className="ml-2" />
                </div>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/customer/register"
                className="text-primary font-semibold hover:text-secondary transition-colors underline decoration-primary/50 hover:decoration-secondary"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <Link
              href="/support"
              className="text-gray-700 hover:text-primary font-medium transition-colors underline decoration-gray-400 hover:decoration-primary"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
