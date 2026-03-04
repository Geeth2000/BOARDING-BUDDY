const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  updateSettings,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validationMiddleware");

// Public routes (with rate limiting and validation)
router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.put("/settings", protect, updateSettings);
router.delete("/account", protect, deleteAccount);

module.exports = router;
