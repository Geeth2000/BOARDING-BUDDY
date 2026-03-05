// Auth pages
export { default as Login } from "./auth/Login";
export { default as Register } from "./auth/Register";

// Public pages
export { default as Home } from "./public/Home";
export { default as About } from "./public/About";
export { default as Contact } from "./public/Contact";
export { default as Properties } from "./public/Properties";
export { default as PropertyDetails } from "./public/PropertyDetails";

// Student pages
export { default as StudentDashboard } from "./student/Dashboard";
export { default as StudentProperties } from "./student/Properties";
export { default as StudentBookings } from "./student/Bookings";
export { default as StudentReviews } from "./student/Reviews";
export { default as StudentMessages } from "./student/Messages";

// Landlord pages
export { default as LandlordDashboard } from "./landlord/Dashboard";
export { default as AddProperty } from "./landlord/AddProperty";
export { default as EditProperty } from "./landlord/EditProperty";
export { default as MyProperties } from "./landlord/MyProperties";
export { default as BookingRequests } from "./landlord/BookingRequests";
export { default as LandlordReviews } from "./landlord/Reviews";
export { default as LandlordMessages } from "./landlord/Messages";

// Admin pages
export { default as AdminDashboard } from "./admin/Dashboard";
export { default as AdminProperties } from "./admin/Properties";
export { default as AdminBookings } from "./admin/Bookings";
export { default as AdminUsers } from "./admin/Users";
export { default as AdminReviews } from "./admin/Reviews";

// Common pages (all authenticated users)
export { default as Profile } from "./common/Profile";
export { default as Settings } from "./common/Settings";
