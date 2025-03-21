import WorkspaceMessage from "../model/WorkspaceMessage.js";
import FileUpload from "../model/FileUpload.js";
import User from "../model/User.js";
import Reaction from "../model/Reaction.js";
import logger from "../utils/logger.js";

class WorkspaceMessageService {
    static async createMessage(data) {
        try {
            const { content, workspaceId, createdBy } = data;

            if (!workspaceId || !createdBy) {
                throw new Error("Workspace ID and creator ID are required");
            }

            console.log("Creating message in workspace:", workspaceId + ", content" + content + ", createdBy" + createdBy);

            const message = await WorkspaceMessage.create({
                content,
                workspaceId,
                createdBy,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            logger.info(`Message created successfully in workspace ${workspaceId}`);
            return message;
        } catch (error) {
            logger.error(`Error creating message: ${error.message}`);
            throw error;
        }
    }

    static async getMessagesByWorkspace(workspaceId, page = 1, limit = 50) {
        try {
            const offset = (page - 1) * limit;
            const messages = await WorkspaceMessage.findAll({
                where: { workspaceId },
                include: [
                    {
                        model: User,
                        attributes: ['userId', 'fullName', 'avatar']
                    },
                    {
                        model: Reaction,
                        include: [{
                            model: User,
                            attributes: ['userId', 'fullName', 'avatar']
                        }]
                    }
                ],
                order: [['createdAt', 'ASC']],
                limit,
                offset
            });

            logger.info(`Retrieved messages for workspace ${workspaceId}`);
            return messages;
        } catch (error) {
            logger.error(`Error retrieving messages: ${error.message}`);
            throw error;
        }
    }

    static async deleteMessage(messageId, userId) {
        try {
            const message = await WorkspaceMessage.findByPk(messageId);
            
            if (!message) {
                throw new Error("Message not found");
            }

            if (message.createdBy !== userId) {
                throw new Error("Unauthorized to delete this message");
            }

            await message.destroy();
            logger.info(`Message ${messageId} deleted successfully`);
        } catch (error) {
            logger.error(`Error deleting message: ${error.message}`);
            throw error;
        }
    }

    static async updateMessage(messageId, userId, content) {
        try {
            const message = await WorkspaceMessage.findByPk(messageId);
            
            if (!message) {
                throw new Error("Message not found");
            }

            if (message.createdBy !== userId) {
                throw new Error("Unauthorized to update this message");
            }

            await message.update({
                content,
                updatedAt: new Date()
            });

            logger.info(`Message ${messageId} updated successfully`);
            return message;
        } catch (error) {
            logger.error(`Error updating message: ${error.message}`);
            throw error;
        }
    }
}

export default WorkspaceMessageService; 