import WorkspaceMessageService from "../services/WorkspaceMessageService.js";
import ManageMemberWorkSpaceService from "../services/ManagerMemberWorkspaceService.js";
import logger from "../utils/logger.js";

export const createMessage = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { content, userId } = req.body;

        // Check if user is a member of the workspace
        // const isMember = await ManageMemberWorkSpaceService.isMemberOfWorkspace(workspaceId, userId);
        // if (!isMember) {
        //     return res.status(403).json({ error: "You are not a member of this workspace" });
        // }

        const message = await WorkspaceMessageService.createMessage({
            content,
            workspaceId,
            createdBy: userId,
        });

        // Emit socket event for real-time updates
        logger.info(`Message created in workspace ${workspaceId} by user ${userId}: ${content}`);
        logger.info(`Emitting to room: workspace-${workspaceId}`);

        // Emit socket event
        req.io.to(`workspace-${workspaceId}`).emit('new-message', message);

        return res.status(201).json(message);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to create message" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        // const { userId } = req.body;

        // Check if user is a member of the workspace
        // const isMember = await ManageMemberWorkSpaceService.isMemberOfWorkspace(workspaceId, userId);
        // if (!isMember) {
        //     return res.status(403).json({ error: "You are not a member of this workspace" });
        // }

        if (!workspaceId) {
            return res.status(400).json({ error: "Workspace ID is required" });
        }

        const messages = await WorkspaceMessageService.getMessagesByWorkspace(workspaceId, page, limit);
        return res.status(200).json(messages);
    } catch (error) {
        logger.error(error.message);
        console.error("Messages Error: "+error);
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        const updatedMessage = await WorkspaceMessageService.updateMessage(messageId, userId, content);

        // Emit socket event for real-time updates
        req.io.to(`workspace-${updatedMessage.workspaceId}`).emit('update-message', updatedMessage);

        return res.status(200).json(updatedMessage);
    } catch (error) {
        logger.error(error.message);
        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({ error: error.message });
        }
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Failed to update message" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        await WorkspaceMessageService.deleteMessage(messageId, userId);

        // Emit socket event for real-time updates
        req.io.to(`workspace-${req.params.workspaceId}`).emit('delete-message', messageId);

        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        logger.error(error.message);
        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({ error: error.message });
        }
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Failed to delete message" });
    }
}; 