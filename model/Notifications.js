import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Notifications = sequelize.define("Notifications", {
  notificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  taskId: {
    type: DataTypes.INTEGER,
  },
  workspaceId: {
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  freezeTableName: true,
  timestamps: true
});

export default Notifications;