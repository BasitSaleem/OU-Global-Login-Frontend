/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateInvitationData, CreateInvitationResponse, GetInvitationsResponse, GetInvitationByTokenResponse } from "./invitation.type";
import { toast } from "@/hooks/useToast";

//ENDPOINTS
const ENDPOINTS = {
    GET_ALL_INVITATIONS: `/invite/all`,
    GET_INVITATION_BY_TOKEN: (token: string) => `/invite/${token}`,
    CREATE_INVITATION: `/invite/create`,
    ACCEPT_INVITATION: `/invite/accept`,
    DECLINE_INVITATION: `/invite/decline`,
};
// 1. CREATE INVITATION
export const useCreateInvitation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateInvitationData) => {
            const res = await request<CreateInvitationResponse>(
                ENDPOINTS.CREATE_INVITATION,
                "POST",
                {},
                data
            )
            return res.data
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
            toast.success(
                "Invitation created",
                "The invitation has been created."
            );
        },
        retry: false,
        onError: (error: any) => {
            const message =
                (error as Error)?.message || "Invitation creation failed";
            toast.error("Failed to create invitation", message);
        },
    });
};
// 2. GET ALL INVITATIONS   
export const useGetInvitations = () => {
    return useQuery({
        queryKey: ["invitations"],
        queryFn: async () => {
            const res = await request<GetInvitationsResponse>(ENDPOINTS.GET_ALL_INVITATIONS, "GET");
            return res.data
        },
    });
};

// 3. GET INVITATION BY TOKEN (Public - no auth required)
export const useGetInvitationByToken = (token: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["invitation", token],
        queryFn: async () => {
            const res = await request<GetInvitationByTokenResponse>(ENDPOINTS.GET_INVITATION_BY_TOKEN(token), "GET");
            return res.data
        },
        enabled: enabled && !!token,
        retry: false,
    });
};
// 4. ACCEPT INVITATION
export const useAcceptInvitation = (callbacks?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (token: string) => {
            const res = await request(
                ENDPOINTS.ACCEPT_INVITATION,
                "POST",
                {},
                { token }
            )
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            toast.success(
                "Invitation accepted",
                "The invitation has been accepted."
            );
            callbacks?.onSuccess?.();
        },
        retry: false,
        onError: (error: any) => {
            const message =
                (error as Error)?.message || "Invitation acceptance failed";
            toast.error("Failed to accept invitation", message);
        },
    });
};

export const useDeclineInvitation = (callbacks?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (token: string) => {
            const res = await request(
                ENDPOINTS.DECLINE_INVITATION,
                "POST",
                {},
                { token }
            )
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
            toast.success(
                "Invitation declined",
                "The invitation has been declined."
            );
            callbacks?.onSuccess?.();
        },
        retry: false,
        onError: (error: any) => {
            const message =
                (error as Error)?.message || "Invitation decline failed";
            toast.error("Failed to decline invitation", message);
        },
    });
};
