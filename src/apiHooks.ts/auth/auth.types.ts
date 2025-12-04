export interface signinData {
  email: string;
  password: string;
  rememberMe: string;
  client_id?: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
  nonce?: string;
  code_challenge?: string;
  response_type?: string;
  code_challenge_method?: string;
}
export interface signUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
}
export interface userProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  contact?: string | null;
  email?:string,
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
}