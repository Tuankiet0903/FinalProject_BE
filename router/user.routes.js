import express from "express";
import {
   createUser,
   getAllUsers,
   getUserById,
   updateUser,
   deleteUser,
   getUserProfile
} from "../controller/UserController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.post("/users", Auth, createUser); // Create user
router.get("/users", Auth, getAllUsers); // Get all users
router.get("/users/:id", Auth, getUserById); // Get user by ID
router.put("/users/:id", Auth, updateUser); // Update user by ID
router.delete("/users/:id", Auth, deleteUser); // Delete user by ID
router.get("/profile", Auth, getUserProfile);
export default router;
