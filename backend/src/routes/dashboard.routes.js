const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");
const dashboardController = require("../controllers/dashboard.controller");

// GET /api/dashboard
router.get(
  "/",
  protect,
  asyncHandler(dashboardController.getDashboard)
);

module.exports = router;