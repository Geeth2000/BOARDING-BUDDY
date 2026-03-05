const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * @desc    Create a new property
 * @route   POST /api/landlord/properties
 * @access  Private (Landlord only)
 */
const createProperty = asyncHandler(async (req, res, next) => {
  // Check if landlord is verified
  if (!req.user.isVerified) {
    return next(
      new AppError(
        "Your account must be verified by an admin before you can add properties",
        403,
      ),
    );
  }

  const {
    title,
    location,
    rent,
    description,
    propertyType,
    bedrooms,
    bathrooms,
    amenities,
    images,
    utilities,
    genderPreference,
    availableFrom,
  } = req.body;

  // Validate required fields
  if (!title || !location || !rent) {
    return next(new AppError("Please provide title, location, and rent", 400));
  }

  // Validate location object
  if (!location.address || !location.city) {
    return next(new AppError("Please provide address and city", 400));
  }

  const property = await Property.create({
    title,
    location,
    rent,
    description,
    propertyType,
    bedrooms,
    bathrooms,
    amenities,
    images: images || [],
    utilities,
    genderPreference,
    availableFrom,
    landlordId: req.user._id,
    status: "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Property created successfully. Awaiting admin approval.",
    data: property,
  });
});

/**
 * @desc    Get all properties for logged-in landlord
 * @route   GET /api/landlord/properties
 * @access  Private (Landlord only)
 */
const getMyProperties = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { landlordId: req.user._id };

  // Filter by status (Pending, Approved, Rejected)
  if (
    req.query.status &&
    ["Pending", "Approved", "Rejected"].includes(req.query.status)
  ) {
    query.status = req.query.status;
  }

  // Filter by active status
  if (req.query.active === "true") {
    query.isActive = true;
  } else if (req.query.active === "false") {
    query.isActive = false;
  }

  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get counts by status
  const pendingCount = await Property.countDocuments({
    landlordId: req.user._id,
    status: "Pending",
  });
  const approvedCount = await Property.countDocuments({
    landlordId: req.user._id,
    status: "Approved",
  });
  const rejectedCount = await Property.countDocuments({
    landlordId: req.user._id,
    status: "Rejected",
  });

  res.status(200).json({
    success: true,
    count: properties.length,
    stats: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: properties,
  });
});

/**
 * @desc    Get single property by ID (owned by landlord)
 * @route   GET /api/landlord/properties/:id
 * @access  Private (Landlord only)
 */
const getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findOne({
    _id: req.params.id,
    landlordId: req.user._id,
  });

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

/**
 * @desc    Update property
 * @route   PUT /api/landlord/properties/:id
 * @access  Private (Landlord only)
 */
const updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findOne({
    _id: req.params.id,
    landlordId: req.user._id,
  });

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Fields that can be updated
  const allowedFields = [
    "title",
    "location",
    "rent",
    "description",
    "propertyType",
    "bedrooms",
    "bathrooms",
    "amenities",
    "images",
    "utilities",
    "genderPreference",
    "availableFrom",
    "isActive",
  ];

  // Filter and update only allowed fields
  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Reset status to pending for re-approval after any edit
  updates.status = "Pending";
  updates.rejectionReason = "";

  property = await Property.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Property updated successfully. Awaiting admin re-approval.",
    data: property,
  });
});

/**
 * @desc    Delete property
 * @route   DELETE /api/landlord/properties/:id
 * @access  Private (Landlord only)
 */
const deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findOne({
    _id: req.params.id,
    landlordId: req.user._id,
  });

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Check for active bookings
  const activeBookings = await Booking.countDocuments({
    propertyId: req.params.id,
    status: "approved",
  });

  if (activeBookings > 0) {
    return next(
      new AppError("Cannot delete property with active bookings", 400),
    );
  }

  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
});

/**
 * @desc    Get booking requests for landlord's properties
 * @route   GET /api/landlord/bookings
 * @access  Private (Landlord only)
 */
const getBookings = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { landlordId: req.user._id };

  // Filter by status
  if (
    req.query.status &&
    ["pending", "approved", "rejected"].includes(req.query.status)
  ) {
    query.status = req.query.status;
  }

  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate("propertyId", "title images rent location")
    .populate("studentId", "name email phone")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: bookings,
  });
});

/**
 * @desc    Update booking status (approve/reject)
 * @route   PUT /api/landlord/bookings/:id
 * @access  Private (Landlord only)
 */
const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason } = req.body;

  if (!status || !["approved", "rejected"].includes(status)) {
    return next(
      new AppError("Please provide valid status (approved/rejected)", 400),
    );
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    landlordId: req.user._id,
  });

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status !== "pending") {
    return next(new AppError("Booking has already been processed", 400));
  }

  booking.status = status;

  if (status === "approved") {
    booking.approvedAt = new Date();
  } else if (status === "rejected") {
    booking.rejectedAt = new Date();
    booking.rejectionReason = rejectionReason || "";
  }

  await booking.save();

  // Populate for response
  await booking.populate("propertyId", "title");
  await booking.populate("studentId", "name email");

  res.status(200).json({
    success: true,
    message: `Booking ${status} successfully`,
    data: booking,
  });
});

