const { Op } = require("sequelize");

const { Product } = require("../models");
const AppError = require("../utils/AppError");

const {
  uploadImage,
  deleteImage,
} = require("./cloudinary.service");

// Fields that can be changed through the product API.
const allowedFields = [
  "name",
  "description",
  "categoryId",
  "price",
  "stock",
  "isActive",
];

const getAllowedData = (data) => {
  const result = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      result[field] = data[field];
    }
  });

  return result;
};

// CREATE PRODUCT
const createProduct = async (data, file) => {
  let uploadedImage = null;

  try {
    const productData = getAllowedData(data);

    // Upload image to Cloudinary if provided.
    if (file) {
      uploadedImage = await uploadImage(file.buffer);

      productData.image = uploadedImage.image;
      productData.imagePublicId = uploadedImage.imagePublicId;
    }

    const product = await Product.create(productData);

    return product;
  } catch (error) {
    // If database creation fails, clean up the newly uploaded image.
    if (uploadedImage?.imagePublicId) {
      try {
        await deleteImage(uploadedImage.imagePublicId);
      } catch (deleteError) {
        console.error(
          "Failed to clean up uploaded Cloudinary image:",
          deleteError
        );
      }
    }

    throw error;
  }
};

// GET PRODUCTS WITH PAGINATION
const getProducts = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  const offset = (page - 1) * limit;

  const where = {};

  if (query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { description: { [Op.like]: `%${query.search}%` } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = Number(query.categoryId);
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive === "true";
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    products: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// GET SINGLE PRODUCT
const getProductById = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  return product;
};

// UPDATE PRODUCT
const updateProduct = async (id, data, file) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const updates = getAllowedData(data);

  // Save old public ID before updating the database.
  const oldImagePublicId = product.imagePublicId;

  let newUploadedImage = null;

  if (file) {
    newUploadedImage = await uploadImage(file.buffer);

    updates.image = newUploadedImage.image;
    updates.imagePublicId = newUploadedImage.imagePublicId;
  }

  try {
    await product.update(updates);
  } catch (error) {
    // If updating MySQL fails, remove the new Cloudinary image.
    if (newUploadedImage?.imagePublicId) {
      try {
        await deleteImage(newUploadedImage.imagePublicId);
      } catch (deleteError) {
        console.error("Failed to clean up new image:", deleteError);
      }
    }

    throw error;
  }

  // Delete old image only after successful database update.
  if (
    newUploadedImage &&
    oldImagePublicId &&
    oldImagePublicId !== newUploadedImage.imagePublicId
  ) {
    try {
      await deleteImage(oldImagePublicId);
    } catch (error) {
      // Do not report the product update as failed.
      console.error("Failed to delete old Cloudinary image:", error);
    }
  }

  return product;
};

// SOFT DELETE OR PERMANENT DELETE
const deleteProduct = async (id, permanent = false) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (!permanent) {
    // Soft delete: keep the database record and Cloudinary image.
    await product.update({
      isActive: false,
    });

    return {
      product,
      permanent: false,
    };
  }

  const oldImagePublicId = product.imagePublicId;

  // Delete the database record first.
  await product.destroy();

  // Delete Cloudinary image after database deletion succeeds.
  if (oldImagePublicId) {
    try {
      await deleteImage(oldImagePublicId);
    } catch (error) {
      console.error(
        "Product deleted from database, but Cloudinary image deletion failed:",
        error
      );
    }
  }

  return {
    product,
    permanent: true,
  };
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};