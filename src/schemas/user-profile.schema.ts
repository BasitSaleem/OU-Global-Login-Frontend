import { z } from "zod";

const userProfileSchema = z.object({
  profile_url: z.string().nullable().optional(),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email address"),
  contact: z.string().nullable().optional(),
  street_address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip_code: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  tax_vat_number: z.string().nullable().optional(),
  emergency_contact_name: z.string().nullable().optional(),
  emergency_contact_no: z.string().nullable().optional(),
});

export default userProfileSchema;
