import { Op, Sequelize } from "sequelize";
import User from "../model/User.js";
import ManageMemberWorkSpace from "../model/ManageMenberWorkSpace.js";
import WorkSpace from "../model/WorkSpace.js";
import logger from "../utils/logger.js";
import PremiumPlans from "../model/PremiunPlans.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const FE_URL = process.env.FE_URL;

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

  static async getCountAllActiveUsers() {
    const users = await User.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("userId")), "totalUser"],
        [Sequelize.fn("COUNT", Sequelize.literal("CASE WHEN active = 'true' THEN 1 END")), "active"],
      ],
    });
    return users;
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
      const plans = await PremiumPlans.findAll();
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
      if (
        !Array.isArray(ids) ||
        ids.length === 0 ||
        !ids.every((id) => Number.isInteger(id))
      ) {
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

  static async editPlan(id, description, price, isPopular) {
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
      await plan.update({ description, price, isPopular });

      logger.info(`Plan ${id} updated successfully`);
      return { message: `Plan ${id} updated successfully`, updatedId: id };
    } catch (error) {
      logger.error(`Error updating plan ${id}: ${error.message}`);
      throw new Error("Failed to update plan");
    }
  }

  static async createPlan(name, price, duration, description, isPopular) {
    try {
      console.log("Create Plan:", {
        name,
        price,
        duration,
        description,
        isPopular,
      });

      const res = await PremiumPlans.create({
        planName: name,
        description,
        price,
        duration,
        isPopular,
      });

      logger.info(`Plan ${res.planId} created successfully`);
      return { message: `Plan ${res.planId} created successfully`, res };
    } catch (error) {
      logger.error(`Error creating plan: ${error.message}`);
      throw new Error("Failed to create plan");
    }
  }
  static async getMembersByWorkspace(workspaceId) {
    try {
        console.log("🔍 Fetching members for workspaceId:", workspaceId);

        if (!workspaceId) {
            throw new Error("workspaceId is required");
        }

        // ✅ JOIN `ManageMemberWorkSpace` với `User`
        const members = await ManageMemberWorkSpace.findAll({
            where: { workspaceId },
            include: [{
                model: User,
                as: "User",
                attributes: ["userId", "fullName", "email", "avatar"] // ❌ Không lấy active từ User nữa
            }],
        });

        if (!members.length) {
            console.warn("⚠️ No members found for workspaceId:", workspaceId);
            return [];
        }

        return members.map(member => ({
            id: member.User?.userId || null,
            name: member.User?.fullName || "Unknown",
            email: member.User?.email || "No email",
            avatar: member.User?.avatar || "/default-avatar.png",
            role: member.roleWorkSpace || "Member",
            status: member.status ? "Active" : "Pending" // ✅ Lấy status từ ManageMemberWorkSpace
        }));
    } catch (error) {
        console.error("❌ Database Query Error:", error);
        throw new Error("Failed to fetch members from database");
    }
}

static async inviteUserToWorkspace(workspaceId, email, roleWorkSpace) {
  try {
      if (!workspaceId || !email || !roleWorkSpace) {
          throw new Error("Missing required parameters: workspaceId, email, or roleWorkSpace.");
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          throw new Error("Invalid email format.");
      }

      // Kiểm tra xem người dùng đã có trong hệ thống chưa
      let user = await User.findOne({ where: { email } });

      // Nếu người dùng chưa có, tạo người dùng mới
      if (!user) {
          user = await User.create({
              email,
              fullName: "Loading...",
              avatar: null,
              active: false,
          });
      }

      // Lưu vào bảng ManageMemberWorkSpace
      const member = await ManageMemberWorkSpace.create({
          workspaceId,
          userId: user.userId,
          roleWorkSpace
      });

      console.log("User invited and added to ManageMemberWorkSpace:", { email, workspaceId });
      const token = jwt.sign({ email, workspaceId }, process.env.JWT_SECRET, { expiresIn: "24h" });

      // Lưu token vào user
      user.inviteToken = token;
      user.inviteTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      // Gửi email
      await AdminService.sendInviteEmail(email, token);

      return {
          userId: user.userId,
          email: user.email,
          name: user.fullName,
          avatar: user.avatar,
          role: roleWorkSpace,
          active: "Pending",
      };
  } catch (error) {
      console.error("Error while inviting user to workspace:", error.message);
      throw new Error("Failed to invite user");
  }
}

