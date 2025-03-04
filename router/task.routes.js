import express from "express";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByColumn,
} from "../controller/TaskController.js";

const router = express.Router();

// Sửa các routes để khớp với prefix trong server.js
router.post("/", createTask);           // Thay vì /tasks
router.get("/", getAllTasks);           // Thay vì /tasks
router.get("/:id", getTaskById);        // Thay vì /tasks/:id
router.put("/:id", updateTask);         // Thay vì /tasks/:id
router.delete("/:id", deleteTask);      // Thay vì /tasks/:id
router.get("/column/:taskColumnId", getTasksByColumn);

export default router;