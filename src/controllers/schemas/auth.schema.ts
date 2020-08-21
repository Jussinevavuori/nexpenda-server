import { object, string, InferType } from "yup";

export const authSchema = object({
  email: string().defined().required().email().max(255),
  password: string().defined().required().min(5).max(255),
})
  .defined()
  .required();

export type AuthSchema = InferType<typeof authSchema>;
