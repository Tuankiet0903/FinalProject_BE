import Folder from "../model/Folder.js";
import Space from "../model/Space.js";
import logger from "../utils/logger.js";

class FolderService {
    static async createFolder(data) {
        const { name, description, spaceId, createdBy } = data;
        
        try {
            // Verify space exists
            const space = await Space.findByPk(spaceId);
            if (!space) {
                throw new Error("Space not found");
            }

            const folder = await Folder.create({
                name,
                description,
                spaceId,
                createdBy,
                createdAt: new Date()
            });
            
            logger.info(`Folder created successfully with ID: ${folder.folderId}`);
            return folder;
        } catch (error) {
            logger.error(`Error creating folder: ${error.message}`);
            throw error;
        }
    }

    static async getAllFolders() {
        try {
            const folders = await Folder.findAll({
                order: [['createdAt', 'DESC']]
            });
            
            logger.info("Fetched all folders successfully");
            return folders;
        } catch (error) {
            logger.error(`Error fetching folders: ${error.message}`);
            throw new Error("Failed to fetch folders");
        }
    }

    static async getFolderById(id) {
        try {
            const folder = await Folder.findByPk(id);
            
            if (!folder) {
                logger.warn(`Folder not found with ID: ${id}`);
                return null;
            }
            
            logger.info(`Fetched folder with ID: ${id}`);
            return folder;
        } catch (error) {
            logger.error(`Error fetching folder: ${error.message}`);
            throw new Error("Failed to fetch folder");
        }
    }

    static async updateFolder(id, data) {
        try {
            const folder = await Folder.findByPk(id);
            
            if (!folder) {
                logger.warn(`Folder not found for update with ID: ${id}`);
                throw new Error("Folder not found");
            }

            const updatedData = {
                ...data,
                updatedAt: new Date()
            };

            await folder.update(updatedData);
            logger.info(`Folder updated successfully with ID: ${id}`);
            return folder;
        } catch (error) {
            logger.error(`Error updating folder: ${error.message}`);
            throw error;
        }
    }

    static async deleteFolder(id) {
        try {
            const folder = await Folder.findByPk(id);
            
            if (!folder) {
                logger.warn(`Folder not found for deletion with ID: ${id}`);
                throw new Error("Folder not found");
            }

            await folder.destroy();
            logger.info(`Folder deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting folder: ${error.message}`);
            throw new Error("Failed to delete folder");
        }
    }

    static async getFoldersBySpace(spaceId) {
        try {
            if (!spaceId) {
                throw new Error("Missing spaceId"); // 🔥 Nếu không có spaceId, báo lỗi
            }
    
            const parsedSpaceId = Number(spaceId);
            if (isNaN(parsedSpaceId)) {
                throw new Error("Invalid spaceId"); // 🔥 Nếu spaceId không phải số, báo lỗi
            }
    
            console.log(`Fetching folders for spaceId: ${parsedSpaceId}`);
    
            const folders = await Folder.findAll({
                where: { spaceId: parsedSpaceId }, // 🔥 Ép kiểu spaceId để đảm bảo Sequelize hiểu
                order: [['createdAt', 'DESC']]
            });
    
            return folders;
        } catch (error) {
            console.error(`Error fetching space folders: ${error.message}`);
            throw new Error("Failed to fetch space folders");
        }
    }
    

    static async getFoldersByUser(userId) {
        try {
            const folders = await Folder.findAll({
                where: { createdBy: userId },
                order: [['createdAt', 'DESC']]
            });
            
            logger.info(`Fetched folders for user ID: ${userId}`);
            return folders;
        } catch (error) {
            logger.error(`Error fetching user folders: ${error.message}`);
            throw new Error("Failed to fetch user folders");
        }
    }
}

export default FolderService;