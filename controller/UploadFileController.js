import cloudinary from "../utils/cloudinary.js";
import logger from "../utils/logger.js";
import UserService from "../services/UserService.js";

export const uploadFile = async (req, res) => {
   try {

      // Kiểm tra file có được gửi lên không
      console.log("📝 Uploaded file details:", req.file);  
      // Kiểm tra file có được gửi lên không
      if (!req.file) {
         logger.error("No file uploaded");
         return res.status(400).json({ message: "No file uploaded" });
      }

      // Kiểm tra `req.user`
      if (!req.user || !req.user.userId) {
         logger.error("User information is missing");
         return res.status(400).json({ message: "User not authenticated" });
      }

      // Log để debug
      console.log("📝 Uploaded file details:", req.file);
      console.log("✅ User authenticated:", req.user);

      // Upload file lên Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "uploads" });

      // Lấy URL của ảnh từ kết quả trả về từ Cloudinary
      const avatarUrl = result.secure_url;
      logger.info(`✅ File uploaded to Cloudinary: ${avatarUrl}`);

      // Lưu URL avatar vào cơ sở dữ liệu của người dùng
      try {
         const userId = req.user.userId;
         const updatedUser = await UserService.updateUserAvatar(userId, avatarUrl);

         if (!updatedUser) {
            logger.error("❌ User not found");
            return res.status(404).json({ message: "User not found" });
         }

         return res.status(200).json({
            success: true,
            message: "✅ File uploaded and avatar updated successfully!",
            avatarUrl,
         });
      } catch (error) {
         logger.error("❌ Error updating avatar:", error);
         return res.status(500).json({ message: "Error updating avatar in DB" });
      }
   } catch (error) {
      logger.error("❌ Error uploading file:", error);
      return res.status(500).json({ message: "Internal server error" });
   }
};
