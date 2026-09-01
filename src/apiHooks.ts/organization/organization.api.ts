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
  ORGANIZATIONS: `/og/organization`,
  ORGANIZATION_ID: (id: string) => `/og/organization/${id}`,
  CHECK_NAME: (name: string) =>
    `/og/organization/check-name/availability?name=${encodeURIComponent(name)}`,
  CHECK_SUBDOMAIN: (subDomain: string) =>
    `/og/organization/check-subdomain/availability?subDomain=${encodeURIComponent(
      subDomain,
    )}`,
  TOGGLE_FAVORITE: "/og/organization/favorite",
  ADD_PRODUCT: (id: string) => `/og/organization/${id}/add-product`,
  DELETE_PRODUCT: (orgId: string, productId: string) =>
    `/og/organization/${orgId}/product/${productId}`,
  ORGANIZATION_PRODUCTS: (id: string) => `/og/organization/products/${id}`,
  GENERATE_SUBDOMAIN: (companyName: string) =>
    `/og/organization/generate-subdomain-suggestions?companyName=${companyName}`,
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
        data,
      );
      return res.data;
    },
    onSuccess: (result, data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.removeQueries({ queryKey: ["subdomainSuggestions"] });
      queryClient.removeQueries({ queryKey: ["subDomainAvailability"] });
    },
    retry: false,
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Organization creation failed";
      toast.error("Failed to create organization", message);
    },
  });
};
// 1b. ADD PRODUCT(S) TO AN EXISTING ORGANIZATION
export const useAddProduct = (orgId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const res = await request<CreateOrganizationResponse>(
        ENDPOINTS.ADD_PRODUCT(orgId),
        "POST",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({
        queryKey: ["organizationProducts", orgId],
      });
      queryClient.removeQueries({ queryKey: ["subdomainSuggestions"] });
      queryClient.removeQueries({ queryKey: ["subDomainAvailability"] });
    },
    retry: false,
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to add product";
      toast.error("Failed to add product", message);
    },
  });
};

// 1c. DELETE A SINGLE PRODUCT FROM AN ORGANIZATION
export const useDeleteProduct = (orgId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      request(ENDPOINTS.DELETE_PRODUCT(orgId, productId), "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organizationProducts", orgId],
      });
      toast.success(
        "Product removed",
        "The product was removed from the organization.",
      );
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to remove product";
      toast.error("Failed to remove product", message);
    },
  });
};

// 2. GET ALL ORGANIZATIONS
export const useGetOrganizations = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["organizations", page, search],
    queryFn: async () => {
      let url = `${ENDPOINTS.ORGANIZATIONS}?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await request<OgOrgResponse>(url, "GET");
      return res.data;
    },
    select: (data) => ({
      meta: data.meta,
      organization: data.organizations,
    }),
  });
};

// 3. GET ORGANIZATION DETAILS
export const useOrganizationDetails = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      const res = await request<OgOrgDetailResponse>(
        ENDPOINTS.ORGANIZATION_ID(id),
        "GET",
      );
      return res.data;
    },
    select: (data) => data.organization,
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
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
        { organizationData: data },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(
        "Organization updated",
        "The organization was updated successfully",
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
      request<{
        data: { favorite_d: boolean; favoriteCount: number };
        message: string;
      }>(ENDPOINTS.TOGGLE_FAVORITE, "POST", {}, payload),

    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["organizations"] });

      // Snapshot the previous values
      const previousOrgsQueries = queryClient.getQueriesData({
        queryKey: ["organizations"],
      });

      // Optimistically update all organizations queries
      queryClient.setQueriesData(
        { queryKey: ["organizations"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            organizations: old.organizations?.map((org: any) => {
              if (org.id === variables.orgId) {
                const isFavorite = org.favorites?.some(
                  (fav: any) => fav.userId === variables.userId
                );
                const newFavorites = isFavorite
                  ? org.favorites.filter((fav: any) => fav.userId !== variables.userId)
                  : [...(org.favorites || []), { userId: variables.userId, organizationId: variables.orgId }];
                return {
                  ...org,
                  favorites: newFavorites,
                };
              }
              return org;
            }) || [],
          };
        }
      );

      return { previousOrgsQueries };
    },

    onSuccess: (data) => {
      toast.info(
        `${data?.data?.favorite_d ? "Favorited" : "Unfavorited"}`,
        data?.message,
      );
    },
    onError: (err, variables, context) => {
      // Rollback to previous state on failure
      if (context?.previousOrgsQueries) {
        context.previousOrgsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"], refetchType: "all" });
    },
  });
};

// 7. DELETE ORGANIZATION BY ID
export const useDeleteOrganization = (onFinish?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request(ENDPOINTS.ORGANIZATION_ID(id), "DELETE"),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["organizations"] });
      const previousOrganizations = queryClient.getQueriesData({
        queryKey: ["organizations"],
      });
      queryClient.setQueriesData(
        { queryKey: ["organizations"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            totalCounts: Math.max((old.totalCounts || 1) - 1, 0),
            organizations:
              old.organizations?.filter((org: any) => org.id !== deletedId) ||
              [],
          };
        },
      );

      return { previousOrganizations, deletedId };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
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

// 10. GENERATE SUBDOMAIN SUGGESTIONS
export const useGenerateSubdomainSuggestions = (companyName: string) => {
  return useQuery({
    queryKey: ["subdomainSuggestions", companyName],
    queryFn: () => request(ENDPOINTS.GENERATE_SUBDOMAIN(companyName), "GET"),
    select: (data) => data.data.suggestions,
    enabled: !!companyName && companyName.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
