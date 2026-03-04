const mongoose = require("mongoose");

/**
 * Booking Schema for Boarding Buddy SaaS
 * Represents booking requests from students to landlords
 * Commission: 8% of first month rent
 */
const COMMISSION_RATE = 0.08;

const bookingSchema = new mongoose.Schema(
  {
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
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord ID is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    commissionAmount: {
      type: Number,
      min: [0, "Commission cannot be negative"],
    },
    rent: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: [0, "Rent cannot be negative"],
    },
    moveInDate: {
      type: Date,
    },
    message: {
      type: String,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    rejectionReason: {
      type: String,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ studentId: 1 });
bookingSchema.index({ landlordId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate pending bookings
bookingSchema.index(
  { propertyId: 1, studentId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

/**
 * Pre-save hook to calculate commission (8% of first month rent)
 */
bookingSchema.pre("save", function (next) {
  if (this.rent && (this.isNew || this.isModified("rent"))) {
    this.commissionAmount = Math.round(this.rent * COMMISSION_RATE * 100) / 100;
  }
  next();
});

/**
 * Pre-save hook to set approval/rejection timestamps
 */
bookingSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "approved" && !this.approvedAt) {
      this.approvedAt = new Date();
    } else if (this.status === "rejected" && !this.rejectedAt) {
      this.rejectedAt = new Date();
    }
  }
  next();
});

/**
 * Static method to calculate commission
 * @param {number} rent - Monthly rent amount
 * @returns {number} Commission amount (8% of rent)
 */
bookingSchema.statics.calculateCommission = function (rent) {
  return Math.round(rent * COMMISSION_RATE * 100) / 100;
};

/**
 * Virtual for commission rate display
 */
bookingSchema.virtual("commissionRate").get(function () {
  return `${COMMISSION_RATE * 100}%`;
});

module.exports = mongoose.model("Booking", bookingSchema);
module.exports.COMMISSION_RATE = COMMISSION_RATE;
