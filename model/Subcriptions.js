import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const Subscription = sequelize.define(
  "Subscription",
  {
    subscriptionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startDate : {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    endDate : {
        type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Subscription;
