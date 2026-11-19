
const {
  Coupon,
  CouponUsage,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

// ========================================
// HELPER: VALIDATE COUPON
// ========================================

const checkCouponEligibility = async (
  coupon,
  userId,
  orderAmount,
  transaction = null
) => {
  const now = new Date();
  const amount = Number(orderAmount);

  if (!coupon.isActive) {
    throw new AppError("This coupon is inactive.", 400);
  }

  if (now < new Date(coupon.startDate)) {
    throw new AppError("This coupon is not available yet.", 400);
  }

  if (now > new Date(coupon.expiryDate)) {
    throw new AppError("This coupon has expired.", 400);
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("Invalid order amount.", 400);
  }

  if (amount < Number(coupon.minOrderAmount)) {
    throw new AppError(
      `Minimum order amount for this coupon is ${coupon.minOrderAmount}.`,
      400
    );
  }

  // Check total coupon usage
  if (coupon.usageLimit !== null) {
    const totalUsage = await CouponUsage.count({
      where: { couponId: coupon.id },
      transaction,
    });

    if (totalUsage >= coupon.usageLimit) {
      throw new AppError(
        "This coupon has reached its usage limit.",
        400
      );
    }
  }

  // Check usage by this customer
  const userUsage = await CouponUsage.count({
    where: {
      couponId: coupon.id,
      userId,
    },
    transaction,
  });

  if (userUsage >= coupon.usagePerUser) {
    throw new AppError(
      "You have already used this coupon the maximum number of times.",
      400
    );
  }

  return true;
};


// ========================================
// HELPER: CALCULATE DISCOUNT
// ========================================

const calculateDiscount = (coupon, orderAmount) => {
  const amount = Number(orderAmount);
  const discountValue = Number(coupon.discountValue);

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (amount * discountValue) / 100;

    if (coupon.maxDiscount !== null) {
      discount = Math.min(
        discount,
        Number(coupon.maxDiscount)
      );
    }
  } else if (coupon.discountType === "fixed") {
    discount = discountValue;
  }

  // Discount cannot exceed order amount
  discount = Math.min(discount, amount);

  return Number(discount.toFixed(2));
};


// ========================================
// CREATE COUPON
// ========================================

const createCoupon = async (data) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount = 0,
    maxDiscount = null,
    usageLimit = null,
    usagePerUser = 1,
    startDate,
    expiryDate,
    isActive = true,
  } = data;

  if (
    !code ||
    !discountType ||
    discountValue === undefined ||
    !startDate ||
    !expiryDate
  ) {
    throw new AppError("Please provide all required coupon fields.", 400);
  }

  if (!["percentage", "fixed"].includes(discountType)) {
    throw new AppError("Invalid discount type.", 400);
  }

  const value = Number(discountValue);
  const minimum = Number(minOrderAmount);
  const maximum = maxDiscount === null ? null : Number(maxDiscount);

  if (!Number.isFinite(value) || value <= 0) {
    throw new AppError("Discount value must be greater than zero.", 400);
  }

  if (discountType === "percentage" && value > 100) {
    throw new AppError("Percentage discount cannot exceed 100%.", 400);
  }

  if (maximum !== null && (!Number.isFinite(maximum) || maximum <= 0)) {
    throw new AppError("Maximum discount must be greater than zero.", 400);
  }

  if (discountType === "fixed" && maximum !== null) {
    throw new AppError("Maximum discount is only applicable to percentage coupons.", 400);
  }

  if (!Number.isFinite(minimum) || minimum < 0) {
    throw new AppError("Minimum order amount cannot be negative.", 400);
  }

  if (
    usageLimit !== null &&
    (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) < 1)
  ) {
    throw new AppError("Usage limit must be a positive integer.", 400);
  }

  if (!Number.isInteger(Number(usagePerUser)) || Number(usagePerUser) < 1) {
    throw new AppError("Usage per user must be a positive integer.", 400);
  }

  const start = new Date(startDate);
  const expiry = new Date(expiryDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(expiry.getTime()) ||
    expiry <= start
  ) {
    throw new AppError("Please provide valid coupon dates.", 400);
  }

  const existingCoupon = await Coupon.findOne({
    where: {
      code: code.trim().toUpperCase(),
    },
  });

  if (existingCoupon) {
    throw new AppError("Coupon code already exists.", 409);
  }

  return await Coupon.create({
    code,
    discountType,
    discountValue: value,
    minOrderAmount: minimum,
    maxDiscount: maximum,
    usageLimit: usageLimit === null ? null : Number(usageLimit),
    usagePerUser: Number(usagePerUser),
    startDate: start,
    expiryDate: expiry,
    isActive,
  });
};


// ========================================
// GET ALL COUPONS
// ========================================

