const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbCon");

module.exports = (sequelize) => {
  const ProductImage = sequelize.define(
    "ProductImage",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      imageUrl: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },

      publicId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "product_images",
      timestamps: true,
      indexes: [
        {
          fields: ["productId"],
        },
      ],
    },
  );

  return ProductImage;
};
