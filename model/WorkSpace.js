import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Workspace = sequelize.define("Workspace", {
  workspaceId: {
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
  type: {
    type: DataTypes.ENUM("personal", "team", "organization"),
    allowNull: false
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: true
});

export default Workspace;
