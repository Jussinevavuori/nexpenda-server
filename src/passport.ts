import * as passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { User } from "./entity/user.entity";
import { conf } from "./conf";

passport.serializeUser(async (user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const existingUser = await User.findOne(String(id));
    done(null, existingUser);
  } catch (e) {
    done(e, undefined);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: conf.google.clientId,
      clientSecret: conf.google.clientSecret,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          where: { googleId: profile.id },
        });
        if (existingUser) {
          done(null, existingUser);
        } else {
          const createdUser = await User.fromGoogleProfile(profile).save();
          done(null, createdUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
