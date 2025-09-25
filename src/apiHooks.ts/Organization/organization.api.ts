/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { request } from "@/utils/requestFunction";

// Define API endpoints
const ENDPOINTS = {
  create: "/organization",
  getAll: "/organization",
  getDetails: (id: string) => `/organization/${id}`,
  update: (id: string) => `/organization/${id}`,
   checkName: (name: string) =>
    `/organization/check-name/availability?name=${encodeURIComponent(name)}`,
  checkSubdomain: (subDomain: string) =>
    `/organization/check-subdomain/availability?subDomain=${encodeURIComponent(
      subDomain
    )}`,
};

type products = "OI" | "OG" | "OA" | "OJ"; // Example product types
// Types (you can refine based on your schema)
export interface Organization {
  name: string;
  product: products;
  subDomainName: string;

  [key: string]: any;
}

export interface CreateOrganizationData {
  name: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  subDomainName?: string;
  companyUrl?: string;
  companyName?: string; 
  packageName?: string;
  formPackage?: string;
  plan?: string;
  remarks?: string;
  isSendCredentialsEmail?: boolean;
  dataCenterId?: string;
  status?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  address?: string;
  [key: string]: any;
}

// 1. Create Organization
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationData) =>
      request<{ organization: Organization; }>(
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
      const message = (error as Error)?.message || "Organization creation failed";
      toast.error("Failed to create organization", message);
    },
  });
};

// 2. Get All Organizations
export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      request<{ organizations: Organization[] }>(ENDPOINTS.getAll, "GET"),
    select: (data) => data.organizations,
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to fetch organizations";
      toast.error("Error", message);
    },
  });
};

// 3. Get Organization Details
export const useOrganizationDetails = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () =>
      request<{ organization: Organization }>(ENDPOINTS.getDetails(id), "GET"),
    select: (data) => data.organization,
    enabled: !!id,
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to fetch details";
      toast.error("Error", message);
    },
  });
};

// 4. Update Organization
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
      toast.success("Organization updated", "The organization was updated successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Update failed";
      toast.error("Failed to update organization", message);
    },
  });
};
// Additional hooks for other organization-related operations can be added here
// 5. Check Organization Name Availability
// 5. Check Organization Name Availability
export const useCheckOrganizationNameAvailability = (name: string) => {
  return useQuery({
    queryKey: ["organizationNameAvailability", name],
    queryFn: () =>
      request<{ isAvailable: boolean }>(ENDPOINTS.checkName(name), "GET"),
    enabled: !!name, // don’t call until name has value
    select: (data) => data.isAvailable,
    retry: false, // optional: don’t retry on error
  });
};

// 6. Check Subdomain Availability
export const useCheckSubDomainAvailability = (subDomain: string) => {
  return useQuery({
    queryKey: ["subDomainAvailability", subDomain],
    queryFn: () =>
      request<{ isAvailable: boolean }>(
        ENDPOINTS.checkSubdomain(subDomain),
        "GET"
      ),
    enabled: !!subDomain, // don’t call until subDomain has value
    select: (data) => data.isAvailable,
    retry: false,
  });
};

// Example: Delete Organization, etc.
// Ensure to handle errors and success messages appropriately in each hook