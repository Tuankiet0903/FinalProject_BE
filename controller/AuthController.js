import AuthService from "../services/AuthService.js";
import jwt from "jsonwebtoken";

const AuthController = {
   async register(req, res) {
      try {
         const { token, user } = await AuthService.register(req.body);
         res.status(201).json({ message: "Đăng ký thành công!", token, user });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   },

   async login(req, res) {
      try {
         const { email, password } = req.body;
         const { token, user } = await AuthService.login(email, password);
         res.status(200).json({ message: "Đăng nhập thành công!", token, user });
      } catch (error) {
         res.status(401).json({ error: error.message });
      }
   },

   async googleCallback(req, res) {
      try {
         console.log("🔍 Google User từ Passport:", req.user);
         if (!req.user) {
            return res.status(401).json({ error: "Xác thực Google thất bại!" });
         }

         const token = jwt.sign(
            {
               userId: req.user.userId,
               email: req.user.email,
               fullName: req.user.fullName,
               avatar: req.user.avatar,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
         );

         res.cookie("token", token, { httpOnly: true });
         res.redirect(`http://localhost:5173/user?token=${token}&avatar=${req.user.avatar}&fullName=${req.user.fullName}`);
      } catch (error) {
         console.error("❌ Lỗi Google Callback:", error);
         res.status(500).json({ error: "Lỗi khi đăng nhập bằng Google!" });
      }
   },

   async logout(req, res) {
      try {
         res.clearCookie("token"); // Xóa token từ cookie
         return res.status(200).json({ message: "Đăng xuất thành công!" });
      } catch (error) {
         return res.status(500).json({ error: "Lỗi khi đăng xuất!" });
      }
   }
};

export default AuthController;
