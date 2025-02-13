// services/WorkspaceService.js
import Workspace from "../model/Workspace.js";
import Space from "../model/Space.js";
import Folder from "../model/Folder.js";
import List from "../model/List.js";
import logger from "../utils/logger.js";

class WorkspaceService {
    static async createWorkspace(data) {
        const { name, description, type, createBy, favorite = false } = data;
        
        try {
            // Validate workspace type
            if (!["personal", "team", "organization"].includes(type)) {
                throw new Error("Invalid workspace type");
            }

            const workspace = await Workspace.create({
                name,
                description,
                type,
                createBy,
                favorite,
                createdAt: new Date()
            });
            
            logger.info(`Workspace created successfully with ID: ${workspace.workspaceId}`);
            return workspace;
        } catch (error) {
            // logger.error(`Error creating workspace: ${error.message}`);
            console.error("Validation error detail:", error);
            throw error;
        }
    }

    static async getAllWorkspaces() {
        try {
            const workspaces = await Workspace.findAll({
                order: [['createdAt', 'DESC']]
            });
            
            logger.info("Fetched all workspaces successfully");
            return workspaces;
        } catch (error) {
            logger.error(`Error fetching workspaces: ${error.message}`);
            console.error("Error fetching workspaces log:", error);
            throw new Error("Failed to fetch workspaces");
        }
    }

    static async getWorkspaceById(id) {
        try {
            const workspace = await Workspace.findByPk(id, {
                include: [
                    {
                        model: Space,
                        as: "spaces",
                        include: [
                            {
                                model: Folder,
                                as: 'folders',
                                include: [
                                    {
                                        model: List,
                                        as: 'lists'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            
            if (!workspace) {
                logger.warn(`Workspace not found with ID: ${id}`);
                return null;
            }
            
            logger.info(`Fetched workspace with ID: ${id}`);
            return workspace;
        } catch (error) {
            logger.error(`Error fetching workspace: ${error.message}`);
            throw new Error("Failed to fetch workspace");
        }
    }

    static async updateWorkspace(id, data) {
        try {
            const workspace = await Workspace.findByPk(id);
            
            if (!workspace) {
                logger.warn(`Workspace not found for update with ID: ${id}`);
                throw new Error("Workspace not found");
            }

            // Validate workspace type if it's being updated
            if (data.type && !["personal", "team", "organization"].includes(data.type)) {
                throw new Error("Invalid workspace type");
            }

            const updatedData = {
                ...data,
                updatedAt: new Date()
            };

            await workspace.update(updatedData);
            logger.info(`Workspace updated successfully with ID: ${id}`);
            return workspace;
        } catch (error) {
            logger.error(`Error updating workspace: ${error.message}`);
            throw error;
        }
    }

    static async deleteWorkspace(id) {
        try {
            const workspace = await Workspace.findByPk(id);
            
            if (!workspace) {
                logger.warn(`Workspace not found for deletion with ID: ${id}`);
                throw new Error("Workspace not found");
            }

            await workspace.destroy();
            logger.info(`Workspace deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting workspace: ${error.message}`);
            throw new Error("Failed to delete workspace");
        }
    }

    static async getWorkspacesByUser(userId) {
        try {
            const workspaces = await Workspace.findAll({
                where: { createBy: userId },
                order: [['createdAt', 'DESC']]
            });
            
            logger.info(`Fetched workspaces for user ID: ${userId}`);
            return workspaces;
        } catch (error) {
            logger.error(`Error fetching user workspaces: ${error.message}`);
            throw new Error("Failed to fetch user workspaces");
        }
    }

    static async toggleFavorite(id) {
        try {
            const workspace = await Workspace.findByPk(id);
            
            if (!workspace) {
                logger.warn(`Workspace not found with ID: ${id}`);
                throw new Error("Workspace not found");
            }

            await workspace.update({
                favorite: !workspace.favorite,
                updatedAt: new Date()
            });

            logger.info(`Toggled favorite status for workspace ID: ${id}`);
            return workspace;
        } catch (error) {
            logger.error(`Error toggling favorite status: ${error.message}`);
            throw new Error("Failed to toggle favorite status");
        }
    }

    static async getWorkspacesByType(type) {
        try {
            if (!["personal", "team", "organization"].includes(type)) {
                throw new Error("Invalid workspace type");
            }

            const workspaces = await Workspace.findAll({
                where: { type },
                order: [['createdAt', 'DESC']]
            });
            
            logger.info(`Fetched workspaces of type: ${type}`);
            return workspaces;
        } catch (error) {
            logger.error(`Error fetching workspaces by type: ${error.message}`);
            throw error;
        }
    }
}

export default WorkspaceService;