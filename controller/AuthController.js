import AdminService from "../services/AdminService.js";

export const activateUser = async (req, res) => {
    try {
        const { token, fullName, avatar } = req.body;

        if (!token || !fullName || !avatar) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await AdminService.activateUser(token, fullName, avatar);

        return res.status(200).json({ message: "User activated successfully!", user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
