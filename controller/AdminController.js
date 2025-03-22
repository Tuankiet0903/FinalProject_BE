import AdminService from "../services/AdminService.js";
import logger from "../utils/logger.js";
import ManageMemberWorkspaceService from "../services/ManageMemberWorkspaceService.js";
import fs from "fs";
import { getPaymentHistoryService } from "../services/PaymentService.js";

// DASHBOARD PAGE
export const getCountAllUser = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllUsers();
    return res.status(200).json(lists);
  } catch (error) {
    logger.error(`Failed to fetch lists. ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllWorkspaceType = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllWorkspaceType();
    return res.status(200).json(lists);
  } catch (error) {
    logger.error(`Failed to fetch workspace counts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllWorkspaceByMonth = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllWorkspaceByMonth();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace counts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllWorkspaceByYear = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllWorkspaceByYear();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace counts: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCountAllActiveUsers = async (req, res) => {
  try {
    const lists = await AdminService.getCountAllActiveUsers();
    return res.status(200).json(lists);
  } catch (error) {
    logger.error(`Failed to fetch lists. ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// WORKSPACE LIST PAGE

export const getAllWorkspaces = async (req, res) => {
  try {
    const lists = await AdminService.getAllWorkspaces();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteWorkSpaceByID = async (req, res) => {
  try {
    const lists = await AdminService.deleteWorkSpaceByID(req.params.id);
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultipleWorkspaces = async (req, res) => {
  try {
    const { ids } = req.body;
    const lists = await AdminService.deleteMultipleWorkspaces(ids);
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// USERS PAGE

export const getAllUsers = async (req, res) => {
  try {
    const lists = await AdminService.getAllUsers();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultipleUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    const lists = await AdminService.deleteMultipleUsers(ids);
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editBlockStatus = async (req, res) => {
  try {
    const lists = await AdminService.editBlockStatus(
      req.body.id,
      req.body.blockStatus
    );
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// PREMIUM PAGE

export const getAllPremiumPlan = async (req, res) => {
  try {
    const lists = await AdminService.getAllPremiumPlan();
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePremiumPlanById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    console.log(id);

    if (!id) {
      return res.status(400).json({ error: "Missing premium plan ID" });
    }

    await AdminService.deletePremiumPlanById(id);
    return res
      .status(200)
      .json({ message: "Premium plan deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete premium plan: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMultiplePremiumPlans = async (req, res) => {
  try {
    const { ids } = req.body;
    console.log("Received IDs:", req.body); // Debugging

    // Validate the received IDs
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => Number.isInteger(id))
    ) {
      return res.status(400).json({
        error:
          "Invalid or empty premium plan IDs. Ensure all IDs are integers.",
      });
    }

    await AdminService.deleteMultiplePremiumPlans(ids);
    return res
      .status(200)
      .json({ message: "Premium plans deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete premium plans: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editPlan = async (req, res) => {
  try {
    const lists = await AdminService.editPlan(
      req.body.id,
      req.body.description,
      req.body.price,
      req.body.isPopular
    );
    return res.status(200).json(lists);
  } catch (error) {
    console.error(`Failed to fetch workspace ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPlan = async (req, res) => {
  try {
    console.log(req.body);

    const plans = await AdminService.createPlan(
      req.body.planName,
      req.body.price,
      req.body.duration,
      req.body.description,
      req.body.isPopular
    );
    return res.status(200).json(plans);
  } catch (error) {
    console.error(`Failed to fetch Plan ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export excel

export const exportExcel = async (req, res) => {
  try {
    const paymentHiotory = await getPaymentHistoryService();
    const data = paymentHiotory.map((payment) => ({
      WorkspaceName: payment.workspace_name,
      Owner: payment.fullName,
      PlanName: payment.planName,
      Price: new Intl.NumberFormat("vi-VN", {
        style: "decimal",
      }).format(payment.price),
      Status: payment.status,
      Date: payment.created_at,
    }));

    const filePath = await AdminService.exportExcel(data, "data");

    res.download(filePath, "data.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      }

      setTimeout(() => {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      }, 5000); // Đợi 5 giây rồi xóa để tránh lỗi khi file chưa tải xong
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getMembersByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId is required" });
    }

    console.log("🔍 Fetching members for workspaceId:", workspaceId);

    const members = await AdminService.getMembersByWorkspace(workspaceId);

    if (!members || members.length === 0) {
      return res
        .status(404)
        .json({ error: "No members found for this workspace" });
    }

    return res.status(200).json(members);
  } catch (error) {
    console.error("❌ Error fetching members:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const inviteMemberToWorkspace = async (req, res) => {
  try {
    const { workspaceId, email, roleWorkSpace } = req.body;

    if (!workspaceId || !email || !roleWorkSpace) {
      return res
        .status(400)
        .json({ error: "workspaceId, email, and roleWorkSpace are required" });
    }

    console.log(
      `📩 Checking if ${email} is already in workspace ${workspaceId}`
    );

    // Kiểm tra xem email đã tồn tại trong workspace chưa
    const userExists = await AdminService.checkUserExistsInWorkspace(
      workspaceId,
      email
    );
    if (userExists) {
      return res
        .status(400)
        .json({ error: "This email is already a member of this workspace." });
    }

    // Nếu chưa tồn tại, tiến hành gửi lời mời
    const invitedMember = await AdminService.inviteUserToWorkspace(
      workspaceId,
      email,
      roleWorkSpace
    );

    return res.status(201).json({
      message: "Invitation sent successfully!",
      user: invitedMember,
    });
  } catch (error) {
    console.error("❌ Error inviting member:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

/**
 * Kích hoạt tài khoản khi người dùng nhấn vào link kích hoạt
 */
export const activateUser = async (req, res) => {
  try {
    const { token, fullName, avatar } = req.body;

    if (!token || !fullName || !avatar) {
      return res
        .status(400)
        .json({ error: "Token, fullName, and avatar are required" });
    }

    const activatedUser = await AdminService.activateUser(
      token,
      fullName,
      avatar
    );

    return res
      .status(200)
      .json({ message: "User activated successfully!", user: activatedUser });
  } catch (error) {
    console.error("❌ Error activating user:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getUserRoleInWorkspace = async (req, res) => {
  try {
    const { userId, workspaceId } = req.params;

    if (!userId || !workspaceId) {
      return res.status(400).json({ error: "Missing userId or workspaceId" });
    }

    const role = await ManageMemberWorkspaceService.getUserRoleInWorkspace(
      userId,
      workspaceId
    );

    if (!role) {
      return res.status(404).json({ error: "User not found in workspace" });
    }

    return res.status(200).json({ role });
  } catch (error) {
    console.error("❌ Error getting user role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resendInviteToWorkspace = async (req, res) => {
  try {
    const { workspaceId, email } = req.body;

    if (!workspaceId || !email) {
      return res
        .status(400)
        .json({ error: "workspaceId và email là bắt buộc" });
    }

    const result = await AdminService.resendInviteToWorkspace(
      workspaceId,
      email
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error resending invite:", error.message);
    return res.status(500).json({ error: "Không thể gửi lại lời mời" });
  }
};
