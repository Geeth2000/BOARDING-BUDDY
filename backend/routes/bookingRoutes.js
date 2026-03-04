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
} = require("../middleware");

// Student routes
router.post("/", protect, studentOnly, createBooking);
router.get("/my-bookings", protect, studentOnly, getStudentBookings);

// Landlord routes
router.get("/landlord-bookings", protect, landlordOnly, getLandlordBookings);
router.patch("/:id/approve", protect, landlordOnly, approveBooking);
router.patch("/:id/reject", protect, landlordOnly, rejectBooking);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllBookingsAdmin);

// Shared routes (authorization checked in controller)
router.get("/:id", protect, getBookingById);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
