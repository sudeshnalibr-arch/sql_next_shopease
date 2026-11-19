const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login)
);

router.post(
  "/refresh",
  asyncHandler(authController.refresh)
);

router.post(
  "/logout",
  asyncHandler(authController.logout)
);

module.exports = router;