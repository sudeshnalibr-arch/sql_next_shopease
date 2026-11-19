const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
          isInt: true,
        },
      },

      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },

      isVerifiedPurchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "reviews",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "productId"],
        },
        {
          fields: ["productId"],
        },
        {
          fields: ["orderId"],
        },
      ],
    },
  );

  return Review;
};
