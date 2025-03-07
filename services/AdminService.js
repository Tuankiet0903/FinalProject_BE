import { Op, Sequelize } from "sequelize";
import User from "../model/User.js";
import ManageMemberWorkSpace from "../model/ManageMenberWorkSpace.js";
import WorkSpace from "../model/WorkSpace.js";
import logger from "../utils/logger.js";
import PremiumPlans from "../model/PremiunPlans.js";

class AdminService {
  // DASHBOARD PAGE

  static async getCountAllUsers() {
    const users = await User.findAll({
      attributes: [
        [Sequelize.col("createdAt"), "time"],
        [Sequelize.fn("COUNT", "*"), "totalUser"],
      ],
      group: ["time"],
      order: [["time", "ASC"]],
    });
    return users;
  }

  static async getCountAllWorkspaceType() {
    try {
      const workspaces = await WorkSpace.findAll({
        attributes: [
          ["type", "workspaceType"],
          [Sequelize.fn("COUNT", Sequelize.col("type")), "totalWorkspace"],
        ],
        group: ["type"],
        raw: true, // Ensures clean JSON output
      });
      return workspaces;
    } catch (error) {
      logger.error(`Error fetching workspace counts: ${error.message}`);
      throw new Error("Database Error");
    }
  }

  static async getCountAllWorkspaceByMonth() {
    try {
      const workspaces = await WorkSpace.findAll({
        attributes: [
          [
            Sequelize.fn("TO_CHAR", Sequelize.col("createdAt"), "YYYY-MM"),
            "workspaceMonth",
          ], // Format as YYYY-MM
          [
            Sequelize.fn("COUNT", Sequelize.col("workspaceId")),
            "totalWorkspace",
          ], // Count workspaces per month
          [Sequelize.fn("COUNT", Sequelize.col("workspaceId")), "growth"],
        ],
        group: ["workspaceMonth"], // Use alias instead of recalculating
        order: [["workspaceMonth", "ASC"]], // Order by alias
        raw: true, // Ensures clean JSON output
      });

      return workspaces;
    } catch (error) {
      logger.error(
        `Error fetching workspace counts by month: ${error.message}`
      );
      throw new Error("Database Error");
    }
  }

  static async getCountAllWorkspaceByYear() {
    try {
      const workspaces = await WorkSpace.findAll({
        attributes: [
          [
            Sequelize.fn("TO_CHAR", Sequelize.col("createdAt"), "YYYY"),
            "workspaceMonth",
          ], // Format as YYYY-MM
          [
            Sequelize.fn("COUNT", Sequelize.col("workspaceId")),
            "totalWorkspace",
          ], // Count workspaces per year
          [Sequelize.fn("COUNT", Sequelize.col("workspaceId")), "growth"], // Count workspaces per year
        ],
        group: ["workspaceMonth"], // Use alias instead of recalculating
        order: [["workspaceMonth", "ASC"]], // Order by alias
        raw: true, // Ensures clean JSON output
      });

      return workspaces;
    } catch (error) {
      logger.error(
        `Error fetching workspace counts by month: ${error.message}`
      );
      throw new Error("Database Error");
    }
  }

  // WORKSPACE LIST PAGE
  static async getAllWorkspaces() {
    try {
      const workspaces = await WorkSpace.findAll({
        include: [
          {
            model: User,
            attributes: ["userId", "fullName", "email", "role"],
          },
          {
            model: ManageMemberWorkSpace,
            attributes: ["idManageMember", "userId", "roleWorkSpace"],
            include: [
              {
                model: User,
                attributes: ["userId", "fullName", "email", "role"],
              },
            ],
          },
        ],
      });

      return workspaces;
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw new Error("Database Error");
    }
  }

  static async deleteWorkSpaceByID(id) {
    try {
      const workSpace = await WorkSpace.findByPk(id);
      if (!workSpace) {
        logger.warn(`workSpace not found for deletion with ID: ${id}`);
        throw new Error("workSpace not found");
      }

      await workSpace.destroy();
      logger.info(`workSpace deleted successfully with ID: ${id}`);
    } catch (error) {
      logger.error(`Error deleting workSpace: ${error.message}`);
      throw new Error("Failed to delete workSpace");
    }
  }

  static async deleteMultipleWorkspaces(ids) {
    try {
      if (!Array.isArray(ids)) {
        console.error("Invalid workspace IDs:", ids);
        throw new Error("Invalid workspace IDs format");
      }

      const workspaces = await WorkSpace.findAll({
        where: { workspaceId: ids },
      });

      if (workspaces.length === 0) {
        console.warn(`No workspaces found for deletion with IDs: ${ids}`);
        throw new Error("No workspaces found");
      }

      await Promise.all(workspaces.map((ws) => ws.destroy()));
      logger.info(`Workspaces deleted successfull`);
    } catch (error) {
      logger.error(`Error deleting workSpace: ${error.message}`);
      throw new Error("Failed to delete workSpace");
    }
  }

