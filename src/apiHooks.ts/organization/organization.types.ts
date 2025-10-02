import { OgOrgMembership, OgUser } from "../membership/membership.types";

type products = "OI" | "OG" | "OA" | "OJ";
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
  name: string;
  isAddNew?: boolean
  remarks?: string | null;
  created_at: string;
  memberships: OgOrgMembership[]
  updated_at: string;
  is_blocked: boolean;
  favorites: {
    userId: string,
    organizationId: string
  }[]
  ogUserId: string;
  products: OgProduct[];
}

export interface OgProduct {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface OgOrgResponse {
  data: {
    totalCounts: number;
    organizations: OgOrganization[];
    message: string,
  };
}
