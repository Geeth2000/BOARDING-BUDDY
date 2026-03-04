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
  reviewValidation,
  mongoIdValidation,
  paginationValidation,
} = require("../middleware");

// Specific routes MUST come before parameterized routes

// Admin routes
router.get(
  "/admin/all",
  protect,
  adminOnly,
  paginationValidation,
  getAllReviewsAdmin,
);

// Student routes
router.post("/", protect, studentOnly, reviewValidation, createReview);
router.get(
  "/my-reviews",
  protect,
  studentOnly,
  paginationValidation,
  getMyReviews,
);

// Public routes
router.get(
  "/property/:propertyId",
  mongoIdValidation("propertyId"),
  paginationValidation,
  getPropertyReviews,
);

// Parameterized routes (must be last)
router.get("/:id", mongoIdValidation(), getReviewById);
router.put("/:id", protect, studentOnly, mongoIdValidation(), updateReview);
router.patch(
  "/:id/respond",
  protect,
  landlordOnly,
  mongoIdValidation(),
  respondToReview,
);
router.delete("/:id", protect, adminOnly, mongoIdValidation(), deleteReview);

module.exports = router;
