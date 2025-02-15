import TaskColumnService from "../services/TaskColumnService.js";
import logger from "../utils/logger.js";

export const createTaskColumn = async (req, res) => {
    try {
        const taskColumn = await TaskColumnService.createTaskColumn({
            ...req.body,
            createdBy: req.user?.userId || req.body.createdBy // Fallback for now
        });
        return res.status(201).json({ 
            message: "Task column created successfully", 
            taskColumn 
        });
    } catch (error) {
        logger.error(error.message);
        let status = 500;
        if (error.message === "List not found") status = 404;
        if (error.message.includes("Invalid color")) status = 400;
        return res.status(status).json({ error: error.message });
    }
};

export const getAllTaskColumns = async (req, res) => {
    try {
        const taskColumns = await TaskColumnService.getAllTaskColumns();
        return res.status(200).json(taskColumns);
    } catch (error) {
        logger.error("Failed to fetch task columns.");
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTaskColumnById = async (req, res) => {
    try {
        const taskColumn = await TaskColumnService.getTaskColumnById(req.params.id);
        if (!taskColumn) {
            return res.status(404).json({ error: "Task column not found" });
        }
        return res.status(200).json(taskColumn);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateTaskColumn = async (req, res) => {
    try {
        const taskColumn = await TaskColumnService.updateTaskColumn(req.params.id, req.body);
        return res.status(200).json({ 
            message: "Task column updated successfully", 
            taskColumn 
        });
    } catch (error) {
        logger.error(error.message);
        let status = 500;
        if (error.message === "TaskColumn not found") status = 404;
        if (error.message.includes("Invalid color")) status = 400;
        return res.status(status).json({ error: error.message });
    }
};

export const deleteTaskColumn = async (req, res) => {
    try {
        await TaskColumnService.deleteTaskColumn(req.params.id);
        return res.status(200).json({ 
            message: "Task column deleted successfully" 
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "TaskColumn not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getTaskColumnsByList = async (req, res) => {
    try {
        const taskColumns = await TaskColumnService.getTaskColumnsByList(req.params.listId);
        return res.status(200).json(taskColumns);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch list task columns" });
    }
};

export const updateColumnOrder = async (req, res) => {
    try {
        const { listId } = req.params;
        const { columnOrders } = req.body;
        
        if (!Array.isArray(columnOrders)) {
            return res.status(400).json({ error: "Column orders must be an array" });
        }

        const updatedColumns = await TaskColumnService.updateColumnOrder(listId, columnOrders);
        return res.status(200).json({ 
            message: "Column order updated successfully",
            taskColumns: updatedColumns
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};