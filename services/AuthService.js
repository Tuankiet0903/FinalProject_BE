import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import ENV from "../config/config.js";

class AuthService {
   /**
    * Đăng nhập và trả về token.
    */
   static async login(email, password) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
         throw new Error("Email hoặc mật khẩu không đúng!");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         throw new Error("Email hoặc mật khẩu không đúng!");
      }

      const token = jwt.sign(
         { userId: user.userId, email: user.email },
         ENV.JWT_SECRET,
         { expiresIn: ENV.JWT_EXPIRES_IN }
      );

      return { token, user };
   }

   /**
    * Đăng ký người dùng mới.
    */
   static async register(data) {
      const { email, password, fullName } = data;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         throw new Error("Email đã được sử dụng!");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, fullName });

      const token = jwt.sign(
         { userId: user.userId, email: user.email },
         ENV.JWT_SECRET,
         { expiresIn: ENV.JWT_EXPIRES_IN }
      );

      return { token, user };
   }
}

export default AuthService;
