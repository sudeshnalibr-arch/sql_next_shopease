
const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate.middleware");

const userController = require("../controllers/user.controller");

const {
  createManagerSchema,
  createStaffSchema,
  updateStaffSchema,
  assignStaffSchema,
  updateManagerSchema,
} = require("../validators/user.validator");

// All routes require authentication.
router.use(protect);


// ==========================================
// CUSTOMER MANAGEMENT (ADMIN ONLY)
// ==========================================

// Get all customers
router.get(
  "/",
  restrictTo("admin"),
  asyncHandler(userController.getAllCustomers)
);

// Get one customer
router.get(
  "/:id",
  restrictTo("admin"),
  asyncHandler(userController.getCustomerById)
);

// Update customer
router.patch(
  "/:id",
  restrictTo("admin"),
  asyncHandler(userController.updateCustomer)
);

// Soft-delete / deactivate customer
router.patch(
  "/:id/deactivate",
  restrictTo("admin"),
  asyncHandler(userController.softDeleteCustomer)
);


// ==========================================
// MANAGER MANAGEMENT (ADMIN ONLY)
// ==========================================

// Create a manager
router.post(
  "/managers",
  restrictTo("admin"),
  validate(createManagerSchema),
  asyncHandler(userController.createManager)
);

router.patch(
  "/managers/:id",
  restrictTo("admin"),
  validate(updateManagerSchema),
  asyncHandler(userController.updateManager)
);

// Get all managers
router.get(
  "/managers",
  restrictTo("admin"),
  asyncHandler(userController.getAllManagers)
);

// ==========================================
// STAFF MANAGEMENT (ADMIN AND MANAGER)
// ==========================================

// Create staff
router.post(
  "/staff",
  restrictTo("admin", "manager"),
  validate(createStaffSchema),
  asyncHandler(userController.createStaff)
);

// Get all staff
router.get(
  "/staff",
  restrictTo("admin", "manager"),
  asyncHandler(userController.getAllStaff)
);

// Get a single staff member
router.get(
  "/staff/:id",
  restrictTo("admin", "manager"),
  asyncHandler(userController.getStaffById)
);

// Update staff details
router.patch(
  "/staff/:id",
  restrictTo("admin", "manager"),
  validate(updateStaffSchema),
  asyncHandler(userController.updateStaff)
);

// Assign staff to a manager (ADMIN ONLY)
router.patch(
  "/staff/:id/assign-manager",
  restrictTo("admin"),
  validate(assignStaffSchema),
  asyncHandler(userController.assignStaffToManager)
);

// Deactivate staff
router.patch(
  "/staff/:id/deactivate",
  restrictTo("admin", "manager"),
  asyncHandler(userController.deactivateStaff)
);

module.exports = router;
