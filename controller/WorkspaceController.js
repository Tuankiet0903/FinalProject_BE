import WorkspaceService from "../services/WorkspaceService.js";
import SpaceService from '../services/SpaceService.js';
import FolderService from '../services/FolderService.js';
import ListService from '../services/ListService.js';
import logger from "../utils/logger.js";

export const createWorkspace = async ({ name, description, type = 'personal' }) => {
    try {
        const response = await axios.post(`${API_ROOT}/workspace/create-with-defaults`, {
            name,
            description,
            type: type || 'personal', // Đảm bảo luôn có giá trị mặc định
            createdBy: getUserId(),
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('Workspace creation request:', {
            name,
            description,
            type,
            createdBy: getUserId()
        });

        return response.data;
    } catch (error) {
        console.error("Error creating workspace:", {
            message: error.message,
            data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceService.getAllWorkspaces();
        return res.status(200).json(workspaces);
    } catch (error) {
        logger.error("Failed to fetch workspaces.");
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await WorkspaceService.getWorkspaceById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" });
        }
        return res.status(200).json(workspace);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateWorkspace = async (req, res) => {
    try {
        const workspace = await WorkspaceService.updateWorkspace(req.params.id, req.body);
        return res.status(200).json({
            message: "Workspace updated successfully",
            workspace
        });
    } catch (error) {
        logger.error(error.message);
        let status = 500;
        if (error.message === "Workspace not found") status = 404;
        if (error.message === "Invalid workspace type") status = 400;
        return res.status(status).json({ error: error.message });
    }
};

export const deleteWorkspace = async (req, res) => {
    try {
        await WorkspaceService.deleteWorkspace(req.params.id);
        return res.status(200).json({
            message: "Workspace deleted successfully"
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Workspace not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getUserWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceService.getWorkspacesByUser(req.params.userId);
        return res.status(200).json(workspaces);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch user workspaces" });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const workspace = await WorkspaceService.toggleFavorite(req.params.id);
        return res.status(200).json({
            message: "Workspace favorite status updated successfully",
            workspace
        });
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Workspace not found" ? 404 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const getWorkspacesByType = async (req, res) => {
    try {
        const workspaces = await WorkspaceService.getWorkspacesByType(req.params.type);
        return res.status(200).json(workspaces);
    } catch (error) {
        logger.error(error.message);
        const status = error.message === "Invalid workspace type" ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const createWorkspaceWithDefaults = async (req, res) => {
    const { createdBy } = req.body;

    try {
        // Tạo Workspace mới
        const workspace = await WorkspaceService.createWorkspace({ ...req.body });

        // Tạo Space mới liên quan đến Workspace
        const space = await SpaceService.createSpace({
            name: 'Default Space',
            description: 'This is a default space',
            createdBy,
            workspaceId: workspace.workspaceId
        });

        // Tạo Folder mới liên quan đến Space
        const folder = await FolderService.createFolder({
            name: 'Default Folder',
            description: 'This is a default folder',
            spaceId: space.spaceId,
            createdBy: createdBy,
        });

        // Tạo List mới liên quan đến Folder
        const list = await ListService.createList({
            name: 'Default List',
            description: 'This is a default list',
            tag: 'blue',
            folderId: folder.folderId,
            createdBy
        });

        res.status(201).json({
            message: 'Workspace, Space, Folder, and List created successfully',
            workspace,
            space,
            folder,
            list
        });
    } catch (error) {
        console.error("Error creating workspace with defaults:", error);
        res.status(500).json({ message: 'Failed to create workspace with defaults' });
    }
};