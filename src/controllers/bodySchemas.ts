import * as yup from "yup";

export const schemas = {
  authSchema: yup
    .object({
      email: yup
        .string()
        .defined()
        .required("Please enter an email address")
        .email("The email you have entered is invalid")
        .max(255, "The email you have entered is too long"),
      password: yup
        .string()
        .defined()
        .required("No password defined")
        .min(5, "Password is too short")
        .max(255, "Password is too long"),
    })
    .defined()
    .required(),
};
