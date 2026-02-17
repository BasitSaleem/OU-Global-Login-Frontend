import z from "zod";
import { passwordValidation } from "./password.schema";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  rememberMe: z.boolean().optional(),
});
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required"),
});
export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .nonempty("First name is required"),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .nonempty("Last name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please enter a valid email address."),
    password: passwordValidation("Password"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
    rememberMe: z.boolean().optional(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
export const resetPasswordSchema = z
  .object({
    token: z.string().nonempty("Token is required"),
    newPassword: passwordValidation("New Password"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: passwordValidation("Old Password"),
    newPassword: passwordValidation("New Password"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  // new password must be different from old password
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  })
  // new password and confirm password must match
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changeEmailSchema = z
  .object({
    oldEmail: z
      .string()
      .email("Please enter a valid email address.")
      .nonempty("Old email is required"),
    newEmail: z
      .string()
      .email("Please enter a valid email address.")
      .nonempty("New email is required"),
    confirmEmail: z
      .string()
      .email("Please enter a valid email address.")
      .nonempty("Confirm email is required"),
  })
  // Check that newEmail matches confirmEmail
  .refine((data) => data.newEmail === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  })
  // Check that newEmail is not the same as oldEmail
  .refine((data) => data.newEmail !== data.oldEmail, {
    message: "New email cannot be the same as old email",
    path: ["newEmail"],
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type ChangeEmailSchemaType = z.infer<typeof changeEmailSchema>;
