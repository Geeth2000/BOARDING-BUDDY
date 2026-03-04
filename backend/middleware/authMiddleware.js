const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { AppError } = require("./errorMiddleware");

/**
 * Protect routes - Require authentication
 * Reads token from HTTP-only cookie or Authorization header
 * Verifies using JWT secret and attaches user to request
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Priority 1: Check for token in HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Priority 2: Check for token in Authorization header (Bearer token)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token found - return 401
  if (!token) {
    return next(new AppError("Not authorized, no token provided", 401));
  }

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database and attach to request
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired, please login again", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    return next(new AppError("Not authorized, token failed", 401));
  }
});

/**
 * Authorize roles - Restrict access to specific roles
 * Must be used AFTER protect middleware
 * @param  {...string} roles - Allowed roles (student, landlord, admin)
 * @example router.get('/admin', protect, authorize('admin'), controller)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "User not found in request. Use protect middleware first",
          500,
        ),
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};

/**
 * Restrict to verified users only
 * Must be used AFTER protect middleware
 */
const verifiedOnly = (req, res, next) => {
  if (!req.user) {
    return next(
      new AppError(
        "User not found in request. Use protect middleware first",
        500,
      ),
    );
  }

  if (!req.user.isVerified) {
    return next(
      new AppError("Please verify your email to access this resource", 403),
    );
  }
  next();
};

/**
 * Admin only middleware - shorthand for authorize('admin')
 */
const adminOnly = authorize("admin");

/**
 * Landlord only middleware - shorthand for authorize('landlord', 'admin')
 */
const landlordOnly = authorize("landlord", "admin");

/**
 * Student only middleware - shorthand for authorize('student', 'admin')
 */
const studentOnly = authorize("student", "admin");

module.exports = {
  protect,
  authorize,
  verifiedOnly,
  adminOnly,
  landlordOnly,
  studentOnly,
};
