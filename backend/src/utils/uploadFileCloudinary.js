
const cloudinary = require("../config/cloudinary");
const AppError = require("./AppError");

const uploadFileCloudinary = (fileBuffer) => {
  if (!fileBuffer) {
    throw new AppError("Image file is required for upload.", 400);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError("Failed to upload product image.", 502)
          );
        }

        if (!result) {
          return reject(
            new AppError("Cloudinary returned no upload result.", 502)
          );
        }

        resolve({
          image: result.secure_url,
          imagePublicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = uploadFileCloudinary;