/**
 * @desc    Get reviews for landlord's properties
 * @route   GET /api/landlord/reviews
 * @access  Private (Landlord only)
 */
const getReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Get all property IDs for this landlord
  const properties = await Property.find({ landlordId: req.user._id }).select(
    "_id",
  );
  const propertyIds = properties.map((p) => p._id);

  const query = { propertyId: { $in: propertyIds }, isVisible: true };

  const total = await Review.countDocuments(query);
  const reviews = await Review.find(query)
    .populate("propertyId", "title images")
    .populate("studentId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: reviews,
  });
});

/**
 * @desc    Respond to a review
 * @route   PUT /api/landlord/reviews/:id
 * @access  Private (Landlord only)
 */
const respondToReview = asyncHandler(async (req, res, next) => {
  const { response } = req.body;

  if (!response) {
    return next(new AppError("Please provide a response", 400));
  }

  // Get all property IDs for this landlord
  const properties = await Property.find({ landlordId: req.user._id }).select(
    "_id",
  );
  const propertyIds = properties.map((p) => p._id.toString());

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  if (!propertyIds.includes(review.propertyId.toString())) {
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
 * @desc    Get conversations for landlord
 * @route   GET /api/landlord/messages
 * @access  Private (Landlord only)
 */
const getConversations = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
    isActive: true,
  })
    .populate("participants", "name email role")
    .populate("lastMessage", "text createdAt")
    .sort({ lastMessageAt: -1 });

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations,
  });
});

/**
 * @desc    Get messages in a conversation
 * @route   GET /api/landlord/messages/:conversationId
 * @access  Private (Landlord only)
 */
const getMessages = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  // Verify user is participant in conversation
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    return next(new AppError("Conversation not found", 404));
  }

  const total = await Message.countDocuments({
    conversationId: req.params.conversationId,
    isDeleted: false,
  });

  const messages = await Message.find({
    conversationId: req.params.conversationId,
    isDeleted: false,
  })
    .populate("senderId", "name role")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  // Mark messages as read
  await Message.updateMany(
    {
      conversationId: req.params.conversationId,
      senderId: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    },
    { $addToSet: { readBy: req.user._id } },
  );

  res.status(200).json({
    success: true,
    count: messages.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: messages,
  });
});

/**
 * @desc    Send a message
 * @route   POST /api/landlord/messages
 * @access  Private (Landlord only)
 */
const sendMessage = asyncHandler(async (req, res, next) => {
  const { conversationId, recipientId, text } = req.body;

  if (!text || text.trim() === "") {
    return next(new AppError("Message text is required", 400));
  }

  let conversation;

  if (conversationId) {
    // Use existing conversation
    conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return next(new AppError("Conversation not found", 404));
    }
  } else if (recipientId) {
    // Create or get conversation
    conversation = await Conversation.getOrCreate([req.user._id, recipientId]);
  } else {
    return next(
      new AppError("Please provide conversationId or recipientId", 400),
    );
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId: req.user._id,
    text: text.trim(),
    readBy: [req.user._id],
  });

  await message.populate("senderId", "name role");

  res.status(201).json({
    success: true,
    data: message,
  });
});

/**
 * @desc    Get landlord dashboard stats
 * @route   GET /api/landlord/stats
 * @access  Private (Landlord only)
 */
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const landlordId = req.user._id;

  // Get property IDs for this landlord
  const properties = await Property.find({ landlordId }).select("_id rent");
  const propertyIds = properties.map((p) => p._id);

  // Count stats
  const [
    totalProperties,
    activeProperties,
    pendingBookings,
    approvedBookings,
    totalReviews,
  ] = await Promise.all([
    Property.countDocuments({ landlordId }),
    Property.countDocuments({ landlordId, isActive: true, isApproved: true }),
    Booking.countDocuments({ landlordId, status: "pending" }),
    Booking.countDocuments({ landlordId, status: "approved" }),
    Review.countDocuments({
      propertyId: { $in: propertyIds },
      isVisible: true,
    }),
  ]);

  // Calculate average rating
  const ratingResult = await Review.aggregate([
    { $match: { propertyId: { $in: propertyIds }, isVisible: true } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);
  const avgRating = ratingResult[0]?.avgRating || 0;

  // Calculate monthly revenue (from approved bookings this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyBookings = await Booking.aggregate([
    {
      $match: {
        landlordId,
        status: "approved",
        approvedAt: { $gte: startOfMonth },
      },
    },
    { $group: { _id: null, totalRevenue: { $sum: "$rent" } } },
  ]);
  const monthlyRevenue = monthlyBookings[0]?.totalRevenue || 0;

  res.status(200).json({
    success: true,
    data: {
      totalProperties,
      activeProperties,
      pendingBookings,
      approvedBookings,
      totalReviews,
      avgRating: avgRating.toFixed(1),
      monthlyRevenue,
    },
  });
});

module.exports = {
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
};
