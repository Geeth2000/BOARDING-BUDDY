const express = require("express");
const router = express.Router();

/**
 * @route   GET /api/test
 * @desc    Test route to verify API is working
 * @access  Public
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Boarding Buddy API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * @route   GET /api/test/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

module.exports = router;