const getAllCoupons = async (query = {}) => {
  const { page = 1, limit = 10, search, isActive } = query;

  const currentPage = Math.max(1, Number(page) || 1);
  const pageLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  const where = {};

  if (search) {
    where.code = {
      [Op.like]: `%${search.trim()}%`,
    };
  }

  if (isActive !== undefined) {
    if (!["true", "false"].includes(String(isActive))) {
      throw new AppError("Invalid isActive filter.", 400);
    }

    where.isActive = String(isActive) === "true";
  }

  const { count, rows } = await Coupon.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: pageLimit,
    offset: (currentPage - 1) * pageLimit,
  });

  return {
    coupons: rows,
    pagination: {
      total: count,
      page: currentPage,
      limit: pageLimit,
      totalPages: Math.ceil(count / pageLimit),
    },
  };
};


// ========================================
// GET COUPON BY ID
// ========================================

const getCouponById = async (id) => {
  const coupon = await Coupon.findByPk(id);

  if (!coupon) {
    throw new AppError("Coupon not found.", 404);
  }

  return coupon;
};


// ========================================
// UPDATE COUPON
// ========================================

const updateCoupon = async (id, updates) => {
  const coupon = await Coupon.findByPk(id);

  if (!coupon) {
    throw new AppError("Coupon not found.", 404);
  }

  const allowedFields = [
    "discountType",
    "discountValue",
    "minOrderAmount",
    "maxDiscount",
    "usageLimit",
    "usagePerUser",
    "startDate",
    "expiryDate",
    "isActive",
  ];

  const safeUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      safeUpdates[field] = updates[field];
    }
  }

  if (safeUpdates.discountType !== undefined &&
      !["percentage", "fixed"].includes(safeUpdates.discountType)) {
    throw new AppError("Invalid discount type.", 400);
  }

  const finalType = safeUpdates.discountType ?? coupon.discountType;
  const finalValue = Number(safeUpdates.discountValue ?? coupon.discountValue);

  if (!Number.isFinite(finalValue) || finalValue <= 0) {
    throw new AppError("Discount value must be greater than zero.", 400);
  }

  if (finalType === "percentage" && finalValue > 100) {
    throw new AppError("Percentage discount cannot exceed 100%.", 400);
  }

  if (finalType === "fixed" &&
      (safeUpdates.maxDiscount ?? coupon.maxDiscount) !== null) {
    throw new AppError("Maximum discount is only applicable to percentage coupons.", 400);
  }

  const finalMinimum = Number(
    safeUpdates.minOrderAmount ?? coupon.minOrderAmount
  );

  if (!Number.isFinite(finalMinimum) || finalMinimum < 0) {
    throw new AppError("Minimum order amount cannot be negative.", 400);
  }

  if (safeUpdates.maxDiscount !== undefined &&
      safeUpdates.maxDiscount !== null &&
      (!Number.isFinite(Number(safeUpdates.maxDiscount)) ||
       Number(safeUpdates.maxDiscount) <= 0)) {
    throw new AppError("Maximum discount must be greater than zero.", 400);
  }

  if (safeUpdates.usageLimit !== undefined &&
      safeUpdates.usageLimit !== null &&
      (!Number.isInteger(Number(safeUpdates.usageLimit)) ||
       Number(safeUpdates.usageLimit) < 1)) {
    throw new AppError("Usage limit must be a positive integer.", 400);
  }

  if (safeUpdates.usagePerUser !== undefined &&
      (!Number.isInteger(Number(safeUpdates.usagePerUser)) ||
       Number(safeUpdates.usagePerUser) < 1)) {
    throw new AppError("Usage per user must be a positive integer.", 400);
  }

  const finalStart = new Date(safeUpdates.startDate ?? coupon.startDate);
  const finalExpiry = new Date(safeUpdates.expiryDate ?? coupon.expiryDate);

  if (
    Number.isNaN(finalStart.getTime()) ||
    Number.isNaN(finalExpiry.getTime()) ||
    finalExpiry <= finalStart
  ) {
    throw new AppError("Coupon expiry date must be after its start date.", 400);
  }

  await coupon.update(safeUpdates);

  return coupon;
};


// ========================================
// DEACTIVATE COUPON
// ========================================

const deactivateCoupon = async (id) => {
  const coupon = await Coupon.findByPk(id);

  if (!coupon) {
    throw new AppError("Coupon not found.", 404);
  }

  await coupon.update({
    isActive: false,
  });

  return coupon;
};


// ========================================
// VALIDATE COUPON
// ========================================

const validateCoupon = async (userId, code, orderAmount) => {
  if (!code || orderAmount === undefined) {
    throw new AppError("Coupon code and order amount are required.", 400);
  }

  const coupon = await Coupon.findOne({
    where: {
      code: code.trim().toUpperCase(),
    },
  });

  if (!coupon) {
    throw new AppError("Invalid coupon code.", 404);
  }

  await checkCouponEligibility(
    coupon,
    userId,
    orderAmount
  );

  const discountAmount = calculateDiscount(
    coupon,
    orderAmount
  );

  return {
    couponId: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    orderAmount: Number(Number(orderAmount).toFixed(2)),
    discountAmount,
    finalAmount: Number(
      (Number(orderAmount) - discountAmount).toFixed(2)
    ),
  };
};


module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deactivateCoupon,
  validateCoupon,
  checkCouponEligibility,
  calculateDiscount,
};
