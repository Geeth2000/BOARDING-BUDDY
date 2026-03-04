const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  deleteProperty,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllReviews,
  deleteReview,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Properties routes
router.get("/properties", getAllProperties);
router.delete("/properties/:id", deleteProperty);

// Bookings routes
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);

// Users routes
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Reviews routes
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

module.exports = router;
