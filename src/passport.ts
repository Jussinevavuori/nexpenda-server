import * as passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { ENV } from "./env";
import { Schemas } from "./lib/schemas/Schemas";
import { prisma } from "./server";

/**
 * Passport serializer: serialize any object with a non-empty, string ID
 * field by its ID. Assume the object to be a user. If no ID field is found,
 * provide error.
 */
passport.serializeUser(async (unknownUser, done) => {
  try {
    const user = Schemas.Auth.id.parse(unknownUser);
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

/**
 * Passport deserializer. Ensure the id is a valid string and attempt to find
 * a user with that id. If found ,return them. Handle errors and situations
 * where a user is not found or the id is not a valid string.
 */
passport.deserializeUser(async (id, done) => {
  try {
    if (id && typeof id === "string") {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } else {
      done(null, null);
    }
  } catch (e) {
    done(e, null);
  }
});

/**
 * Google strategy
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.google.clientId,
      clientSecret: ENV.google.clientSecret,
      callbackURL: `${ENV.hosts.server}/api/auth/google/callback`,
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

        // Must contain an email
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
