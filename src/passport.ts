import * as passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { conf } from "./conf";
import { prisma } from "./server";

passport.serializeUser(async (user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (typeof id === "string") {
      const existingUser = await prisma.user.findOne({
        where: { id },
      });
      done(null, existingUser);
    } else {
      done(null, undefined);
    }
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
        const existingUser = await prisma.user.findOne({
          where: { googleId: profile.id },
        });

        if (existingUser) {
          done(null, existingUser);
        } else {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : undefined;

          const photoUrl =
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : undefined;

          const createdUser = await prisma.user.create({
            data: {
              displayName: profile.displayName,
              googleId: profile.id,
              email,
              photoUrl,
            },
          });
          done(null, createdUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
