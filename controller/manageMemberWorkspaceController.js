import ManageMemberWorkspaceService from "../services/ManageMemberWorkspaceService.js";

// 🔹 Xử lý API xóa user khỏi workspace
export const removeUserFromWorkspace = async (req, res) => {
  try {
    const { workspaceId, userId } = req.body;

    if (!workspaceId || !userId) {
      return res.status(400).json({ error: "workspaceId và userId là bắt buộc" });
    }

    const result = await ManageMemberWorkspaceService.removeUserFromWorkspace(workspaceId, userId);
    if (result) {
      return res.status(200).json({ message: "User đã bị xóa khỏi workspace" });
    } else {
      return res.status(404).json({ error: "User không tồn tại trong workspace" });
    }
  } catch (error) {
    console.error("❌ Error removing user:", error);
    return res.status(500).json({ error: "Lỗi server khi xóa user" });
  }
};

// 🔹 Xử lý API xóa hoàn toàn user khỏi workspace
export const deleteUserFromWorkspace = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;

    if (!workspaceId || !userId) {
      return res.status(400).json({ error: "workspaceId và userId là bắt buộc" });
    }

    const result = await ManageMemberWorkspaceService.deleteUserFromWorkspace(workspaceId, userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return res.status(500).json({ error: "Lỗi server khi xóa user" });
  }
};
export const resendInviteToWorkspace = async (req, res) => {
    try {
      const { workspaceId, email } = req.body;
      if (!workspaceId || !email) {
        return res.status(400).json({ error: "workspaceId và email là bắt buộc" });
      }
  
      // Gửi lại email mời
      await EmailService.sendInviteEmail(email, workspaceId); // Gọi hàm gửi email lại
  
      return res.status(200).json({ message: `Lời mời đã gửi lại đến ${email}` });
    } catch (error) {
      console.error("❌ Lỗi khi gửi lại lời mời:", error);
      return res.status(500).json({ error: "Không thể gửi lại lời mời" });
    }
  };
