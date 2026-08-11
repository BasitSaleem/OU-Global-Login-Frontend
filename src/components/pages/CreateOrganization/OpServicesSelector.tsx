"use client";
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import {
  useGetOpServices,
  useOpPreview,
  useVerifyOpInvoice,
} from "@/apiHooks.ts/opSubscription/opSubscription.api";
import PlanCardSkeleton from "@/components/PlanCardSkeleton";
import { Input, LoadingSpinner } from "@/components/ui";
import OpServiceItem from "./OpServiceItem";

interface OpServicesSelectorProps {
  selectedServiceIds: string[];
  setSelectedServiceIds: (ids: string[]) => void;
  dominationUpgrade: boolean;
  setDominationUpgrade: (v: boolean) => void;
  billingCycle?: "monthly" | "yearly";
  invoiceId: string;
  setInvoiceId: (v: string) => void;
  invoiceVerified: boolean;
  setInvoiceVerified: (v: boolean) => void;
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
  invoiceId,
  setInvoiceId,
  invoiceVerified,
  setInvoiceVerified,
}) => {
  const { data: services, isPending } = useGetOpServices();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(true);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const {
    mutate: verifyInvoice,
    isPending: isVerifyingInvoice,
  } = useVerifyOpInvoice();

  const handleVerifyInvoice = () => {
    const trimmed = invoiceId.trim();
    if (!trimmed) return;
    setInvoiceError(null);
    verifyInvoice(
      {
        invoiceId: trimmed,
        serviceIds: selectedServiceIds,
        dominationUpgrade: bundleSelected && dominationUpgrade,
      },
      {
        onSuccess: (data) => {
          // The backend resolves whatever was typed (a Stripe Invoice ID, or
          // the human-readable Invoice Number customers actually have) to the
          // canonical Stripe invoice id and stores the verification under that
          // id. Adopt it here so the create-org submission sends the SAME id
          // the backend looks up at creation time — otherwise submitting the
          // originally-typed value (e.g. the Invoice Number) wouldn't match.
          setInvoiceId(data.invoiceId);
          setInvoiceVerified(true);
        },
        onError: (error: any) => {
          setInvoiceVerified(false);
          setInvoiceError(
            (error as Error)?.message || "Could not verify this invoice ID",
          );
        },
      },
    );
  };

  const isYearly = billingCycle === "yearly";

  const svcPrice = (s: {
    monthly_price: string;
    yearly_price: string | null;
  }) => {
    const useYearly = isYearly && !!s.yearly_price;
    const price = useYearly ? s.yearly_price : s.monthly_price;
    return `$${Number(price).toLocaleString()}${useYearly ? "/yr" : "/mo"}`;
  };

  const bundle = services?.find((s) => s.is_bundle);
  const individual = services?.filter((s) => !s.is_bundle) ?? [];

  const bundleSelected = bundle
    ? selectedServiceIds.includes(bundle.id)
    : false;
  const hasNoServiceSelected = selectedServiceIds.length === 0;

  const { data: preview, isFetching: previewLoading } = useOpPreview({
    serviceIds: selectedServiceIds,
    dominationUpgrade: bundleSelected && dominationUpgrade,
  });

  // The Domination upsell only applies to the bundle; reset it otherwise.
  useEffect(() => {
    if (!bundleSelected && dominationUpgrade) setDominationUpgrade(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleSelected]);

  // A verified invoice is tied to one specific combo/price. If the selection
  // (or the Domination upgrade) changes after verifying, that verification no
  // longer matches what's being ordered — re-verification is required. Without
  // this, Create stays enabled for a stale, now-wrong invoice/price pairing.
  const selectionKey =
    [...selectedServiceIds].sort().join(",") + "|" + dominationUpgrade;
  const lastSelectionKeyRef = useRef(selectionKey);
  useEffect(() => {
    if (lastSelectionKeyRef.current !== selectionKey) {
      lastSelectionKeyRef.current = selectionKey;
      if (invoiceVerified) setInvoiceVerified(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey]);

  const toggle = (id: string) => {
    const allIndividualIds = individual.map((s) => s.id);
    const isBundleClick = bundle && id === bundle.id;

    if (isBundleClick) {
      if (bundleSelected) {
        // Unselect bundle and all individual services
        setSelectedServiceIds([]);
      } else {
        // Select bundle + all individual services
        setSelectedServiceIds([bundle.id, ...allIndividualIds]);
      }
      return;
    }

    // Individual service click
    if (bundleSelected) {
      // Selecting an individual service while the bundle is active drops the
      // bundle and starts over with just this one service selected.
      setSelectedServiceIds([id]);
    } else {
      const isCurrentlySelected = selectedServiceIds.includes(id);
      const nextSelected = isCurrentlySelected
        ? selectedServiceIds.filter((x) => x !== id && x !== bundle?.id)
        : [...selectedServiceIds.filter((x) => x !== bundle?.id), id];

      // Auto-select bundle if all individual services become selected
      const allSelected =
        allIndividualIds.length > 0 &&
        allIndividualIds.every((sId) => nextSelected.includes(sId));

      if (allSelected && bundle) {
        setSelectedServiceIds([bundle.id, ...nextSelected]);
      } else {
        setSelectedServiceIds(nextSelected);
      }
    }
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <PlanCardSkeleton />
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

  // Selected services list for table display in Order Summary
  const selectedServicesList = bundleSelected
    ? bundle
      ? [bundle]
      : []
    : services.filter((s) => selectedServiceIds.includes(s.id) && !s.is_bundle);

  // Calculate order totals
  const monthlyTotal = isYearly
    ? (preview?.yearly ?? 0)
    : (preview?.monthly ?? 0);
  const setupFee = preview?.setup ?? 0;
  const firstPayment = monthlyTotal + setupFee;

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Choose your Services
        </h3>
        <Link
          href="https://ownerspulse.com/pricing"
          target="_blank"
          className="text-primary cursor-pointer text-nowrap text-sm font-bold hover:underline"
        >
          View all services
        </Link>
      </div>

      {/* Services 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {individual.map((svc) => (
          <OpServiceItem
            key={svc.id}
            svc={svc}
            isSelected={!bundleSelected && selectedServiceIds.includes(svc.id)}
            onToggle={toggle}
            svcPrice={svcPrice}
          />
        ))}

        {/* All-In-One Bundle Card */}
        {bundle && (
          <button
            type="button"
            onClick={() => toggle(bundle.id)}
            className="relative text-left p-4 rounded-xl border border-[#1ad1b9] bg-[#e6fcf5] transition-all duration-200 cursor-pointer"
          >
            {bundleSelected && (
              <span className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full border border-[#1ad1b9] bg-white text-[#1ad1b9] flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
            <span className="font-bold text-gray-900 text-sm block pr-6 mb-1">
              {bundle.name}
            </span>
            <span className="text-xs font-normal text-gray-500 block">
              {svcPrice(bundle)}
              {Number(bundle.setup_fee) > 0
                ? ` · $${Number(bundle.setup_fee).toLocaleString()} setup`
                : ""}
            </span>
          </button>
        )}
      </div>

      {/* Domination Upgrade Checkbox — only relevant once the full bundle is selected */}
      {bundleSelected && (
        <div className="pt-0.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dominationUpgrade}
              onChange={(e) => setDominationUpgrade(e.target.checked)}
              className="w-4 h-4 accent-primary rounded border-gray-300 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-gray-800">
              Upgrade to{" "}
              <span className="font-bold text-gray-900">Domination</span> for{" "}
              <span className="font-bold text-gray-900">+$200/mo</span>{" "}
              <span className="text-gray-500 font-normal">(bundle only)</span>
            </span>
          </label>
        </div>
      )}

      {/* Order Summary Box */}
      <div className="rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-2xs">
        {/* Header with Column Titles */}
        <div className="px-4 py-3 bg-[#F9FAFB] border-b border-gray-200/60 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">Order Summary</h4>
          <div className="flex items-center gap-6 sm:gap-10 text-xs font-medium text-gray-500">
            <span className="w-20 text-right">
              {isYearly ? "Per year" : "Per month"}
            </span>
            <span className="w-24 text-right">1 time setup</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Selected Services Itemized List */}
          {selectedServicesList.length > 0 ? (
            <div className="space-y-3 pb-1">
              {selectedServicesList.map((svc) => {
                const price =
                  isYearly && svc.yearly_price
                    ? svc.yearly_price
                    : svc.monthly_price;
                return (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between text-xs sm:text-sm"
                  >
                    <span className="font-normal text-gray-900">
                      {svc.name}
                    </span>
                    <div className="flex items-center gap-6 sm:gap-10 font-semibold text-gray-900">
                      <span className="w-20 text-right">
                        ${Number(price).toLocaleString()}
                      </span>
                      <span className="w-24 text-right">
                        ${Number(svc.setup_fee).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-normal py-1">
              No services selected yet.
            </p>
          )}

          {/* Included plan banner */}
          <div className="bg-[#F4F5F7] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-gray-700">Included plan</span>
            {dominationUpgrade ? (
              <span className="font-semibold text-primary">
                Domination{" "}
                <span className="text-gray-500 font-normal text-xs">
                  (+$200/month)
                </span>
              </span>
            ) : (
              <span className="font-semibold text-primary">
                {preview?.resolvedTier
                  ? `${tierLabel[preview.resolvedTier] ?? preview.resolvedTier}`
                  : "Starter"}{" "}
                <span className="text-gray-500 font-normal text-xs">
                  (included free)
                </span>
              </span>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-normal">Monthly total</span>
              <span className="font-semibold text-gray-900">
                {previewLoading ? "…" : `$${monthlyTotal.toLocaleString()}/mo`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-normal">Setup fee</span>
              <span className="font-semibold text-gray-900">
                {previewLoading ? "…" : `$${setupFee.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200/80 pt-3 flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">
              First payment
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {previewLoading ? "…" : `$${firstPayment.toLocaleString()}`}
            </span>
          </div>

          <p className="text-xs text-gray-500 text-right pt-1">
            (Prices are exclusive of taxes.)
          </p>
        </div>
      </div>

      {/* Action Notice */}
      <p className="text-xs sm:text-sm text-gray-700 pt-0.5">
        {preview?.stripePaymentLink ? (
          <>
            To continue,{" "}
            <a
              href={preview.stripePaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline"
            >
              Make Payment
            </a>{" "}
            or Verify with Invoice ID to confirm your setup fee.
          </>
        ) : (
          "Setup-fee payment isn't available online for this selection yet — please verify with an Invoice ID from your Closer."
        )}
      </p>

      {/* Verify with Invoice ID Collapsible Accordion */}
      <div className="rounded-xl bg-[#F9FAFB] border border-gray-100 p-4 space-y-3">
        <div
          onClick={() => setIsInvoiceOpen(!isInvoiceOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="font-semibold text-gray-900 text-sm">
            Verify with Invoice ID
          </span>
          {isInvoiceOpen ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </div>

        {isInvoiceOpen && (
          <div className="pt-0.5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  label="Invoice ID"
                  name="op-invoice-id"
                  value={invoiceId ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInvoiceId(val);
                    if (invoiceVerified) setInvoiceVerified(false);
                    if (invoiceError) setInvoiceError(null);
                  }}
                  placeholder={
                    hasNoServiceSelected
                      ? "Select a service first"
                      : "Enter invoice ID"
                  }
                  disabled={hasNoServiceSelected}
                  className="bg-white"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore=""
                  data-bwignore="true"
                  data-form-type="other"
                />
              </div>
              {invoiceVerified ? (
                <span className="flex items-center gap-1 text-[#1ad1b9] font-semibold text-sm pb-3">
                  <Check size={14} strokeWidth={3} />
                  Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyInvoice}
                  disabled={
                    hasNoServiceSelected ||
                    !invoiceId?.trim() ||
                    isVerifyingInvoice
                  }
                  className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline pb-3"
                >
                  {isVerifyingInvoice && <LoadingSpinner size={3} />}
                  {isVerifyingInvoice ? "Verifying…" : "Verify"}
                </button>
              )}
            </div>
            {invoiceError && (
              <p className="text-xs text-red-500 font-medium pt-1.5">
                {invoiceError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpServicesSelector;
