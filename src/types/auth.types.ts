import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  contact?: string | null;
  email: string;
  profile_url?: string;
  password?: string | null;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  tax_vat_number?: string | null;
  emergency_contact_no?: string | null;
  emergency_contact_name?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  role_id?: string | null;
  oiDataCenterId?: string | null;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
  organizations?: {
    id: string;
    name: string;
  }[];
  memberships?: {
    id: string;
    org_id: string;
    role: string;
    organization: {
      id: string;
      name: string;
    };
  }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  termsAccepted: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
  refreshToken?: string | null;
  organization: OgOrganization|null
}

export enum UserRole {
  ADMIN = "admin",
  OWNER = "owner",
  MANAGER = "manager",
  USER = "user",
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}
