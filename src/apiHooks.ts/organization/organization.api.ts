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

//ENDPOINTS
const ENDPOINTS = {
  create: "/organization",
  getAll: `/organization`,
  getDetails: (id: string) => `/organization/${id}`,
  update: (id: string) => `/organization/${id}`,
  checkName: (name: string) =>
    `/organization/check-name/availability?name=${encodeURIComponent(name)}`,
  checkSubdomain: (subDomain: string) =>
    `/organization/check-subdomain/availability?subDomain=${encodeURIComponent(
      subDomain
    )}`,
  toggleFavorite: "/organization/favorite",
};

// 1. CREATE ORGANIATION
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationData) =>
      request<{ organization: Organization }>(
        ENDPOINTS.create,
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
export const useGetOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => request<OgOrgResponse>(ENDPOINTS.getAll, "GET"),
    select: (response) => response.data,
  });
};

// 3. GET ORGANIZATION DETAILS
export const useOrganizationDetails = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () =>
      request<{ organization: Organization }>(ENDPOINTS.getDetails(id), "GET"),
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
        ENDPOINTS.update(id),
        "PUT",
        {},
        { organizationData: data }
      ),
    onSuccess: (result) => {
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

export const useCheckOrganizationNameAvailability = (name: string) => {
  return useQuery({
    queryKey: ["organizationNameAvailability", name],
    queryFn: () => request(ENDPOINTS.checkName(name), "GET"),
    enabled: !!name,
    select: (data) => data?.data.isAvailable,
    retry: false,
  });
};
export const useIsFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { userId: string; orgId: string }) =>
      request<{ updatedUser: any }>(
        ENDPOINTS.toggleFavorite,
        "POST",
        {},
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(
        "Favorites updated",
        "Your favorite organizations list has been updated"
      );
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to update favorites";
      toast.error("Error", message);
    },
  });
};

export const useCheckSubDomainAvailability = (subDomain: string) => {
  return useQuery({
    queryKey: ["subDomainAvailability", subDomain],
    queryFn: () => request(ENDPOINTS.checkSubdomain(subDomain), "GET"),
    enabled: !!subDomain,
    select: (data) => data.data.isAvailable,
    retry: false,
  });
};
