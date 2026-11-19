// backend/src/controllers/order.controller.js

const orderService = require("../services/order.service");

/* =====================================================
   CREATE ORDER / CHECKOUT
   POST /api/orders
===================================================== */

const createOrder = async (req, res) => {
  const result = await orderService.createOrder(
    req.user.id,
    req.body.items
  );

  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    data: result,
  });
};

/* =====================================================
   GET MY ORDERS
   GET /api/orders/my-orders
===================================================== */

const getMyOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await orderService.getMyOrders(
    req.user.id,
    {
      page: Number(page),
      limit: Number(limit),
    }
  );

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully.",
    data: result,
  });
};

/* =====================================================
   GET ORDER BY ID
   GET /api/orders/:id
===================================================== */

const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(
    Number(req.params.id),
    req.user.id,
    req.user.role === "admin"
  );

  res.status(200).json({
    success: true,
    message: "Order fetched successfully.",
    data: { order },
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};