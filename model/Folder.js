import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Folder = sequelize.define(
  "Folder",
  {
    folderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    spaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Folder;
