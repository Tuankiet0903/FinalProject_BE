import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const List = sequelize.define("List", {
  listId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  colorTag: {
    type: DataTypes.ENUM("red", "blue", "green"),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default List;