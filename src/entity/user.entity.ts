import { Profile as GoogleProfile } from "passport-google-oauth";
// import * as bcrypt from "bcryptjs";
// import * as yup from "yup";
import { prisma } from "../server";

export function createUserFromEmailPassword(form: {
  email: string;
  password: string;
}) {
  return prisma.user.create({
    data: {
      email: form.email,
      password: form.password,
      displayName: form.email,
    },
  });
}

type UserConstructable = {
  id: string;
  displayName?: string | undefined | null;
  email?: string | undefined | null;
  googleId?: string | undefined | null;
  photoUrl?: string | undefined | null;
};

// class User {
//   /**
//    * Validating a password
//    */
//   async validatePassword(password: string) {
//     if (!this.password) return false;
//     return bcrypt.compare(password, this.password);
//   }

//   /**
//    * Converting a user to a user constructable for sending to the client.
//    * Hides sensitive information, such as the password
//    */
//   toConstructable() {
//     return {
//       id: this.id,
//       displayName: this.displayName,
//       email: this.email,
//       googleId: this.googleId,
//       photoUrl: this.photoUrl,
//     };
//   }

//   /**
//    * Constructable schema
//    */
//   static constructableSchema: yup.ObjectSchema<UserConstructable> = yup
//     .object({
//       id: yup.string().defined().required(),
//       displayName: yup.string().optional().nullable(),
//       email: yup.string().optional().nullable(),
//       googleId: yup.string().optional().nullable(),
//       photoUrl: yup.string().optional().nullable(),
//     })
//     .defined();

//   /**
//    * Constructable validator
//    */
//   static isUserConstructable(arg: any): arg is UserConstructable {
//     return this.constructableSchema.isValidSync(arg) && !Array.isArray(arg);
//   }

//   static createFromEmailPassword(form: { email: string; password: string }) {
//     return prisma.user.create({
//       data: {
//         email: form.email,
//         password: form.password,
//         displayName: form.email,
//       },
//     });
//   }

//   /**
//    * Generating a new user from a Google profile
//    */
//   static createFromGoogleProfile(profile: Profile) {
//     const email =
//       profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;

//     const photoUrl =
//       profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;

//     return prisma.user.create({
//       data: {
//         displayName: profile.displayName,
//         googleId: profile.id,
//         email,
//         photoUrl,
//       },
//     });
//   }
// }
