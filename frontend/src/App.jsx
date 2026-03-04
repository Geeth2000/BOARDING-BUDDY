import { Routes, Route, Navigate } from "react-router-dom";
import {
  ProtectedRoute,
  GuestRoute,
  StudentRoute,
  LandlordRoute,
  AdminRoute,
} from "./components";
import { DashboardLayout } from "./layouts";
import {
  Login,
  Register,
  StudentDashboard,
  LandlordDashboard,
  AdminDashboard,
} from "./pages";

/**
 * Main App Component
 * Sets up routing with role-based access control
 */
function App() {
  return (
    <Routes>
      {/* Public routes - only for guests */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes - requires authentication */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard layout wrapper */}
        <Route element={<DashboardLayout />}>
          {/* Student routes */}
          <Route element={<StudentRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/properties"
              element={<PlaceholderPage title="Browse Properties" />}
            />
            <Route
              path="/student/bookings"
              element={<PlaceholderPage title="My Bookings" />}
            />
            <Route
              path="/student/reviews"
              element={<PlaceholderPage title="My Reviews" />}
            />
            <Route
              path="/student/messages"
              element={<PlaceholderPage title="Messages" />}
            />
          </Route>

          {/* Landlord routes */}
          <Route element={<LandlordRoute />}>
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route
              path="/landlord/properties"
              element={<PlaceholderPage title="My Properties" />}
            />
            <Route
              path="/landlord/bookings"
              element={<PlaceholderPage title="Booking Requests" />}
            />
            <Route
              path="/landlord/reviews"
              element={<PlaceholderPage title="Reviews" />}
            />
            <Route
              path="/landlord/messages"
              element={<PlaceholderPage title="Messages" />}
            />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/properties"
              element={<PlaceholderPage title="Manage Properties" />}
            />
            <Route
              path="/admin/bookings"
              element={<PlaceholderPage title="Manage Bookings" />}
            />
            <Route
              path="/admin/users"
              element={<PlaceholderPage title="Manage Users" />}
            />
            <Route
              path="/admin/reviews"
              element={<PlaceholderPage title="Manage Reviews" />}
            />
          </Route>

          {/* Common protected routes */}
          <Route
            path="/profile"
            element={<PlaceholderPage title="Profile" />}
          />
          <Route
            path="/settings"
            element={<PlaceholderPage title="Settings" />}
          />
        </Route>
      </Route>

      {/* Redirect root to login or dashboard */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/**
 * Placeholder Page Component
 * Used for routes that are not yet implemented
 */
function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-gray-600">This page is under construction.</p>
      <div className="mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
        <span className="text-6xl">🚧</span>
      </div>
    </div>
  );
}

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-700">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/login"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
}

export default App;
