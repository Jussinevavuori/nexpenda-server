import * as bcrypt from "bcryptjs";

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function validatePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export const passwordService = { hashPassword, validatePassword };
