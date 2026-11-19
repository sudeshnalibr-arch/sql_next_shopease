
const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/unread-count", messageController.getUnreadCount);

router.get(
  "/:conversationId",
  messageController.getMessages
);

router.post(
  "/:conversationId",
  messageController.sendMessage
);

router.patch(
  "/:conversationId/read",
  messageController.markAsRead
);

module.exports = router;
