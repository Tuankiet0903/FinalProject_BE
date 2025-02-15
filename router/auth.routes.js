import express from "express";
import AuthController from "../controller/AuthController.js";
import passport from "../config/passport.js";

const router = express.Router();

// Auth routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthController.googleCallback);

export default router;
