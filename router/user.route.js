import express from "express";
import {
   createUser,
   getAllUsers,
   getUserById,
   updateUser,
   deleteUser,
} from "../controller/UserController.js";

const router = express.Router();

router.post("/users", createUser); // Create user
router.get("/users", getAllUsers); // Get all users
router.get("/users/:id", getUserById); // Get user by ID
router.put("/users/:id", updateUser); // Update user by ID
router.delete("/users/:id", deleteUser); // Delete user by ID

export default router;
