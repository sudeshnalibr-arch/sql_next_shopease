
const express = require("express");
const router = express.Router();

// ============================================
// IMPORT ROUTE FILES
// ============================================

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const analyticsRoutes = require("./analytics.routes");
const emailRoutes = require("./email.routes");
const invoiceRoutes = require("./invoice.routes");
const couponRoutes = require("./coupon.routes");
const reviewRoutes = require("./review.routes");
const wishlistRoutes = require("./wishlist.routes");
const notificationRoutes = require("./notification.routes");
const userRoutes = require("./user.routes");
const dashboardRoutes = require("./dashboard.routes");
const conversationRoutes = require("./conversation.routes");
const messageRoutes = require("./message.routes");
const supportRoutes = require("./support.routes");
const profileRoutes = require("./profile.routes");

// ============================================
// AUTH ROUTES
// Base URL: /api/auth
// ============================================

router.use("/auth", authRoutes);

// ============================================
// USER MANAGEMENT ROUTES
// Admin and Manager
// Base URL: /api/admin/users
// ============================================

router.use("/admin/users", userRoutes);

// ============================================
// PRODUCT ROUTES
// Base URL: /api/products
// ============================================

router.use("/products", productRoutes);

// ============================================
// ORDER ROUTES
// Base URL: /api/orders
// ============================================

router.use("/orders", orderRoutes);

// ============================================
// ANALYTICS ROUTES
// Base URL: /api/analytics
// ============================================

router.use("/analytics", analyticsRoutes);

// ============================================
// EMAIL ROUTES
// Base URL: /api/email
// ============================================

router.use("/email", emailRoutes);

// ============================================
// INVOICE ROUTES
// Base URL: /api/invoices
// ============================================

router.use("/invoices", invoiceRoutes);

// ============================================
// COUPON ROUTES
// Base URL: /api/coupons
// ============================================

router.use("/coupons", couponRoutes);

// ============================================
// REVIEW ROUTES
// Base URL: /api/reviews
// ============================================

router.use("/reviews", reviewRoutes);

// ============================================
// WISHLIST ROUTES
// Base URL: /api/wishlist
// ============================================

router.use("/wishlist", wishlistRoutes);

// ============================================
// NOTIFICATION ROUTES
// Base URL: /api/notifications
// ============================================

router.use("/notifications", notificationRoutes);

//=============================================
// DASHBOARD ROUTES
// Base URL: /api/dashboard
//=============================================
router.use("/dashboard", dashboardRoutes);

//=============================================
router.use("/conversations", conversationRoutes);

//==============================================
router.use("/messages", messageRoutes);

//==============================================
router.use("/support", supportRoutes);

// ============================================
// CUSTOMER PROFILE ROUTES
// Base URL: /api/users
// ============================================

router.use("/users", profileRoutes);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;
