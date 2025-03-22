import Space from "../model/Space.js";
import Workspace from "../model/WorkSpace.js";
import logger from "../utils/logger.js";

class SpaceService {
    static async createSpace(data) {
        const { name, description, workspaceId, createdBy, favorite = false } = data;

        try {

            const workspace = await Workspace.findByPk(workspaceId);
            if (!workspace) {
                throw new Error(`Workspace with ID ${workspaceId} does not exist.`);
            }

            const space = await Space.create({
                name,
                description,
                createdBy,
                workspaceId,
                favorite,
                createdAt: new Date()
            });

            logger.info(`Space created successfully with ID: ${space.spaceId}`);
            return space;
        } catch (error) {
            console.error("Error creating space:", error);
            throw error;
        }
    }

    static async getAllSpaces() {
        try {
            const spaces = await Space.findAll({
                order: [['createdAt', 'DESC']]
            });

            logger.info("Fetched all spaces successfully");
            return spaces;
        } catch (error) {
            logger.error(`Error fetching spaces: ${error.message}`);
            throw new Error("Failed to fetch spaces");
        }
    }

    static async getSpaceById(id) {
        try {
            const space = await Space.findByPk(id);

            if (!space) {
                logger.warn(`Space not found with ID: ${id}`);
                return null;
            }

            logger.info(`Fetched space with ID: ${id}`);
            return space;
        } catch (error) {
            logger.error(`Error fetching space: ${error.message}`);
            throw new Error("Failed to fetch space");
        }
    }

    static async updateSpace(id, data) {
        try {
            const space = await Space.findByPk(id);

            if (!space) {
                logger.warn(`Space not found for update with ID: ${id}`);
                throw new Error("Space not found");
            }

            const updatedData = {
                ...data,
                updatedAt: new Date()
            };

            await space.update(updatedData);
            logger.info(`Space updated successfully with ID: ${id}`);
            return space;
        } catch (error) {
            logger.error(`Error updating space: ${error.message}`);
            throw new Error("Failed to update space");
        }
    }

    static async deleteSpace(id) {
        try {
            const space = await Space.findByPk(id);

            if (!space) {
                logger.warn(`Space not found for deletion with ID: ${id}`);
                throw new Error("Space not found");
            }

            await space.destroy();
            logger.info(`Space deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting space: ${error.message}`);
            throw new Error("Failed to delete space");
        }
    }

    static async getSpacesByUser(userId) {
        try {
            const spaces = await Space.findAll({
                where: { createdBy: userId },
                order: [['createdAt', 'DESC']]
            });

            logger.info(`Fetched spaces for user ID: ${userId}`);
            return spaces;
        } catch (error) {
            logger.error(`Error fetching user spaces: ${error.message}`);
            throw new Error("Failed to fetch user spaces");
        }
    }

    static async toggleFavorite(id) {
        try {
            const space = await Space.findByPk(id);

            if (!space) {
                logger.warn(`Space not found with ID: ${id}`);
                throw new Error("Space not found");
            }

            await space.update({
                favorite: !space.favorite,
                updatedAt: new Date()
            });

            logger.info(`Toggled favorite status for space ID: ${id}`);
            return space;
        } catch (error) {
            logger.error(`Error toggling favorite status: ${error.message}`);
            throw new Error("Failed to toggle favorite status");
        }
    }
    static async getSpacesByWorkspaceId(workspaceId) {
        try {
            // 🔥 Kiểm tra workspaceId hợp lệ
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            // 🔥 Kiểm tra xem Workspace có tồn tại không
            const workspace = await Workspace.findByPk(workspaceId);
            if (!workspace) {
                throw new Error(`Workspace with ID ${workspaceId} does not exist.`);
            }

            // 🔥 Lấy danh sách Spaces từ database theo workspaceId
            const spaces = await Space.findAll({
                where: { workspaceId },
                order: [["createdAt", "DESC"]], // 🔥 Sắp xếp theo thời gian mới nhất
            });

            logger.info(`Fetched spaces for workspace ID: ${workspaceId}`);
            return spaces;
        } catch (error) {
            logger.error(`Error fetching spaces for workspace ${workspaceId}: ${error.message}`);
            throw new Error("Failed to fetch spaces");
        }
    }

    
    
}

export default SpaceService;