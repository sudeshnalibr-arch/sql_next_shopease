const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Task title is required.",
          },
          len: {
            args: [3, 150],
            msg: "Task title must be between 3 and 150 characters.",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      assignedBy: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      assignedTo: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "in-progress",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "tasks",
      timestamps: true,

      indexes: [
        {
          fields: ["assignedTo", "status"],
        },
        {
          fields: ["assignedBy"],
        },
        {
          fields: ["dueDate"],
        },
      ],

      validate: {
        completionTimestampConsistency() {
          if (this.status === "completed" && !this.completedAt) {
            throw new Error(
              "completedAt is required when the task is completed."
            );
          }

          if (this.status !== "completed" && this.completedAt) {
            throw new Error(
              "completedAt must be null unless the task is completed."
            );
          }
        },
      },
    }
  );

  return Task;
};