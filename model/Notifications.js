import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Notifications = sequelize.define("Notifications", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('WELCOME_MESSAGE', 'NEW_TASK', 'TASK_UPDATE', 'TASK_DEADLINE'),
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default Notifications;