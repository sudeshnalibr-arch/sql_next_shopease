const { Payment, Order } = require("../models");
const { randomUUID } = require("crypto");
const AppError = require("../utils/AppError");

// Create a pending payment attempt
const createPayment = async (userId, orderId, paymentGateway, paymentMethod) => {
  const order = await Order.findOne({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // Adapt this check to your actual Order status values.
  if (["cancelled", "canceled"].includes(String(order.status).toLowerCase())) {
    throw new AppError("Cannot pay for a cancelled order.", 400);
  }

  const allowedGateways = ["razorpay", "stripe", "cod"];

  if (!allowedGateways.includes(paymentGateway)) {
    throw new AppError("Invalid payment gateway.", 400);
  }

  const amount = Number(order.totalAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("Invalid order amount.", 400);
  }

  if (paymentGateway === "cod" && paymentMethod !== "cod") {
    throw new AppError("COD gateway requires COD payment method.", 400);
  }

  if (paymentGateway !== "cod" && paymentMethod === "cod") {
    throw new AppError("COD method requires the COD gateway.", 400);
  }

  // A successful payment already exists for this order.
  const successfulPayment = await Payment.findOne({
    where: {
      orderId,
      status: "succeeded",
    },
  });

  if (successfulPayment) {
    throw new AppError("This order has already been paid.", 409);
  }

  const payment = await Payment.create({
    orderId,
    userId,
    paymentGateway,
    paymentMethod,
    amount,
    currency: "INR",
    status: paymentGateway === "cod" ? "pending" : "processing",
    transactionId: `TXN-${randomUUID()}`,
  });

  return payment;
};

// Get logged-in user's payments
const getMyPayments = async (userId, query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const { count, rows } = await Payment.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Order,
        as: "order",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    payments: rows,
    pagination: {
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      pageSize: limit,
    },
  };
};

// Get payment by ID (customer can only access own payment)
const getPaymentById = async (paymentId, userId, isAdmin = false) => {
  const where = { id: paymentId };

  if (!isAdmin) {
    where.userId = userId;
  }

  const payment = await Payment.findOne({
    where,
    include: [
      {
        model: Order,
        as: "order",
      },
    ],
  });

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  return payment;
};

// Internal function: call only after trusted gateway verification.
const markPaymentSuccessful = async (
  paymentId,
  gatewayPaymentId,
  gatewayResponse = null
) => {
  const payment = await Payment.findByPk(paymentId);

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  if (payment.status === "succeeded") {
    return payment;
  }

  await payment.update({
    status: "succeeded",
    gatewayPaymentId,
    gatewayResponse,
    paidAt: new Date(),
    failureReason: null,
  });

  return payment;
};

// Internal function: call only after trusted gateway failure confirmation.
const markPaymentFailed = async (paymentId, failureReason) => {
  const payment = await Payment.findByPk(paymentId);

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  if (payment.status === "succeeded") {
    throw new AppError("A successful payment cannot be marked as failed.", 409);
  }

  await payment.update({
    status: "failed",
    failureReason: failureReason || "Payment failed.",
  });

  return payment;
};

module.exports = {
  createPayment,
  getMyPayments,
  getPaymentById,
  markPaymentSuccessful,
  markPaymentFailed,
};