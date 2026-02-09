import { z } from "zod";

export const passwordValidation = (label = "Password") =>
  z.
    string()
    .min(8, `${label} must be at least 8 characters long`)
    .regex(/[A-Z]/, `${label} must contain at least one uppercase letter`)
    .regex(/[a-z]/, `${label} must contain at least one lowercase letter`)
    .regex(/[0-9]/, `${label} must contain at least one number`)
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      `${label} must contain at least one symbol`,
    )
    .nonempty();
