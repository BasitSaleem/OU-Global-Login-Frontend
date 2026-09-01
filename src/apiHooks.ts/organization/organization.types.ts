import { Permission } from "@/types/common";
import { OgOrgMembership } from "../membership/membership.types";
import { PaymentType } from "../subscription/subscription.types";
import { Invoice } from "../invoice/invoice.types";

export type products = "OI" | "OG" | "OA" | "OJ";
export interface Organization {
  name: string;
  product: products;
  subDomainName: string;
  subscriptions: Subscription[];
  [key: string]: any;
}

export type Subscription = {
  id: string;
  billing_cycle: "MONTHLY" | "YEARLY";
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  status:
    | "TRIAL"
    | "ACTIVE"
    | "CANCELLED"
    | "PAST_DUE"
    | "EXPIRED"
    | "INCOMPLETE";
  payment_method: string | null;
  oiPackage: Package;
  payments: PaymentType[];
  invoices: Invoice[];
};

export type Package = {
  tier_level: number;
  id: string;
  package_name: string;
  currency: string;
  free_trial_days: number;
  monthly_price: string;
  yearly_price: string;
  discounted_yearly_price: string;
};
export interface CreateOrganizationData {
  name: string;
  packageId: string | null;
  // Owners Pulse (OP) uses its own package table + billing; it takes
  // opPackageId instead of packageId and has no subdomain. A services order
  // instead passes serviceIds (+ optional Domination upgrade) and is paid via
  // the buy-services endpoint after creation.
  opPackageId?: string | null;
  serviceIds?: string[];
  dominationUpgrade?: boolean;
  // The verified Stripe (OP account) invoice id for a services order's setup
  // fee (see POST /og/op/verify-invoice) — required when serviceIds is set.
  invoiceId?: string;
  billingCycle?: "Monthly" | "Yearly";
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  subDomainName?: string;
  companyUrl?: string;
  companyName?: string;
  packageName?: string;
  formPackage?: string;
  plan?: string;
  remarks?: string;
  isSendCredentialsEmail?: boolean;
  dataCenterId?: string;
  status?: string;
  product?: string[];
}

export interface UpdateOrganizationData {
  name?: string;
  address?: string;
  [key: string]: any;
}

// Match your Prisma enum
export enum OrgStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
}

export interface OgOrganization {
  id: string;
  status?: "ACTIVE" | "PENDING" | "BLOCKED" | "SUSPENDED";
  name?: string;
  isAddNew?: boolean;
  remarks?: string | null;
  created_at?: string;
  memberships?: OgOrgMembership[];
  updated_at?: string; // Made optional to support "Add New" items
  is_blocked?: boolean; // Made optional to support "Add New" items

  favorites?: {
    userId: string;
    organizationId: string;
  }[];
  _count?: {
    memberships: any;
  };
  ogUserId?: string;
  products?: OgProduct[];
  membersCount?: number;
  permissionNames?: Permission[];
  packageName?: string;
  subscriptions: Subscription[];
}

export interface OgProduct {
  id: string;
  organization_id: string;
  product_name?: string;
  oi_sub_domain?: string;
  is_blocked?: boolean;
  provisioning_status?: string;
  external_tenant_ref?: string;
  plan?: string;
  seats?: number;
}

export interface OgOrgResponse {
  data: {
    organizations: OgOrganization[];
    meta: {
      totalCount: number;
      hasMore: boolean;
    };
  };
  message?: string;
  success: boolean;
}
export interface OgOrgDetailResponse {
  data: {
    organization: OgOrganization;
  };
  message?: string;
  success: boolean;
}

export interface LeadRegistrationResponse {
  jobId: string;
  status: "queued" | "in-progress" | "completed" | "failed";
  message: string;
  subDomainName: string;
  progressUrl?: string;
  sseUrl?: string;
  organizationProgressUrl?: string;
}

export interface CreateOrganizationResponse {
  data: {
    organization: OgOrganization;
    product?: OgProduct;
    leadRegistration?: LeadRegistrationResponse | null;
  };
  message?: string;
  success?: boolean;
}
