import SpaceService from "../services/SpaceService.js";
import FolderService from "../services/FolderService.js";
import ListService from "../services/ListService.js";
import logger from "../utils/logger.js";

export const createSpace = async (req, res) => {

    const { createdBy } = req.body;

    try {
        console.log("🔍 Debug: Data received from frontend:", req.body);


        const space = await SpaceService.createSpace({
            ...req.body,
            // createdBy: req.user.userId 
        });

        const folder = await FolderService.createFolder({
            name: 'Folder',
            description: 'This is a default folder',
            spaceId: space.spaceId,
            createdBy: createdBy
        });

        const list = await ListService.createList({
            name: 'List',
            description: 'This is a default list',
            tag: 'blue',
            folderId: folder.folderId,
            createdBy
        });

        return res.status(201).json({
            message: "Space created successfully",
            space,
            folder,
            list
        });

    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const getAllSpaces = async (req, res) => {
    try {
        const spaces = await SpaceService.getAllSpaces();
        return res.status(200).json(spaces);
    } catch (error) {
        logger.error("Failed to fetch spaces.");
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSpaceById = async (req, res) => {
    try {
        const space = await SpaceService.getSpaceById(req.params.id);
        if (!space) {
            return res.status(404).json({ error: "Space not found" });
        }
        return res.status(200).json(space);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateSpace = async (req, res) => {
    try {
        const space = await SpaceService.updateSpace(req.params.id, req.body);
        return res.status(200).json({
            message: "Space updated successfully",
            space
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Space not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const deleteSpace = async (req, res) => {
    try {
        await SpaceService.deleteSpace(req.params.id);
        return res.status(200).json({
            message: "Space deleted successfully"
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Space not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getUserSpaces = async (req, res) => {
    try {
        const spaces = await SpaceService.getSpacesByUser(req.user.userId);
        return res.status(200).json(spaces);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch user spaces" });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const space = await SpaceService.toggleFavorite(req.params.id);
        return res.status(200).json({
            message: "Space favorite status updated successfully",
            space
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Space not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};