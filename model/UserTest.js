import { DataTypes } from "sequelize";
import { sequelize, syncDatabase } from "../database/connect.js";
 // Đường dẫn tới file `db.js`

// Định nghĩa model User
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
});

syncDatabase()


export default User;
