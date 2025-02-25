import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const PremiumPlans = sequelize.define(
  "PremiumPlans",
  {
    planId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    planName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    // số ngày đăng kí
    duration : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  { 
    freezeTableName: true,
    timestamps: true,
  }
);

export default PremiumPlans;
