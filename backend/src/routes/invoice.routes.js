const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const invoiceController = require("../controllers/invoice.controller");

// Download invoice PDF
router.get(
  "/orders/:orderId",
  protect,
  invoiceController.downloadInvoice
);

module.exports = router;