const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const paymentController = require("../controllers/payment.controller");

// All payment routes require authentication
router.use(protect);

// Create payment attempt for an order
router.post(
  "/",
  paymentController.createPayment
);

// Get logged-in user's payment history
router.get(
  "/my",
  paymentController.getMyPayments
);

// Get payment details
router.get(
  "/:id",
  paymentController.getPaymentById
);

module.exports = router;