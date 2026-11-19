
const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");

const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate.middleware");

const {
  protect,
  restrictTo,
} = require("../middleware/auth.middleware");

const {
  salesQuerySchema,
} = require("../validators/order.validator");

// ============================================
// PROTECT ALL ANALYTICS ROUTES
// All routes below require an admin
// ============================================

router.use(protect, restrictTo("admin"));

// ============================================
// DASHBOARD ANALYTICS
// GET /api/analytics/dashboard
// ============================================

router.get(
  "/dashboard",
  asyncHandler(analyticsController.getDashboardAnalytics)
);

// ============================================
// CATEGORY SALES
// GET /api/analytics/category-sales
// ============================================

router.get(
  "/category-sales",
  asyncHandler(analyticsController.getCategorySales)
);

// ============================================
// TOP PRODUCTS
// GET /api/analytics/top-products
// ============================================

router.get(
  "/top-products",
  asyncHandler(analyticsController.getTopProducts)
);

// ============================================
// CUSTOMER ANALYTICS
// GET /api/analytics/customers
// ============================================

router.get(
  "/customers",
  asyncHandler(analyticsController.getCustomerAnalytics)
);

// ============================================
// MONTHLY REVENUE
// GET /api/analytics/monthly-revenue
// ============================================

router.get(
  "/monthly-revenue",
  asyncHandler(analyticsController.getMonthlyRevenue)
);

// ============================================
// DATE-RANGE SALES
// GET /api/analytics/sales?from=2026-10-01&to=2026-10-14
// ============================================

router.get(
  "/sales",
  validate(salesQuerySchema, "query"),
  asyncHandler(analyticsController.getSalesAnalytics)
);

// ============================================
// ORDER STATUS ANALYTICS
// GET /api/analytics/order-status
// ============================================

router.get(
  "/order-status",
  asyncHandler(analyticsController.getOrderStatusAnalytics)
);

module.exports = router;
