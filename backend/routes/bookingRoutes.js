const express = require("express");
const router = express.Router();
const {
  createBooking,
  getStudentBookings,
  getLandlordBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getAllBookingsAdmin,
} = require("../controllers/bookingController");
const {
  protect,
  studentOnly,
  landlordOnly,
  adminOnly,
  bookingValidation,
  bookingStatusValidation,
  mongoIdValidation,
  paginationValidation,
} = require("../middleware");

// Student routes
router.post("/", protect, studentOnly, bookingValidation, createBooking);
router.get(
  "/my-bookings",
  protect,
  studentOnly,
  paginationValidation,
  getStudentBookings,
);

// Landlord routes
router.get(
  "/landlord-bookings",
  protect,
  landlordOnly,
  paginationValidation,
  getLandlordBookings,
);
router.patch(
  "/:id/approve",
  protect,
  landlordOnly,
  mongoIdValidation(),
  approveBooking,
);
router.patch(
  "/:id/reject",
  protect,
  landlordOnly,
  mongoIdValidation(),
  bookingStatusValidation,
  rejectBooking,
);

// Admin routes
router.get(
  "/admin/all",
  protect,
  adminOnly,
  paginationValidation,
  getAllBookingsAdmin,
);

// Shared routes (authorization checked in controller)
router.get("/:id", protect, mongoIdValidation(), getBookingById);
router.delete("/:id", protect, mongoIdValidation(), cancelBooking);

module.exports = router;
