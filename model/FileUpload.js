import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const FileUpload = sequelize.define("FileUpload", {
    uploadFileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    workspaceMessageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fileURL: {
        type: DataTypes.TEXT,
        allowNull: false
      },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default FileUpload;
