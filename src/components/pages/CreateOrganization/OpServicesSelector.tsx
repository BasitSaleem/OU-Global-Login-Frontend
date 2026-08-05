"use client";
import React, { useEffect } from "react";
import { Check } from "lucide-react";
import {
  useGetOpServices,
  useOpPreview,
} from "@/apiHooks.ts/opSubscription/opSubscription.api";
import PlanCardSkeleton from "@/components/PlanCardSkeleton";

interface OpServicesSelectorProps {
  selectedServiceIds: string[];
  setSelectedServiceIds: (ids: string[]) => void;
  dominationUpgrade: boolean;
  setDominationUpgrade: (v: boolean) => void;
  billingCycle?: "monthly" | "yearly";
}

const tierLabel: Record<string, string> = {
  STARTER: "Starter",
  GROWTH: "Growth",
  DOMINATION: "Domination",
};

const OpServicesSelector: React.FC<OpServicesSelectorProps> = ({
  selectedServiceIds,
  setSelectedServiceIds,
  dominationUpgrade,
  setDominationUpgrade,
  billingCycle = "monthly",
}) => {
  const { data: services, isPending } = useGetOpServices();

  const isYearly = billingCycle === "yearly";
  // Display price for a service — yearly when selected + available, else monthly.
  const svcPrice = (s: { monthly_price: string; yearly_price: string | null }) => {
    const useYearly = isYearly && !!s.yearly_price;
    return `$${useYearly ? s.yearly_price : s.monthly_price}${useYearly ? "/yr" : "/mo"}`;
  };

  const bundle = services?.find((s) => s.is_bundle);
  const bundleSelected = bundle
    ? selectedServiceIds.includes(bundle.id)
    : false;

  const { data: preview, isFetching: previewLoading } = useOpPreview({
    serviceIds: selectedServiceIds,
    dominationUpgrade: bundleSelected && dominationUpgrade,
  });

  // The Domination upsell only applies to the bundle; reset it otherwise.
  useEffect(() => {
    if (!bundleSelected && dominationUpgrade) setDominationUpgrade(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleSelected]);

  const toggle = (id: string) => {
    setSelectedServiceIds(
      selectedServiceIds.includes(id)
        ? selectedServiceIds.filter((x) => x !== id)
        : [...selectedServiceIds, id],
    );
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PlanCardSkeleton />
        <PlanCardSkeleton />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-6 text-center">
        No services are available right now.
      </p>
    );
  }

  const individual = services.filter((s) => !s.is_bundle);

  return (
    <div className="space-y-3">
      <p className="text-text font-semibold">Choose your Services</p>

      {/* Individual services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {individual.map((svc) => {
          const isSelected = selectedServiceIds.includes(svc.id);
          return (
            <button
              type="button"
              key={svc.id}
              onClick={() => toggle(svc.id)}
              className={`relative text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? "border-success bg-success-bg"
                  : "border-border hover:border-primary/50 bg-background"
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-success-bg border border-success text-success flex items-center justify-center">
                  <Check size={12} />
                </span>
              )}
              <span className="font-bold text-text block pr-6">{svc.name}</span>
              <span className="text-xs text-text-secondary">
                {svcPrice(svc)}
                {Number(svc.setup_fee) > 0
                  ? ` · $${svc.setup_fee} setup`
                  : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bundle (all-in-one) */}
      {bundle && (
        <button
          type="button"
          onClick={() => toggle(bundle.id)}
          className={`relative w-full text-left p-4 rounded-xl border-2 transition-all ${
            bundleSelected
              ? "border-success bg-success-bg"
              : "border-dashed border-border hover:border-primary/50 bg-background"
          }`}
        >
          {bundleSelected && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-success-bg border border-success text-success flex items-center justify-center">
              <Check size={12} />
            </span>
          )}
          <span className="font-bold text-text block pr-6">
            {bundle.name}{" "}
            <span className="text-[10px] uppercase font-black text-primary tracking-wide">
              Best value
            </span>
          </span>
          <span className="text-xs text-text-secondary">
            {svcPrice(bundle)}
            {Number(bundle.setup_fee) > 0
              ? ` · $${bundle.setup_fee} setup`
              : ""}
          </span>
        </button>
      )}

      {/* Domination upsell — bundle only */}
      {bundleSelected && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={dominationUpgrade}
            onChange={(e) => setDominationUpgrade(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-text">
            Upgrade to <b>Domination</b> for{" "}
            <b>+$200/mo</b> (bundle only)
          </span>
        </label>
      )}

      {/* Live order preview — informational only. GHL bills Owners Pulse and the
          setup fee is arranged with our team; nothing is charged in-app here. */}
      {selectedServiceIds.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-secondary p-4 space-y-2">
          {preview?.resolvedTier && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Included plan</span>
              <span className="font-bold text-primary">
                {tierLabel[preview.resolvedTier] ?? preview.resolvedTier}{" "}
                <span className="text-text-secondary font-medium">
                  (included free)
                </span>
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {isYearly ? "Yearly" : "Monthly"}
              </span>
              <span className="font-semibold text-text">
                {previewLoading
                  ? "…"
                  : `$${isYearly ? (preview?.yearly ?? 0) : (preview?.monthly ?? 0)}${isYearly ? "/yr" : "/mo"}`}
              </span>
            </div>
            <p className="text-xs text-text-secondary">billed by Owners Pulse</p>
          </div>
          {(preview?.setup ?? 0) > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">One-time setup</span>
                <span className="font-semibold text-text">${preview?.setup}</span>
              </div>
              <p className="text-xs text-text-secondary">
                arranged separately with our team
              </p>
            </div>
          )}
          {preview && !preview.ghlPlanConfigured && (
            <p className="text-xs text-amber-600 pt-1">
              {preview.missingConfig?.length
                ? `This plan isn't fully configured yet (missing: ${preview.missingConfig.join(", ")}).`
                : "This plan isn't fully configured yet."}{" "}
              You can still create the workspace.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OpServicesSelector;
