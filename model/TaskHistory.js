import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const TaskHistory = sequelize.define(
  "TaskHistory",
  {
    historyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    changeType: {
      type: DataTypes.STRING,
    },
    changedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default TaskHistory;
