/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateOrganizationData,
  OgOrgResponse,
  Organization,
  UpdateOrganizationData,
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
    mutationFn: (data: CreateOrganizationData) =>
      request<{ organization: Organization }>(
        ENDPOINTS.ORGANIZATIONS,
        "POST",
        {},
        data
      ),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(
        "Organization created",
        "The organization and lead were created successfully"
      );
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Organization creation failed";
      toast.error("Failed to create organization", message);
    },
  });
};
// 2. GET ALL ORGANIZATIONS
export const useGetOrganizations = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["organizations", page, limit],
    queryFn: () => {
      const url = `${ENDPOINTS.ORGANIZATIONS}?page=${page}&limit=${limit}`;
      return request<OgOrgResponse>(url, "GET");
    },
    select: (res) => res.data,
  });
};

// 3. GET ORGANIZATION DETAILS
export const useOrganizationDetails = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () =>
      request<{ organization: Organization }>(ENDPOINTS.ORGANIZATION_ID(id), "GET"),
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
    enabled: !!name,
    select: (data) => data?.data.isAvailable,
    retry: false,
  });
};
// 6. TOGGLE FAVORITE
export const useIsFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: string; orgId: string }) =>
      request<{ favorited: boolean; favoriteCount: number }>(
        "/organization/favorite",
        "POST",
        {},
        payload
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

// 7. DELETE ORGANIZATION BY ID
export const useDeleteOrganization = (onFinish?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return request(ENDPOINTS.ORGANIZATION_ID(id), "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization deleted", "The organization was deleted");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Delete failed";
      toast.error("Failed to delete organization", message);
    },
    onSettled: () => {
      if (onFinish) onFinish();
    }
  });
};

// 8. CHECK SUBDOMAIN AVAILABILITY
export const useCheckSubDomainAvailability = (subDomain: string) => {
  return useQuery({
    queryKey: ["subDomainAvailability", subDomain],
    queryFn: () => request(ENDPOINTS.CHECK_SUBDOMAIN(subDomain), "GET"),
    enabled: !!subDomain,
    select: (data) => data.data.isAvailable,
    retry: false,
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