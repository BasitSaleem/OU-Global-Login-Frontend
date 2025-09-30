import { OgOrganization } from "../organization/organization.types";

// Enum equivalent
export enum OrgRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}

// Interface for ogOrgMembership
export interface OgOrgMembership {
    id: string;
    org_id: string;
    isAddNew?: boolean;
    name: string
    user_id: string;
    role: OrgRole;        // uses the enum
    createdAt: Date;      // DateTime -> JS Date
    updatedAt: Date;
    organization?: OgOrganization;
    user?: OgUser;
}


export interface OgUser {
    id: string;
    // ... other fields from ogUser model
}
