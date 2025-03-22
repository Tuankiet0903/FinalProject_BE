import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const WorkspaceMessage = sequelize.define("WorkspaceMessage", {
    workspaceMessageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type:{
        type: DataTypes.ENUM("text", "image","file"),
        allowNull: false,
        defaultValue: "text",
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default WorkspaceMessage;
