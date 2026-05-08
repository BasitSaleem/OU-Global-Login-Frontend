import { PaymentType } from "../subscription/subscription.types";

export interface GetOrganizationInvoicesResponse {
  statusCode: number;
  data: {
    invoices: Invoice[];
    meta: PaginationMeta;
  };
  message: string;
  success: boolean;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id: string;
  payment_id: string | null;
  invoice_number: string;
  amount: number;
  currency: string;
  payment_method_id: string | null;
  status: "PAID" | "PENDING" | "FAILED" | "DRAFT";
  billing_period_start: string;
  billing_period_end: string;
  provider_invoice_id: string;
  invoice_pdf_url: string;
  metadata: InvoiceMetadata;
  created_at: string;
  payment: PaymentType;
  subscription: {
    current_period_end: string;
    current_period_start: string;
    billing_cycle: "MONTHLY" | "YEARLY";
    oiPackage: {
      package_name: string;
      monthly_price: string;
      yearly_price: string;
      discounted_yearly_price: string;
      yearly_discount: string;
    };
  };
}

export interface InvoiceMetadata {
  addOns: AddOn[];
  midCycleAddons?: AddOn[];
  packageId: string;
  packageName: string;
  customerName?: string;
  customerEmail?: string;
  stripe_invoice_id: string;
  stripe_customer_id: string;
}

export interface AddOn {
  id: string;
  name: string;
  quantity: number;
  price: string;
  currency: string;
}

export interface PaginationMeta {
  totalCount: number;
  skip: number;
  take: number;
  hasMore: boolean;
  page: number;
  limit: number;
}
