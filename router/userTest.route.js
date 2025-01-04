import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByPassword,
  updateUser,
} from "../controller/UserTestController.js";

const route = express.Router();

// Routes
route.post("/users", createUser); // Tạo người dùng
route.get("/users", getAllUsers); // Lấy tất cả người dùng
route.get("/users/:password", getUserByPassword); // Lấy người dùng theo password
route.put("/users/:password", updateUser); // Cập nhật thông tin người dùng
route.delete("/users/:password", deleteUser); // Xóa người dùng theo password

export default route;
