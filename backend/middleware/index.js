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

module.exports = {
  AppError,
  notFound,
  errorHandler,
  protect,
  authorize,
  verifiedOnly,
  adminOnly,
  landlordOnly,
  studentOnly,
  apiLimiter,
  authLimiter,
};
