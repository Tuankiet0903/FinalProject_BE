import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";


const List = sequelize.define("List", {
  listId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  folderId:{
    type: DataTypes.INTEGER,
    allowNull: false
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
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: true
});

export default List;