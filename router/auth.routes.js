import express from "express";
import AuthController from "../controller/AuthController.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService.js";

const router = express.Router();

// Đăng ký tài khoản
router.post("/register", async (req, res) => {
   try {
      const { token, user } = await AuthService.register(req.body);
      res.status(201).json({ message: "Đăng ký thành công!", token, user });
   } catch (error) {
      console.error("Error during registration:", error);
      res.status(400).json({ error: error.message });
   }
});

// Đăng nhập thông thường
router.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.status(200).json({ message: "Đăng nhập thành công!", token, user });
   } catch (error) {
      res.status(401).json({ error: error.message });
   }
});

// Google OAuth - Bắt đầu xác thực
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth - Xử lý callback
router.get(
   "/google/callback",
   passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
   (req, res) => {
      const user = req.user;

      if (!user) {
         return res.redirect("http://localhost:5173/login?error=auth_failed");
      }

      // Tạo JWT token
      const token = jwt.sign(
         { userId: user.userId, email: user.email, fullName: user.fullName, avatar: user.avatar },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      // Lưu token vào cookie để bảo mật hơn
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

      // Chuyển hướng về FE kèm token + user info
      res.redirect(`http://localhost:5173/user?fullName=${encodeURIComponent(user.fullName)}`);
   }
);

// Đăng xuất
router.get("/logout", (req, res) => {
   res.clearCookie("token");
   res.redirect("http://localhost:5173/login");
});

export default router;
