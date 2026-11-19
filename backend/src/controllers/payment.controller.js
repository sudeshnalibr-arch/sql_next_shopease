const paymentService = require("../services/payment.service");
const asyncHandler = require("../middleware/asyncHandler");

const isAdmin = (req) => req.user.role === "admin";

// Create a payment attempt
const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentGateway, paymentMethod } = req.body;

  const payment = await paymentService.createPayment(
    req.user.id,
    orderId,
    paymentGateway,
    paymentMethod
  );

  res.status(201).json({
    success: true,
    message: "Payment attempt created successfully.",
    data: payment,
  });
});

// Get logged-in user's payment history
const getMyPayments = asyncHandler(async (req, res) => {
  const result = await paymentService.getMyPayments(
    req.user.id,
    req.query
  );

  res.status(200).json({
    success: true,
    message: "Payment history fetched successfully.",
    data: result.payments,
    pagination: result.pagination,
  });
});

// Get payment details
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(
    req.params.id,
    req.user.id,
    isAdmin(req)
  );

  res.status(200).json({
    success: true,
    message: "Payment details fetched successfully.",
    data: payment,
  });
});

module.exports = {
  createPayment,
  getMyPayments,
  getPaymentById,
};