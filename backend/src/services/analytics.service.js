const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

// Revenue is counted from paid orders that have not been cancelled.
const REVENUE_CONDITION = `
  o.paymentStatus = 'paid'
  AND o.status <> 'cancelled'
`;

const getDashboardAnalytics = async () => {
  const [result] = await sequelize.query(
    `
    SELECT
      COUNT(*) AS totalOrders,

      COALESCE(SUM(
        CASE WHEN ${REVENUE_CONDITION}
        THEN o.totalAmount ELSE 0 END
      ), 0) AS revenue,

      COALESCE(AVG(
        CASE WHEN ${REVENUE_CONDITION}
        THEN o.totalAmount ELSE NULL END
      ), 0) AS averageOrderValue,

      SUM(CASE
        WHEN o.status = 'cancelled' THEN 1 ELSE 0
      END) AS cancelledOrders,

      SUM(CASE
        WHEN o.status = 'delivered' THEN 1 ELSE 0
      END) AS completedOrders

    FROM orders o
    `,
    { type: QueryTypes.SELECT }
  );

  return result;
};

const getCategorySales = async () => {
  return sequelize.query(
    `
    SELECT
      c.id AS categoryId,
      c.name AS categoryName,
      SUM(oi.quantity) AS quantitySold,
      COUNT(DISTINCT o.id) AS totalOrders,
      SUM(oi.quantity * oi.price) AS revenue

    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.orderId
    INNER JOIN products p ON p.id = oi.productId
    INNER JOIN categories c ON c.id = p.categoryId

    WHERE ${REVENUE_CONDITION}

    GROUP BY c.id, c.name
    ORDER BY revenue DESC
    `,
    { type: QueryTypes.SELECT }
  );
};

const getTopProducts = async () => {
  return sequelize.query(
    `
    SELECT
      oi.productId,
      oi.productName,
      SUM(oi.quantity) AS quantitySold,
      SUM(oi.quantity * oi.price) AS revenue

    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.orderId

    WHERE ${REVENUE_CONDITION}

    GROUP BY oi.productId, oi.productName
    ORDER BY revenue DESC
    LIMIT 5
    `,
    { type: QueryTypes.SELECT }
  );
};

const getCustomerAnalytics = async () => {
  return sequelize.query(
    `
    SELECT
      u.id AS customerId,
      u.name,
      u.email,

      COUNT(DISTINCT o.id) AS totalOrders,

      COALESCE(SUM(
        CASE WHEN ${REVENUE_CONDITION}
        THEN o.totalAmount ELSE 0 END
      ), 0) AS totalSpending

    FROM users u

    LEFT JOIN orders o ON o.userId = u.id

    WHERE u.role = 'customer'

    GROUP BY u.id, u.name, u.email
    ORDER BY totalSpending DESC
    `,
    { type: QueryTypes.SELECT }
  );
};

const getMonthlyRevenue = async () => {
  return sequelize.query(
    `
    SELECT
      YEAR(o.createdAt) AS year,
      MONTH(o.createdAt) AS month,
      COUNT(*) AS totalOrders,
      SUM(o.totalAmount) AS revenue

    FROM orders o

    WHERE ${REVENUE_CONDITION}

    GROUP BY YEAR(o.createdAt), MONTH(o.createdAt)
    ORDER BY year ASC, month ASC
    `,
    { type: QueryTypes.SELECT }
  );
};

const getSalesAnalytics = async ({ from, to } = {}) => {
  const conditions = [REVENUE_CONDITION];
  const replacements = {};

  if (from) {
    conditions.push("o.createdAt >= :from");
    replacements.from = from;
  }

  if (to) {
    conditions.push("o.createdAt <= :to");
    replacements.to = to;
  }

  const [result] = await sequelize.query(
    `
    SELECT
      COUNT(*) AS totalOrders,
      COALESCE(SUM(o.totalAmount), 0) AS revenue,
      COALESCE(AVG(o.totalAmount), 0) AS averageOrderValue,

      COALESCE((
        SELECT SUM(oi.quantity)
        FROM order_items oi
        INNER JOIN orders filteredOrders
          ON filteredOrders.id = oi.orderId
        WHERE ${REVENUE_CONDITION.replaceAll("o.", "filteredOrders.")}
          ${from ? "AND filteredOrders.createdAt >= :from" : ""}
          ${to ? "AND filteredOrders.createdAt <= :to" : ""}
      ), 0) AS totalItems

    FROM orders o

    WHERE ${conditions.join(" AND ")}
    `,
    {
      replacements,
      type: QueryTypes.SELECT,
    }
  );

  return result;
};

const getOrderStatusAnalytics = async () => {
  return sequelize.query(
    `
    SELECT
      o.status,
      COUNT(*) AS totalOrders,

      COALESCE(SUM(
        CASE
          WHEN o.paymentStatus = 'paid'
           AND o.status <> 'cancelled'
          THEN o.totalAmount
          ELSE 0
        END
      ), 0) AS revenue

    FROM orders o

    GROUP BY o.status
    ORDER BY totalOrders DESC
    `,
    { type: QueryTypes.SELECT }
  );
};

module.exports = {
  getDashboardAnalytics,
  getCategorySales,
  getTopProducts,
  getCustomerAnalytics,
  getMonthlyRevenue,
  getSalesAnalytics,
  getOrderStatusAnalytics,
};