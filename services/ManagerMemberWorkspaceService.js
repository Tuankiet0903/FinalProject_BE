import ManageMemberWorkSpace from "../model/ManageMenberWorkSpace.js";
import logger from "../utils/logger.js";

class ManageMemberWorkSpaceService {
    static async createMember(data) {
        try {
            const { workspaceId, roleWorkSpace, userId } = data;

            if (!workspaceId || !roleWorkSpace || !userId) {
                throw new Error("All fields (workspaceId, roleWorkSpace, userId) are required");
            }

            const member = await ManageMemberWorkSpace.create({
                workspaceId,
                roleWorkSpace,
                userId
            });

            logger.info(`Member added to workspace successfully:`, member);
            return member;
        } catch (error) {
            logger.error(`Error adding member to workspace: ${error.message}`);
            throw error;
        }
    }

    static async getAllMembers() {
        try {
            const members = await ManageMemberWorkSpace.findAll();
            logger.info("Fetched all workspace members successfully");
            return members;
        } catch (error) {
            logger.error(`Error fetching members: ${error.message}`);
            throw new Error("Failed to fetch workspace members");
        }
    }

    static async getMemberById(id) {
        try {
            const member = await ManageMemberWorkSpace.findByPk(id);
            
            if (!member) {
                logger.warn(`Member not found with ID: ${id}`);
                return null;
            }
            
            logger.info(`Fetched member with ID: ${id}`);
            return member;
        } catch (error) {
            logger.error(`Error fetching member: ${error.message}`);
            throw new Error("Failed to fetch workspace member");
        }
    }

    static async updateMember(id, data) {
        try {
            const member = await ManageMemberWorkSpace.findByPk(id);

            if (!member) {
                logger.warn(`Member not found for update with ID: ${id}`);
                throw new Error("Member not found");
            }

            await member.update(data);
            logger.info(`Member updated successfully with ID: ${id}`);
            return member;
        } catch (error) {
            logger.error(`Error updating member: ${error.message}`);
            throw error;
        }
    }

    static async deleteMember(id) {
        try {
            const member = await ManageMemberWorkSpace.findByPk(id);

            if (!member) {
                logger.warn(`Member not found for deletion with ID: ${id}`);
                throw new Error("Member not found");
            }

            await member.destroy();
            logger.info(`Member deleted successfully with ID: ${id}`);
        } catch (error) {
            logger.error(`Error deleting member: ${error.message}`);
            throw new Error("Failed to delete workspace member");
        }
    }

    static async isMemberOfWorkspace(workspaceId, userId) {
        try {
            const member = await ManageMemberWorkSpace.findOne({
                where: { workspaceId, userId }
            });
            return !!member;
        } catch (error) {
            logger.error(`Error checking membership: ${error.message}`);
            throw new Error("Failed to check workspace membership");
        }
    }
}

export default ManageMemberWorkSpaceService;