import TaskColumn from "../model/TaskColumn.js";
import List from "../model/List.js";
import logger from "../utils/logger.js";

class TaskColumnService {
    static async createTaskColumn(data) {
        const { name, color, listId, createdBy, status = 1 } = data; // Cung cấp giá trị mặc định cho status = 1 (To do)

        try {
            // Kiểm tra xem List có tồn tại không
            const list = await List.findByPk(listId);
            if (!list) {
                throw new Error("List not found");
            }

            // Kiểm tra màu sắc nếu có
            if (color && !["gray", "blue", "green"].includes(color)) {
                throw new Error("Invalid color. Must be gray, blue, or green");
            }

            // Tạo TaskColumn với giá trị mặc định cho status là 1 (To do)
            const taskColumn = await TaskColumn.create({
                name,
                color,
                listId,
                createdBy,
                status,  // Truyền giá trị status (1: To do, 2: In process, 3: Done)
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
                order: [['listId', 'ASC']]
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

            // Kiểm tra màu sắc nếu có thay đổi
            if (data.color && !["gray", "blue", "green"].includes(data.color)) {
                throw new Error("Invalid color. Must be gray, blue, or green");
            }

            // Kiểm tra status nếu có thay đổi
            if (data.status && ![1, 2, 3].includes(data.status)) {
                throw new Error("Invalid status. Must be 1 (To do), 2 (In process), or 3 (Done)");
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
                order: [['columnId', 'ASC']]  // Không cần sử dụng orderIndex
            });

            logger.info(`Fetched task columns for list ID: ${listId}`);
            return taskColumns;
        } catch (error) {
            logger.error(`Error fetching list task columns: ${error.message}`);
            throw new Error("Failed to fetch list task columns");
        }
    }
}

export default TaskColumnService;
