const { Notification } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/notifications
// Get logged-in user's notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const offset = (page - 1) * limit;

  const { count, rows } = await Notification.findAndCountAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  });
});

// GET /api/notifications/unread-count
// Get unread notification count
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const count = await Notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      unreadCount: count,
    },
  });
});

// PATCH /api/notifications/:id/read
// Mark one notification as read
const markAsRead = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const notificationId = Number(req.params.id);

  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    return next(new AppError("Invalid notification ID.", 400));
  }

  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    return next(new AppError("Notification not found.", 404));
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read.",
    data: notification,
  });
});

// PATCH /api/notifications/read-all
// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [updatedCount] = await Notification.update(
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      where: {
        userId,
        isRead: false,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read.",
    data: {
      updatedCount,
    },
  });
});

// DELETE /api/notifications/:id
// Delete one notification
const deleteNotification = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const notificationId = Number(req.params.id);

  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    return next(new AppError("Invalid notification ID.", 400));
  }

  const deletedCount = await Notification.destroy({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!deletedCount) {
    return next(new AppError("Notification not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully.",
  });
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};