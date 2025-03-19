import ManageMemberSpaceService from "../services/manageMemberSpaceService.js";


export const getUserSpacesInvited = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId; // Lấy user từ token

    if (!workspaceId || !userId) {
      return res.status(400).json({ error: "workspaceId hoặc userId bị thiếu" });
    }

    const spaces = await ManageMemberSpaceService.getUserSpaces(userId, workspaceId);

    return res.status(200).json(spaces);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách space của user:", error);
    return res.status(500).json({ error: "Không thể lấy danh sách space" });
  }
};


export const fetchUserSpacesInWorkspaceController = async (req, res) => {
  try {
    const { userId, workspaceId } = req.params; // Lấy userId và workspaceId từ URL params

    if (!userId || !workspaceId) {
      return res.status(400).json({ message: "userId and workspaceId are required." });
    }

    // Gọi Service để lấy danh sách spaceId và spaceName cho user trong workspace
    const userSpaces = await ManageMemberSpaceService.getUserSpacesInWorkspace(userId, workspaceId);

    // Nếu không tìm thấy space cho user trong workspace
    if (userSpaces.length === 0) {
      return res.status(404).json({ message: "No spaces found for the user in this workspace." });
    }

    // Trả về các space mà user có quyền truy cập cùng tên của từng space
    res.status(200).json(userSpaces);
  } catch (error) {
    console.error("❌ Error fetching user spaces in workspace:", error.message);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

export const getMembersBySpace = async (req, res) => {
  try {
      const { spaceId } = req.params;

      if (!spaceId) {
          return res.status(400).json({ error: "spaceId is required" });
      }

      console.log("🔍 Fetching members for spaceId:", spaceId);

      // Gọi service để lấy danh sách thành viên từ ManageMemberSpace
      const members = await ManageMemberSpaceService.getMembersBySpace(spaceId);

      if (!members || members.length === 0) {
          return res.status(200).json([]); // Trả về mảng rỗng thay vì lỗi 404
      }

      // Add status to each member if needed
      const responseMembers = members.map(member => ({
          ...member,
          status: member.status, // Include status in the response
      }));

      return res.status(200).json(responseMembers);
  } catch (error) {
      console.error("❌ Error fetching members:", error);
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getUserRoleInSpace = async (req, res) => {
  try {
    const { userId, spaceId } = req.params;

    if (!userId || !spaceId) {
      return res.status(400).json({ error: "Missing userId or spaceId" });
    }

    // Gọi service để lấy role của user trong space
    const role = await ManageMemberSpaceService.getUserRoleInSpace(userId, spaceId);

    if (!role) {
      return res.status(404).json({ error: "User not found in space" });
    }

    return res.status(200).json({ role });
  } catch (error) {
    console.error("❌ Error getting user role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const inviteMemberToSpace = async (req, res) => {
  try {
    // Lấy workspaceId và spaceId từ URL params
    const { workspaceId, spaceId } = req.params; 
    // Lấy thông tin từ body (memberId và roleSpace)
    const { memberId, roleSpace,email } = req.body;

    // Kiểm tra xem các tham số có tồn tại không
    console.log("workspaceId:", workspaceId);
    console.log("spaceId:", spaceId);
    console.log("memberId:", memberId);
    console.log("roleSpace:", roleSpace);

    if (!workspaceId || !spaceId || !memberId || !roleSpace || !email) {
      return res.status(400).json({ error: "Thiếu thông tin workspaceId, spaceId, memberId hoặc roleSpace." });
    }

    // Gọi service để mời thành viên vào không gian
    const inviteResult = await ManageMemberSpaceService.inviteMemberToSpace(workspaceId, spaceId, memberId, roleSpace, email);

    return res.status(200).json({
      message: "Mời thành viên thành công",
      invite: inviteResult
    });
  } catch (error) {
    console.error("❌ Lỗi khi mời thành viên vào không gian:", error);
    return res.status(500).json({ error: "Lỗi hệ thống khi mời thành viên vào không gian." });
  }
};

export const deleteUserFromSpace = async (req, res) => {
  try {
    const { workspaceId, spaceId, userId } = req.params;

    // Kiểm tra xem workspaceId, spaceId, và userId có hợp lệ không
    if (!workspaceId || !spaceId || !userId) {
      return res.status(400).json({ error: "workspaceId, spaceId và userId là bắt buộc" });
    }

    // Gọi service để xóa thành viên khỏi space
    const result = await ManageMemberSpaceService.deleteUserFromSpace(workspaceId, spaceId, userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error deleting user from space:", error);
    return res.status(500).json({ error: "Lỗi server khi xóa user khỏi space" });
  }
};



