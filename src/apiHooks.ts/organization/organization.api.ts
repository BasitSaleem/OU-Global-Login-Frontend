/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/components/ui/toast";
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateOrganizationData,
  OgOrgResponse,
  Organization,
  UpdateOrganizationData,
} from "./organization.types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  const ownerUserId = useSelector((state: RootState) => state.auth.user?.id);

  return useQuery({
    // queryKey: ["organizations", page, limit],
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
  const toggleOneList = (
    listData: any,
    userId: string,
    orgId: string
  ) => {
    if (!listData) return listData;
    if (Array.isArray(listData)) {
      return listData.map((org: any) => {
        if (org.id !== orgId) return org;
        const had = org.favorites?.some((f: any) => f.userId === userId);
        const nextFavs = had
          ? (org.favorites || []).filter((f: any) => f.userId !== userId)
          : [...(org.favorites || []), { userId }];
        return { ...org, favorites: nextFavs };
      });
    }

    if (Array.isArray(listData.items)) {
      return {
        ...listData,
        items: listData.items.map((org: any) => {
          if (org.id !== orgId) return org;
          const had = org.favorites?.some((f: any) => f.userId === userId);
          const nextFavs = had
            ? (org.favorites || []).filter((f: any) => f.userId !== userId)
            : [...(org.favorites || []), { userId }];
          return { ...org, favorites: nextFavs };
        }),
      };
    }

    return listData;
  };

  return useMutation({
    mutationFn: (payload: { userId: string; orgId: string }) =>
      request<{ favorited: boolean; favoriteCount: number }>(
        "/organization/favorite",
        "POST",
        {},
        payload
      ),

    onMutate: async ({ userId, orgId }) => {
      await queryClient.cancelQueries({ queryKey: ["organizations"] });

      // take a snapshot of every cached page for rollback
      const all = queryClient.getQueriesData({ queryKey: ["organizations"] });
      const prev = all.map(([key, data]) => [key, data] as const);

      // update every cached page
      all.forEach(([key, data]) => {
        queryClient.setQueryData(key, (old: any) =>
          toggleOneList(old, userId, orgId)
        );
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx?.prev) return;
      // rollback every page
      ctx.prev.forEach(([key, data]: any) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      // refetch every page to be safe
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};


export const useCheckSubDomainAvailability = (subDomain: string) => {
  return useQuery({
    queryKey: ["subDomainAvailability", subDomain],
    queryFn: () => request(ENDPOINTS.CHECK_SUBDOMAIN(subDomain), "GET"),
    enabled: !!subDomain,
    select: (data) => data.data.isAvailable,
    retry: false,
  });
};
