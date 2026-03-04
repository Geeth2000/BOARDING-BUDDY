const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} = require("../utils/tokenUtils");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * Send token response with HTTP-only cookie
 * @param {object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Set secure HTTP-only cookie
  setTokenCookie(res, token);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

/**
 * @desc    Register a new user (student or landlord)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password", 400));
  }

  // Validate role - only allow student or landlord registration
  const allowedRoles = ["student", "landlord"];
  const userRole = role && allowedRoles.includes(role) ? role : "student";

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists with this email", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  // Send token response (201 Created)
  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Find user by email and include password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Check if password matches using bcrypt comparison from User model
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Send token response (200 OK)
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res, next) => {
  // Clear the token cookie securely
  clearTokenCookie(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
