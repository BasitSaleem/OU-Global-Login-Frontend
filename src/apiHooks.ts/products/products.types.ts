import { OgOrganization } from "../organization/organization.types";

// Enums
export enum ProductName {
    OI = "OI",
    OJ = "OJ",
    OM = "OM",
    OA = "OA",
}

export enum ProvisioningStatus {
    PENDING = "PENDING",
    PROVISIONED = "PROVISIONED",
    FAILED = "FAILED",
}

export interface OgProduct {
    id: string;
    organization_id: string;
    product_name: ProductName;
    oi_sub_domain?: string | null;
    is_blocked: boolean;
    provisioning_status: ProvisioningStatus;
    external_tenant_ref?: string | null;
    plan?: string | null;
    seats?: number | null;
    organization?: OgOrganization;
    roleAssignments?: OgUserRoleAssignment[];
}


export interface OgUserRoleAssignment {
    id: string;
}

