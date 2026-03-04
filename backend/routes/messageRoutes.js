const express = require("express");
const router = express.Router();
const {
  createConversation,
  sendMessage,
  getConversationMessages,
  getUserConversations,
  getUnreadCount,
  deleteMessage,
} = require("../controllers/messageController");
const {
  protect,
  messageValidation,
  conversationValidation,
  mongoIdValidation,
  paginationValidation,
} = require("../middleware");

// All routes require authentication

// Conversation routes
router.post(
  "/conversations",
  protect,
  conversationValidation,
  createConversation,
);
router.get(
  "/conversations",
  protect,
  paginationValidation,
  getUserConversations,
);
router.get(
  "/conversations/:conversationId",
  protect,
  mongoIdValidation("conversationId"),
  paginationValidation,
  getConversationMessages,
);

// Message routes
router.post("/", protect, messageValidation, sendMessage);
router.delete(
  "/:messageId",
  protect,
  mongoIdValidation("messageId"),
  deleteMessage,
);

// Utility routes
router.get("/unread-count", protect, getUnreadCount);

module.exports = router;
