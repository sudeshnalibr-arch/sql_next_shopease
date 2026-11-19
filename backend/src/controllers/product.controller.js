const AppError = require("../utils/AppError");
const upload = require("../middleware/upload.middleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../services/product.service");

const { Permission, rolePermission } = require("../constants/permission");

const permissionByMethod = {
  GET: Permission.READ_PRODUCT,
  POST: Permission.CREATE_PRODUCT,
  PATCH: Permission.UPDATE_PRODUCT,
  DELETE: Permission.DELETE_PRODUCT,
};

// Run Multer after checking permissions.
const processProductImage = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single("image")(req, res, (error) => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
};

const manageProduct = async (req, res, next) => {
  try {
    const method = req.method;
    const requiredPermission = permissionByMethod[method];

    if (!requiredPermission) {
      throw new AppError("Method not allowed.", 405);
    }

    // Permission check before image upload.
    const hasPermission =
      rolePermission[req.user.role]?.includes(requiredPermission);

    if (!hasPermission) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403,
      );
    }

    if (!hasPermission) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403,
      );
    }

    // Process images only for create and update.
    if (method === "POST" || method === "PATCH") {
      await processProductImage(req, res);
    }

    switch (method) {
      // GET PRODUCTS
      case "GET": {
        const { id } = req.query;

        if (id) {
          const product = await getProductById(id);

          return res.status(200).json({
            success: true,
            message: "Product retrieved successfully.",
            data: product,
          });
        }

        const result = await getProducts(req.query);

        return res.status(200).json({
          success: true,
          message: "Products retrieved successfully.",
          data: result.products,
          pagination: result.pagination,
        });
      }

      // CREATE PRODUCT
      case "POST": {
        const product = await createProduct(req.body, req.file);

        return res.status(201).json({
          success: true,
          message: "Product created successfully.",
          data: product,
        });
      }

      // UPDATE PRODUCT
      case "PATCH": {
        const id = req.query.id || req.body.id;

        if (!id) {
          throw new AppError("Product ID is required.", 400);
        }

        const product = await updateProduct(id, req.body, req.file);

        return res.status(200).json({
          success: true,
          message: "Product updated successfully.",
          data: product,
        });
      }

      // DELETE PRODUCT
      case "DELETE": {
        const id = req.query.id || req.body.id;

        if (!id) {
          throw new AppError("Product ID is required.", 400);
        }

        const permanent = req.query.permanent === "true";

        // Permanent deletion is restricted to admin.
        if (permanent && req.user.role !== "admin") {
          throw new AppError(
            "Only admin can permanently delete products.",
            403,
          );
        }

        const result = await deleteProduct(id, permanent);

        return res.status(200).json({
          success: true,
          message: permanent
            ? "Product permanently deleted."
            : "Product moved to inactive products.",
          data: result,
        });
      }

      default:
        throw new AppError("Method not allowed.", 405);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  manageProduct,
};
