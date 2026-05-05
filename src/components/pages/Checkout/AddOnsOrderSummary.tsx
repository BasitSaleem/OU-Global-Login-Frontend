import React, { useMemo } from "react";
import { Loader2, Plus, Shield, Tag } from "lucide-react";
import { Button, LoadingSpinner } from "@/components/ui";
import { AddOnType } from "@/apiHooks.ts/addons/addons.types";
import { TaxData } from "@/apiHooks.ts/subscription/subscription.api";

interface AddOnsOrderSummaryProps {
  selectedAddOns: Record<string, number>;
  availableAddOns: AddOnType[];
  billingCycle: "MONTHLY" | "YEARLY";
  taxDetails?: TaxData;
  isProcessing: boolean;
  isCalculatingTax?: boolean;
  isPaymentMethodAvailable: boolean;
  country: string;
  canCheckout: boolean;
  chargeToday?: string | number | null;
  isLoadingChargeToday?: boolean;
  onCheckout: () => void;
  onManageCards: () => void;
  onAddBillingInfo?: () => void;
}

const AddOnsOrderSummary: React.FC<AddOnsOrderSummaryProps> = ({
  selectedAddOns,
  availableAddOns,
  billingCycle,
  taxDetails,
  isProcessing,
  isCalculatingTax,
  isPaymentMethodAvailable,
  country,
  canCheckout,
  chargeToday,
  isLoadingChargeToday,
  onCheckout,
  onManageCards,
  onAddBillingInfo,
}) => {
  const periodLabel = billingCycle === "MONTHLY" ? "mo" : "yr";
  const numSelected = Object.keys(selectedAddOns).length;

  // Per-addon original + discounted prices
  const { rows, totalOriginal, totalDiscounted } = useMemo(() => {
    let orig = 0;
    let disc = 0;
    const rows = Object.entries(selectedAddOns)
      .map(([id, quantity]) => {
        const addon = availableAddOns.find((a) => a.id === id);
        if (!addon) return null;

        const originalPrice =
          billingCycle === "MONTHLY"
            ? parseFloat(addon.monthly_price || "0")
            : parseFloat(addon.yearly_price || "0");

        const discountedPrice =
          billingCycle === "MONTHLY"
            ? originalPrice *
              (1 - parseFloat(addon.monthly_discount || "0") / 100)
            : parseFloat(
                addon.discounted_yearly_price || addon.yearly_price || "0",
              );

        orig += originalPrice * quantity;
        disc += discountedPrice * quantity;

        return { addon, quantity, originalPrice, discountedPrice };
      })
      .filter(Boolean) as {
      addon: AddOnType;
      quantity: number;
      originalPrice: number;
      discountedPrice: number;
    }[];

    return { rows, totalOriginal: orig, totalDiscounted: disc };
  }, [selectedAddOns, availableAddOns, billingCycle]);

  const savingsAmount = totalOriginal - totalDiscounted;

  // Tax — calculated on chargeToday (prorated) when available, else on net total
  const taxPercent = useMemo(() => {
    if (!taxDetails) return "0";
    const pct = taxDetails.breakdown?.[0]?.tax_rate_details?.percentage_decimal;
    if (pct) return parseFloat(pct).toFixed(1);
    if (!taxDetails.subtotal || !taxDetails.tax) return "0";
    return ((taxDetails.tax / taxDetails.subtotal) * 100).toFixed(1);
  }, [taxDetails]);

  const chargeTodayNum =
    chargeToday != null ? parseFloat(String(chargeToday)) : null;
  const taxBase = chargeTodayNum != null ? chargeTodayNum : totalDiscounted;
  const taxAmount = taxBase * (parseFloat(taxPercent) / 100);
  const chargeTodayTotal = taxBase + taxAmount;

  const finalTotal = isCalculatingTax
    ? "..."
    : taxDetails?.total != null
      ? chargeTodayTotal.toFixed(2)
      : (chargeTodayNum ?? totalDiscounted).toFixed(2);

  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {/* Add-ons list */}
        {numSelected > 0 ? (
          <>
            <div className="border-t pt-3">
              <span className="text-xs font-semibold text-text uppercase tracking-wider">
                Add-ons
              </span>
            </div>

            {rows.map(({ addon, quantity, originalPrice }) => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-text flex items-center gap-1.5 flex-1 pr-2">
                  <Plus className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">
                    {addon.name}
                    {quantity > 1 ? ` (×${quantity})` : ""}
                  </span>
                </span>
                <span className="font-medium shrink-0">
                  ${(originalPrice * quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Add-ons subtotal
            <div className="flex justify-between text-sm border-t border-dashed pt-2">
              <span className="text-text">Add-ons subtotal</span>
              <span className="font-medium">${totalOriginal.toFixed(2)}</span>
            </div> */}
          </>
        ) : (
          <p className="text-sm text-text text-center py-4">
            No add-ons selected yet.
          </p>
        )}

        {/* Discount row */}
        <div className="border-t pt-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text">Subtotal</span>
            <span className="font-medium">${totalOriginal.toFixed(2)}</span>
          </div>

          {savingsAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Discount
              </span>
              <span className="font-medium text-green-600">
                -${savingsAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Net total */}
        <div className="border-t pt-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text font-medium">Net Total</span>
            <span className="font-semibold">${totalDiscounted.toFixed(2)}</span>
          </div>
        </div>

        {/* Charge today section */}
        <div className="border-t pt-3 space-y-3">
          {/* Charge today base (prorated) */}
          <div className="flex justify-between text-sm items-center">
            <span className="text-text font-medium flex items-center gap-1.5">
              {isLoadingChargeToday && (
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
              )}
              Charge today
            </span>
            {isLoadingChargeToday ? (
              <span className="h-4 w-16 rounded bg-primary/10 animate-pulse inline-block" />
            ) : chargeTodayNum != null ? (
              <span className="font-semibold">
                ${chargeTodayNum.toFixed(2)}
              </span>
            ) : (
              <span className="text-text text-xs">—</span>
            )}
          </div>

          {/* Tax row — based on charge today */}
          <div className="flex justify-between text-sm items-center">
            <span className="text-text flex gap-2">
              Tax
              {!isLoadingChargeToday &&
                (taxDetails?.breakdown?.[0]?.tax_rate_details?.country ||
                  country) && (
                  <span>
                    (Tax Rate —{" "}
                    {taxDetails?.breakdown?.[0]?.tax_rate_details?.country ||
                      country}
                    )
                  </span>
                )}
            </span>
            {isLoadingChargeToday ? (
              <span className="h-4 w-12 rounded bg-primary/10 animate-pulse inline-block" />
            ) : isCalculatingTax && !taxDetails ? (
              <span className="font-medium">...</span>
            ) : (
              <span className="font-medium">
                ${taxAmount.toFixed(2)}&nbsp;
                <span className="font-medium">
                  (
                  {taxDetails?.breakdown?.[0]?.tax_rate_details
                    ?.percentage_decimal ?? 0}
                  %)
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Grand total — charge today + tax */}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="font-semibold">Total due today</span>
              {isLoadingChargeToday && (
                <span className="text-[10px] text-primary animate-pulse italic">
                  Calculating proration…
                </span>
              )}
              {!isLoadingChargeToday && isCalculatingTax && (
                <span className="text-[10px] text-primary animate-pulse italic">
                  Calculating tax…
                </span>
              )}
            </div>
            <div className="text-right">
              {isLoadingChargeToday ? (
                <span className="h-7 w-20 rounded bg-primary/10 animate-pulse inline-block" />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  ${finalTotal}
                </span>
              )}
              <span className="text-xs text-text block">prorated</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {isPaymentMethodAvailable ? (
        <Button
          variant="primary"
          className="w-full py-5 text-base"
          disabled={
            (!!country && !canCheckout) ||
            isProcessing ||
            isCalculatingTax ||
            isLoadingChargeToday
          }
          onClick={!country && onAddBillingInfo ? onAddBillingInfo : onCheckout}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size={4} className="border-white" />
              Processing…
            </div>
          ) : !country ? (
            "Add Billing Info"
          ) : (
            `Subscribe  $${finalTotal}/${periodLabel}`
          )}
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full py-5 text-base"
          onClick={onManageCards}
        >
          Add Payment Method
        </Button>
      )}

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text">
        <Shield className="w-3.5 h-3.5" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
};

export default AddOnsOrderSummary;
