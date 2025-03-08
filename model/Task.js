import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Task = sequelize.define("Task", {
  taskId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  parentTaskId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Easy"
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assigneeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  taskColumnId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue : DataTypes.NOW
  },
  cpmpletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default Task;
