import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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