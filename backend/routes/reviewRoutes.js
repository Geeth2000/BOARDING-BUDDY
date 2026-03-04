const express = require("express");
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
  getReviewById,
  updateReview,
  respondToReview,
  getMyReviews,
  deleteReview,
  getAllReviewsAdmin,
} = require("../controllers/reviewController");
const {
  protect,
  studentOnly,
  landlordOnly,
  adminOnly,
} = require("../middleware");

// Specific routes MUST come before parameterized routes

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllReviewsAdmin);

// Student routes
router.post("/", protect, studentOnly, createReview);
router.get("/my-reviews", protect, studentOnly, getMyReviews);

// Public routes
router.get("/property/:propertyId", getPropertyReviews);

// Parameterized routes (must be last)
router.get("/:id", getReviewById);
router.put("/:id", protect, studentOnly, updateReview);
router.patch("/:id/respond", protect, landlordOnly, respondToReview);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;
