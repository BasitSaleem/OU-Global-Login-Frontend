import { z } from "zod";

export const checkoutSchema = z
  .object({
    country: z.string().min(1, "Country is required"),
    billing_city: z.string().optional(),
    billing_state: z.string().optional(),
    billing_postal_code: z.string().optional(),
    billing_address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.country === "US") {
      if (!data.billing_city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing city is required",
          path: ["billing_city"],
        });
      }
      if (!data.billing_state?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing state is required",
          path: ["billing_state"],
        });
      }
      if (!data.billing_postal_code?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing postal code is required",
          path: ["billing_postal_code"],
        });
      }
      if (!data.billing_address?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing address is required",
          path: ["billing_address"],
        });
      }
    }
  });
