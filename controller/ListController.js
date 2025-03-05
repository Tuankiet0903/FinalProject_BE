import ListService from "../services/ListService.js";
import logger from "../utils/logger.js";

export const createList = async (req, res) => {
    try {
        const list = await ListService.createList({
            ...req.body,
            createdBy: req.user?.userId || req.body.createdBy // Fallback for now
        });
        return res.status(201).json({ 
            message: "List created successfully", 
            list 
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message.includes("Invalid color tag") ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getAllLists = async (req, res) => {
    try {
        const lists = await ListService.getAllLists();
        return res.status(200).json(lists);
    } catch (error) {
        logger.error("Failed to fetch lists.");
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getListById = async (req, res) => {
    try {
        const list = await ListService.getListById(req.params.id);
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        return res.status(200).json(list);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateList = async (req, res) => {
    try {
        const list = await ListService.updateList(req.params.id, req.body);
        return res.status(200).json({ 
            message: "List updated successfully", 
            list 
        });
    } catch (error) {
        logger.error(error.message);
        let status = 500;
        if (error.message === "List not found") status = 404;
        if (error.message.includes("Invalid color tag")) status = 400;
        return res.status(status).json({ error: error.message });
    }
};

export const deleteList = async (req, res) => {
    try {
        await ListService.deleteList(req.params.id);
        return res.status(200).json({ 
            message: "List deleted successfully" 
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "List not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getListsByUser = async (req, res) => {
    try {
        const lists = await ListService.getListsByUser(req.params.userId);
        return res.status(200).json(lists);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch user lists" });
    }
};

export const getListsByColor = async (req, res) => {
    try {
        const lists = await ListService.getListsByColor(req.params.colorTag);
        return res.status(200).json(lists);
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Invalid color tag" ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
};

