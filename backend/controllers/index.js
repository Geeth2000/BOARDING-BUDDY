const testController = require("./testController");
const authController = require("./authController");
const propertyController = require("./propertyController");
const bookingController = require("./bookingController");
const reviewController = require("./reviewController");
const messageController = require("./messageController");
const analyticsController = require("./analyticsController");
// Add more controller imports here as you create them
// const userController = require('./userController');

module.exports = {
  testController,
  authController,
  propertyController,
  bookingController,
  reviewController,
  messageController,
  analyticsController,
  // userController,
};
