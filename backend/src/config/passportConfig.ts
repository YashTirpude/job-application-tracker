import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User";
import cloudinary from "./cloudinaryConfig";

dotenv.config();

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_CALLBACK_URL
) {
  throw new Error("Missing Google OAuth environment variables");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const uploadedImage = await cloudinary.uploader.upload(
            profile.photos?.[0].value || "",
            { folder: "job_tracker_users" }
          );

          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0].value,
            photo: uploadedImage.secure_url,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as any, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
