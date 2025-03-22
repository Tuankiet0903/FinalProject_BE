import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Reaction = sequelize.define("Reaction", {
    reactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    workspaceMessageId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("like", "love", "hava", "wow", "sad", "angry"),
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

export default Reaction;
