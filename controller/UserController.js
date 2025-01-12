import UserService from "../services/UserService.js";

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    const status = error.message === "Email is already registered" ? 409 : 500;
    return res.status(status).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};
