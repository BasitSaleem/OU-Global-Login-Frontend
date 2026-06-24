export type PlanFeatureType = [
  {
    feature_key: string;
    feature_value: string;
  },
];

export type PlanType = "RETAIL" | "HYBRID" | "ECOMMERCE" | "MANUFACTURING";

export interface OiPlanType {
  id: string;
  created_at: string;
  updated_at: string;

  // Updated Feilds
  package_name: string;
  monthly_price: string;
  type: PlanType;
  stripe_price_monthly_id: string;
  stripe_price_yearly_id: string;
  stripe_product_id: string;
  discounted_yearly_price: string | null;

  free_trial: boolean;
  free_trial_days: number;

  monthly_discount: string;
  yearly_price: string;
  yearly_discount: string;
  currency: string;
  is_active: boolean;

  show_people: boolean;
  show_users: boolean;
  no_of_users: string | null;
  show_customers: boolean;
  no_of_customers: string | null;
  show_suppliers: boolean;
  no_of_suppliers: string | null;

  // Human Resource
  show_human_resource: boolean;
  show_employees: boolean;
  no_of_employees: string | null;

  show_departments: boolean;
  no_of_departments: string | null;
  show_designations: boolean;
  no_of_designations: string | null;
  show_payslips: boolean;
  no_of_payslips: string | null;

  show_resturants: boolean;
  show_floors: boolean;
  no_of_floors: string | null;
  show_tables: boolean;
  no_of_tables: string | null;
  show_decorations: boolean;
  no_of_decorations: string | null;
  show_product: boolean;
  show_products: boolean;
  no_of_products: string | null;
  show_categories: boolean;
  no_of_categories: string | null;
  show_brands: boolean;
  no_of_brands: string | null;
  show_barcode_tracking: boolean;
  no_of_barcode_tracking: string | null;
  no_of_product_images: string | null;
  show_product_images: boolean;
  show_bulk_product_import: boolean;
  no_of_bulk_product_import: string | null;
  show_bulk_price_updates: boolean;
  no_of_bulk_price_updates: string | null;
  show_sales_and_orders: boolean;
  show_pos: boolean;
  no_of_pos: string | null;

  show_invoices: boolean;
  no_of_invoices: string | null;
  show_quotations: boolean;
  no_of_quotations: string | null;
  show_sale_orders: boolean;
  no_of_sale_orders: string | null;
  show_sale_returns: boolean;
  no_of_sale_returns: string | null;
  show_hold_sale: boolean;
  no_of_hold_sale: string | null;
  show_sample_sale: boolean;
  no_of_sample_sale: string | null;
  show_purchases: boolean;
  show_purchase_order: boolean;
  no_of_purchase_order: string | null;
  show_bulk_purchase: boolean;
  no_of_bulk_purchase: string | null;
  show_inventory_operation: boolean;
  show_transfers: boolean;
  no_of_transfers: string | null;
  show_stock_issuing: boolean;
  no_of_stock_issuing: string | null;
  show_stock_receiving: boolean;
  no_of_stock_receiving: string | null;
  show_stock_adjustments: boolean;
  no_of_stock_adjustments: string | null;
  show_bulk_import_stocks: boolean;
  no_of_bulk_import_stocks: string | null;

  // Ecommerce
  show_ecommerce: boolean;
  show_campaigns: boolean;
  no_of_campaigns: string | null;
  show_collections: boolean;
  no_of_collections: string | null;

  show_themes: boolean;
  no_of_themes: string | null;
  show_orders: boolean;
  no_of_orders: string | null;
  show_discount: boolean;
  no_of_discount: string | null;
  show_domains: boolean;
  no_of_domains: string | null;
  show_marketing: boolean;
  show_coupons: boolean;
  no_of_coupons: string | null;
  show_loyalty: boolean;
  no_of_loyalty: string | null;

  show_manufacturing: boolean;
  show_moulds: boolean;
  no_of_moulds: string | null;
  show_quality_and_inspections: boolean;
  no_of_quality_and_inspections: string | null;

  show_production_orders: boolean;
  no_of_production_orders: string | null;
  show_machines: boolean;
  no_of_machines: string | null;
  show_accounting_and_financial: boolean;
  show_expenses: boolean;
  no_of_expenses: string | null;
  show_billing_payments: boolean;
  no_of_billing_payments: string | null;
  show_payable_receivables: boolean;
  no_of_payable_receivables: string | null;
  show_financial_reports: boolean;
  no_of_financial_reports: string | null;
  show_balance_sheet: boolean;
  no_of_balance_sheet: string | null;
  show_chart_of_accounts: boolean;
  no_of_chart_of_accounts: string | null;
  show_journal_entry_reports: boolean;
  no_of_journal_entry_reports: string | null;
  show_assets: boolean;
  no_of_assets: string | null;

  // Analytics
  show_analytics: boolean;
  show_manufacturing_reports: boolean;
  show_sale_reports: boolean;
  show_purchase_reports: boolean;
  show_inventory_reports: boolean;
  show_shift_reports: boolean;
  show_commission_reports: boolean;

  // Reports
  show_standard_reports: boolean;
  no_of_standard_reports: string | null;

  show_cash_reports: boolean;
  no_of_cash_reports: string | null;
  show_advance_reports: boolean;
  no_of_advance_reports: string | null;
  show_general_tools: boolean;
  show_roles: boolean;
  no_of_roles: string | null;
  show_notifications: boolean;
  no_of_notifications: string | null;
  show_stock_alerts: boolean;
  no_of_stock_alerts: string | null;
  show_activity_logs: boolean;
  no_of_activity_logs: string | null;
  show_automations: boolean;
  no_of_automations: string | null;

  // Integrations
  show_integrations: boolean;
  show_fbr: boolean;

  // Facilities
  show_facilities: boolean;
  show_stores: boolean;
  no_of_stores: string | null;
  show_warehouses: boolean;
  no_of_warehouses: string | null;
  show_pos_terminal: boolean;
  no_of_pos_terminal: string | null;
  show_online_store: boolean;
  no_of_online_store: string | null;
  show_production_floor: boolean;
  no_of_production_floor: string | null;

  // API Calls
  show_api_call: boolean;
  no_of_api_call: string | null;
  show_stripe: boolean;
  no_of_stripe: string | null;
  show_paypal: boolean;
  no_of_paypal: string | null;
  show_dhl: boolean;
  no_of_dhl: string | null;
  show_leopard: boolean;
  no_of_leopard: string | null;
  show_zapier: boolean;
  no_of_zapier: string | null;
  show_make: boolean;
  no_of_make: string | null;
  show_support: boolean;
  show_onboarding_support: boolean;
  no_of_onboarding_support: string | null;
  show_email_support: boolean;
  no_of_email_support: string | null;
  show_live_chat_support: boolean;
  no_of_live_chat_support: string | null;
  show_phone_support: boolean;
  no_of_phone_support: string | null;
  show_dedicated_account_manager: boolean;
  no_of_dedicated_account_manager: string | null;

  owner: any | null;
  admin: any | null;
  member: any | null;

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
    monthly_discount: string | null;
    yearly_discount: string | null;
    discounted_yearly_price: string | null;
    is_active: boolean;
    is_quantity_allowed: boolean;
  };
}
