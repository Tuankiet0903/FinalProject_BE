import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Space = sequelize.define("Space", {
  spaceId: {
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
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  workspaceId: {  // 🔹 Thêm trường này vào
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
},{
  freezeTableName: true,
  timestamps: false
});

export default Space;