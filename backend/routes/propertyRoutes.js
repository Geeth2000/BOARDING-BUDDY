const express = require("express");
const router = express.Router();
const {
  createProperty,
  getApprovedProperties,
  getPropertyById,
  getLandlordProperties,
  updateProperty,
  approveProperty,
  rejectProperty,
  getAllPropertiesAdmin,
  deleteProperty,
} = require("../controllers/propertyController");
const { protect, landlordOnly, adminOnly } = require("../middleware");

// Public routes
router.get("/", getApprovedProperties);

// Protected routes - must be before /:id to avoid route conflicts
router.get("/my-properties", protect, landlordOnly, getLandlordProperties);
router.get("/admin/all", protect, adminOnly, getAllPropertiesAdmin);

// Landlord routes
router.post("/", protect, landlordOnly, createProperty);

// Property by ID routes (public get with conditional access in controller)
router.get("/:id", getPropertyById);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

// Admin only routes
router.patch("/:id/approve", protect, adminOnly, approveProperty);
router.patch("/:id/reject", protect, adminOnly, rejectProperty);

module.exports = router;
