export interface OgBillingInfo {
  id: string;
  country: string;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetOgBillingInfoResponse {
  data: OgBillingInfo;
  message?: string;
  success: boolean;
}
