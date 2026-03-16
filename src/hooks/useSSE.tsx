// hooks/useSSE.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "./useToast";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_PROD_BASE_URL;

const SSE_EVENTS = {
  SUBSCRIPTION_CREATED: "subscription:created",
  SUBSCRIPTION_UPDATED: "subscription:updated",
  SUBSCRIPTION_CANCELLED: "subscription:cancelled",
  //   SUBSCRIPTION_REACTIVATED: "subscription:reactivated",
  //   SUBSCRIPTION_TRIAL_STARTED: "subscription:trial_started",
  //   SUBSCRIPTION_TRIAL_ENDING: "subscription:trial_ending",
  //   SUBSCRIPTION_TRIAL_ENDED: "subscription:trial_ended",
  //   SUBSCRIPTION_PAST_DUE: "subscription:past_due",
  //   INVOICE_CREATED: "invoice:created",
  INVOICE_PAID: "invoice:paid",
  INVOICE_PAYMENT_FAILED: "invoice:payment_failed",
  //   INVOICE_VOIDED: "invoice:voided",
  PAYMENT_METHOD_ADDED: "payment_method:added",
  //   PAYMENT_METHOD_REMOVED: "payment_method:removed",
  //   PAYMENT_METHOD_SET_PRIMARY: "payment_method:set_primary",
};
export const useSSE = (orgId: string | undefined, subscriptionId: string) => {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!orgId) return;

    // ✅ connect to SSE endpoint
    const es = new EventSource(
      `${BASE_URL}/og/events/organization/${orgId}`,
      { withCredentials: true }, // sends cookies for auth
    );

    esRef.current = es;

    es.onopen = () => {
      console.log("✅ SSE connected");
    };

    es.onerror = (err) => {
      console.log("❌ SSE error", err);
      // browser auto-reconnects on error
    };

    // ✅ subscription events
    es.addEventListener(SSE_EVENTS.SUBSCRIPTION_CREATED, (e: any) => {
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);

      queryClient.invalidateQueries({ queryKey: ["subscription", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
    });

    es.addEventListener(SSE_EVENTS.SUBSCRIPTION_UPDATED, (e) => {
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({
        queryKey: ["subscription", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", orgId],
      });
    });

    es.addEventListener(SSE_EVENTS.SUBSCRIPTION_CANCELLED, (e) => {
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({
        queryKey: ["subscription", subscriptionId],
      });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
    });

    // ✅ invoice events
    es.addEventListener(SSE_EVENTS.INVOICE_PAID, (e: any) => {
      console.log("INVOICE_PAID", orgId);
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({ queryKey: ["org-invoices", orgId] });
    });

    es.addEventListener(SSE_EVENTS.INVOICE_PAYMENT_FAILED, (e) => {
      console.log("INVOICE_PAYMENT_FAILED", orgId);
      const data = JSON.parse(e.data);
      toast.error(data.title, data.message);
      queryClient.invalidateQueries({ queryKey: ["org-invoices", orgId] });
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [orgId]);
};
