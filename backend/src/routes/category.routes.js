const express = require("express");

const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware");

const categoryController = require("../controllers/category.controller");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin and manager routes
router.post(
  "/",
  protect,
  restrictTo("admin", "manager"),
  categoryController.createCategory
);

router.patch(
  "/:id",
  protect,
  restrictTo("admin", "manager"),
  categoryController.updateCategory
);

router.patch(
  "/:id/deactivate",
  protect,
  restrictTo("admin", "manager"),
  categoryController.deactivateCategory
);

router.patch(
  "/:id/activate",
  protect,
  restrictTo("admin", "manager"),
  categoryController.activateCategory
);

module.exports = router;