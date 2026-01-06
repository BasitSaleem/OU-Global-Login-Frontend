import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  rememberMe: z.boolean().optional(),
});
export const signUpSchema = z
  .object({
    first_name: z.string().min(3, "First name must be at least 3 characters long").nonempty("First name is required"),
    last_name: z.string().min(3, "Last name must be at least 3 characters long").nonempty("Last name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long").nonempty("Password is required"),
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