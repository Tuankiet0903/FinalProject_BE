import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Attachment = sequelize.define("Attachment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  fileURL: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
},{
  freezeTableName: true,
  timestamps: false
});

export default Attachment;