  // USERS LIST PAGE
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: [
          "userId",
          "fullName",
          "email",
          "avatar",
          "dateOfBirth",
          "isBlocked",
          "active",
          "createdAt",
        ],
      });

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Database Error");
    }
  }

  static async deleteMultipleUsers(ids) {
    try {
      console.log("Received IDs:", ids); // Debugging Log

      if (!Array.isArray(ids) || ids.length === 0) {
        console.error("Invalid User IDs:", ids);
        throw new Error("Invalid User IDs format");
      }

      const users = await User.findAll({
        where: { userId: ids }, // Ensure userId matches the column in DB
      });

      if (users.length === 0) {
        throw new Error("No users found for deletion");
      }

      // Delete all users in parallel
      await Promise.all(users.map((user) => user.destroy()));

      logger.info(`Users deleted successfully: ${ids.join(", ")}`);
      return { message: "Users deleted successfully", deletedIds: ids };
    } catch (error) {
      logger.error(`Error deleting users: ${error.message}`);
      throw new Error("Failed to delete users");
    }
  }

  static async editBlockStatus(id, blockStatus) {
    try {
      console.log("Received ID:", id, "Block Status:", blockStatus); // Debug Log

      if (!id || typeof id !== "number") {
        console.error("Invalid User ID:", id);
        throw new Error("Invalid User ID format");
      }

      const user = await User.findByPk(id);

      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Update block status
      await user.update({ isBlocked: blockStatus });

      logger.info(`User ${id} block status updated successfully`);
      return { message: `User ${id} updated successfully`, updatedId: id };
    } catch (error) {
      logger.error(`Error updating user ${id}: ${error.message}`);
      throw new Error("Failed to update user");
    }
  }

// PREMIUM PAGE
static async getAllPremiumPlan() {
  try {
    const plans = await PremiumPlans.findAll()
    return plans;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Database Error");
  }
}

static async deletePremiumPlanById(id) {
  try {
    const premiumPlan = await PremiumPlans.findByPk(id);
    if (!premiumPlan) {
      logger.warn(`Premium plan not found for deletion with ID: ${id}`);
      throw new Error("Premium plan not found");
    }

    await premiumPlan.destroy();
    logger.info(`Premium plan deleted successfully with ID: ${id}`);
  } catch (error) {
    logger.error(`Error deleting premium plan: ${error.message}`);
    throw new Error("Failed to delete premium plan");
  }
}

static async deleteMultiplePremiumPlans(ids) {
  console.log("Deleting premium plans with IDs:", ids); // Debugging
  try {
    if (!Array.isArray(ids) || ids.length === 0 || !ids.every(id => Number.isInteger(id))) {
      logger.warn("Invalid or empty premium plan IDs provided:", ids);
      throw new Error("Invalid or empty premium plan IDs format");
    }

    const deletedCount = await PremiumPlans.destroy({
      where: { planId: ids },
    });

    if (deletedCount === 0) {
      logger.warn(`No premium plans found for deletion with IDs: ${ids}`);
      throw new Error("No premium plans found for deletion");
    }

    logger.info(`Successfully deleted ${deletedCount} premium plans.`);
  } catch (error) {
    logger.error(`Error deleting premium plans: ${error.message}`);
    throw new Error("Failed to delete premium plans");
  }
}

static async editPlan(id, description, price) {
  try {

    // Ensure the ID is valid
    if (!id || isNaN(Number(id))) {
      console.error("Invalid Plan ID:", id);
      throw new Error("Invalid Plan ID format");
    }

    // Find the plan by ID
    const plan = await PremiumPlans.findByPk(id);

    if (!plan) {
      throw new Error(`Plan with ID ${id} not found`);
    }

    // Update plan details
    await plan.update({ description, price });

    logger.info(`Plan ${id} updated successfully`);
    return { message: `Plan ${id} updated successfully`, updatedId: id };
  } catch (error) {
    logger.error(`Error updating plan ${id}: ${error.message}`);
    throw new Error("Failed to update plan");
  }
}

static async createPlan(name, price, duration, description) {
  try {
    console.log("Create Plan:", { name, price, duration, description });

    const res = await PremiumPlans.create({ planName: name, description, price, duration });

    logger.info(`Plan ${res.planId} created successfully`);
    return { message: `Plan ${res.planId} created successfully`, res };
  } catch (error) {
    logger.error(`Error creating plan: ${error.message}`);
    throw new Error("Failed to create plan");
  }
}





}

export default AdminService;
