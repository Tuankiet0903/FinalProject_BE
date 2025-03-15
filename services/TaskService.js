import Task from "../model/Task.js";
import User from "../model/User.js";
import NotificationService from "./NotificationService.js";
import logger from "../utils/logger.js";
import TaskColumn from "../model/TaskColumn.js";
import List from "../model/List.js";
import Folder from "../model/Folder.js";

class TaskService {
    // Tạo task mới
    static async createTask(taskData) {
        try {
            // Validate required fields
            if (!taskData.title) {
                throw new Error('Title is required');
            }

            // Set default values if not provided
            const task = await Task.create({
                ...taskData,
                status: taskData.status || 1,
                priority: taskData.priority || "Easy",
                createdAt: new Date(),
                startDate: taskData.startDate ? new Date(taskData.startDate) : null,
                endDate: taskData.endDate ? new Date(taskData.endDate) : null
            });

            logger.info(`Task created successfully with ID: ${task.taskId}`);
            return task;
        } catch (error) {
            logger.error(`Error creating task: ${error.message}`);
            throw error;
        }
    }

    // Lấy tất cả tasks
    static async getAllTasks() {
        try {
            const tasks = await Task.findAll({
                order: [["startDate", "ASC"]],
            });
            logger.info("Fetched all tasks successfully");
            return tasks;
        } catch (error) {
            logger.error(`Error fetching tasks: ${error.message}`);
            throw new Error("Failed to fetch tasks");
        }
    }

    // Lấy task theo ID
    static async getTaskById(id) {
        try {
            const task = await Task.findByPk(id);
            if (!task) {
                logger.warn(`Task not found with ID: ${id}`);
                return null;
            }
            logger.info(`Fetched task with ID: ${id}`);
            return task;
        } catch (error) {
            logger.error(`Error fetching task: ${error.message}`);
            throw new Error("Failed to fetch task");
        }
    }

    // Cập nhật task
    static async updateTask(id, data) {
        try {
            const task = await Task.findByPk(id);
            if (!task) {
                logger.warn(`Task not found for update with ID: ${id}`);
                throw new Error("Task not found");
            }

            // Cập nhật completedAt nếu status là 3
            if (data.status === 3) {
                data.completedAt = new Date();
            }

            await task.update(data);
            logger.info(`Task updated successfully with ID: ${id}`);
            return task;
        } catch (error) {
            logger.error(`Error updating task: ${error.message}`);
            throw error;
        }
    }

    // Xóa task
    static async deleteTask(id) {
        try {
            const task = await Task.findByPk(id);
            if (!task) {
                logger.warn(`Task not found for deletion with ID: ${id}`);
                throw new Error("Task not found");
            }

            await task.destroy();
            logger.info(`Task deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting task: ${error.message}`);
            throw new Error("Failed to delete task");
        }
    }

    // Lấy tasks theo column
    static async getTasksByColumn(taskColumnId) {
        try {
            const tasks = await Task.findAll({
                where: { taskColumnId },
                order: [["priority", "DESC"], ["startDate", "ASC"]],
            });

            logger.info(`Fetched tasks for column ID: ${taskColumnId}`);
            return tasks;
        } catch (error) {
            logger.error(`Error fetching column tasks: ${error.message}`);
            throw new Error("Failed to fetch column tasks");
        }
    }

    // Lấy tasks theo space
    static async getTasksBySpace(spaceId) {
        try {
            const tasks = await Task.findAll({
                include: [{
                    model: TaskColumn,
                    as: 'taskColumn',
                    include: [{
                        model: List,
                        as: 'list',
                        include: [{
                            model: Folder,
                            as: 'folder',
                            where: { spaceId }
                        }]
                    }]
                }],
                order: [["priority", "DESC"], ["startDate", "ASC"]],
            });

            logger.info(`Fetched tasks for space ID: ${spaceId}`);
            return tasks;
        } catch (error) {
            logger.error(`Error fetching space tasks: ${error.message}`);
            throw new Error("Failed to fetch space tasks");
        }
    }

    // Lấy tasks theo workspace
    static async getTasksByWorkspace(workspaceId) {
        try {
            const tasks = await Task.findAll({
                where: { workspaceId },
                order: [["priority", "DESC"], ["startDate", "ASC"]],
            });

            logger.info(`Fetched tasks for workspace ID: ${workspaceId}`);
            return tasks;
        } catch (error) {
            logger.error(`Error fetching workspace tasks: ${error.message}`);
            throw new Error("Failed to fetch workspace tasks");
        }
    }
}

export default TaskService;
