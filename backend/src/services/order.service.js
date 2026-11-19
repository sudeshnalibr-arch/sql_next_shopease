const { Transaction } = require("sequelize");
const {
  sequelize,
  Product,
  Order,
  OrderItem,
} = require("../models");
const AppError = require("../utils/AppError");
const { randomUUID } = require("crypto");

// Convert a MySQL DECIMAL price string into integer cents.
// Avoid floating-point arithmetic for money.
const toCents = (value) => {
  const [whole, fraction = ""] = String(value).split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0").slice(0, 2));
};

const fromCents = (cents) => (cents / 100).toFixed(2);

const createOrder = async (userId, items) => {
  return sequelize.transaction(
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    },
    async (transaction) => {
      const productIds = items
        .map((item) => item.productId)
        .sort((a, b) => a - b);

      const products = await Product.findAll({
        where: {
          id: productIds,
          isActive: true,
        },
        order: [["id", "ASC"]],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (products.length !== productIds.length) {
        throw new AppError(
          "One or more products are unavailable",
          400
        );
      }

      const productMap = new Map(
        products.map((product) => [product.id, product])
      );

      const orderItems = [];
      let totalCents = 0;

      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for ${product.name}`,
            409
          );
        }

        const priceCents = toCents(product.price);
        const subtotalCents = priceCents * item.quantity;

        totalCents += subtotalCents;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          price: fromCents(priceCents),
          subtotal: fromCents(subtotalCents),
        });
      }

      // This assignment uses a simulated successful payment.
      const order = await Order.create(
        {
          userId,
          totalAmount: fromCents(totalCents),
          status: "confirmed",
          paymentStatus: "paid",
          paymentMethod: "simulated",
          paidAt: new Date(),
          transactionId: `SIM-${randomUUID()}`,
        },
        { transaction }
      );

      await OrderItem.bulkCreate(
        orderItems.map((item) => ({
          ...item,
          orderId: order.id,
        })),
        { transaction }
      );

      for (const item of items) {
        const product = productMap.get(item.productId);

        await product.decrement("stock", {
          by: item.quantity,
          transaction,
        });
      }

      return {
        orderId: order.id,
        totalAmount: fromCents(totalCents),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paidAt: order.paidAt,
        message: "Payment successful. Order placed successfully.",
        items: orderItems,
      };
    }
  );
};

const getMyOrders = async (userId, { page = 1, limit = 10 }) => {
  const { count, rows } = await Order.findAndCountAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: "items",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
  });

  return {
    orders: rows,
    pagination: {
      totalItems: count,
      currentPage: page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getOrderById = async (id, userId, isAdmin = false) => {
  const where = { id };

  if (!isAdmin) {
    where.userId = userId;
  }

  const order = await Order.findOne({
    where,
    include: [
      {
        model: OrderItem,
        as: "items",
      },
    ],
  });

  if (!order) {
    // Do not reveal whether another customer's order exists.
    throw new AppError("Order not found", 404);
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};