// backend/src/controllers/analytics.controller.js

const analyticsService = require("../services/analytics.service");

/* =====================================================
   DASHBOARD ANALYTICS
   GET /api/analytics/dashboard
===================================================== */

const getDashboardAnalytics = async (req, res) => {
  const result =
    await analyticsService.getDashboardAnalytics();

  res.status(200).json({
    success: true,
    message: "Dashboard analytics fetched successfully.",
    data: result,
  });
};

/* =====================================================
   CATEGORY SALES
   GET /api/analytics/category-sales
===================================================== */

const getCategorySales = async (req, res) => {
  const result =
    await analyticsService.getCategorySales();

  res.status(200).json({
    success: true,
    message: "Category sales fetched successfully.",
    data: result,
  });
};

/* =====================================================
   TOP PRODUCTS
   GET /api/analytics/top-products
===================================================== */

const getTopProducts = async (req, res) => {
  const result =
    await analyticsService.getTopProducts();

  res.status(200).json({
    success: true,
    message: "Top products fetched successfully.",
    data: result,
  });
};

/* =====================================================
   CUSTOMER ANALYTICS
   GET /api/analytics/customers
===================================================== */

const getCustomerAnalytics = async (req, res) => {
  const result =
    await analyticsService.getCustomerAnalytics();

  res.status(200).json({
    success: true,
    message: "Customer analytics fetched successfully.",
    data: result,
  });
};

/* =====================================================
   MONTHLY REVENUE
   GET /api/analytics/monthly-revenue
===================================================== */

const getMonthlyRevenue = async (req, res) => {
  const result =
    await analyticsService.getMonthlyRevenue();

  res.status(200).json({
    success: true,
    message: "Monthly revenue fetched successfully.",
    data: result,
  });
};

/* =====================================================
   DATE-RANGE SALES
   GET /api/analytics/sales?from=YYYY-MM-DD&to=YYYY-MM-DD
===================================================== */

const getSalesAnalytics = async (req, res) => {
  const result = await analyticsService.getSalesAnalytics({
    from: req.query.from,
    to: req.query.to,
  });

  res.status(200).json({
    success: true,
    message: "Sales analytics fetched successfully.",
    data: result,
  });
};

/* =====================================================
   ORDER STATUS ANALYTICS
   GET /api/analytics/order-status
===================================================== */

const getOrderStatusAnalytics = async (req, res) => {
  const result =
    await analyticsService.getOrderStatusAnalytics();

  res.status(200).json({
    success: true,
    message: "Order status analytics fetched successfully.",
    data: result,
  });
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