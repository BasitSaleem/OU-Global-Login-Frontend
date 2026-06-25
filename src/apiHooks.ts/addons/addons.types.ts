export interface OgAddOnsResponse {
  data: {
    data: AddOnType[];
  };
  message?: string;
  success: boolean;
}

export interface AddOnType {
  id: string;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  name: string;
  description: string;
  stripe_product_id: string;
  stripe_price_monthly_id: string;
  stripe_price_yearly_id: string;
  monthly_price: string;
  yearly_price: string;
  currency: string;
  monthly_discount: string | null;
  yearly_discount: string | null;
  discounted_yearly_price: string | null;
  is_active: boolean;
  is_quantity_allowed: boolean;
}
