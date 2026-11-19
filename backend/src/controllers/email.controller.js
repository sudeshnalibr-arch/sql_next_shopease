const emailService = require("../services/email.service");
const invoiceService = require("../services/invoice.service");
const asyncHandler = require("../middleware/asyncHandler");

const isAdmin = (req) => req.user.role === "admin";

// Resend order confirmation email
const sendOrderConfirmation = asyncHandler(async (req, res) => {
  const order = await invoiceService.getOrderForInvoice(
    req.params.orderId,
    req.user.id,
    isAdmin(req)
  );

  await emailService.sendOrderConfirmationEmail(order.user, order);

  res.status(200).json({
    success: true,
    message: "Order confirmation email sent successfully.",
  });
});

// Email the invoice PDF
const sendInvoiceEmail = asyncHandler(async (req, res) => {
  const { invoiceNumber, pdfBuffer, order } =
    await invoiceService.getInvoice(
      req.params.orderId,
      req.user.id,
      isAdmin(req)
    );

  await emailService.sendInvoiceEmail(
    order.user,
    order,
    invoiceNumber,
    pdfBuffer
  );

  res.status(200).json({
    success: true,
    message: "Invoice email sent successfully.",
    data: {
      invoiceNumber,
    },
  });
});

module.exports = {
  sendOrderConfirmation,
  sendInvoiceEmail,
};