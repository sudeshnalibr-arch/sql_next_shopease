
const { Wishlist, Product } = require("../models");
const AppError = require("../utils/AppError");
const { UniqueConstraintError } = require("sequelize");

// ========================================
// ADD PRODUCT TO WISHLIST
// ========================================

const addToWishlist = async (userId, productId) => {
  // Check whether product exists
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  // Check whether product is already in wishlist
  const existingWishlist = await Wishlist.findOne({
    where: {
      userId,
      productId,
    },
  });

  if (existingWishlist) {
    throw new AppError("Product is already in your wishlist.", 409);
  }

  try {
    const wishlistItem = await Wishlist.create({
      userId,
      productId,
    });

    return wishlistItem;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError("Product is already in your wishlist.", 409);
    }

    throw error;
  }
};


// ========================================
// GET CUSTOMER WISHLIST
// ========================================

const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findAll({
    where: { userId },

    include: [
      {
        model: Product,
        as: "product",
      },
    ],

    order: [["createdAt", "DESC"]],
  });

  return wishlist;
};


// ========================================
// REMOVE PRODUCT FROM WISHLIST
// ========================================

const removeFromWishlist = async (userId, productId) => {
  const wishlistItem = await Wishlist.findOne({
    where: {
      userId,
      productId,
    },
  });

  if (!wishlistItem) {
    throw new AppError("Product not found in your wishlist.", 404);
  }

  await wishlistItem.destroy();

  return {
    productId,
  };
};


module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
