import express from "express";
import AuthController from "../controller/AuthController.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Đăng ký & Đăng nhập bằng Email
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Google OAuth - Đăng nhập với Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }), AuthController.googleCallback);

// Đăng xuất
router.get("/logout", AuthController.logout);

export default router;
