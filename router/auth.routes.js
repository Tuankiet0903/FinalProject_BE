import express from "express";
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

      // Lưu token vào cookie
      res.cookie("token", token, {
         httpOnly: true,
         secure: false,  // Phải là `false` khi test trên localhost
         sameSite: "lax",
         maxAge: 24 * 60 * 60 * 1000 // 24h
      });

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

router.get("/google/success", (req, res) => {
   if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
   }

   // ✅ Trả token về frontend từ cookies
   res.json({
      message: "Google login successful",
      token: req.cookies.token,  // 🔥 Lấy token từ cookies
      user: {
         userId: req.user.userId,
         fullName: req.user.fullName,
         email: req.user.email,
         avatar: req.user.avatar,
      },
   });
});

// Đăng xuất
router.get("/logout", (req, res) => {
   res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" }); // Xóa token trong cookies
   res.json({ message: "Đã đăng xuất thành công!" }); // Gửi response về FE để xử lý tiếp
   res.redirect("http://localhost:5173/login");
});

export default router;
