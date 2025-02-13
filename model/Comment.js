import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Comment = sequelize.define("Comment", {
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
},{
  freezeTableName: true,
  timestamps: false
});

export default Comment;