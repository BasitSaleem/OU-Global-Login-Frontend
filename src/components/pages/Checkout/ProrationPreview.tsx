"use client";

import React, { useEffect, useMemo } from "react";
import {
  Receipt,
  Loader2,
  AlertCircle,
  Zap,
  CalendarDays,
  Info,
  Plus,
} from "lucide-react";
import { usePreviewAddon } from "@/apiHooks.ts/subscription/subscription.api";
import { previewAddonDataType } from "@/apiHooks.ts/subscription/subscription.types";
import { Tooltip } from "@/components/ui";

interface ProrationPreviewProps {
  orgId: string;
  selectedAddOns: Record<string, number>;
  onPreviewUpdate?: (
    data: previewAddonDataType | null,
    loading: boolean,
    isError: boolean,
  ) => void;
}

const ProrationPreview: React.FC<ProrationPreviewProps> = ({
  orgId,
  selectedAddOns,
  onPreviewUpdate,
}) => {
  const {
    mutate: previewAddon,
    data: previewResponse,
    isPending: isLoadingPreview,
    isError: isPreviewError,
    error: previewError,
    reset: resetPreview,
  } = usePreviewAddon();

  const previewData = previewResponse;

  const previewPayload = useMemo(
    () =>
      Object.entries(selectedAddOns).map(([addonId, quantity]) => ({
        addonId,
        quantity,
      })),
    [selectedAddOns],
  );

  useEffect(() => {
    if (previewPayload.length === 0) {
      resetPreview();
      onPreviewUpdate?.(null, false, false);
      return;
    }
    const timer = setTimeout(() => {
      previewAddon({ orgId, addons: previewPayload });
    }, 600);
    return () => clearTimeout(timer);
  }, [previewPayload, orgId, previewAddon, resetPreview, onPreviewUpdate]);

  useEffect(() => {
    onPreviewUpdate?.(previewData || null, isLoadingPreview, isPreviewError);
  }, [previewData, isLoadingPreview, isPreviewError, onPreviewUpdate]);

  if (Object.keys(selectedAddOns).length === 0) return null;

  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-primary" />
        Current & Upcoming Charges
        <Tooltip
          content="You’ll only pay for the remaining days in your current billing cycle today. On your renewal date, you’ll be charged the standard recurring amount."
          position="top"
          className="w-64 whitespace-normal text-xs"
        >
          <Info className="w-4 h-4 text-text" />
        </Tooltip>
      </h3>

      {isLoadingPreview && (
        <div className="flex items-center gap-3 text-sm text-text py-4 justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Calculating prorated charges…
        </div>
      )}

      {isPreviewError && !isLoadingPreview && (
        <div className="flex items-start gap-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Preview unavailable</p>
            <p className="text-xs mt-0.5 text-red-400">
              {(previewError as Error)?.message ||
                "Could not calculate proration. You can still proceed to checkout."}
            </p>
          </div>
        </div>
      )}

      {!isLoadingPreview && !isPreviewError && previewData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium">Charged today</span>
              <span className="text-xs text-text">(prorated)</span>
            </div>
            <span className="text-lg font-bold text-primary">
              ${parseFloat(previewData.chargeToday).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-text" />
              <span className="font-medium">Next renewal</span>
              {previewData.renewalDate && (
                <span className="text-xs text-text">
                  (
                  {new Date(previewData.renewalDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                  )
                </span>
              )}
            </div>
            <span className="text-sm font-semibold">
              ${parseFloat(previewData.renewalTotal).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {!isLoadingPreview && !isPreviewError && !previewData && (
        <p className="text-sm text-text text-center py-4">
          Select add-ons above to see the prorated charge.
        </p>
      )}
    </div>
  );
};

export default ProrationPreview;
