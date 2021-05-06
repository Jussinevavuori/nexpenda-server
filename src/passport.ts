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
    async (_accessToken, _refreshToken, googleProfile, done) => {
      try {
        // Extract profile details
        const googleId = googleProfile.id;
        const email =
          googleProfile.emails && googleProfile.emails[0]
            ? googleProfile.emails[0].value
            : undefined;
        const photoUrl =
          googleProfile.photos && googleProfile.photos[0]
            ? googleProfile.photos[0].value
            : undefined;

        if (!email) {
          throw Error("Email not found in Google profile");
        }

        // Seek existing user by email
        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { Profile: true },
        });

        // Existing user found: update missing fields and return
        if (existingUser) {
          let user = existingUser;
          let profile = existingUser.Profile;

          // Update Google ID if none set
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId },
              include: { Profile: true },
            });
          }

          // Create profile if missing
          if (!profile) {
            profile = await prisma.profile.create({
              data: {
                displayName: googleProfile.displayName,
                photoUrl,
                User: { connect: { id: user.id } },
              },
            });
          }

          // Update photo URL if none set
          if (!user.Profile?.photoUrl) {
            profile = await prisma.profile.update({
              where: { uid: user.id },
              data: { photoUrl },
            });
          }

          // Update display name if none or default set
          if (!profile.displayName || profile.displayName === email) {
            profile = await prisma.profile.update({
              where: { uid: user.id },
              data: { photoUrl },
            });
          }

          // Return existing user
          done(null, { ...user, Profile: profile });
        } else {
          // Create user and profile if existing user not found.
          const createdUser = await prisma.user.create({
            data: {
              googleId: googleProfile.id,
              email,
              emailVerified: true,
              tokenVersion: 1,
              Profile: {
                create: {
                  displayName: googleProfile.displayName,
                  photoUrl,
                },
              },
            },
            include: { Profile: true },
          });

          // Return created user
          done(null, createdUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
