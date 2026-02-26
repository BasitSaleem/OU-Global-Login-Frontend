/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/requestFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/useToast";
import {
  CreatePaymentMethodResponse,
  GetPaymentMethodResponse,
  PaymentSecretRespons,
} from "./paymentMethod.types";

//ENDPOINTS
const ENDPOINTS = {
  GET_PAYMENT_METHODS: `/og/payment-method`,
  GET_SECRET: `/og/payment-method/secret`,
  CREATE_PAYMENT_METHOD: `/og/payment-method/add`,
  DELETE_PAYMENT_METHOD: `/og/payment-method`,
  MAKE_PRIMARY_PAYMENT_METHOD: `/og/payment-method/primary`,
  UPDATE_PAYMENT_METHOD: `/og/payment-method/update`,
};

export const useGetPaymentSecret = () => {
  return useQuery({
    queryKey: ["payment-method-secret"],
    queryFn: async () => {
      const res = await request<PaymentSecretRespons>(
        ENDPOINTS.GET_SECRET,
        "GET",
      );
      return res.data;
    },
    select: (data) => ({
      clientSecret: data.clientSecret,
    }),
  });
};

export const useGetPaymentMethods = () => {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const res = await request<GetPaymentMethodResponse>(
        ENDPOINTS.GET_PAYMENT_METHODS,
        "GET",
      );
      return res.data;
    },
    select: (data) => ({
      paymentMethods: data.paymentMethods,
    }),
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
        {},
        { pmId },
      );
      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method deleted successfully!");
    },
    retry: false,
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to delete payment method";
      toast.error("Failed to delete payment method", message);
    },
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
