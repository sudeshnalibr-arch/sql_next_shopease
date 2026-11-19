
const wishlistService = require("../services/wishlist.service");
const asyncHandler = require("../middleware/asyncHandler");

// ========================================
// ADD TO WISHLIST
// ========================================

const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await wishlistService.addToWishlist(
    userId,
    productId
  );

  res.status(201).json({
    success: true,
    message: "Product added to wishlist successfully.",
    data: result,
  });
});


// ========================================
// GET WISHLIST
// ========================================

const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await wishlistService.getWishlist(userId);

  res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully.",
    data: result,
  });
});


// ========================================
// REMOVE FROM WISHLIST
// ========================================

const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await wishlistService.removeFromWishlist(
    userId,
    productId
  );

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully.",
    data: result,
  });
});


module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
