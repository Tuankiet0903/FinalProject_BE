import { sendOtpService, verifyOtpService } from "../services/OTPService.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await sendOtpService(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const response = await verifyOtpService(email, otpCode);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
