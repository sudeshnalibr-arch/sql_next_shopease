
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const supportController = require("../controllers/support.controller");

router.use(protect);

router.patch(
  "/:conversationId/assign",
  supportController.assignAgent
);

module.exports = router;
