import express from "express";
import AuthService from "../services/AuthService.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

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

// Đường dẫn khởi động quy trình Google OAuth
router.get(
   "/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
);

// Đường dẫn callback sau khi Google xác thực
router.get(
   "/google/callback",
   passport.authenticate("google", { failureRedirect: "/login" }),
   (req, res) => {
      // Người dùng đã được xác thực
      const user = req.user;

      // Tạo token JWT
      const token = jwt.sign(
         {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
         },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      // Gửi phản hồi hoặc chuyển hướng
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
   }
);

// Đường dẫn khởi động GitHub OAuth
router.get(
   "/github",
   passport.authenticate("github", { scope: ["user:email"] }) // Yêu cầu email của người dùng
);

// Đường dẫn callback sau khi GitHub xác thực
router.get(
   "/github/callback",
   passport.authenticate("github", { failureRedirect: "/login" }),
   (req, res) => {
      const user = req.user;

      // Tạo token JWT
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
   }
);

export default router;
