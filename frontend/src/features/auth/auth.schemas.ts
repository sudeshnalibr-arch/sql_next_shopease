import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),

  password: yup
    .string()
    .required("Password is required."),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .required("Name is required."),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(150)
    .required("Email is required."),

  password: yup
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(72, "Password cannot exceed 72 characters.")
    .required("Password is required."),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
});

export const resetPasswordSchema = yup.object({
  token: yup.string().required("Reset token is required."),

  password: yup
    .string()
    .min(8)
    .max(72)
    .required("Password is required."),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Please confirm your password."),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormValues = yup.InferType<
  typeof forgotPasswordSchema
>;
export type ResetPasswordFormValues = yup.InferType<
  typeof resetPasswordSchema
>;