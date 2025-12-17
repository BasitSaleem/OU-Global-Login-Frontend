/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateOrganizationData,
  OgOrgResponse,
  Organization,
  UpdateOrganizationData,
  CreateOrganizationResponse,
  OgOrgDetailResponse,
} from "./organization.types";
import { toast } from "@/hooks/useToast";

//ENDPOINTS
const ENDPOINTS = {
  ORGANIZATIONS: `/organization`,
  ORGANIZATION_ID: (id: string) => `/organization/${id}`,
  CHECK_NAME: (name: string) =>
    `/organization/check-name/availability?name=${encodeURIComponent(name)}`,
  CHECK_SUBDOMAIN: (subDomain: string) =>
    `/organization/check-subdomain/availability?subDomain=${encodeURIComponent(
      subDomain
    )}`,
  TOGGLE_FAVORITE: "/organization/favorite",
  ORGANIZATION_PRODUCTS: (id: string) => `/organization/products/${id}`
};

// 1. CREATE ORGANIZATION
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const res = await request<CreateOrganizationResponse>(
        ENDPOINTS.ORGANIZATIONS,
        "POST",
        {},
        data
      )
      return res.data
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(
        "Organization created",
        "The organization has been created and lead registration is processing in the background."
      );
    },
    retry: false,
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Organization creation failed";
      toast.error("Failed to create organization", message);
    },
  });
};
// 2. GET ALL ORGANIZATIONS
export const useGetOrganizations = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const url = `${ENDPOINTS.ORGANIZATIONS}?page=${page}&limit=${limit}`;
      const res = await request<OgOrgResponse>(url, "GET");
      return res.data
    },
    select: (data) => ({
      totalCount: data.totalCount,
      organization: data.organizations
    })
  });
};

// 3. GET ORGANIZATION DETAILS
export const useOrganizationDetails = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      const res = await request<OgOrgDetailResponse>(ENDPOINTS.ORGANIZATION_ID(id), "GET")
      return res.data
    },
    select: (data) => data.organization,
    enabled: !!id,
  });
};


// 4. UPDATE ORGANIZATION
export const useUpdateOrganization = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrganizationData) =>
      request<{ organization: Organization }>(
        ENDPOINTS.ORGANIZATION_ID(id),
        "PUT",
        {},
        { organizationData: data }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(
        "Organization updated",
        "The organization was updated successfully"
      );
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Update failed";
      toast.error("Failed to update organization", message);
    },
  });
};
// 5. CHECK ORGANIZATION NAME AVAILABILITY
export const useCheckOrganizationNameAvailability = (name: string) => {
  return useQuery({
    queryKey: ["organizationNameAvailability", name],
    queryFn: () => request(ENDPOINTS.CHECK_NAME(name), "GET"),
    enabled: !!name && name.length > 0,
    select: (data) => data?.data.isAvailable,
    retry: false,
    staleTime: 30000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
  });
};
// 6. TOGGLE FAVORITE
export const useIsFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: string; orgId: string }) =>
      request<{ data: { favorite_d: boolean; favoriteCount: number }, message: string }>(
        ENDPOINTS.TOGGLE_FAVORITE,
        "POST",
        {},
        payload
      ),

    onSuccess: (data) => {
      toast.info(`${data?.data?.favorite_d ? "Favorited" : "Unfavorited"}`, data?.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },

  });
};

// 7. DELETE ORGANIZATION BY ID
export const useDeleteOrganization = (onFinish?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(ENDPOINTS.ORGANIZATION_ID(id), "DELETE"),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["organizations"] });
      const previousOrganizations = queryClient.getQueriesData({ queryKey: ["organizations"] });
      queryClient.setQueriesData(
        { queryKey: ["organizations"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            totalCounts: Math.max((old.totalCounts || 1) - 1, 0),
            organizations: old.organizations?.filter((org: any) => org.id !== deletedId) || []
          };
        }
      );

      return { previousOrganizations, deletedId };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization deleted", "The organization was deleted successfully");
    },
    onError: (error: any, deletedId: string, context) => {
      if (context?.previousOrganizations) {
        context.previousOrganizations.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = (error as Error)?.message || "Delete failed";
      toast.error("Failed to delete organization", message);
    },
    onSettled: () => {
      if (onFinish) onFinish();
    },
  });
};


// 8. CHECK SUBDOMAIN AVAILABILITY
export const useCheckSubDomainAvailability = (subDomain: string) => {
  return useQuery({
    queryKey: ["subDomainAvailability", subDomain],
    queryFn: () => request(ENDPOINTS.CHECK_SUBDOMAIN(subDomain), "GET"),
    enabled: !!subDomain && subDomain.length > 0,
    select: (data) => data.data.isAvailable,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

//9. GET ALL PRODUCTS OF ORGANIZATION
export const useGetOrganizationProducts = (id: string) => {
  return useQuery({
    queryKey: ["organizationProducts", id],
    queryFn: () => request(ENDPOINTS.ORGANIZATION_PRODUCTS(id), "GET"),
    enabled: !!id,
    select: (data) => data.data,
  });
};