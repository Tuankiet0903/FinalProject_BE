import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/User.js";
import { Op } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const BE_URL = process.env.BE_URL;

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_CALLBACK_URL || `${BE_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            const { id: googleId, displayName: fullName, emails, photos } = profile;
            const email = emails && emails[0]?.value;
            const avatar = photos && photos[0]?.value;

            // 🔥 Tìm user theo Google ID hoặc email
            let user = await User.findOne({
               where: {
                  [Op.or]: [{ googleId }, { email }],
               },
            });

            if (user) {
               // 🔥 Nếu user đã tồn tại, CẬP NHẬT DỮ LIỆU từ Google
               user.fullName = fullName || user.fullName; // Chỉ cập nhật nếu fullName có giá trị
               user.avatar = avatar || user.avatar; // Chỉ cập nhật nếu avatar có giá trị
               user.googleId = googleId; // Đảm bảo Google ID được lưu
               user.active = true; // Đảm bảo tài khoản được kích hoạt
               await user.save();
            } else {
               // 🔥 Nếu user chưa tồn tại, tạo mới
               user = await User.create({
                  fullName,
                  email,
                  googleId,
                  avatar,
                  password: "", // Không cần mật khẩu
                  active: true,
               });
            }

            if (user.isBlocked) {
               return done(null, false, { message: "Tài khoản của bạn đã bị khóa." });
            }

            done(null, user);
         } catch (error) {
            done(error, null);
         }
      }
   )
);

// ✅ Serialize & Deserialize User
passport.serializeUser((user, done) => {
   done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findByPk(id);
      done(null, user);
   } catch (error) {
      done(error, null);
   }
});

export default passport;
