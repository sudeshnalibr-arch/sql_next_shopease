
const cloudinary = require("../config/cloudinary");

const deleteFileCloudinary = async (publicId) => {
  if (!publicId) {
    return null;
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (!["ok", "not found"].includes(result.result)) {
    throw new Error("Failed to delete the old Cloudinary image.");
  }

  return result;
};

module.exports = deleteFileCloudinary;
