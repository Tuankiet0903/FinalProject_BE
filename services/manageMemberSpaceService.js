import ManageMemberSpace from "../models/ManageMemberSpace.js";

class ManageMemberSpaceService {
  /**
   * Lấy danh sách các space mà user có quyền truy cập trong một workspace cụ thể.
   * @param {number} userId - ID của user.
   * @param {number} workspaceId - ID của workspace.
   * @returns {Promise<Array>} - Danh sách spaceId mà user có quyền truy cập.
   */
  static async getUserSpacesByWorkspace(userId, workspaceId) {
    try {
      const spaces = await ManageMemberSpace.findAll({
        where: { userId },
        attributes: ["spaceId"],
      });

      return spaces.map((s) => s.spaceId);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách Space của user trong workspace:", error);
      throw error;
    }
  }
}

export default ManageMemberSpaceService;
