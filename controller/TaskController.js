import TaskService from "../services/TaskService.js";
import logger from "../utils/logger.js";

export const createTask = async (req, res) => {
    try {
        const task = await TaskService.createTask(req.body);
        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await TaskService.getAllTasks();
        return res.status(200).json(tasks);
    } catch (error) {
        logger.error("Failed to fetch tasks.");
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await TaskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await TaskService.updateTask(req.params.id, req.body);
        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        logger.error(error.message);
        let status = 500;
        if (error.message === "Task not found") status = 404;
        return res.status(status).json({ error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await TaskService.deleteTask(req.params.id);
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Task not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getTasksByColumn = async (req, res) => {
    try {
        const tasks = await TaskService.getTasksByColumn(req.params.taskColumnId);
        return res.status(200).json(tasks);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch column tasks" });
    }
};
