const PDFDocument = require("pdfkit");

const { Order, OrderItem, Product, User } = require("../models");
const AppError = require("../utils/AppError");

// Fetch an order with its customer and products
const getOrderForInvoice = async (orderId, userId, isAdmin = false) => {
  const where = { id: orderId };

  // Customers can only access their own orders.
  if (!isAdmin) {
    where.userId = userId;
  }

  const order = await Order.findOne({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "phone"],
      },
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  return order;
};

// Create a consistent invoice number
const generateInvoiceNumber = (order) => {
  return `INV-${String(order.id).padStart(6, "0")}`;
};

// Generate PDF invoice
const generateInvoicePdf = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      const invoiceNumber = generateInvoiceNumber(order);

      const customer = order.user;
      const items = order.items || [];

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("ShopEase", { align: "center" });

      doc.moveDown(0.5);

      doc
        .fontSize(18)
        .text("INVOICE", { align: "center" });

      doc.moveDown();

      // Invoice information
      doc.fontSize(10).font("Helvetica");

      doc.text(`Invoice Number: ${invoiceNumber}`);
      doc.text(`Order Number: ${order.orderNumber || order.id}`);
      doc.text(
        `Invoice Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`
      );

      doc.moveDown();

      // Customer information
      doc.font("Helvetica-Bold").text("Bill To:");

      doc.font("Helvetica");
      doc.text(`Name: ${customer?.name || "Customer"}`);
      doc.text(`Email: ${customer?.email || "N/A"}`);
      doc.text(`Phone: ${customer?.phone || "N/A"}`);

      doc.moveDown(2);

      // Table header
      const tableTop = doc.y;

      const columns = {
        name: 50,
        quantity: 300,
        price: 380,
        total: 470,
      };

      doc.font("Helvetica-Bold");

      doc.text("Product", columns.name, tableTop);
      doc.text("Qty", columns.quantity, tableTop);
      doc.text("Price", columns.price, tableTop);
      doc.text("Total", columns.total, tableTop);

      doc
        .moveTo(50, tableTop + 20)
        .lineTo(550, tableTop + 20)
        .stroke();

      let y = tableTop + 30;

      doc.font("Helvetica");

      for (const item of items) {
        const productName = item.product?.name || "Product";

        const quantity = Number(item.quantity || 0);

        const price = Number(item.price || 0);

        const subtotal =
          Number(item.subtotal ?? quantity * price);

        doc.text(productName, columns.name, y, {
          width: 230,
        });

        doc.text(String(quantity), columns.quantity, y);

        doc.text(`Rs. ${price.toFixed(2)}`, columns.price, y);

        doc.text(`Rs. ${subtotal.toFixed(2)}`, columns.total, y);

        y += 25;

        // Add a new page if the invoice is long.
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      }

      doc.moveDown(2);

      // Amount summary
      const subtotal = Number(order.subtotal ?? order.totalAmount);

      const discountAmount = Number(order.discountAmount || 0);

      const totalAmount = Number(order.totalAmount || 0);

      doc
        .font("Helvetica-Bold")
        .text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, {
          align: "right",
        });

      doc
        .font("Helvetica")
        .text(`Discount: Rs. ${discountAmount.toFixed(2)}`, {
          align: "right",
        });

      doc
        .font("Helvetica-Bold")
        .text(`Grand Total: Rs. ${totalAmount.toFixed(2)}`, {
          align: "right",
        });

      doc.moveDown(2);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text("Thank you for shopping with ShopEase!", {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Get invoice PDF for an order
const getInvoice = async (orderId, userId, isAdmin = false) => {
  const order = await getOrderForInvoice(orderId, userId, isAdmin);

  const invoiceNumber = generateInvoiceNumber(order);

  const pdfBuffer = await generateInvoicePdf(order);

  return {
    invoiceNumber,
    pdfBuffer,
    order,
  };
};

module.exports = {
  getOrderForInvoice,
  generateInvoiceNumber,
  generateInvoicePdf,
  getInvoice,
};