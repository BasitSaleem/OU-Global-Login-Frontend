import { OgOrgMembership, OgUser } from "../membership/membership.types";

export type products = "OI" | "OG" | "OA" | "OJ";
export interface Organization {
  name: string;
  product: products;
  subDomainName: string;
  [key: string]: any;
}

export interface CreateOrganizationData {
  name: string;
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
  name?: string; // Made optional to support "Add New" items
  isAddNew?: boolean;
  remarks?: string | null;
  created_at?: string; // Made optional to support "Add New" items
  memberships?: OgOrgMembership[]; // Made optional to support "Add New" items
  updated_at?: string; // Made optional to support "Add New" items
  is_blocked?: boolean; // Made optional to support "Add New" items
  favorites?: {
    userId: string,
    organizationId: string
  }[]; // Made optional to support "Add New" items
  ogUserId?: string; // Made optional to support "Add New" items
  products?: OgProduct[]; // Made optional to support "Add New" items
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
    totalCounts: number;
    organizations: OgOrganization[];
    message: string,
  };
}
