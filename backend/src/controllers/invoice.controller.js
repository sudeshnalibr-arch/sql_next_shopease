const invoiceService = require("../services/invoice.service");
const asyncHandler = require("../middleware/asyncHandler");

const isAdmin = (req) => req.user.role === "admin";

// Download invoice PDF
const downloadInvoice = asyncHandler(async (req, res) => {
  const { invoiceNumber, pdfBuffer } =
    await invoiceService.getInvoice(
      req.params.orderId,
      req.user.id,
      isAdmin(req)
    );

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${invoiceNumber}.pdf"`
  );

  res.setHeader("Content-Length", pdfBuffer.length);

  res.status(200).send(pdfBuffer);
});

module.exports = {
  downloadInvoice,
};