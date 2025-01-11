import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const ManageMemberSpace = sequelize.define("ManageMemberSpace", {
  idManageMember: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  roleSpace: {
    type: DataTypes.ENUM("owner", "admin", "member"),
    allowNull: false
  },
  spaceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
  freezeTableName: true,
  timestamps: false
});

export default ManageMemberSpace;
