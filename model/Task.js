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
    type: DataTypes.ENUM("todo", "inProgress", "done"),
    allowNull: false,
    defaultValue: "todo"
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    allowNull: false,
    defaultValue: "medium"
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM("bug", "feature", "task"),
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
  timeProcess: {
    type: DataTypes.TIME,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default Task;
