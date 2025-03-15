import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    githubId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Member"
    }
  },
  {
    freezeTableName: true,
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default User;
