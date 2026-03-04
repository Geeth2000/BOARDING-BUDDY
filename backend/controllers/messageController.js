const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * @desc    Create or get existing conversation
 * @route   POST /api/messages/conversations
 * @access  Private
 */
const createConversation = asyncHandler(async (req, res, next) => {
  const { participantId } = req.body;

  if (!participantId) {
    return next(new AppError("Participant ID is required", 400));
  }

  // Cannot create conversation with yourself
  if (participantId === req.user._id.toString()) {
    return next(new AppError("Cannot create conversation with yourself", 400));
  }

  // Verify participant exists
  const participant = await User.findById(participantId);
  if (!participant) {
    return next(new AppError("User not found", 404));
  }

  // Get or create conversation
  const participants = [req.user._id, participantId].sort();
  const conversation = await Conversation.getOrCreate(participants);

  // Populate participants
  await conversation.populate("participants", "name email role");

  res.status(200).json({
    success: true,
    data: conversation,
  });
});

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res, next) => {
  const { conversationId, text } = req.body;

  if (!conversationId || !text) {
    return next(
      new AppError("Conversation ID and message text are required", 400),
    );
  }

  // Verify conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return next(new AppError("Conversation not found", 404));
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString(),
  );

  if (!isParticipant) {
    return next(
      new AppError("Not authorized to send message in this conversation", 403),
    );
  }

  // Create message
  const message = await Message.create({
    conversationId,
    senderId: req.user._id,
    text,
    readBy: [req.user._id], // Sender has read their own message
  });

  // Populate sender info
  await message.populate("senderId", "name email");

  res.status(201).json({
    success: true,
    data: message,
  });
});

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/messages/conversations/:conversationId
 * @access  Private
 */
const getConversationMessages = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  // Verify conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return next(new AppError("Conversation not found", 404));
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString(),
  );

  if (!isParticipant) {
    return next(new AppError("Not authorized to view this conversation", 403));
  }

  // Get messages
  const messages = await Message.find({
    conversationId,
    isDeleted: false,
  })
    .populate("senderId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments({
    conversationId,
    isDeleted: false,
  });

  // Mark messages as read by current user
  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    },
    { $addToSet: { readBy: req.user._id } },
  );

  res.status(200).json({
    success: true,
    count: messages.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: messages.reverse(), // Return in chronological order
  });
});

/**
 * @desc    Get all conversations for current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
const getUserConversations = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {
    participants: req.user._id,
    isActive: true,
  };

  const conversations = await Conversation.find(filter)
    .populate("participants", "name email role")
    .populate({
      path: "lastMessage",
      select: "text senderId createdAt",
      populate: { path: "senderId", select: "name" },
    })
    .sort({ lastMessageAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Conversation.countDocuments(filter);

  // Add unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        senderId: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
        isDeleted: false,
      });

      return {
        ...conv.toObject(),
        unreadCount,
      };
    }),
  );

  res.status(200).json({
    success: true,
    count: conversations.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: conversationsWithUnread,
  });
});

/**
 * @desc    Get unread message count for current user
 * @route   GET /api/messages/unread-count
 * @access  Private
 */
const getUnreadCount = asyncHandler(async (req, res, next) => {
  // Get all conversations user is part of
  const conversations = await Conversation.find({
    participants: req.user._id,
    isActive: true,
  });

  const conversationIds = conversations.map((c) => c._id);

  // Count unread messages across all conversations
  const unreadCount = await Message.countDocuments({
    conversationId: { $in: conversationIds },
    senderId: { $ne: req.user._id },
    readBy: { $ne: req.user._id },
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    data: { unreadCount },
  });
});

/**
 * @desc    Delete a message (soft delete)
 * @route   DELETE /api/messages/:messageId
 * @access  Private (sender only)
 */
const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  // Only sender can delete their message
  if (message.senderId.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized to delete this message", 403));
  }

  message.isDeleted = true;
  await message.save();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});

module.exports = {
  createConversation,
  sendMessage,
  getConversationMessages,
  getUserConversations,
  getUnreadCount,
  deleteMessage,
};
