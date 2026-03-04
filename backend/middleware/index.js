const { AppError, notFound, errorHandler } = require("./errorMiddleware");
const {
  protect,
  authorize,
  verifiedOnly,
  adminOnly,
  landlordOnly,
  studentOnly,
} = require("./authMiddleware");
const { apiLimiter, authLimiter } = require("./rateLimiter");
const {
  sanitizeMongo,
  xssClean,
  preventParamPollution,
  sanitizeRequestBody,
} = require("./securityMiddleware");
const {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  propertyValidation,
  propertyUpdateValidation,
  bookingValidation,
  bookingStatusValidation,
  reviewValidation,
  messageValidation,
  conversationValidation,
  mongoIdValidation,
  paginationValidation,
} = require("./validationMiddleware");

module.exports = {
  // Error handling
  AppError,
  notFound,
  errorHandler,
  // Authentication
  protect,
  authorize,
  verifiedOnly,
  adminOnly,
  landlordOnly,
  studentOnly,
  // Rate limiting
  apiLimiter,
  authLimiter,
  // Security
  sanitizeMongo,
  xssClean,
  preventParamPollution,
  sanitizeRequestBody,
  // Validation
  handleValidationErrors,
  registerValidation,
  loginValidation,
  propertyValidation,
  propertyUpdateValidation,
  bookingValidation,
  bookingStatusValidation,
  reviewValidation,
  messageValidation,
  conversationValidation,
  mongoIdValidation,
  paginationValidation,
};
