
const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversation.controller");

// Change this import to the exact path of your existing protect middleware.
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.post("/", conversationController.createConversation);
router.get("/", conversationController.getMyConversations);
router.get("/:id", conversationController.getConversation);

module.exports = router;
