const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const emailController = require("../controllers/email.controller");

// Resend order confirmation
router.post(
  "/orders/:orderId/confirmation",
  protect,
  emailController.sendOrderConfirmation
);

// Send invoice PDF through email
router.post(
  "/orders/:orderId/invoice",
  protect,
  emailController.sendInvoiceEmail
);

module.exports = router;