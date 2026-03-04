const mongoose = require("mongoose");

/**
 * Review Schema for Boarding Buddy SaaS
 * Represents reviews from students on properties they've booked
 * Only allowed after booking is approved
 */
const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
      unique: true, // Prevents duplicate reviews per booking
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property ID is required"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    landlordResponse: {
      type: String,
      trim: true,
      maxlength: [500, "Response cannot exceed 500 characters"],
    },
    respondedAt: {
      type: Date,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ propertyId: 1 });
reviewSchema.index({ studentId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

/**
 * Pre-save validation to ensure booking is approved
 * This runs on create and update
 */
reviewSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Booking = mongoose.model("Booking");
    const booking = await Booking.findById(this.bookingId);

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      return next(error);
    }

    if (booking.status !== "approved") {
      const error = new Error("Can only review approved bookings");
      error.statusCode = 400;
      return next(error);
    }

    // Verify the student making the review is the one who made the booking
    if (booking.studentId.toString() !== this.studentId.toString()) {
      const error = new Error("You can only review your own bookings");
      error.statusCode = 403;
      return next(error);
    }

    // Ensure propertyId matches the booking's propertyId
    if (booking.propertyId.toString() !== this.propertyId.toString()) {
      const error = new Error("Property ID does not match the booking");
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

/**
 * Static method to get average rating for a property
 * @param {ObjectId} propertyId - Property ID
 * @returns {Promise<{averageRating: number, totalReviews: number}>}
 */
reviewSchema.statics.getPropertyRating = async function (propertyId) {
  const result = await this.aggregate([
    {
      $match: {
        propertyId: new mongoose.Types.ObjectId(propertyId),
        isVisible: true,
      },
    },
    {
      $group: {
        _id: "$propertyId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    };
  }

  return { averageRating: 0, totalReviews: 0 };
};

/**
 * Static method to check if booking already has a review
 * @param {ObjectId} bookingId - Booking ID
 * @returns {Promise<boolean>}
 */
reviewSchema.statics.hasReview = async function (bookingId) {
  const review = await this.findOne({ bookingId });
  return !!review;
};

module.exports = mongoose.model("Review", reviewSchema);
