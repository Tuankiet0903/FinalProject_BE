import UserService from "../services/UserService.js";
import AuthService from "../services/AuthService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    logger.error(error.message);
    const status = error.message === "Email is already registered" ? 409 : 500;
    return res.status(status).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    logger.error("Failed to fetch users.");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Lấy userId từ tham số
    const { fullName, email, newPassword } = req.body; // Lấy dữ liệu gửi lên từ client

    const updatedData = { fullName, email, newPassword };

    // Gọi UserService để xử lý việc cập nhật người dùng
    const user = await UserService.updateUser(userId, updatedData);
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    logger.error(error.message);
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(error.message);
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

export const ggLogin = async (req, res) => {
  try {
    const { email, fullName, googleId, avatar } = req.body;
    const user = await AuthService.googleLogin({ email, fullName, googleId, avatar });

    if (!user) {
      return res.status(401).json({ error: "Google login failed." });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, fullName: user.fullName, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(`http://localhost:5173/user?token=${token}&avatar=${encodeURIComponent(user.avatar)}&fullName=${encodeURIComponent(user.fullName)}`);
  } catch (error) {
    logger.error("Google login error:", error);
    res.status(500).json({ error: "Đăng nhập thất bại." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    console.log("📌 Đang lấy thông tin user với ID:", req.user.userId); // Kiểm tra ID

    const user = await UserService.getUserById(req.user.userId);
    console.log("✅ Kết quả truy vấn user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Lỗi trong getUserProfile:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!newPassword) {
    return res.status(400).json({ error: "New password is required." });
  }

  // Lấy người dùng từ database
  try {
    const user = await UserService.getUserById(req.user.userId); // Lấy user dựa trên userId trong token
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mã hóa mật khẩu mới và lưu lại
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password." });
  }
};

export const updateUserAvatar = async (req, res) => {
  const { avatarUrl } = req.body;

  // Nếu user không phải admin, chỉ cho phép họ sửa avatar của chính họ
  const userId = req.user.isAdmin ? req.params.userId : req.user.userId;

  try {
    const updatedUser = await UserService.updateUserAvatar(userId, avatarUrl);

    if (!updatedUser) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Avatar updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Error updating avatar:", error);
    return res.status(500).json({ message: "Failed to update avatar" });
  }
};

