import User from "../model/User.js";
import logger from "../utils/logger.js";
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
};

class UserService {
   static async createUser(data) {
      const { fullName, email, password } = data;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         logger.warn(`Attempt to register with existing email: ${email}`);
         throw new Error("Email is already registered");
      }
      const hashedPassword = await hashPassword(password);
      const user = await User.create({ fullName, email, password: hashedPassword });
      logger.info(`User created successfully: ${email}`);
      return user;
   }

   static async getAllUsers() {
      const users = await User.findAll({
         attributes: [
            "userId",
            "fullName",
            "email",
            "avatar",
            "googleId",
            "githubId",
            "dateOfBirth",
            "isBlocked",
            "active",
            "createdAt",
         ],
         order: [["createdAt", "DESC"]] // Sắp xếp theo ngày tạo mới nhất
      });

      return users;
   }

   static async getUserById(id) {
      try {
         console.log(`🔍 [Truy vấn] Tìm User với ID: ${id}`);

         if (!id || isNaN(id)) {
            console.error("❌ [LỖI] userId không hợp lệ:", id);
            return null;
         }

         const user = await User.findByPk(id, {
            attributes: [
               "userId",
               "fullName",
               "email",
               "avatar",
               "githubId",
               "googleId",
               "dateOfBirth",
               "isBlocked",
               "active",
               "createdAt",
               "updatedAt"
            ],
         });

         if (!user) {
            console.error("❌ [LỖI] Không tìm thấy user với ID:", id);
            return null;
         }

         console.log("✅ [THÀNH CÔNG] User tìm thấy:", user);
         return user;
      } catch (error) {
         console.error("🔥 [LỖI] Lỗi truy vấn DB:", error);
         throw new Error("Lỗi truy vấn database");
      }
   }



   static async updateUser(id, data) {
      const user = await User.findByPk(id);
      if (!user) {
         logger.warn(`User not found for update with ID: ${id}`);
         throw new Error("User not found");
      }

      const updatedData = {};
      if (data.fullName) updatedData.fullName = data.fullName;
      if (data.email) updatedData.email = data.email;
      if (data.password) updatedData.password = await hashPassword(data.password);
      if (data.status) updatedData.status = data.status;

      await user.update(updatedData);
      logger.info(`User updated successfully with ID: ${id}`);
      return user;
   }

   static async deleteUser(id) {
      const user = await User.findByPk(id);
      if (!user) {
         logger.warn(`User not found for deletion with ID: ${id}`);
         throw new Error("User not found");
      }

      await user.destroy();
      logger.info(`User deleted successfully with ID: ${id}`);
   }
}

export default UserService;
