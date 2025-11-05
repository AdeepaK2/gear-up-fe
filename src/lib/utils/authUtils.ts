/**
 * Authentication utility functions
 * Provides consistent token management across the application
 */

/**
 * Get the authentication token from localStorage
 * Checks both 'accessToken' and 'token' keys for compatibility
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Handle authentication errors
 * Clears storage and provides user-friendly error message
 */
export const handleAuthError = (response: Response): Error => {
  if (response.status === 401) {
    localStorage.clear();
    return new Error("Session expired. Please login again.");
  }
  return new Error(`Request failed with status ${response.status}`);
};

/**
 * Make an authenticated API request
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise with the response
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.clear();
    throw new Error("Session expired. Please login again.");
  }

  return response;
};
