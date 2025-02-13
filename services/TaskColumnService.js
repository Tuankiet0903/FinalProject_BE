import TaskColumn from "../model/TaskColumn.js";
import List from "../model/List.js";
import logger from "../utils/logger.js";

class TaskColumnService {
    static async createTaskColumn(data) {
        const { name, color, listId, createBy } = data;
        
        try {
            // Verify list exists
            const list = await List.findByPk(listId);
            if (!list) {
                throw new Error("List not found");
            }

            // Validate color if provided
            if (color && !["red", "blue", "green"].includes(color)) {
                throw new Error("Invalid color. Must be red, blue, or green");
            }

            // Get max orderIndex for the list
            const maxOrderColumn = await TaskColumn.findOne({
                where: { listId },
                order: [['orderIndex', 'DESC']]
            });
            const orderIndex = maxOrderColumn ? maxOrderColumn.orderIndex + 1 : 0;

            const taskColumn = await TaskColumn.create({
                name,
                color,
                listId,
                createBy,
                orderIndex
            });
            
            logger.info(`TaskColumn created successfully with ID: ${taskColumn.columnId}`);
            return taskColumn;
        } catch (error) {
            logger.error(`Error creating task column: ${error.message}`);
            throw error;
        }
    }

    static async getAllTaskColumns() {
        try {
            const taskColumns = await TaskColumn.findAll({
                order: [['listId', 'ASC'], ['orderIndex', 'ASC']]
            });
            
            logger.info("Fetched all task columns successfully");
            return taskColumns;
        } catch (error) {
            logger.error(`Error fetching task columns: ${error.message}`);
            throw new Error("Failed to fetch task columns");
        }
    }

    static async getTaskColumnById(id) {
        try {
            const taskColumn = await TaskColumn.findByPk(id);
            
            if (!taskColumn) {
                logger.warn(`TaskColumn not found with ID: ${id}`);
                return null;
            }
            
            logger.info(`Fetched task column with ID: ${id}`);
            return taskColumn;
        } catch (error) {
            logger.error(`Error fetching task column: ${error.message}`);
            throw new Error("Failed to fetch task column");
        }
    }

    static async updateTaskColumn(id, data) {
        try {
            const taskColumn = await TaskColumn.findByPk(id);
            
            if (!taskColumn) {
                logger.warn(`TaskColumn not found for update with ID: ${id}`);
                throw new Error("TaskColumn not found");
            }

            // Validate color if being updated
            if (data.color && !["red", "blue", "green"].includes(data.color)) {
                throw new Error("Invalid color. Must be red, blue, or green");
            }

            await taskColumn.update(data);
            logger.info(`TaskColumn updated successfully with ID: ${id}`);
            return taskColumn;
        } catch (error) {
            logger.error(`Error updating task column: ${error.message}`);
            throw error;
        }
    }

    static async deleteTaskColumn(id) {
        try {
            const taskColumn = await TaskColumn.findByPk(id);
            
            if (!taskColumn) {
                logger.warn(`TaskColumn not found for deletion with ID: ${id}`);
                throw new Error("TaskColumn not found");
            }

            await taskColumn.destroy();
            
            // Reorder remaining columns
            await TaskColumn.update(
                { orderIndex: sequelize.literal('orderIndex - 1') },
                { 
                    where: { 
                        listId: taskColumn.listId,
                        orderIndex: { [Op.gt]: taskColumn.orderIndex }
                    }
                }
            );

            logger.info(`TaskColumn deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting task column: ${error.message}`);
            throw new Error("Failed to delete task column");
        }
    }

    static async getTaskColumnsByList(listId) {
        try {
            const taskColumns = await TaskColumn.findAll({
                where: { listId },
                order: [['orderIndex', 'ASC']]
            });
            
            logger.info(`Fetched task columns for list ID: ${listId}`);
            return taskColumns;
        } catch (error) {
            logger.error(`Error fetching list task columns: ${error.message}`);
            throw new Error("Failed to fetch list task columns");
        }
    }

    static async updateColumnOrder(listId, columnOrders) {
        try {
            // columnOrders should be an array of { columnId, orderIndex }
            await sequelize.transaction(async (t) => {
                for (const order of columnOrders) {
                    await TaskColumn.update(
                        { orderIndex: order.orderIndex },
                        { 
                            where: { 
                                columnId: order.columnId,
                                listId: listId
                            },
                            transaction: t
                        }
                    );
                }
            });

            logger.info(`Updated order of columns in list ID: ${listId}`);
            return await this.getTaskColumnsByList(listId);
        } catch (error) {
            logger.error(`Error updating column order: ${error.message}`);
            throw new Error("Failed to update column order");
        }
    }
}

export default TaskColumnService;