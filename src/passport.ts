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
      const existingUser = await prisma.user.findUnique({
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

        // Existing user found:
        if (existingUser) {
          // Check which fields should be updated
          const shouldUpdate = {
            googleId: !existingUser.googleId,
            photoUrl: !existingUser.photoUrl,
            displayName: existingUser.displayName === existingUser.email,
          };

          // If there were any updatable properties, update them
          const shouldUpdateAny = Object.values(shouldUpdate).some(Boolean);
          if (shouldUpdateAny) {
            prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: shouldUpdate.googleId ? googleId : undefined,
                displayName: shouldUpdate.displayName
                  ? profile.displayName
                  : undefined,
                photoUrl: shouldUpdate.photoUrl ? photoUrl : undefined,
              },
            });
          }

          // Return existing user
          done(null, existingUser);
        } else {
          // Create user if existing user not found.
          const createdUser = await prisma.user.create({
            data: {
              displayName: profile.displayName,
              googleId: profile.id,
              email,
              photoUrl,
              emailVerified: true,
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
