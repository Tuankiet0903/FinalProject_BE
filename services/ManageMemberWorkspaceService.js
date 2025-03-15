import ManageMemberWorkSpace from "../model/ManageMenberWorkSpace.js";

class ManageMemberWorkspaceService {
  
  static async getUserRoleInWorkspace(userId, workspaceId) {
    try {
      const member = await ManageMemberWorkSpace.findOne({
        where: { userId, workspaceId },
        attributes: ["roleWorkSpace"],
      });

      return member ? member.roleWorkSpace : null;
    } catch (error) {
      console.error("❌ Lỗi khi lấy role của user trong workspace:", error);
      throw error;
    }
  }

  static async addUserToWorkspace(workspaceId, userId, roleWorkSpace) {
    try {
      const newMember = await ManageMemberWorkSpace.create({
        workspaceId,
        userId,
        roleWorkSpace,
        status: true, // Mặc định kích hoạt khi thêm
      });

      return newMember;
    } catch (error) {
      console.error("❌ Lỗi khi thêm user vào workspace:", error);
      throw error;
    }
  }

  
  static async updateUserRole(workspaceId, userId, newRole) {
    try {
      const member = await ManageMemberWorkSpace.findOne({ where: { userId, workspaceId } });

      if (!member) return false; // Không tìm thấy user trong workspace

      await member.update({ roleWorkSpace: newRole });
      return true;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật role của user:", error);
      throw error;
    }
  }

  
  

  // 🔹 Xóa hoàn toàn user khỏi hệ thống
  static async deleteUserFromWorkspace(workspaceId, userId) {
    try {
      const deleted = await ManageMemberWorkSpace.destroy({
        where: { userId, workspaceId },
      });
      if (deleted > 0) {
        return { message: "User đã bị xóa khỏi workspace" };
      } else {
        return { message: "Không tìm thấy user trong workspace" };
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa hoàn toàn user:", error);
      throw error;
    }
  }
  
}

export default ManageMemberWorkspaceService;
