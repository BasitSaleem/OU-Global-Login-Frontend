export interface CreateInvitationData {
    email: string;
    orgId: string;
    productId: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
}
export interface CreateInvitationResponse {
    statusCode: number;
    data: {
        id: string;
        inviterId: string;
        email: string;
        token: string;
        expiresAt: string;
        inviteeId: string;
        organizationId: string;
        status: string;
        createdAt: string;
        respondedAt: string;
    }
    message?: string
    success?: boolean
}
export interface GetInvitationsResponse {
    statusCode: number;
    data: inviteData[]
    message?: string
    success?: boolean
}
export interface inviteData {
    id: string;
    email: string;
    expiresAt: string;
    createdAt: string;
    token: string
    inviter: {
        email: string
        id: string
        first_name: string
        last_name: string
        profile_url: string
    }
    organization: {
        name: string;
        id: string;
        status: string;
    };
    // Set on product-scoped invitations (Owners Reach).
    role?: "OWNER" | "ADMIN" | "MEMBER" | null;
    product?: { product_name: string } | null;
}

export interface GetInvitationByTokenResponse {
    statusCode: number;
    data: inviteData;
    message?: string;
    success?: boolean;
}
export interface inviteStatusType {
    statusCode: number;
    data: {
        inviteStatus: string;
        email: string;
        userStatus: "EXIST" | "NOT_EXIST"
    };
    message: string;
    success: boolean;
}

