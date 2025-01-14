import express from "express";
import AuthService from "../services/AuthService.js";

const router = express.Router();

/**
 * Đăng ký người dùng.
 */
router.post("/register", async (req, res) => {
   try {
      const { token, user } = await AuthService.register(req.body);
      res.status(201).json({ message: "Đăng ký thành công!", token, user });
   } catch (error) {
      console.error("Error during registration:", error);
      res.status(400).json({ error: error.message });
   }
});

/**
 * Đăng nhập người dùng.
 */
router.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.status(200).json({ message: "Đăng nhập thành công!", token, user });
   } catch (error) {
      res.status(401).json({ error: error.message });
   }
});

export default router;
