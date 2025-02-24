import express from "express";
import {
   createUser,
   getAllUsers,
   getUserById,
   updateUser,
   deleteUser,
   getProfile, 
} from "../controller/UserController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// 🔥 Route lấy thông tin user từ token
router.get("/profile", Auth, getProfile);

// CRUD Users
router.post("/users", Auth, createUser);
router.get("/users", Auth, getAllUsers);
router.get("/users/:id", Auth, getUserById);
router.put("/users/:id", Auth, updateUser);
router.delete("/users/:id", Auth, deleteUser);

export default router;
