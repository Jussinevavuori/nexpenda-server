import { User } from "@prisma/client";

export function getPublicProfile(user: User) {
  return {
    id: user.id,
    displayName: user.displayName ?? undefined,
    photoUrl: user.photoUrl ?? undefined,
    email: user.email ?? undefined,
    googleId: user.googleId ?? undefined,
  };
}
