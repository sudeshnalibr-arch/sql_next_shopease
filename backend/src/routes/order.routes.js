
const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate.middleware");

const {
  protect,
  restrictTo,
} = require("../middleware/auth.middleware");

const {
  createOrderSchema,
  orderIdSchema,
  orderQuerySchema,
} = require("../validators/order.validator");

// ============================================
// CREATE ORDER / CHECKOUT
// POST /api/orders
// Customer only
// ============================================

router.post(
  "/",
  protect,
  restrictTo("customer"),
  validate(createOrderSchema),
  asyncHandler(orderController.createOrder)
);

// ============================================
// GET MY ORDERS
// GET /api/orders/my-orders?page=1&limit=10
// Customer only
// ============================================

router.get(
  "/my-orders",
  protect,
  restrictTo("customer"),
  validate(orderQuerySchema, "query"),
  asyncHandler(orderController.getMyOrders)
);

// ============================================
// GET ORDER BY ID
// GET /api/orders/:id
// Customer or admin
// ============================================

router.get(
  "/:id",
  protect,
  validate(orderIdSchema, "params"),
  asyncHandler(orderController.getOrderById)
);

module.exports = router;
