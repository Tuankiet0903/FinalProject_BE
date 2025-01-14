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

    // Gọi AuthService để xử lý logic
    const user = await AuthService.googleLogin({ email, fullName, googleId, avatar });

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.status(200).json({
      msg: "Đăng nhập thành công!",
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Đăng nhập thất bại." });
  }
};

