import FolderService from "../services/FolderService.js";
import ListService from "../services/ListService.js";
import logger from "../utils/logger.js";

export const createFolder = async (req, res) => {

    const { createdBy } = req.body;

    try {
        const folder = await FolderService.createFolder({
            ...req.body,
            createdBy
        });

        const list = await ListService.createList({
            name: 'List',
            description: 'This is a default list',
            tag: 'blue',
            folderId: folder.folderId,
            createdBy
        });

        return res.status(201).json({ 
            message: "Folder created successfully", 
            folder,
            list
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Space not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getAllFolders = async (req, res) => {
    try {
        const folders = await FolderService.getAllFolders();
        return res.status(200).json(folders);
    } catch (error) {
        logger.error("Failed to fetch folders.");
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFolderById = async (req, res) => {
    try {
        const folder = await FolderService.getFolderById(req.params.id);
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }
        return res.status(200).json(folder);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateFolder = async (req, res) => {
    try {
        const folder = await FolderService.updateFolder(req.params.id, req.body);
        return res.status(200).json({ 
            message: "Folder updated successfully", 
            folder 
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Folder not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const deleteFolder = async (req, res) => {
    try {
        await FolderService.deleteFolder(req.params.id);
        return res.status(200).json({ 
            message: "Folder deleted successfully" 
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Folder not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getFoldersBySpace = async (req, res) => {
    try {
        const folders = await FolderService.getFoldersBySpace(req.params.spaceId);
        return res.status(200).json(folders);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch space folders" });
    }
};

export const getFoldersByUser = async (req, res) => {
    try {
        const folders = await FolderService.getFoldersByUser(req.params.userId);
        return res.status(200).json(folders);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch user folders" });
    }
};