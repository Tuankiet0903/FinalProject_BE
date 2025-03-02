import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import { Op } from "sequelize";
import { sendOtpService } from "./OTPService.js";

class AuthService {
   static async login(email, password) {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("Email hoặc mật khẩu không đúng!");
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new Error("Email hoặc mật khẩu không đúng!");
      const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return { token, user };
   }

   static async register(data) {
      const { email, password, fullName } = data;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new Error("Email đã được sử dụng!");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, fullName, active: false });
      await sendOtpService(email)
      // const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return { user };
   }

   static async googleLogin(data) {
      const { email, fullName, googleId, avatar } = data;
      let user = await User.findOne({ where: { [Op.or]: [{ googleId }, { email }] } });
      if (!user) user = await User.create({ fullName, email, googleId, avatar, password: "", active: true });
      if (user.isBlocked) throw new Error("Tài khoản của bạn đã bị khóa.");
      return user;
   }
}

export default AuthService;
