import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService.js";
import { createWelcomeNotification } from "../controller/NotificationController.js";
import dotenv from 'dotenv';
import User from "../model/User.js"; // Import model User
import ManageMemberWorkSpace from "../model/ManageMenberWorkSpace.js";

dotenv.config();

const FE_URL = process.env.FE_URL;

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

      // Tạo thông báo chào mừng
      const notification = await createWelcomeNotification(user.userId);
      console.log('Welcome notification created:', notification);

      res.status(200).json({
         message: "Đăng nhập thành công!",
         token,
         user,
         notification
      });
   } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ error: error.message });
   }
});

// Google OAuth - Bắt đầu xác thực
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth - Xử lý callback
router.get(
   "/google/callback",
   passport.authenticate("google", { failureRedirect: `${FE_URL}/login` }),
   async (req, res) => {
      try {
         const googleUser = req.user;
         if (!googleUser) {
            console.error("❌ Google authentication failed.");
            return res.redirect(`${FE_URL}/login?error=auth_failed`);
         }

         console.log("✅ Google User Info:", googleUser);

         // 🔥 Tìm xem email này có trong bảng User không?
         let user = await User.findOne({ where: { email: googleUser.email } });

         if (!user) {
            console.log("🆕 User not found in DB. Creating new user...");
            user = await User.create({
               email: googleUser.email,
               fullName: googleUser.fullName,
               avatar: googleUser.avatar,
               active: false, // ✅ Sẽ được cập nhật khi kích hoạt từ lời mời
            });
         }

         // 🔥 Kiểm tra xem user có lời mời không
         const invitedMember = await ManageMemberWorkSpace.findOne({
            where: { userId: user.userId }
         });

         if (invitedMember) {
            console.log("🎉 User was invited! Updating status to active...");
            await ManageMemberWorkSpace.update(
               { status: true },
               { where: { userId: user.userId } }
            );
         }

         // ✅ Tạo JWT token
         const token = jwt.sign(
            { userId: user.userId, email: user.email, fullName: user.fullName, avatar: user.avatar },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
         );

         // ✅ Lưu token vào cookie
         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
         });

         console.log(`✅ User ${user.email} logged in successfully!`);

         // ✅ Chuyển hướng đến trang chính
         res.redirect(`${FE_URL}/user`);

         // Tạo thông báo chào mừng
         const notification = await createWelcomeNotification(user.userId);
         console.log('Welcome notification created:', notification);


      } catch (error) {
         console.error("Google callback error:", error);
         res.redirect(`${FE_URL}/login?error=server_error`);
      }
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
router.get("/activate/:token", async (req, res) => {
   try {
      const { token } = req.params;
      console.log("📩 Received activation token:", token); // ✅ Debug token

      // 🔥 Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token:", decoded);

      const { email, workspaceId } = decoded;

      // 🔍 Tìm user theo email
      const user = await User.findOne({ where: { email } });

      if (!user || user.active) {
         console.error("❌ Invalid or expired token.");
         return res.status(400).json({ error: "Invalid or expired token." });
      }

      // ✅ Cập nhật trạng thái user thành active
      user.active = true;
      user.inviteToken = null;
      user.inviteTokenExpires = null;
      await user.save();

      // ✅ Kiểm tra xem `ManageMemberWorkSpace` có tồn tại không
      const member = await ManageMemberWorkSpace.findOne({
         where: { workspaceId, userId: user.userId }
      });

      if (!member) {
         console.error("❌ User not found in workspace.");
         return res.status(404).json({ error: "User is not a member of this workspace." });
      }

      // ✅ Cập nhật trạng thái trong `ManageMemberWorkSpace`
      await ManageMemberWorkSpace.update(
         { active: "Active" },
         { where: { workspaceId, userId: user.userId } }
      );

      // ✅ Tạo token đăng nhập tự động sau khi kích hoạt
      const authToken = jwt.sign(
         { userId: user.userId, email: user.email, fullName: user.fullName, avatar: user.avatar },
         process.env.JWT_SECRET,
         { expiresIn: "24h" }
      );

      // ✅ Lưu token vào cookie
      res.cookie("token", authToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: 24 * 60 * 60 * 1000, // 24h
      });

      console.log(`✅ User ${email} activated successfully and redirected to workspace ${workspaceId}`);

      // ✅ Chuyển hướng đến `manage-people/:workspaceId` trên FE
      res.json({ success: true, workspaceId });

   } catch (error) {
      console.error("❌ Activation error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
   }
});

router.post("/activate-from-google", async (req, res) => {
   try {
      const { inviteToken } = req.body;

      if (!inviteToken) return res.status(400).json({ error: "Missing invite token" });

      // 🔥 Giải mã token từ email mời
      const decoded = jwt.verify(inviteToken, process.env.JWT_SECRET);
      const { email, workspaceId } = decoded;

      // 🔍 Tìm user theo email
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(404).json({ error: "User not found" });

      // ✅ Lấy thông tin từ Google Token (Lấy từ session hoặc database)
      const googleUser = req.user;

      if (!googleUser) return res.status(401).json({ error: "Google login required" });

      console.log("🌟 Google User Data:", googleUser);

      // 🔥 Cập nhật thông tin user từ Google
      user.fullName = googleUser.fullName;
      user.avatar = googleUser.avatar;
      user.active = true;
      await user.save();

      console.log(`✅ Updated User: ${user.email} | Name: ${user.fullName} | Avatar: ${user.avatar}`);

      // 🔥 Cập nhật trạng thái trong `ManageMemberWorkSpace`
      await ManageMemberWorkSpace.update(
         { status: true }, // Chuyển trạng thái thành Active
         { where: { workspaceId, userId: user.userId } }
      );

      console.log(`✅ Workspace ${workspaceId} - User ${user.email} Activated!`);

      res.json({ success: true, message: "User activated successfully!" });

   } catch (error) {
      console.error("❌ Activation error:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
});



// Đăng xuất
router.get("/logout", (req, res) => {
   res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" }); // Xóa token trong cookies
   res.json({ message: "Đã đăng xuất thành công!" }); // Gửi response về FE để xử lý tiếp
   res.redirect(`${FE_URL}/login`);
});

export default router;