static async checkUserExistsInWorkspace(workspaceId, email) {
  try {
    // Check if a user with the given email already exists in the given workspace
    const existingMember = await ManageMemberWorkSpace.findOne({
      where: { workspaceId },
      include: [{
        model: User,
        as: "User",
        where: { email }, // Check the email
        attributes: ['email']
      }]
    });

    if (existingMember) {
      throw new Error('This email is already a member of this workspace.');
    }

    return null; // No existing member found
  } catch (error) {
    console.error('Error while checking user existence:', error.message);
    throw error;
  }
}

static async sendInviteEmail(email, token) {
  try {
    const inviteLink = `${FE_URL}/login?inviteToken=${token}`;
    const declineLink = `${FE_URL}/decline-invite?inviteToken=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "You're Invited to Join a Space!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7fb; color: #333;">
          <h2 style="color: #4CAF50;">You're Invited to Join a Space!</h2>
          <p style="font-size: 16px; color: #555;">
            Hello, 
            <br><br>
            You've been invited to join a Space. Click the button below to accept the invitation and get started.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${inviteLink}" style="padding: 15px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; transition: background-color 0.3s;">Accept Invitation</a>
          </div>
          <p style="font-size: 14px; color: #888;">This link will expire in 24 hours.</p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="${declineLink}" style="padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; transition: background-color 0.3s;">Decline Invitation</a>
          </div>
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
            If you did not expect this email, please ignore it.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Invitation email sent to:", email);
  } catch (error) {
    console.error("❌ Failed to send invitation email:", error.message);
  }
}



static async activateUser(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, workspaceId } = decoded;

    // 🔍 Tìm user theo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found.");
    }

    // 🔍 Tìm thành viên trong workspace
    const workspaceMember = await ManageMemberWorkSpace.findOne({
      where: { workspaceId, userId: user.userId }
    });

    if (!workspaceMember) {
      throw new Error("User is not a member of this workspace.");
    }

    // ✅ Cập nhật trạng thái trong `ManageMemberWorkSpace`
    workspaceMember.status = true;
    await workspaceMember.save();

    console.log(`✅ User ${email} activated successfully in workspace ${workspaceId}`);

    // ✅ Trả về phản hồi
    return { userId: user.userId, workspaceId, status: workspaceMember.status };
  } catch (error) {
    console.error("❌ Activation error:", error.message);
    throw new Error("Failed to activate user.");
  }
}
static async getUserRoleInWorkspace(userId, workspaceId) {
  try {
    const member = await ManageMemberWorkSpace.findOne({
      where: { userId, workspaceId },
      attributes: ["role"],
    });

    return member ? member.role : null;
  } catch (error) {
    console.error("❌ Lỗi khi lấy role của user trong workspace:", error);
    throw error;
  }
}
static async resendInviteToWorkspace(workspaceId, email) {
  try {
      if (!workspaceId || !email) {
          throw new Error("Missing required parameters: workspaceId or email.");
      }

      // Kiểm tra xem user có tồn tại không
      let user = await User.findOne({ where: { email } });

      if (!user) {
          throw new Error("User not found.");
      }

      // Tạo token mới
      const token = jwt.sign({ email, workspaceId }, process.env.JWT_SECRET, { expiresIn: "24h" });

      // Cập nhật token vào database
      user.inviteToken = token;
      user.inviteTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      // Gửi lại email
      await AdminService.sendInviteEmail(email, token);

      console.log(`📧 Resent invitation to ${email}`);
      return { message: `Invitation resent to ${email}` };
  } catch (error) {
      console.error("❌ Error while resending invite:", error.message);
      throw new Error("Failed to resend invite");
  }
}

}

export default AdminService;
