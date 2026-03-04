const mongoose = require("mongoose");

/**
 * Property Schema for Boarding Buddy SaaS
 * Represents rental listings created by landlords
 */
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a property title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Please add an address"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "Please add a city"],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    rent: {
      type: Number,
      required: [true, "Please add monthly rent amount"],
      min: [0, "Rent cannot be negative"],
    },
    utilities: {
      electricity: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      internet: { type: Boolean, default: false },
      gas: { type: Boolean, default: false },
      included: { type: Boolean, default: false },
      estimatedCost: { type: Number, default: 0 },
    },
    genderPreference: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },
    amenities: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 20;
        },
        message: "Cannot have more than 20 amenities",
      },
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String }, // For cloud storage deletion
          caption: { type: String },
        },
      ],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 images",
      },
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Property must belong to a landlord"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    propertyType: {
      type: String,
      enum: ["room", "apartment", "house", "studio", "shared"],
      default: "room",
    },
    bedrooms: {
      type: Number,
      min: [0, "Bedrooms cannot be negative"],
      default: 1,
    },
    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
      default: 1,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
propertySchema.index({ landlordId: 1 });
propertySchema.index({ "location.city": 1 });
propertySchema.index({ rent: 1 });
propertySchema.index({ isApproved: 1, isActive: 1 });
propertySchema.index({ genderPreference: 1 });

// Text index for search functionality
propertySchema.index({
  title: "text",
  "location.address": "text",
  "location.city": "text",
  description: "text",
});

/**
 * Virtual for formatted rent display
 */
propertySchema.virtual("formattedRent").get(function () {
  return `$${this.rent.toLocaleString()}/month`;
});

module.exports = mongoose.model("Property", propertySchema);
