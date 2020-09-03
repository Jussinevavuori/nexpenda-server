import { object, string, InferType } from "yup";

export const emailOnlyAuthSchema = object({
  email: string().required().email().max(255),
}).required();

export const passwordOnlyAuthSchema = object({
  password: string().required().min(5).max(255),
}).required();

export const authSchema = object({
  email: string().required().email().max(255),
  password: string().required().min(5).max(255),
}).required();

export type EmailOnlyAuthSchema = InferType<typeof emailOnlyAuthSchema>;

export type PasswordOnlyAuthSchema = InferType<typeof passwordOnlyAuthSchema>;

export type AuthSchema = InferType<typeof authSchema>;
