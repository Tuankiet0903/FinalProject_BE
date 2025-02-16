import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../model/User.js";
import { Op } from "sequelize";

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",

      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            const { id: googleId, displayName: fullName, emails, photos } = profile;
            const email = emails && emails[0]?.value;
            const avatar = photos && photos[0]?.value;

            // Tìm người dùng theo Google ID hoặc email
            let user = await User.findOne({
               where: {
                  [Op.or]: [{ googleId }, { email }],
               },
            });

            if (!user) {
               user = await User.create({
                  fullName,
                  email,
                  googleId,
                  avatar,
                  password: "",
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

passport.use(
   new GitHubStrategy(
      {
         clientID: process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET,
         callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            const { id: githubId, username, displayName, emails, photos } = profile;

            // Lấy email nếu có
            let email = emails && emails.length > 0 ? emails[0].value : null;

            // Nếu email không có, sử dụng API của GitHub để lấy email
            if (!email) {
               const emailResponse = await fetch("https://api.github.com/user/emails", {
                  headers: {
                     Authorization: `Bearer ${accessToken}`,
                  },
               });
               const emailData = await emailResponse.json();
               const primaryEmail = emailData.find((e) => e.primary && e.verified);
               email = primaryEmail ? primaryEmail.email : null; // Dùng email giả nếu không có email hợp lệ
            }
            const avatar = photos && photos[0]?.value;
            const fullName = displayName || username;

            // Tìm người dùng theo GitHub ID hoặc email
            let user = await User.findOne({
               where: {
                  [Op.or]: [{ githubId }, { email }],
               },
            });

            if (!user) {
               user = await User.create({
                  fullName,
                  email: email, // Nếu email không có, dùng email giả
                  githubId,
                  avatar,
                  password: "", // Không sử dụng mật khẩu cho GitHub login
                  active: true,
               });
            }

            if (user.isBlocked) {
               return done(null, false, { message: "Tài khoản của bạn đã bị khóa." });
            }

            done(null, user);
         } catch (error) {
            console.error("GitHub Strategy Error:", error);
            done(error, null);
         }
      }
   )
);

// Serialize and deserialize user
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
