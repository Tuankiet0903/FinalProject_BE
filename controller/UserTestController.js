import User from "../model/UserTest.js";

// Create: Tạo một bản ghi mới
export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await User.create({ username, password });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
};

// Read: Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Error fetching users" });
  }
};

// Read: Lấy một người dùng theo password
export const getUserByPassword = async (req, res) => {
  try {
    const { password } = req.params;
    const user = await User.findOne({ where: { password } });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Error fetching user" });
  }
};

// Update: Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  try {
    const { password } = req.params;
    const { username } = req.body;
    const [updated] = await User.update({ username }, { where: { password } });
    if (updated) {
      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Error updating user" });
  }
};

// Delete: Xóa một người dùng
export const deleteUser = async (req, res) => {
  try {
    const { password } = req.params;
    const deleted = await User.destroy({ where: { password } });
    if (deleted) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Error deleting user" });
  }
};
