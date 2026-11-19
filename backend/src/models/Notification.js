const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
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

      type: {
        type: DataTypes.ENUM(
          "NEW_PRODUCT",
          "ORDER_UPDATE",
          "PROMOTION",
          "GENERAL"
        ),
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      indexes: [
        { fields: ["userId", "isRead"] },
        { fields: ["createdAt"] },
      ],
    }
  );

  return Notification;
};