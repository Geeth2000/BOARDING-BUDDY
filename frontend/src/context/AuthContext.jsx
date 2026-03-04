import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../api";

/**
 * Auth Context for Boarding Buddy
 * Manages authentication state across the application
 */
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state and functions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check authentication status on app load
   * Verifies token and fetches user data
   */
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      setError(null);
    } catch (err) {
      // Token invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User data on success
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await authAPI.login({ email, password });

      // Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    }
  };

  /**
   * Register function
   * @param {object} userData - Registration data (name, email, password, role)
   * @returns {Promise<object>} - User data on success
   */
  const register = async (userData) => {
    try {
      setError(null);
      const { data } = await authAPI.register(userData);

      // Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return data;
    } catch (err) {
      // Extract detailed validation errors if available
      let message = err.response?.data?.message || "Registration failed";
      if (err.response?.data?.errors?.length) {
        message = err.response.data.errors.map((e) => e.message).join(". ");
      }
      setError(message);
      throw new Error(message);
    }
  };

  /**
   * Logout function
   * Clears user data and token
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Continue with logout even if API call fails
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
    }
  };

  /**
   * Update user data in context
   * @param {object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isLandlord: user?.role === "landlord",
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to access auth context
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
