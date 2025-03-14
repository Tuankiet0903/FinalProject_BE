import express from "express";
import { sendOtp, verifyOtp } from "../controller/OTPController.js";


const router = express.Router();

// router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp)
router.post("/resend-otp", sendOtp)

export default router;
