const mongoose = require("mongoose");

/**
 * Message Schema for Boarding Buddy SaaS
 * Represents individual messages within a conversation
 */
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation ID is required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    text: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    readBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ createdAt: -1 });

/**
 * Post-save hook to update conversation's lastMessage
 */
messageSchema.post("save", async function () {
  const Conversation = mongoose.model("Conversation");
  await Conversation.findByIdAndUpdate(this.conversationId, {
    lastMessage: this._id,
    lastMessageAt: this.createdAt,
  });
});

module.exports = mongoose.model("Message", messageSchema);
