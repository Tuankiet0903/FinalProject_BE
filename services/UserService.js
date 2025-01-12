import User from "../model/User.js";
import logger from "../utils/logger.js";

class UserService {
   static async createUser(data) {
      const { fullName, email, password } = data;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         logger.warn(`Attempt to register with existing email: ${email}`);
         throw new Error("Email is already registered");
      }
      const user = await User.create({ fullName, email, password });
      logger.info(`User created successfully: ${email}`);
      return user;
   }

   static async getAllUsers() {
      const users = await User.findAll({ attributes: ["userId", "fullName", "email", "active"] });
      logger.info("Fetched all users successfully.");
      return users;
   }
   static async getUserById(id) {
      const user = await User.findByPk(id, { attributes: ["userId", "fullName", "email", "active"] });
      if (!user) {
         logger.warn(`User not found with ID: ${id}`);
         throw new Error("User not found");
      }
      logger.info(`Fetched user with ID: ${id}`);
      return user;
   }
   static async updateUser(id, data) {
      const { fullName, email, password, active } = data;
      const user = await User.findByPk(id);
      if (!user) {
         logger.warn(`User not found for update with ID: ${id}`);
         throw new Error("User not found");
      }

      await user.update({ fullName, email, password, active });
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
