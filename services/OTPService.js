import { Op } from "sequelize";
import nodemailer from "nodemailer";
import Otp from "../model/OTP.js";
import User from "../model/User.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOtpEmail = async (email, otpCode) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otpCode}. It expires in 5 minutes.`,
    html: HTMLTemplate(otpCode),
  });
};

export const sendOtpService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.destroy({ where: { userId: user.userId } });

  await Otp.create({ userId: user.userId, otpCode, expiresAt });

  await sendOtpEmail(email, otpCode);

  return { message: "OTP sent successfully" };
};

export const verifyOtpService = async (email, otpCode) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const otpRecord = await Otp.findOne({
    where: {
      userId: user.userId,
      otpCode,
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!otpRecord) throw new Error("Invalid or expired OTP");

  await Otp.destroy({ where: { userId: user.userId } });

  await User.update(
    { active: true },
    {
      where: {
        userId: user.userId,
      },
    }
  );

  return { message: "OTP verified successfully" };
};

const HTMLTemplate = (otpCode) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
">
  <div style="
    max-width: 560px;
    margin: 0 auto;
    padding: 40px 20px;
  ">
    <h1 style="
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin: 30px 0;
      padding: 0;
    ">Verification Code</h1>
    
    <p style="
      color: #333333;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      margin: 20px 0;
    ">Here is your one-time verification code:</p>

    <div style="
      background: #f4f4f4;
      border-radius: 5px;
      margin: 20px 0;
      padding: 20px;
    ">
      <div style="
        color: #000000;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        text-align: center;
        margin: 0;
      ">${otpCode}</div>
    </div>
    
    <p style="
      color: #333333;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      margin: 20px 0;
    ">This code will expire in 5 minutes for security purposes.</p>
    
    <p style="
      color: #666666;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      margin-top: 30px;
    ">If you didn't request this code, please ignore this email.</p>
  </div>
</body>
</html>
`;
