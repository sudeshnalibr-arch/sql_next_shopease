
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const productController = require("../controllers/product.controller");

const uploadProductImage = (req, res, next) => {
  if (req.method === "POST" || req.method === "PATCH") {
    return upload.single("image")(req, res, next);
  }

  next();
};

router.all(
  "/manage",
  protect,
  uploadProductImage,
  productController.manageProduct
);

module.exports = router;
