import { object, string, InferType } from "yup";

export const forgotPasswordSchema = object({
  email: string().defined().required().email().max(255),
})
  .defined()
  .required();

export type AuthSchema = InferType<typeof forgotPasswordSchema>;
