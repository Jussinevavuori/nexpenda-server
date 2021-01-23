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
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } else {
      done(null, null);
    }
  } catch (e) {
    done(e, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: conf.google.clientId,
      clientSecret: conf.google.clientSecret,
      callbackURL: `${conf.hosts.server}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Extract profile details
        const googleId = profile.id;
        const email =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : undefined;
        const photoUrl =
          profile.photos && profile.photos[0]
            ? profile.photos[0].value
            : undefined;

        if (!email) {
          throw Error("Email not found in Google profile");
        }

        // Seek existing user by email
        const existingUser = await prisma.user.findUnique({ where: { email } });

        // Existing user found: update missing fields and return
        if (existingUser) {
          let user = existingUser;

          // Update Google ID if none set
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId },
            });
          }

          // Update photo URL if none set
          if (!user.photoUrl) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { photoUrl },
            });
          }

          // Update display name if none or default set
          if (!user.displayName || user.displayName === email) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { displayName: profile.displayName },
            });
          }

          // Return existing user
          done(null, user);
        } else {
          // Create user if existing user not found.
          const createdUser = await prisma.user.create({
            data: {
              displayName: profile.displayName,
              googleId: profile.id,
              email,
              photoUrl,
              emailVerified: true,
              tokenVersion: 1,
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
