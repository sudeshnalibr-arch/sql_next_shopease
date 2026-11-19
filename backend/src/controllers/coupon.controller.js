
const couponService = require("../services/coupon.service");
const asyncHandler = require("../middleware/asyncHandler");

// ========================================
// CREATE COUPON
// ========================================

const createCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.createCoupon(req.body);

  res.status(201).json({
    success: true,
    message: "Coupon created successfully.",
    data: result,
  });
});


// ========================================
// GET ALL COUPONS
// ========================================

const getAllCoupons = asyncHandler(async (req, res) => {
  const result = await couponService.getAllCoupons(req.query);

  res.status(200).json({
    success: true,
    message: "Coupons fetched successfully.",
    data: result,
  });
});


// ========================================
// GET COUPON BY ID
// ========================================

const getCouponById = asyncHandler(async (req, res) => {
  const result = await couponService.getCouponById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Coupon fetched successfully.",
    data: result,
  });
});


// ========================================
// UPDATE COUPON
// ========================================

const updateCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.updateCoupon(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully.",
    data: result,
  });
});


// ========================================
// DEACTIVATE COUPON
// ========================================

const deactivateCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.deactivateCoupon(req.params.id);

  res.status(200).json({
    success: true,
    message: "Coupon deactivated successfully.",
    data: result,
  });
});


// ========================================
// VALIDATE COUPON
// ========================================

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  const userId = req.user.id;

  const result = await couponService.validateCoupon(
    userId,
    code,
    orderAmount
  );

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully.",
    data: result,
  });
});


module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deactivateCoupon,
  validateCoupon,
};
