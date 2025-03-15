import express from "express";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByColumn,
    getTasksBySpace,
    getTasksByWorkspace,
} from "../controller/TaskController.js";

const router = express.Router();

// Sửa các routes để khớp với prefix trong server.js
router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/column/:taskColumnId", getTasksByColumn);
router.get("/space/:spaceId", getTasksBySpace);
router.get("/workspace/:workspaceId", getTasksByWorkspace);

export default router;