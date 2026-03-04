const { body, param, query, validationResult } = require("express-validator");

/**
 * Validation error handler middleware
 * Processes express-validator errors and returns formatted response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  next();
};

// ============================================
// AUTH VALIDATION RULES
// ============================================

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens and apostrophes",
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase, one uppercase, and one number",
    ),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("role")
    .optional()
    .isIn(["student", "landlord"])
    .withMessage("Role must be either student or landlord"),

  handleValidationErrors,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// ============================================
// PROPERTY VALIDATION RULES
// ============================================

const propertyValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters")
    .escape(),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 100 })
    .withMessage("City cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("City can only contain letters"),

  body("rent")
    .notEmpty()
    .withMessage("Rent is required")
    .isFloat({ min: 0, max: 100000 })
    .withMessage("Rent must be between 0 and 100,000"),

  body("bedrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Bedrooms must be between 0 and 20"),

  body("bathrooms")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("Bathrooms must be between 0 and 10"),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array"),

  body("amenities.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each amenity cannot exceed 50 characters"),

  body("propertyType")
    .optional()
    .isIn(["apartment", "house", "room", "studio", "condo", "townhouse"])
    .withMessage("Invalid property type"),

  handleValidationErrors,
];

const propertyUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters")
    .escape(),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("rent")
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage("Rent must be between 0 and 100,000"),

  handleValidationErrors,
];

// ============================================
// BOOKING VALIDATION RULES
// ============================================

const bookingValidation = [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isMongoId()
    .withMessage("Invalid property ID"),

  body("moveInDate")
    .optional()
    .isISO8601()
    .withMessage("Move-in date must be a valid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Move-in date cannot be in the past");
      }
      return true;
    }),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),

  handleValidationErrors,
];

const bookingStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be either approved or rejected"),

  body("rejectionReason")
    .if(body("status").equals("rejected"))
    .notEmpty()
    .withMessage("Rejection reason is required when rejecting a booking")
    .isLength({ max: 500 })
    .withMessage("Rejection reason cannot exceed 500 characters"),

  handleValidationErrors,
];

// ============================================
// REVIEW VALIDATION RULES
// ============================================

const reviewValidation = [
  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),

  handleValidationErrors,
];

// ============================================
// MESSAGE VALIDATION RULES
// ============================================

const messageValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters"),

  handleValidationErrors,
];

const conversationValidation = [
  body("recipientId")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .isMongoId()
    .withMessage("Invalid recipient ID"),

  body("propertyId").optional().isMongoId().withMessage("Invalid property ID"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Initial message is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters"),

  handleValidationErrors,
];

// ============================================
// COMMON VALIDATION RULES
// ============================================

const mongoIdValidation = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
  handleValidationErrors,
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .matches(/^-?[a-zA-Z]+$/)
    .withMessage("Invalid sort format"),

  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  // Auth
  registerValidation,
  loginValidation,
  // Property
  propertyValidation,
  propertyUpdateValidation,
  // Booking
  bookingValidation,
  bookingStatusValidation,
  // Review
  reviewValidation,
  // Message
  messageValidation,
  conversationValidation,
  // Common
  mongoIdValidation,
  paginationValidation,
};
