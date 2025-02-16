import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

// Tạo kết nối tới cơ sở dữ liệu PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME, // Tên cơ sở dữ liệu
  process.env.DB_USERNAME, // Tên đăng nhập
  process.env.DB_PASSWORD, // Mật khẩu
  {
    host: process.env.DB_HOST, // Host của cơ sở dữ liệu
    dialect: process.env.DB_DIALECT || "postgres", // Loại cơ sở dữ liệu (mặc định: PostgreSQL)
    pool: {
      max: 5, // Số kết nối tối đa trong pool
      min: 0, // Số kết nối tối thiểu trong pool
      idle: 10000, // Thời gian tối đa một kết nối có thể nhàn rỗi (ms)
    },
    logging: false, // Tắt log SQL trong môi trường sản xuất
  }
);

// const sequelize = new Sequelize(process.env.DB_CONNECT_URL, {
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // Bỏ qua kiểm tra chứng chỉ
//       },
//     },
//   });

// Kết nối tới cơ sở dữ liệu
const connectDB = async () => {
  try {
    // Authenticate the connection to the database
    await sequelize.authenticate();
    console.log("Connected to the PostgreSQL database successfully.");

    // Sync the database schema
    await sequelize.sync({ alter: true }); // Use `alter: true` to update schema without dropping tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error("Error connecting to or syncing the database:", error.message);
    process.exit(1); // Stop the application if there's an error
  }
};
// Xuất `sequelize` để sử dụng trong model
export { sequelize, connectDB };
  