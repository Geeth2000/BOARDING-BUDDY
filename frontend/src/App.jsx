import { Routes, Route } from "react-router-dom";
import {
  ProtectedRoute,
  GuestRoute,
  StudentRoute,
  LandlordRoute,
  AdminRoute,
} from "./components";
import { DashboardLayout, PublicLayout } from "./layouts";
import {
  Login,
  Register,
  Home,
  About,
  Contact,
  Properties,
  PropertyDetails,
  StudentDashboard,
  StudentProperties,
  StudentBookings,
  StudentReviews,
  StudentMessages,
  LandlordDashboard,
  AddProperty,
  EditProperty,
  MyProperties,
  BookingRequests,
  LandlordReviews,
  LandlordMessages,
  AdminDashboard,
  AdminProperties,
  AdminBookings,
  AdminUsers,
  AdminReviews,
  Profile,
  Settings,
} from "./pages";

/**
 * Main App Component
 * Sets up routing with role-based access control
 */
function App() {
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
      </Route>

      {/* Auth routes - only for guests */}
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
            <Route path="/student/properties" element={<StudentProperties />} />
            <Route path="/student/bookings" element={<StudentBookings />} />
            <Route path="/student/reviews" element={<StudentReviews />} />
            <Route path="/student/messages" element={<StudentMessages />} />
          </Route>

          {/* Landlord routes */}
          <Route element={<LandlordRoute />}>
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/add-property" element={<AddProperty />} />
            <Route
              path="/landlord/edit-property/:id"
              element={<EditProperty />}
            />
            <Route path="/landlord/properties" element={<MyProperties />} />
            <Route path="/landlord/bookings" element={<BookingRequests />} />
            <Route path="/landlord/reviews" element={<LandlordReviews />} />
            <Route path="/landlord/messages" element={<LandlordMessages />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
          </Route>

          {/* Common protected routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
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
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
}

export default App;
