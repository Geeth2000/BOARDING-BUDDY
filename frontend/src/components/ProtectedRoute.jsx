import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context";

/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

/**
 * Role-based redirect paths
 */
const roleRedirects = {
  student: "/student/dashboard",
  landlord: "/landlord/dashboard",
  admin: "/admin/dashboard",
};

/**
 * Protected Route Component
 * Restricts access to authenticated users only
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Redirect path if not authenticated (default: /login)
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

/**
 * Role Protected Route Component
 * Restricts access to users with specific roles
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of allowed roles
 * @param {string} props.redirectTo - Redirect path if not authenticated (default: /login)
 * @param {string} props.unauthorizedRedirect - Redirect path if role not allowed (default: role dashboard)
 */
export const RoleProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/login",
  unauthorizedRedirect,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!allowedRoles || !allowedRoles.includes(user.role)) {
    const redirect = unauthorizedRedirect || roleRedirects[user.role] || "/";
    return <Navigate to={redirect} replace />;
  }

  return children || <Outlet />;
};

/**
 * Student Route Component
 * Only accessible to students (and admins)
 */
export const StudentRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["student", "admin"]}>
    {children}
  </RoleProtectedRoute>
);

/**
 * Landlord Route Component
 * Only accessible to landlords (and admins)
 */
export const LandlordRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["landlord", "admin"]}>
    {children}
  </RoleProtectedRoute>
);

/**
 * Admin Route Component
 * Only accessible to admins
 */
export const AdminRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["admin"]}>{children}</RoleProtectedRoute>
);

/**
 * Guest Route Component
 * Only accessible to non-authenticated users
 * Redirects authenticated users to their dashboard
 */
export const GuestRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
