const express = require("express");
const router = express.Router();

const {
  protect,
  restrictTo,
} = require("../middleware/auth.middleware");

const asyncHandler = require("../middleware/asyncHandler");

const userController = require("../controllers/user.controller");

// All profile routes require authentication.
router.use(protect);

// Get own profile
router.get(
  "/me",
  restrictTo("customer"),
  asyncHandler(userController.getMyProfile)
);

// Update own profile
router.patch(
  "/me",
  restrictTo("customer"),
  asyncHandler(userController.updateMyProfile)
);

module.exports = router;