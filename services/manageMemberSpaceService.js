// service/ManageMemberSpaceService.js
import Space from "../model/Space.js";
import ManageMemberSpace from "../model/ManageMemberSpace.js";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Folder from "../model/Folder.js";
import List from "../model/List.js";

class ManageMemberSpaceService {
  /**
   * Lấy danh sách các space mà người dùng có quyền truy cập trong một workspace cụ thể
   * @param {number} userId - ID của user.
   * @param {number} workspaceId - ID của workspace.
   * @returns {Promise<Array>} - Danh sách các spaceId mà người dùng có quyền truy cập.
   */
  static async getUserSpacesInWorkspace(userId, workspaceId) {
    try {
      // Truy vấn các không gian của người dùng trong workspace
      const spaces = await ManageMemberSpace.findAll({
        where: { userId, workspaceId }, // Lọc theo userId và workspaceId
        attributes: ["spaceId"], // Lấy spaceId
        include: [
          {
            model: Space, // Liên kết với bảng Space
            // Không chỉ định 'attributes' để lấy tất cả các trường của Space
            include: [
              {
                model: Folder, // Liên kết với bảng Folder
                as: 'folders',
                // Không chỉ định 'attributes' để lấy tất cả các trường của Folder
                include: [
                  {
                    model: List, // Liên kết với bảng List
                    as: 'lists',
                    // Không chỉ định 'attributes' để lấy tất cả các trường của List
                  }
                ]
              }
            ]
          }
        ]
      });
  
      // Trả về danh sách các không gian với tên của từng space, thư mục và danh sách
      return spaces.map((space) => ({
        spaceId: space.spaceId,
        spaceName: space.Space.name, // Lấy tên của space từ bảng Space
        // Lấy tất cả dữ liệu của thư mục và danh sách
        folders: space.Space.folders.map(folder => ({
          folderId: folder.folderId,
          folderName: folder.name,
          // Lấy tất cả các trường của List
          lists: folder.lists.map(list => ({
            listId: list.listId,
            listName: list.name,
            // Bạn có thể thêm bất kỳ trường nào khác từ List mà bạn muốn
          }))
        }))
      }));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách spaces của user trong workspace:", error);
      throw error;
    }
  }
  
  


  static async getMembersBySpace(spaceId) {
    try {
      console.log("🔍 Fetching members for spaceId:", spaceId);

      if (!spaceId) {
        throw new Error("spaceId is required");
      }

      // ✅ JOIN `ManageMemberSpace` với `User`
      const members = await ManageMemberSpace.findAll({
        where: { spaceId },
        include: [
          {
            model: User,  
            as: "User",
            attributes: ["userId", "fullName", "email", "avatar"], // ❌ Không lấy active từ User
          },
        ],
      });

      if (!members.length) {
        console.warn("⚠️ No members found for spaceId:", spaceId);
        return [];
      }

      // ✅ Chuẩn hóa dữ liệu trả về
      return members.map((member) => ({
        id: member.User?.userId || null,
        name: member.User?.fullName || "Unknown",
        email: member.User?.email || "No email",
        avatar: member.User?.avatar || "/default-avatar.png",
        role: member.roleSpace || "Member",
        status: member.status ? "Active" : "Pending", // ✅ Lấy status từ `ManageMemberSpace`
      }));
    } catch (error) {
      console.error("❌ Database Query Error:", error);
      throw new Error("Failed to fetch members from database");
    }
  }

  static async getUserRoleInSpace(userId, spaceId) {
    try {
      // Tìm member trong ManageMemberSpace dựa vào userId và spaceId
      const member = await ManageMemberSpace.findOne({
        where: { userId, spaceId },
        attributes: ["roleSpace"], // Lấy roleSpace
      });

      // Trả về role nếu tìm thấy, nếu không trả về null
      return member ? member.roleSpace : null;
    } catch (error) {
      console.error("❌ Lỗi khi lấy role của user trong space:", error);
      throw error;
    }
  }
  static async inviteMemberToSpace(workspaceId, spaceId, memberId, roleSpace, email) {
    try {
      // Tạo bản ghi mời thành viên vào không gian, sử dụng memberId = userId
      const newInvite = await ManageMemberSpace.create({
        workspaceId,
        spaceId,
        userId: memberId, // Sử dụng memberId làm userId (vì memberId và userId là một)
        roleSpace,
        status: false, // Đặt trạng thái mời là false (chưa chấp nhận)
      });

      // Gửi email mời
      await this.sendInviteEmail(email, memberId, workspaceId, spaceId);

      return newInvite;
    } catch (error) {
      console.error("❌ Error when inviting user:", error.message);
      throw new Error("Error when inviting user");
    }
  }
  static async deleteUserFromSpace(workspaceId, spaceId, userId) {
    try {
      // Tìm và xóa thành viên khỏi bảng ManageMemberSpace với workspaceId và spaceId
      const deleted = await ManageMemberSpace.destroy({
        where: { 
          userId, 
          workspaceId, 
          spaceId 
        },
      });

      if (deleted > 0) {
        return { message: "User đã bị xóa khỏi không gian" };
      } else {
        return { message: "Không tìm thấy user trong không gian này" };
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa hoàn toàn user khỏi không gian:", error);
      throw error;
    }
  }

  static async sendInviteEmail(email, userId, workspaceId, spaceId) {
    try {
      // Tạo token để xác nhận lời mời
      const token = jwt.sign({ userId, workspaceId, spaceId }, process.env.JWT_SECRET, { expiresIn: "24h" });
      
      // Tạo link xác nhận và từ chối với token
      const inviteLink = `http://localhost:5173/confirm-invite?inviteToken=${token}&userId=${userId}&spaceId=${spaceId}&workspaceId=${workspaceId}`;
      const declineLink = `http://localhost:5173/decline-invite?inviteToken=${token}`;

      // Cấu hình Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Email của bạn
          pass: process.env.EMAIL_PASSWORD, // Mật khẩu ứng dụng email của bạn
        },
      });

      // Cấu hình email
      const mailOptions = {
        from: process.env.EMAIL, // Địa chỉ email gửi
        to: email, // Địa chỉ người nhận
        subject: "You're Invited to Join a Workspace!", // Tiêu đề email
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7fb; color: #333;">
            <h2 style="color: #4CAF50;">You're Invited to Join a Workspace!</h2>
            <p style="font-size: 16px; color: #555;">
              Hello, 
              <br><br>
              You've been invited to join a workspace. Click the button below to accept the invitation and get started.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${inviteLink}" style="padding: 15px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="font-size: 14px; color: #888;">This link will expire in 24 hours.</p>
            <div style="text-align: center; margin-top: 15px;">
              <a href="${declineLink}" style="padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Decline Invitation</a>
            </div>
            <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
              If you did not expect this email, please ignore it.
            </p>
          </div>
        `,
      };

      // Gửi email
      await transporter.sendMail(mailOptions);
      console.log("✅ Invitation email sent to:", email);
    } catch (error) {
      console.error("❌ Failed to send invitation email:", error.message);
      throw new Error("Error sending invitation email");
    }
  }
  

  

}












export default ManageMemberSpaceService;
