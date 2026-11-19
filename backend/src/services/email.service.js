const transporter = require("../config/mail.config");
const AppError = require("../utils/AppError");

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!to || !subject || !html) {
    throw new AppError("Email recipient, subject and content are required.", 400);
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      html,
      attachments,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new AppError("Unable to send email. Please try again later.", 500);
  }
};

// Order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  const customerName = user.name || "Customer";
  const orderNumber = order.orderNumber || order.id;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Thank you for shopping with ShopEase!</h2>

      <p>Hello ${customerName},</p>

      <p>Your order has been placed successfully.</p>

      <h3>Order Details</h3>

      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Total Amount:</strong> ₹${Number(order.totalAmount).toFixed(2)}</p>
      <p><strong>Order Status:</strong> ${order.status}</p>

      <p>Thank you for choosing ShopEase.</p>
      <p>Team ShopEase</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  });
};

// Send invoice PDF through email
const sendInvoiceEmail = async (user, order, invoiceNumber, pdfBuffer) => {
  const orderNumber = order.orderNumber || order.id;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Your ShopEase Invoice</h2>

      <p>Hello ${user.name || "Customer"},</p>

      <p>
        Your invoice for order
        <strong>${orderNumber}</strong>
        is attached to this email.
      </p>

      <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>

      <p>Thank you for shopping with ShopEase!</p>
      <p>Team ShopEase</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Invoice ${invoiceNumber} - ShopEase`,
    html,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendInvoiceEmail,
};