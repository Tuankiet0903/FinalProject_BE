import List from "../model/List.js";
import logger from "../utils/logger.js";

class ListService {
    static async createList(data) {
        const { name, description, colorTag, folderId, createdBy } = data;
        
        try {
            // Validate color tag if provided
            if (colorTag && !["red", "blue", "green"].includes(colorTag)) {
                throw new Error("Invalid color tag. Must be red, blue, or green");
            }

            const list = await List.create({
                name,
                description,
                colorTag,
                folderId,
                createdBy,
                createdAt: new Date()
            });
            
            logger.info(`List created successfully with ID: ${list.listId}`);
            return list;
        } catch (error) {
            logger.error(`Error creating list: ${error.message}`);
            throw error;
        }
    }

    static async getAllLists() {
        try {
            const lists = await List.findAll({
                order: [['createdAt', 'DESC']]
            });
            
            logger.info("Fetched all lists successfully");
            return lists;
        } catch (error) {
            logger.error(`Error fetching lists: ${error.message}`);
            throw new Error("Failed to fetch lists");
        }
    }

    static async getListById(id) {
        try {
            const list = await List.findByPk(id);
            
            if (!list) {
                logger.warn(`List not found with ID: ${id}`);
                return null;
            }
            
            logger.info(`Fetched list with ID: ${id}`);
            return list;
        } catch (error) {
            logger.error(`Error fetching list: ${error.message}`);
            throw new Error("Failed to fetch list");
        }
    }

    static async updateList(id, data) {
        try {
            const list = await List.findByPk(id);
            
            if (!list) {
                logger.warn(`List not found for update with ID: ${id}`);
                throw new Error("List not found");
            }

            // Validate color tag if being updated
            if (data.colorTag && !["red", "blue", "green"].includes(data.colorTag)) {
                throw new Error("Invalid color tag. Must be red, blue, or green");
            }

            const updatedData = {
                ...data,
                updatedAt: new Date()
            };

            await list.update(updatedData);
            logger.info(`List updated successfully with ID: ${id}`);
            return list;
        } catch (error) {
            logger.error(`Error updating list: ${error.message}`);
            throw error;
        }
    }

    static async deleteList(id) {
        try {
            const list = await List.findByPk(id);
            
            if (!list) {
                logger.warn(`List not found for deletion with ID: ${id}`);
                throw new Error("List not found");
            }

            await list.destroy();
            logger.info(`List deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting list: ${error.message}`);
            throw new Error("Failed to delete list");
        }
    }

    static async getListsByUser(userId) {
        try {
            const lists = await List.findAll({
                where: { createdBy: userId },
                order: [['createdAt', 'DESC']]
            });
            
            logger.info(`Fetched lists for user ID: ${userId}`);
            return lists;
        } catch (error) {
            logger.error(`Error fetching user lists: ${error.message}`);
            throw new Error("Failed to fetch user lists");
        }
    }

    static async getListsByColor(colorTag) {
        try {
            if (!["red", "blue", "green"].includes(colorTag)) {
                throw new Error("Invalid color tag");
            }

            const lists = await List.findAll({
                where: { colorTag },
                order: [['createdAt', 'DESC']]
            });
            
            logger.info(`Fetched lists with color tag: ${colorTag}`);
            return lists;
        } catch (error) {
            logger.error(`Error fetching lists by color: ${error.message}`);
            throw error;
        }
    }
}

export default ListService;