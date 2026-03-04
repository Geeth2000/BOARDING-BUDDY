const express = require("express");
const router = express.Router();
const {
  createProperty,
  getMyProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getBookings,
  updateBookingStatus,
  getReviews,
  respondToReview,
  getConversations,
  getMessages,
  sendMessage,
  getDashboardStats,
} = require("../controllers/landlordController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require authentication and landlord role
router.use(protect);
router.use(authorize("landlord"));

// Dashboard stats
router.get("/stats", getDashboardStats);

// Property routes
router.route("/properties").get(getMyProperties).post(createProperty);

router
  .route("/properties/:id")
  .get(getProperty)
  .put(updateProperty)
  .delete(deleteProperty);

// Booking routes
router.get("/bookings", getBookings);
router.put("/bookings/:id", updateBookingStatus);

// Review routes
router.get("/reviews", getReviews);
router.put("/reviews/:id", respondToReview);

// Message routes
router.route("/messages").get(getConversations).post(sendMessage);

router.get("/messages/:conversationId", getMessages);

module.exports = router;
