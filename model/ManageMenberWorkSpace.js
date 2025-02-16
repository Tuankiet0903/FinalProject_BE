    import { DataTypes } from "sequelize";
    import { sequelize } from "../database/connect.js";

    const ManageMemberWorkSpace = sequelize.define("ManageMemberWorkSpace", {
      idManageMember: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      roleWorkSpace: {
        type: DataTypes.ENUM("owner", "admin", "member"),
        allowNull: false
      },
      userId: { 
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },{
      freezeTableName: true,
      timestamps: false
    });

    export default ManageMemberWorkSpace;