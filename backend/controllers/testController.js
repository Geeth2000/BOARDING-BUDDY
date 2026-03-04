/**
 * Test Controller
 * Handles test and health check operations
 */

/**
 * @desc    Get API information
 * @route   GET /api/test/info
 * @access  Public
 */
const getApiInfo = (req, res) => {
  res.status(200).json({
    success: true,
    name: "Boarding Buddy API",
    version: "1.0.0",
    description: "Backend API for Boarding Buddy SaaS Application",
  });
};

module.exports = {
  getApiInfo,
};
