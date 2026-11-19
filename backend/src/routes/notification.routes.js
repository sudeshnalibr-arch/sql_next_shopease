const express = require("express");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Get logged-in user's notifications
router.get("/", getMyNotifications);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Mark one notification as read
router.patch("/:id/read", markAsRead);

// Delete one notification
router.delete("/:id", deleteNotification);

module.exports = router;