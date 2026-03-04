const mongoose = require("mongoose");

/**
 * Conversation Schema for Boarding Buddy SaaS
 * Represents a conversation between users (student-landlord)
 */
const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: [true, "Participants are required"],
      validate: {
        validator: function (v) {
          return v.length >= 2;
        },
        message: "Conversation must have at least 2 participants",
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ updatedAt: -1 });

/**
 * Static method to find existing conversation between participants
 * @param {Array} participantIds - Array of user IDs
 * @returns {Promise<Conversation|null>}
 */
conversationSchema.statics.findByParticipants = async function (
  participantIds,
) {
  return this.findOne({
    participants: { $all: participantIds, $size: participantIds.length },
  });
};

/**
 * Static method to get or create conversation
 * @param {Array} participantIds - Array of user IDs
 * @returns {Promise<Conversation>}
 */
conversationSchema.statics.getOrCreate = async function (participantIds) {
  let conversation = await this.findByParticipants(participantIds);

  if (!conversation) {
    conversation = await this.create({ participants: participantIds });
  }

  return conversation;
};

module.exports = mongoose.model("Conversation", conversationSchema);
