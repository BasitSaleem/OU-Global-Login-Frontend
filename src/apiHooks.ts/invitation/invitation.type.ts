export interface CreateInvitationData {
    email: string;
    organizationId: string;
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
    }
    organization: {
        name: string;
        id: string;
        status: string;
    };
}

export interface GetInvitationByTokenResponse {
    statusCode: number;
    data: inviteData;
    message?: string;
    success?: boolean;
}
