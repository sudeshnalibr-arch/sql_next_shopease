
const express = require("express");
const router = express.Router();

const {
  protect,
  restrictTo,
} = require("../middleware/auth.middleware");

const couponController = require("../controllers/coupon.controller");

// ========================================
// CUSTOMER ROUTE
// ========================================

// Validate coupon during checkout
router.post(
  "/validate",
  protect,
  restrictTo("customer"),
  couponController.validateCoupon
);


// ========================================
// ADMIN ROUTES
// ========================================

// Create coupon
router.post(
  "/",
  protect,
  restrictTo("admin"),
  couponController.createCoupon
);

// Get all coupons
router.get(
  "/",
  protect,
  restrictTo("admin"),
  couponController.getAllCoupons
);

// Get coupon by ID
router.get(
  "/:id",
  protect,
  restrictTo("admin"),
  couponController.getCouponById
);

// Update coupon
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  couponController.updateCoupon
);

// Deactivate coupon
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  couponController.deactivateCoupon
);

module.exports = router;
