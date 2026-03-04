const logger = require("../utils/logger");
const { config } = require("../config");

/**
 * Custom Error Class
 * Extends Error to include status code and operational flag
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error Handler
 * Handles 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global Error Handler Middleware
 * Handles all errors passed through next(error)
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  const errorDetails = {
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  };

  // Log based on error type
  if (err.isOperational) {
    logger.warn("Operational error", errorDetails);
  } else {
    logger.error("Unexpected error", { ...errorDetails, stack: err.stack });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data: ${messages.join(". ")}`;
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again.";
    error = new AppError(message, 401);
  }

  // Send error response
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  // Build response
  const response = {
    success: false,
    status,
    message: error.message || "Internal Server Error",
  };

  // Include stack trace and error details only in development
  if (config.isDevelopment) {
    response.stack = err.stack;
    response.error = err;
  }

  // In production, don't leak internal error details for 500 errors
  if (config.isProduction && statusCode === 500) {
    response.message = "An unexpected error occurred. Please try again later.";
  }

  res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  notFound,
  errorHandler,
};
