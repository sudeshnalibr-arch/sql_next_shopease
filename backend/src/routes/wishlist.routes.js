
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const wishlistController = require("../controllers/wishlist.controller");

// All wishlist routes require authentication

// Add product to wishlist
router.post(
  "/:productId",
  protect,
  wishlistController.addToWishlist
);

// Get logged-in customer's wishlist
router.get(
  "/",
  protect,
  wishlistController.getWishlist
);

// Remove product from wishlist
router.delete(
  "/:productId",
  protect,
  wishlistController.removeFromWishlist
);

module.exports = router;
