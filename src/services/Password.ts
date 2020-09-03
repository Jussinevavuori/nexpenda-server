import * as bcrypt from "bcryptjs";

export class Password {
  constructor() {}

  static hash(password: string) {
    return bcrypt.hash(password, 12);
  }

  static validate(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
