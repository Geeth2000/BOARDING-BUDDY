const express = require("express");
const router = express.Router();
const {
  getOverview,
  getMonthlyStats,
  getBookingStats,
  getRevenueStats,
  getUserStats,
} = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes require admin access
router.use(protect, adminOnly);

/**
 * @route   GET /api/analytics/overview
 * @desc    Get dashboard overview (totals, counts)
 */
router.get("/overview", getOverview);

/**
 * @route   GET /api/analytics/monthly
 * @desc    Get monthly revenue and booking growth
 * @query   months - Number of months to retrieve (default: 12)
 */
router.get("/monthly", getMonthlyStats);

/**
 * @route   GET /api/analytics/bookings
 * @desc    Get booking statistics breakdown
 */
router.get("/bookings", getBookingStats);

/**
 * @route   GET /api/analytics/revenue
 * @desc    Get revenue and commission breakdown
 */
router.get("/revenue", getRevenueStats);

/**
 * @route   GET /api/analytics/users
 * @desc    Get user growth and distribution stats
 * @query   months - Number of months to retrieve (default: 6)
 */
router.get("/users", getUserStats);

module.exports = router;
