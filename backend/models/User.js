const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema for Boarding Buddy SaaS
 * Supports students, landlords, and admin users
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["student", "landlord", "admin"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Profile fields
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot be more than 20 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    address: {
      street: String,
      city: String,
      district: String,
      postalCode: String,
      country: { type: String, default: "Sri Lanka" },
    },
    // Settings/preferences
    settings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "Asia/Colombo" },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index for better query performance
userSchema.index({ email: 1 });

/**
 * Pre-save hook to hash password
 * Only hashes if password is modified or new
 */
userSchema.pre("save", async function (next) {
  // Skip if password is not modified
  if (!this.isModified("password")) {
    return next();
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare entered password with hashed password in database
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
