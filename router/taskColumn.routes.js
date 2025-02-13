import express from "express";
import {
    createTaskColumn,
    getAllTaskColumns,
    getTaskColumnById,
    updateTaskColumn,
    deleteTaskColumn,
    getTaskColumnsByList,
    updateColumnOrder
} from "../controller/TaskColumnController.js";
// import Auth from "../middleware/auth.js";

const router = express.Router();

// Commented out authenticated routes for future use
// router.post("/task-columns", Auth, createTaskColumn);
// router.get("/task-columns", Auth, getAllTaskColumns);
// router.get("/task-columns/:id", Auth, getTaskColumnById);
// router.put("/task-columns/:id", Auth, updateTaskColumn);
// router.delete("/task-columns/:id", Auth, deleteTaskColumn);
// router.get("/task-columns/list/:listId", Auth, getTaskColumnsByList);
// router.patch("/task-columns/list/:listId/order", Auth, updateColumnOrder);

// Current routes without authentication
router.post("/task-columns", createTaskColumn);
router.get("/task-columns", getAllTaskColumns);
router.get("/task-columns/:id", getTaskColumnById);
router.put("/task-columns/:id", updateTaskColumn);
router.delete("/task-columns/:id", deleteTaskColumn);
router.get("/task-columns/list/:listId", getTaskColumnsByList);
router.patch("/task-columns/list/:listId/order", updateColumnOrder);

export default router;