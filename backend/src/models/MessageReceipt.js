
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "MessageReceipt",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      messageId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "message_receipts",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["messageId", "userId"],
        },
        { fields: ["userId", "readAt"] },
      ],
    }
  );
};
