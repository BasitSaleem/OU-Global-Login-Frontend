import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "./useToast";
import logger from "@/utils/logger";
const BASE_URL = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : process.env.NEXT_PUBLIC_API_PROD_BASE_URL;
const SSE_EVENTS = {
  SUBSCRIPTION_CREATED: "subscription:created",
  SUBSCRIPTION_UPDATED: "subscription:updated",
  SUBSCRIPTION_CANCELLED: "subscription:cancelled",
  INVOICE_PAID: "invoice:paid",
  INVOICE_PAYMENT_FAILED: "invoice:payment_failed",
  PAYMENT_METHOD_ADDED: "payment_method:added",
};
export const useSSE = (orgId: string | undefined, subscriptionId?: string) => {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!orgId) return;

    const es = new EventSource(
      `${BASE_URL}/og/events/organization/${orgId}`,
      { withCredentials: true },
    );

    esRef.current = es;

    es.onopen = () => {
      logger.log(`SSE connected for org: ${orgId}`);
    };

    es.onerror = (err) => {
      logger.error(` SSE error for org: ${orgId}`, err);
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        logger.log("SSE Message received:", data);
        if (data.type === "connected") {
          logger.log("SSE Stream confirmed active connection");
        }
      } catch (err) {
      }
    };
    //1.SUBSCRIPTION EVENTS
    es.addEventListener(SSE_EVENTS.SUBSCRIPTION_CREATED, (e: any) => {
      logger.log(`SSE Event: ${SSE_EVENTS.SUBSCRIPTION_CREATED} received for org: ${orgId}`, e.data);
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);

      queryClient.invalidateQueries({ queryKey: ["subscription", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      logger.log(`Invalidating queries for subscription:created`);
    });
    //1.2.SUBSCRIPTION UPDATED
    es.addEventListener(SSE_EVENTS.SUBSCRIPTION_UPDATED, (e) => {
      logger.log(`SSE Event: ${SSE_EVENTS.SUBSCRIPTION_UPDATED} received for org: ${orgId}`, e.data);
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({ queryKey: ["subscription", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    });
    //1.3.SUBSCRIPTION CANCELLED
    es.addEventListener(SSE_EVENTS.SUBSCRIPTION_CANCELLED, (e) => {
      logger.log(`SSE Event: ${SSE_EVENTS.SUBSCRIPTION_CANCELLED} received for org: ${orgId}`, e.data);
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({
        queryKey: ["subscription", subscriptionId],
      });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    });
    //2.INVOICE EVENTS
    es.addEventListener(SSE_EVENTS.INVOICE_PAID, (e: any) => {
      logger.log(`SSE Event: ${SSE_EVENTS.INVOICE_PAID} received for org: ${orgId}`, e.data);
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({ queryKey: ["org-invoices", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    });
    //2.2.INVOICE PAYMENT FAILED
    es.addEventListener(SSE_EVENTS.INVOICE_PAYMENT_FAILED, (e) => {
      logger.log(`SSE Event: ${SSE_EVENTS.INVOICE_PAYMENT_FAILED} received for org: ${orgId}`, e.data);
      const data = JSON.parse(e.data);
      toast.error(data.title, data.message);
      queryClient.invalidateQueries({ queryKey: ["org-invoices", orgId] });
    });
    //3.PAYMENT METHOD EVENTS
    es.addEventListener(SSE_EVENTS.PAYMENT_METHOD_ADDED, (e: any) => {
      logger.log(`SSE Event: ${SSE_EVENTS.PAYMENT_METHOD_ADDED} received for org: ${orgId}`, e.data);
      const data = JSON.parse(e.data);
      toast.success(data.title, data.message);
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [orgId]);
};
