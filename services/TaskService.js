import Task from "../model/Task.js";
import logger from "../utils/logger.js";

class TaskService {
    static async createTask(data) {
        try {
            const task = await Task.create(data);
            logger.info(`Task created successfully with ID: ${task.taskId}`);
            return task;
        } catch (error) {
            logger.error(`Error creating task: ${error.message}`);
            throw error;
        }
    }

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

    static async updateTask(id, data) {
        try {
            const task = await Task.findByPk(id);
            if (!task) {
                logger.warn(`Task not found for update with ID: ${id}`);
                throw new Error("Task not found");
            }

            await task.update(data);
            logger.info(`Task updated successfully with ID: ${id}`);
            return task;
        } catch (error) {
            logger.error(`Error updating task: ${error.message}`);
            throw error;
        }
    }

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
}

export default TaskService;
