const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * @desc    Create a booking request (student only)
 * @route   POST /api/bookings
 * @access  Private (Student only)
 */
const createBooking = asyncHandler(async (req, res, next) => {
  const { propertyId, moveInDate, message } = req.body;

  // Validate required fields
  if (!propertyId) {
    return next(new AppError("Property ID is required", 400));
  }

  // Get property details
  const property = await Property.findById(propertyId);

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Check if property is approved and active
  if (!property.isApproved || !property.isActive) {
    return next(
      new AppError("This property is not available for booking", 400),
    );
  }

  // Prevent booking own property
  if (property.landlordId.toString() === req.user._id.toString()) {
    return next(new AppError("You cannot book your own property", 400));
  }

  // Check for existing pending or approved booking for the same property
  const existingBooking = await Booking.findOne({
    propertyId,
    studentId: req.user._id,
    status: { $in: ["pending", "approved"] },
  });

  if (existingBooking) {
    if (existingBooking.status === "pending") {
      return next(
        new AppError(
          "You already have a pending booking for this property",
          400,
        ),
      );
    }
    if (existingBooking.status === "approved") {
      return next(
        new AppError(
          "You already have an approved booking for this property",
          400,
        ),
      );
    }
  }

  // Create booking with commission auto-calculated via pre-save hook
  const booking = await Booking.create({
    propertyId,
    studentId: req.user._id,
    landlordId: property.landlordId,
    rent: property.rent,
    moveInDate,
    message,
    status: "pending",
  });

  // Populate for response
  await booking.populate([
    { path: "propertyId", select: "title location rent" },
    { path: "landlordId", select: "name email" },
  ]);

  res.status(201).json({
    success: true,
    message: "Booking request sent successfully",
    data: booking,
  });
});

/**
 * @desc    Get bookings for student (their own bookings)
 * @route   GET /api/bookings/my-bookings
 * @access  Private (Student)
 */
const getStudentBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { studentId: req.user._id };

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const bookings = await Booking.find(filter)
    .populate("propertyId", "title location rent images")
    .populate("landlordId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: bookings,
  });
});

/**
 * @desc    Get bookings for landlord (bookings on their properties)
 * @route   GET /api/bookings/landlord-bookings
 * @access  Private (Landlord)
 */
const getLandlordBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { landlordId: req.user._id };

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const bookings = await Booking.find(filter)
    .populate("propertyId", "title location rent images")
    .populate("studentId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(filter);

  // Get counts by status
  const pendingCount = await Booking.countDocuments({
    landlordId: req.user._id,
    status: "pending",
  });

  res.status(200).json({
    success: true,
    count: bookings.length,
    pendingRequests: pendingCount,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: bookings,
  });
});

/**
 * @desc    Get single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private (Student owner, Landlord owner, or Admin)
 */
const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("propertyId", "title location rent images amenities")
    .populate("studentId", "name email")
    .populate("landlordId", "name email");

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Authorization check
  const isStudent =
    booking.studentId._id.toString() === req.user._id.toString();
  const isLandlord =
    booking.landlordId._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isStudent && !isLandlord && !isAdmin) {
    return next(new AppError("Not authorized to view this booking", 403));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Approve booking (landlord only)
 * @route   PATCH /api/bookings/:id/approve
 * @access  Private (Landlord - property owner only)
 */
const approveBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Only landlord of the property can approve
  if (booking.landlordId.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to approve this booking", 403));
  }

  // Can only approve pending bookings
  if (booking.status !== "pending") {
    return next(
      new AppError(
        `Cannot approve a booking that is already ${booking.status}`,
        400,
      ),
    );
  }

  // Update status - commission is already calculated on create
  booking.status = "approved";
  booking.approvedAt = new Date();
  await booking.save();

  // Populate for response
  await booking.populate([
    { path: "propertyId", select: "title location rent" },
    { path: "studentId", select: "name email" },
  ]);

  res.status(200).json({
    success: true,
    message: "Booking approved successfully",
    data: {
      booking,
      commissionDetails: {
        rent: booking.rent,
        commissionRate: "8%",
        commissionAmount: booking.commissionAmount,
      },
    },
  });
});

/**
 * @desc    Reject booking (landlord only)
 * @route   PATCH /api/bookings/:id/reject
 * @access  Private (Landlord - property owner only)
 */
const rejectBooking = asyncHandler(async (req, res, next) => {
  const { rejectionReason } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Only landlord of the property can reject
  if (booking.landlordId.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to reject this booking", 403));
  }

  // Can only reject pending bookings
  if (booking.status !== "pending") {
    return next(
      new AppError(
        `Cannot reject a booking that is already ${booking.status}`,
        400,
      ),
    );
  }

  // Update status
  booking.status = "rejected";
  booking.rejectedAt = new Date();
  if (rejectionReason) {
    booking.rejectionReason = rejectionReason;
  }
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking rejected",
    data: booking,
  });
});

/**
 * @desc    Cancel booking (student can cancel their pending booking)
 * @route   DELETE /api/bookings/:id
 * @access  Private (Student owner only - pending bookings only)
 */
const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Only the student who made the booking can cancel
  const isStudent = booking.studentId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isStudent && !isAdmin) {
    return next(new AppError("Not authorized to cancel this booking", 403));
  }

  // Students can only cancel pending bookings
  if (isStudent && booking.status !== "pending") {
    return next(new AppError("Can only cancel pending bookings", 400));
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: {},
  });
});

/**
 * @desc    Get all bookings (admin only)
 * @route   GET /api/bookings/admin/all
 * @access  Private (Admin only)
 */
const getAllBookingsAdmin = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const bookings = await Booking.find(filter)
    .populate("propertyId", "title location rent")
    .populate("studentId", "name email")
    .populate("landlordId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(filter);

  // Commission stats
  const approvedBookings = await Booking.find({ status: "approved" });
  const totalCommission = approvedBookings.reduce(
    (sum, b) => sum + (b.commissionAmount || 0),
    0,
  );

  res.status(200).json({
    success: true,
    count: bookings.length,
    stats: {
      totalCommissionEarned: Math.round(totalCommission * 100) / 100,
      approvedBookingsCount: approvedBookings.length,
    },
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: bookings,
  });
});

module.exports = {
  createBooking,
  getStudentBookings,
  getLandlordBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getAllBookingsAdmin,
};
