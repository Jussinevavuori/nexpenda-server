import { User } from "@prisma/client";

export class UserService {
  public readonly user: User;

  constructor(user: User) {
    this.user = user;
  }

  public getPublicProfileDetails() {
    return {
      id: this.user.id,
      displayName: this.user.displayName ?? undefined,
      photoUrl: this.user.photoUrl ?? undefined,
      email: this.user.email ?? undefined,
      googleId: this.user.googleId ?? undefined,
    };
  }
}
