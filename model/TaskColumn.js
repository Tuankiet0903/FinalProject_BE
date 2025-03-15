import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";
import List from "./List.js"; // Import model List

const TaskColumn = sequelize.define("TaskColumn", {
  columnId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  listId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true // Cho phép giá trị null
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default TaskColumn;