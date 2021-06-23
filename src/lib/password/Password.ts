import * as bcrypt from "bcryptjs";

/**
 * The password class contains methods for hashing and validating passwords.
 */
export class Password {
  /**
   * Hashes a password.
   */
  static hash(password: string) {
    return bcrypt.hash(password, 12);
  }

  /**
   * Validates the hashed password.
   */
  static validate(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
