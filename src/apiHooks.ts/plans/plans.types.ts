export type PlanFeatureType = [
  {
    feature_key: string;
    feature_value: string;
  },
];

export type PlanType = "RETAIL" | "HYBRID" | "ECOMMERCE" | "MANUFACTURING";

export interface OiPlanType {
  id: string;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  type: PlanType;

  stripe_price_monthly_id: string | null;
  stripe_price_yearly_id: string | null;

  package_name: string;
  monthly_price: string;
  monthly_discount: string | null;
  yearly_price: string;
  yearly_discount: string | null;
  currency: string;
  free_trial_days: number;
  is_active: boolean;

  // Example flags (you have MANY)
  show_people: boolean | null;
  show_users: boolean | null;
  no_of_users: string | null;

  show_customers: boolean | null;
  no_of_customers: string | null;

  show_suppliers: boolean | null;
  no_of_suppliers: string | null;

  show_stores: boolean | null;
  no_of_stores: string | null;

  show_warehouses: boolean | null;
  no_of_warehouses: string | null;

  show_products: boolean | null;
  no_of_products: string | null;

  show_pos: boolean | null;
  no_of_pos: string | null;

  show_online_store: boolean | null;
  no_of_online_store: string | null;

  show_manufacturing: boolean | null;

  owner: any | null;
  admin: any | null;

  packageAddOns: packageAddOnsType[];
}

export interface OgPlansResponse {
  data: {
    data: OiPlanType[];
  };
  message?: string;
  success: boolean;
}

export interface packageAddOnsType {
  id: string;
  packageId: string;
  addOnId: string;
  addOn: {
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
    is_active: boolean;
    is_quantity_allowed: boolean;
  };
}
