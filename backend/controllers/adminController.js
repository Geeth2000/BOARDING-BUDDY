const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * @desc    Get all properties (admin)
 * @route   GET /api/admin/properties
 * @access  Private/Admin
 */
const getAllProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const properties = await Property.find()
    .populate("landlord", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments();

  res.status(200).json({
    success: true,
    data: properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Delete a property (admin)
 * @route   DELETE /api/admin/properties/:id
 * @access  Private/Admin
 */
const deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
});

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const bookings = await Booking.find()
    .populate("property", "title images price")
    .populate("student", "name email")
    .populate("landlord", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments();

  res.status(200).json({
    success: true,
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Update booking status (admin)
 * @route   PUT /api/admin/bookings/:id/status
 * @access  Private/Admin
 */
const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!validStatuses.includes(status)) {
    return next(
      new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400,
      ),
    );
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking,
  });
});

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Update user role (admin)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const validRoles = ["student", "landlord", "admin"];

  if (!validRoles.includes(role)) {
    return next(
      new AppError(
        `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        400,
      ),
    );
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Prevent removing the last admin
  if (user.role === "admin" && role !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return next(new AppError("Cannot remove the last admin", 400));
    }
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

/**
 * @desc    Delete user (admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("Cannot delete your own account", 400));
  }

  // Prevent deleting the last admin
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return next(new AppError("Cannot delete the last admin", 400));
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

/**
 * @desc    Get all reviews (admin)
 * @route   GET /api/admin/reviews
 * @access  Private/Admin
 */
const getAllReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find()
    .populate("property", "title")
    .populate("student", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments();

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Delete review (admin)
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private/Admin
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProperties,
    totalBookings,
    pendingBookings,
    totalReviews,
    usersByRole,
    recentUsers,
    recentBookings,
  ] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Review.countDocuments(),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt"),
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property", "title")
      .populate("student", "name"),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProperties,
      totalBookings,
      pendingBookings,
      totalReviews,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentUsers,
      recentBookings,
    },
  });
});

module.exports = {
  getAllProperties,
  deleteProperty,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllReviews,
  deleteReview,
  getDashboardStats,
};
