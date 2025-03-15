import Reaction from "../model/Reaction.js";
import User from "../model/User.js";
import logger from "../utils/logger.js";

class ReactionService {
    static async addReaction(data) {
        try {
            const { workspaceMessageId, emoji, createdBy } = data;

            if (!workspaceMessageId || !emoji || !createdBy) {
                throw new Error("Message ID, emoji, and user ID are required");
            }

            // Check if user already reacted with the same emoji
            const existingReaction = await Reaction.findOne({
                where: {
                    workspaceMessageId,
                    createdBy,
                    emoji
                }
            });

            if (existingReaction) {
                throw new Error("User already reacted with this emoji");
            }

            const reaction = await Reaction.create({
                workspaceMessageId,
                emoji,
                createdBy,
                createdAt: new Date()
            });

            logger.info(`Reaction added successfully to message ${workspaceMessageId}`);
            return reaction;
        } catch (error) {
            logger.error(`Error adding reaction: ${error.message}`);
            throw error;
        }
    }

    static async removeReaction(reactionId, userId) {
        try {
            const reaction = await Reaction.findByPk(reactionId);
            
            if (!reaction) {
                throw new Error("Reaction not found");
            }

            if (reaction.createdBy !== userId) {
                throw new Error("Unauthorized to remove this reaction");
            }

            await reaction.destroy();
            logger.info(`Reaction ${reactionId} removed successfully`);
        } catch (error) {
            logger.error(`Error removing reaction: ${error.message}`);
            throw error;
        }
    }

    static async getReactionsByMessage(workspaceMessageId) {
        try {
            const reactions = await Reaction.findAll({
                where: { workspaceMessageId },
                include: [{
                    model: User,
                    attributes: ['userId', 'username', 'avatar']
                }],
                order: [['createdAt', 'ASC']]
            });

            logger.info(`Retrieved reactions for message ${workspaceMessageId}`);
            return reactions;
        } catch (error) {
            logger.error(`Error retrieving reactions: ${error.message}`);
            throw error;
        }
    }
}

export default ReactionService; 