import UserService from "../services/UserService.js";
import AuthService from "../services/AuthService.js";
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
    console.error("Failed to fetch users:", error);
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
    const user = await UserService.updateUser(req.params.id, req.body);
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

    const token = jwt.sign(
      { userId: user.userId, email: user.email, fullName: user.fullName, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(`http://localhost:5173/user?token=${token}&avatar=${encodeURIComponent(user.avatar)}&fullName=${encodeURIComponent(user.fullName)}`);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message || "Đăng nhập thất bại." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // 🔥 Lấy userId từ token

    if (!userId) {
      console.error("❌ [getProfile] userId không hợp lệ:", userId);
      return res.status(400).json({ error: "userId không hợp lệ!" });
    }

    console.log(`🔍 [getProfile] Đang tìm user với userId: ${userId}`);

    const user = await UserService.getUserById(userId);

    if (!user) {
      console.error(`❌ [getProfile] Không tìm thấy user với ID: ${userId}`);
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    console.log("✅ [getProfile] Trả về thông tin user:", user);

    return res.status(200).json({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar || "/placeholder.svg",
      githubId: user.githubId,
      googleId: user.googleId,
      dateOfBirth: user.dateOfBirth,
      isBlocked: user.isBlocked,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error("🔥 [getProfile] Lỗi khi lấy thông tin user:", error);
    return res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại!" });
  }
};







