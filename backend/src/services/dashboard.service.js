const { Op } = require("sequelize");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getOrderCount = (where = {}) => Order.count({ where });

const getSalesTotal = async (where = {}) => {
  return (await Order.sum("totalAmount", { where })) || 0;
};

// 1. ADMIN DASHBOARD
const getAdminDashboard = async () => {
  const [
    totalUsers,
    activeUsers,
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSales,
    recentOrders,
  ] = await Promise.all([
    User.count(),
    User.count({ where: { isActive: true } }),
    Product.count(),
    Product.count({ where: { isActive: true } }),
    getOrderCount(),
    getOrderCount({ status: "pending" }),
    getOrderCount({ status: "delivered" }),
    getSalesTotal({ status: "delivered" }),
    Order.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "userId", "status", "totalAmount", "createdAt"],
    }),
  ]);

  return {
    role: "admin",
    stats: {
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales,
    },
    recentOrders,
  };
};

// 2. MANAGER DASHBOARD
const getManagerDashboard = async () => {
  const [
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    totalSales,
  ] = await Promise.all([
    Product.count(),
    Product.count({ where: { isActive: true } }),
    Product.count({
      where: {
        stock: { [Op.lte]: 5 },
        isActive: true,
      },
    }),
    getOrderCount(),
    getOrderCount({ status: "pending" }),
    getOrderCount({ status: "processing" }),
    getOrderCount({ status: "delivered" }),
    getSalesTotal({ status: "delivered" }),
  ]);

  return {
    role: "manager",
    stats: {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalSales,
    },
  };
};

// 3. STAFF DASHBOARD
const getStaffDashboard = async () => {
  const [
    pendingOrders,
    processingOrders,
    shippedOrders,
    totalProducts,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    getOrderCount({ status: "pending" }),
    getOrderCount({ status: "processing" }),
    getOrderCount({ status: "shipped" }),
    Product.count({ where: { isActive: true } }),
    Product.count({
      where: {
        stock: { [Op.lte]: 5 },
        isActive: true,
      },
    }),
    Order.findAll({
      where: {
        status: { [Op.in]: ["pending", "processing"] },
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "userId", "status", "createdAt"],
    }),
  ]);

  return {
    role: "staff",
    stats: {
      pendingOrders,
      processingOrders,
      shippedOrders,
      totalProducts,
      lowStockProducts,
    },
    ordersToProcess: recentOrders,
  };
};

// 4. CUSTOMER DASHBOARD
const getCustomerDashboard = async (userId) => {
  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalSpent,
    recentOrders,
  ] = await Promise.all([
    getOrderCount({ userId }),
    getOrderCount({ userId, status: "pending" }),
    getOrderCount({ userId, status: "delivered" }),
    getOrderCount({ userId, status: "cancelled" }),
    getSalesTotal({ userId, status: "delivered" }),
    Order.findAll({
      where: { userId },
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "status", "totalAmount", "createdAt"],
    }),
  ]);

  return {
    role: "customer",
    stats: {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalSpent,
    },
    recentOrders,
  };
};

module.exports = {
  getAdminDashboard,
  getManagerDashboard,
  getStaffDashboard,
  getCustomerDashboard,
};