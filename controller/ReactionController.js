import ReactionService from "../services/ReactionService.js";
import WorkspaceMessageService from "../services/WorkspaceMessageService.js";
import ManageMemberWorkSpaceService from "../services/ManagerMemberWorkspaceService.js";
import logger from "../utils/logger.js";

export const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.userId;

        // Get the message to check workspace membership
        const message = await WorkspaceMessageService.getMessageById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user is a member of the workspace
        const isMember = await ManageMemberWorkSpaceService.isMemberOfWorkspace(message.workspaceId, userId);
        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this workspace" });
        }

        const reaction = await ReactionService.addReaction({
            workspaceMessageId: messageId,
            emoji,
            createdBy: userId
        });

        // Emit socket event for real-time updates
        req.io.to(`workspace-${message.workspaceId}`).emit('new-reaction', {
            messageId,
            reaction
        });

        return res.status(201).json(reaction);
    } catch (error) {
        logger.error(error.message);
        if (error.message.includes("already reacted")) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Failed to add reaction" });
    }
};

export const removeReaction = async (req, res) => {
    try {
        const { reactionId } = req.params;
        const userId = req.user.userId;

        await ReactionService.removeReaction(reactionId, userId);

        // Emit socket event for real-time updates
        req.io.to(`workspace-${req.params.workspaceId}`).emit('remove-reaction', {
            messageId: req.params.messageId,
            reactionId
        });

        return res.status(200).json({ message: "Reaction removed successfully" });
    } catch (error) {
        logger.error(error.message);
        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({ error: error.message });
        }
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Failed to remove reaction" });
    }
};

export const getReactions = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        // Get the message to check workspace membership
        const message = await WorkspaceMessageService.getMessageById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user is a member of the workspace
        const isMember = await ManageMemberWorkSpaceService.isMemberOfWorkspace(message.workspaceId, userId);
        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this workspace" });
        }

        const reactions = await ReactionService.getReactionsByMessage(messageId);
        return res.status(200).json(reactions);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: "Failed to fetch reactions" });
    }
}; 