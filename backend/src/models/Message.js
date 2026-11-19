
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      conversationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      senderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 5000],
        },
      },

      messageType: {
        type: DataTypes.ENUM("text", "system"),
        allowNull: false,
        defaultValue: "text",
      },

      editedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "messages",
      timestamps: true,
      indexes: [
        { fields: ["conversationId", "createdAt"] },
        { fields: ["senderId"] },
      ],
    }
  );
};
