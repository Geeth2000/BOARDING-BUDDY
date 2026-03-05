const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * @desc    Create a new property
 * @route   POST /api/properties
 * @access  Private (Landlord only)
 */
const createProperty = asyncHandler(async (req, res, next) => {
  const {
    title,
    location,
    rent,
    utilities,
    genderPreference,
    amenities,
    images,
    description,
    propertyType,
    bedrooms,
    bathrooms,
    availableFrom,
  } = req.body;

  // Validate required fields
  if (!title || !location || !rent) {
    return next(new AppError("Please provide title, location, and rent", 400));
  }

  if (!location.address || !location.city) {
    return next(new AppError("Please provide address and city", 400));
  }

  // Create property with landlord ID from authenticated user
  // Check if landlord is verified
  if (!req.user.isVerified) {
    return next(
      new AppError(
        "Your account must be verified by an admin before you can add properties",
        403,
      ),
    );
  }

  const property = await Property.create({
    title,
    location,
    rent,
    utilities,
    genderPreference,
    amenities,
    images,
    description,
    propertyType,
    bedrooms,
    bathrooms,
    availableFrom,
    landlordId: req.user._id,
    status: "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Property created successfully. Pending admin approval.",
    data: property,
  });
});

/**
 * @desc    Get all approved properties (public listing)
 * @route   GET /api/properties
 * @access  Public
 */
const getApprovedProperties = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter query - only show approved properties
  const filter = {
    status: "Approved",
    isActive: true,
  };

  // Optional filters
  if (req.query.city) {
    filter["location.city"] = new RegExp(req.query.city, "i");
  }
  if (req.query.minRent) {
    filter.rent = { ...filter.rent, $gte: parseInt(req.query.minRent, 10) };
  }
  if (req.query.maxRent) {
    filter.rent = { ...filter.rent, $lte: parseInt(req.query.maxRent, 10) };
  }
  if (req.query.genderPreference && req.query.genderPreference !== "any") {
    filter.genderPreference = { $in: [req.query.genderPreference, "any"] };
  }
  if (req.query.propertyType) {
    filter.propertyType = req.query.propertyType;
  }

  // Execute query
  const properties = await Property.find(filter)
    .populate("landlordId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Property.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: properties,
  });
});

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public (only if approved) / Private (owner/admin can see any)
 */
const getPropertyById = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate(
    "landlordId",
    "name email",
  );

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Public users can only see approved properties
  // Owners and admins can see any property
  const isOwner =
    req.user && property.landlordId._id.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === "admin";

  if (property.status !== "Approved" && !isOwner && !isAdmin) {
    return next(new AppError("Property not found", 404));
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

/**
 * @desc    Get properties for logged-in landlord
 * @route   GET /api/properties/my-properties
 * @access  Private (Landlord only)
 */
const getLandlordProperties = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { landlordId: req.user._id };

  // Optional status filter
  if (req.query.status === "approved") {
    filter.isApproved = true;
  } else if (req.query.status === "pending") {
    filter.isApproved = false;
  }

  const properties = await Property.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: properties,
  });
});

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private (Owner or Admin)
 */
const updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Check ownership (landlord can only update their own properties)
  const isOwner = property.landlordId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new AppError("Not authorized to update this property", 403));
  }

  // Prevent landlords from changing status
  if (!isAdmin && req.body.status !== undefined) {
    delete req.body.status;
  }
  if (!isAdmin && req.body.rejectionReason !== undefined) {
    delete req.body.rejectionReason;
  }

  // If landlord updates, reset status to pending for re-approval
  if (isOwner && !isAdmin) {
    req.body.status = "Pending";
    req.body.rejectionReason = "";
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message:
      isOwner && !isAdmin
        ? "Property updated. Requires re-approval."
        : "Property updated successfully.",
    data: property,
  });
});

/**
 * @desc    Approve property
 * @route   PATCH /api/properties/:id/approve
 * @access  Private (Admin only)
 */
const approveProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  property.status = "Approved";
  property.rejectionReason = "";
  await property.save();

  res.status(200).json({
    success: true,
    message: "Property approved successfully",
    data: property,
  });
});

/**
 * @desc    Reject/Unapprove property
 * @route   PATCH /api/properties/:id/reject
 * @access  Private (Admin only)
 */
const rejectProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  const { reason } = req.body;

  property.status = "Rejected";
  property.rejectionReason = reason || "Property does not meet our guidelines";
  await property.save();

  res.status(200).json({
    success: true,
    message: "Property rejected",
    data: property,
  });
});

/**
 * @desc    Get all properties (admin view - includes unapproved)
 * @route   GET /api/properties/admin/all
 * @access  Private (Admin only)
 */
const getAllPropertiesAdmin = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const properties = await Property.find(filter)
    .populate("landlordId", "name email role isVerified")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments(filter);
  const pendingCount = await Property.countDocuments({ status: "Pending" });
  const approvedCount = await Property.countDocuments({ status: "Approved" });
  const rejectedCount = await Property.countDocuments({ status: "Rejected" });

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
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: properties,
  });
});

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private (Owner or Admin)
 */
const deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError("Property not found", 404));
  }

  // Check ownership
  const isOwner = property.landlordId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new AppError("Not authorized to delete this property", 403));
  }

  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
    data: {},
  });
});

module.exports = {
  createProperty,
  getApprovedProperties,
  getPropertyById,
  getLandlordProperties,
  updateProperty,
  approveProperty,
  rejectProperty,
  getAllPropertiesAdmin,
  deleteProperty,
};
