const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * @desc    Create a review (only students with approved bookings)
 * @route   POST /api/reviews
 * @access  Private (Student only)
 */
const createReview = asyncHandler(async (req, res, next) => {
  const { bookingId, rating, comment } = req.body;

  // Validate required fields
  if (!bookingId || !rating) {
    return next(new AppError("Booking ID and rating are required", 400));
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return next(new AppError("Rating must be between 1 and 5", 400));
  }

  // Get booking details
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Verify the student owns this booking
  if (booking.studentId.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only review your own bookings", 403));
  }

  // Check if booking is approved
  if (booking.status !== "approved") {
    return next(new AppError("Can only review approved bookings", 400));
  }

  // Check for existing review
  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    return next(new AppError("You have already reviewed this booking", 400));
  }

  // Create review
  const review = await Review.create({
    bookingId,
    propertyId: booking.propertyId,
    studentId: req.user._id,
    rating,
    comment,
  });

  // Populate for response
  await review.populate([
    { path: "propertyId", select: "title location" },
    { path: "studentId", select: "name" },
  ]);

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    data: review,
  });
});

/**
 * @desc    Get reviews for a property
 * @route   GET /api/reviews/property/:propertyId
 * @access  Public
 */
const getPropertyReviews = asyncHandler(async (req, res, next) => {
  const { propertyId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Verify property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Get reviews
  const filter = { propertyId, isVisible: true };

  const reviews = await Review.find(filter)
    .populate("studentId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  // Get rating stats
  const ratingStats = await Review.getPropertyRating(propertyId);

  res.status(200).json({
    success: true,
    count: reviews.length,
    stats: ratingStats,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: reviews,
  });
});

/**
 * @desc    Get single review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate("propertyId", "title location")
    .populate("studentId", "name");

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Update review (student can update their own review)
 * @route   PUT /api/reviews/:id
 * @access  Private (Review owner only)
 */
const updateReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Only the student who wrote the review can update it
  if (review.studentId.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to update this review", 403));
  }

  // Validate rating if provided
  if (rating && (rating < 1 || rating > 5)) {
    return next(new AppError("Rating must be between 1 and 5", 400));
  }

  // Update fields
  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

/**
 * @desc    Landlord responds to a review
 * @route   PATCH /api/reviews/:id/respond
 * @access  Private (Landlord - property owner only)
 */
const respondToReview = asyncHandler(async (req, res, next) => {
  const { response } = req.body;

  if (!response) {
    return next(new AppError("Response is required", 400));
  }

  const review = await Review.findById(req.params.id).populate("propertyId");

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Verify landlord owns the property
  if (review.propertyId.landlordId.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to respond to this review", 403));
  }

  review.landlordResponse = response;
  review.respondedAt = new Date();
  await review.save();

  res.status(200).json({
    success: true,
    message: "Response added successfully",
    data: review,
  });
});

/**
 * @desc    Get student's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private (Student)
 */
const getMyReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { studentId: req.user._id };

  const reviews = await Review.find(filter)
    .populate("propertyId", "title location images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: reviews,
  });
});

/**
 * @desc    Delete review (admin only)
 * @route   DELETE /api/reviews/:id
 * @access  Private (Admin only)
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    data: {},
  });
});

/**
 * @desc    Get all reviews (admin only)
 * @route   GET /api/reviews/admin/all
 * @access  Private (Admin only)
 */
const getAllReviewsAdmin = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.rating) {
    filter.rating = parseInt(req.query.rating, 10);
  }

  const reviews = await Review.find(filter)
    .populate("propertyId", "title location")
    .populate("studentId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: reviews,
  });
});

module.exports = {
  createReview,
  getPropertyReviews,
  getReviewById,
  updateReview,
  respondToReview,
  getMyReviews,
  deleteReview,
  getAllReviewsAdmin,
};
