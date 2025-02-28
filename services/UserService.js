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
      const users = await User.findAll({ attributes: ["userId", "fullName", "email", "status"] });
      logger.info("Fetched all users successfully.");
      return users;
   }

   static async getUserById(id) {
      const user = await User.findByPk(id, { attributes: ["userId", "fullName", "email", "active", "avatar"] });
      if (!user) {
         logger.warn(`User not found with ID: ${id}`);
         return null;
      }
      logger.info(`Fetched user with ID: ${id}`);
      return user;
   }

   static async updateUser(id, data) {
      const user = await User.findByPk(id);
      if (!user) {
         throw new Error("User not found");
      }

      const updatedData = {};

      if (data.fullName) updatedData.fullName = data.fullName;
      if (data.email) updatedData.email = data.email;
      if (data.newPassword) {
         // Nếu có mật khẩu mới, mã hóa và thay đổi mật khẩu
         updatedData.password = await hashPassword(data.newPassword);
      }

      await user.update(updatedData);
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
   
   static async updateUserAvatar(userId, avatarUrl) {
      const user = await User.findByPk(userId);
      if (!user) {
         throw new Error("User not found");
      }

      user.avatar = avatarUrl; // Lưu URL avatar vào cơ sở dữ liệu
      await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

      return user;
   }
}

export default UserService;
