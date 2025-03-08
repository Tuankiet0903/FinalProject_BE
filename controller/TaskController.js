import TaskService from "../services/TaskService.js";
import NotificationService from "../services/NotificationService.js";
import logger from "../utils/logger.js";

export const createTask = async (req, res) => {
    try {
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            parentTaskId: req.body.parentTaskId,
            status: req.body.status,
            priority: req.body.priority,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            type: req.body.type,
            assigneeId: req.body.assigneeId,
            createdBy: req.body.createdBy,
            taskColumnId: req.body.taskColumnId
        };

        // Create task
        const task = await TaskService.createTask(taskData);

        // Create notification if task has assignee
        if (task.assigneeId && task.createdBy) {
            await NotificationService.createTaskAssignmentNotification({
                taskId: task.taskId,
                assigneeId: task.assigneeId,
                createdBy: task.createdBy,
                taskTitle: task.title
            });
        }

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        logger.error(`Task creation error: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: error.message
        });
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
