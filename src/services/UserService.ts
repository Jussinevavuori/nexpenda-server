import { User } from "@prisma/client";

export class UserService {
  static getPublicProfileDetails(user: User) {
    return {
      id: user.id,
      displayName: user.displayName ?? undefined,
      photoUrl: user.photoUrl ?? undefined,
      email: user.email ?? undefined,
      googleId: user.googleId ?? undefined,
      prefersColorScheme: user.prefersColorScheme ?? undefined,
      isAdmin: user.isAdmin,
    };
  }
}
