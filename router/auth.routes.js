import express from "express";
import passport from "../config/passport.js";
import jwt from 'jsonwebtoken';
import AuthService from "../services/AuthService.js";
const router = express.Router();

router.post("/register", async (req, res) => {
   try {
      const { token, user } = await AuthService.register(req.body);
      res.status(201).json({ message: "Đăng ký thành công!", token, user });
   } catch (error) {
      console.error("Error during registration:", error);
      res.status(400).json({ error: error.message });
   }
});

router.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      res.status(200).json({ message: "Đăng nhập thành công!", token, user });
   } catch (error) {
      res.status(401).json({ error: error.message });
   }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
   "/google/callback",
   passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
   (req, res) => {
      const user = req.user;
      const token = jwt.sign(
         { userId: user.userId, email: user.email, fullName: user.fullName, avatar: user.avatar },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );
      res.cookie("token", token, { httpOnly: true });
      res.redirect(`http://localhost:5173/user?token=${token}&avatar=${user.avatar}&fullName=${user.fullName}`);
   }
);

router.get("/logout", (req, res) => {
   res.clearCookie("token");
   res.redirect("http://localhost:5173/login");
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
   "/github/callback",
   passport.authenticate("github", { failureRedirect: "/login" }),
   (req, res) => {
      const user = req.user;
      const token = jwt.sign(
         { userId: user.userId, email: user.email, fullName: user.fullName },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );
      res.cookie("token", token, { httpOnly: true });
      res.redirect("http://localhost:5173/user");
   }
);
// Auth routes
////router.post("/register", AuthController.register);
//router.post("/login", AuthController.login);

// Google OAuth
//router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
//router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthController.googleCallback);

export default router;