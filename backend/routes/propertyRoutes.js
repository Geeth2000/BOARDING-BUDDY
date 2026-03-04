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
const {
  protect,
  landlordOnly,
  adminOnly,
  propertyValidation,
  propertyUpdateValidation,
  mongoIdValidation,
  paginationValidation,
} = require("../middleware");

// Public routes
router.get("/", paginationValidation, getApprovedProperties);

// Protected routes - must be before /:id to avoid route conflicts
router.get(
  "/my-properties",
  protect,
  landlordOnly,
  paginationValidation,
  getLandlordProperties,
);
router.get(
  "/admin/all",
  protect,
  adminOnly,
  paginationValidation,
  getAllPropertiesAdmin,
);

// Landlord routes
router.post("/", protect, landlordOnly, propertyValidation, createProperty);

// Property by ID routes (public get with conditional access in controller)
router.get("/:id", mongoIdValidation(), getPropertyById);
router.put(
  "/:id",
  protect,
  mongoIdValidation(),
  propertyUpdateValidation,
  updateProperty,
);
router.delete("/:id", protect, mongoIdValidation(), deleteProperty);

// Admin only routes
router.patch(
  "/:id/approve",
  protect,
  adminOnly,
  mongoIdValidation(),
  approveProperty,
);
router.patch(
  "/:id/reject",
  protect,
  adminOnly,
  mongoIdValidation(),
  rejectProperty,
);

module.exports = router;
