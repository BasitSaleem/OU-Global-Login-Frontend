/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/useToast";
import {
  CreatePaymentMethodResponse,
  GetPaymentMethodResponse,
  PaymentSecretRespons,
} from "./paymentMethod.types";
import logger from "@/utils/logger";

//ENDPOINTS
const ENDPOINTS = {
  GET_PAYMENT_METHODS: `/og/payment-method`,
  GET_SECRET: `/og/payment-method/secret`,
  CREATE_PAYMENT_METHOD: `/og/payment-method/add`,
  DELETE_PAYMENT_METHOD: `/og/payment-method`,
  MAKE_PRIMARY_PAYMENT_METHOD: `/og/payment-method/primary`,
  UPDATE_PAYMENT_METHOD: `/og/payment-method/update`,
};

export const useGetPaymentSecret = (orgId: string) => {
  return useQuery({
    queryKey: ["payment-method-secret"],
    queryFn: async () => {
      const res = await request<PaymentSecretRespons>(
        `${ENDPOINTS.GET_SECRET}/${orgId}`,
        "GET",
      );
      return res.data;
    },
    select: (data) => ({
      clientSecret: data.clientSecret,
    }),
  });
};

export const useGetPaymentMethods = (orgId: string) => {
  return useQuery({
    queryKey: ["payment-methods", orgId],
    queryFn: async () => {
      const res = await request<GetPaymentMethodResponse>(
        ENDPOINTS.GET_PAYMENT_METHODS + `/${orgId}`,
        "GET",
      );
      return res.data;
    },
    enabled: !!orgId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useMakePrimaryPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await request<CreatePaymentMethodResponse>(
        ENDPOINTS.MAKE_PRIMARY_PAYMENT_METHOD + `/${id}`,
        "PATCH",
      );
      return res.data;
    },
    onSuccess: (result, data) => {
      toast.success("Payment method made primary successfully!");
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
    retry: false,
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to create payment method";
      toast.error("Failed to create payment method", message);
    },
  });
};

export const useCreatePaymentMethod = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pmId: string) => {
      const res = await request<CreatePaymentMethodResponse>(
        ENDPOINTS.CREATE_PAYMENT_METHOD,
        "POST",
        {},
        { pmId },
      );
      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method added successfully!");
    },
    retry: false,
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to create payment method";
      toast.error("Failed to create payment method", message);
    },
  });
};

export const useDeletePaymentMethod = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pmId: string) => {
      const res = await request<CreatePaymentMethodResponse>(
        `${ENDPOINTS.DELETE_PAYMENT_METHOD}/${pmId}`,
        "DELETE",
      );
      return res.data;
    },
    onMutate: async (pmId: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["payment-methods"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["payment-methods"]);
      logger.log("=== DELETE OPTIMISTIC UPDATE ===");
      logger.log("pmId to delete:", pmId);
      logger.log(
        "Cache data BEFORE update:",
        JSON.stringify(previousData, null, 2),
      );

      // Optimistically remove the deleted payment method from the cache
      queryClient.setQueryData(["payment-methods"], (old: any) => {
        if (!old) {
          logger.log("Cache is empty/null, skipping optimistic update");
          return old;
        }

        // Handle both possible data shapes
        const methods = old.paymentMethods || old.data?.paymentMethods || [];
        logger.log("Found methods in cache:", methods.length);
        logger.log(
          "Method IDs in cache:",
          methods.map((m: any) => m.id),
        );

        const filtered = methods.filter((method: any) => method.id !== pmId);
        logger.log("Methods after filter:", filtered.length);

        // Preserve the original shape
        if (old.paymentMethods) {
          return { ...old, paymentMethods: filtered };
        }
        if (old.data?.paymentMethods) {
          return { ...old, data: { ...old.data, paymentMethods: filtered } };
        }
        return old;
      });

      const afterData = queryClient.getQueryData(["payment-methods"]);
      logger.log(
        "Cache data AFTER update:",
        JSON.stringify(afterData, null, 2),
      );

      // Return the snapshot so we can roll back on error
      return { previousData };
    },
    onSuccess: () => {
      logger.log("=== DELETE SUCCESS ===");
      toast.success("Payment method deleted successfully!");
      onSuccess?.();
    },
    onError: (error: any, _pmId, context) => {
      logger.log("=== DELETE ERROR ===", error);
      // Roll back to the previous data if the mutation fails
      if (context?.previousData) {
        queryClient.setQueryData(["payment-methods"], context.previousData);
      }
      const message =
        (error as Error)?.message || "Failed to delete payment method";
      toast.error("Failed to delete payment method", message);
    },
    onSettled: () => {
      logger.log("=== DELETE SETTLED, invalidating queries ===");
      // Always refetch after mutation to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
    retry: false,
  });
};
export const useUpdatePaymentMethod = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pmId,
      data,
    }: {
      pmId: string;
      data: {
        cardHolderName?: string;
        billingAddress?: string;
        exp_month?: number;
        exp_year?: number;
      };
    }) => {
      const res = await request<CreatePaymentMethodResponse>(
        `${ENDPOINTS.UPDATE_PAYMENT_METHOD}/${pmId}`,
        "PATCH",
        {},
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method updated successfully!");
    },
    retry: false,
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to update payment method";
      toast.error("Failed to update payment method", message);
    },
  });
};
