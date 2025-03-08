import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Attachment = sequelize.define("Attachment", {
  attachmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileURL: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},{
  freezeTableName: true,
  timestamps: false
});

export default Attachment;