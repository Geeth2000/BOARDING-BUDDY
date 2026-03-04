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
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      address: user.address,
      settings: user.settings,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone, bio, address, avatar } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update allowed fields only
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (address) {
    user.address = {
      ...user.address,
      ...address,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      address: user.address,
      settings: user.settings,
    },
  });
});

/**
 * @desc    Update user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400));
  }

  if (newPassword.length < 6) {
    return next(
      new AppError("New password must be at least 6 characters", 400),
    );
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!passwordRegex.test(newPassword)) {
    return next(
      new AppError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        400,
      ),
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

/**
 * @desc    Update user settings
 * @route   PUT /api/auth/settings
 * @access  Private
 */
const updateSettings = asyncHandler(async (req, res, next) => {
  const {
    emailNotifications,
    smsNotifications,
    marketingEmails,
    darkMode,
    language,
    timezone,
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update settings
  if (emailNotifications !== undefined)
    user.settings.emailNotifications = emailNotifications;
  if (smsNotifications !== undefined)
    user.settings.smsNotifications = smsNotifications;
  if (marketingEmails !== undefined)
    user.settings.marketingEmails = marketingEmails;
  if (darkMode !== undefined) user.settings.darkMode = darkMode;
  if (language) user.settings.language = language;
  if (timezone) user.settings.timezone = timezone;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    settings: user.settings,
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/auth/account
 * @access  Private
 */
const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError("Please provide your password to confirm", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Verify password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError("Password is incorrect", 401));
  }

  await User.findByIdAndDelete(req.user.id);

  // Clear cookies
  clearTokenCookie(res);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  updateSettings,
  deleteAccount,
};
