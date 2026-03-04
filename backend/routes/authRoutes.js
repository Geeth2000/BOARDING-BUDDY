const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
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

module.exports = router;
