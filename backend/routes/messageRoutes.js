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
const { protect } = require("../middleware");

// All routes require authentication

// Conversation routes
router.post("/conversations", protect, createConversation);
router.get("/conversations", protect, getUserConversations);
router.get("/conversations/:conversationId", protect, getConversationMessages);

// Message routes
router.post("/", protect, sendMessage);
router.delete("/:messageId", protect, deleteMessage);

// Utility routes
router.get("/unread-count", protect, getUnreadCount);

module.exports = router;
