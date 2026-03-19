import React, { useMemo } from "react";
import { Plus, Shield, Tag } from "lucide-react";
import { Button, LoadingSpinner } from "@/components/ui";
import { packageAddOnsType } from "@/apiHooks.ts/plans/plans.types";
import { TaxData } from "@/apiHooks.ts/subscription/subscribtion.api";
import DiscountAlert from "./DiscountAlert";

type BillingCycle = "monthly" | "yearly";

interface OrderSummaryProps {
  packageName: string;
  currency: string;
  billingCycle: BillingCycle;
  basePrice: number;
  yearlyPerMonth: number;
  discount: string | null;
  yearlySavings: string | null;
  selectedAddOns: Record<string, number>;
  availableAddOns: packageAddOnsType[];
  addOnsTotal: number;
  totalPrice: number;
  taxDetails?: TaxData;
  isProcessing: boolean;
  isCalculatingTax?: boolean;
  canCheckout: boolean;
  country: string;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageName,
  currency,
  billingCycle,
  basePrice,
  yearlyPerMonth,
  discount,
  yearlySavings,
  country,
  selectedAddOns,
  availableAddOns,
  addOnsTotal,
  totalPrice,
  taxDetails,
  isProcessing,
  isCalculatingTax,
  canCheckout,
  onCheckout,
}) => {
  const periodLabel = billingCycle === "monthly" ? "mo" : "yr";
  const numSelectedAddOns = Object.keys(selectedAddOns).length;

  const finalTotal = isCalculatingTax
    ? "..." // Tax is being calculated
    : taxDetails?.total != null
      ? taxDetails.total.toFixed(2) // Tax is calculated
      : totalPrice.toFixed(2); // Fallback

  const taxPercent = useMemo(() => {
    if (!taxDetails) return "0";

    // Try to get percentage from breakdown first
    const percentage =
      taxDetails.breakdown?.[0]?.tax_rate_details?.percentage_decimal;
    if (percentage) {
      return parseFloat(percentage).toFixed(1);
    }

    if (!taxDetails.subtotal || !taxDetails.tax) return "0";
    return ((taxDetails.tax / taxDetails.subtotal) * 100).toFixed(1);
  }, [taxDetails]);

  return (
    <div className="bg-bg-secondary border rounded-xl p-6 sticky top-8">
      <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {/* Base plan */}
        <div className="flex justify-between text-sm">
          <span className="text-text">Plan</span>
          <span className="font-medium">{packageName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text">Billing</span>
          <span className="font-medium capitalize">{billingCycle}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text">Base price</span>
          <span className="font-medium">${basePrice.toFixed(2)}</span>
        </div>
        {billingCycle === "yearly" && (
          <div className="flex justify-between text-sm">
            <span className="text-text">Per month</span>
            <span className="font-medium">${yearlyPerMonth.toFixed(2)}</span>
          </div>
        )}
        {discount && parseFloat(discount) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Discount
            </span>
            <span className="font-medium text-green-600">-{discount}%</span>
          </div>
        )}

        {/* Selected add-ons */}
        {numSelectedAddOns > 0 && (
          <>
            <div className="border-t pt-3">
              <span className="text-xs font-semibold text-text uppercase tracking-wider">
                Add-ons
              </span>
            </div>
            {Object.entries(selectedAddOns).map(([id, quantity]) => {
              const entry = availableAddOns.find((a) => a.addOnId === id);
              if (!entry) return null;
              const unitPrice =
                billingCycle === "monthly"
                  ? parseFloat(entry.addOn.monthly_price || "0")
                  : parseFloat(entry.addOn.yearly_price || "0");
              const totalAddOnPrice = unitPrice * quantity;
              return (
                <div key={id} className="flex justify-between text-sm">
                  <span className="text-text flex items-center gap-1.5 flex-1 pr-2">
                    <Plus className="w-3 h-3 text-primary shrink-0" />
                    <span className="truncate">
                      {entry.addOn.name} {quantity > 1 ? `(x${quantity})` : ""}
                    </span>
                  </span>
                  <span className="font-medium shrink-0">
                    {/* {entry.addOn.currency} */}${totalAddOnPrice.toFixed(2)}
                  </span>
                </div>
              );
            })}
            <div className="flex justify-between text-sm border-t border-dashed pt-2">
              <span className="text-text">Add-ons subtotal</span>
              <span className="font-medium">${addOnsTotal.toFixed(2)}</span>
            </div>
          </>
        )}

        <div className="border-t pt-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text">Tax</span>
            <span className="font-medium">
              {isCalculatingTax && !taxDetails ? (
                "..."
              ) : (
                <div className="text-right">
                  <div>${(taxDetails?.tax ?? 0).toFixed(2)}</div>
                  <div className="text-[10px] text-text-secondary">
                    ({taxPercent}%)
                  </div>
                </div>
              )}
            </span>
          </div>

          {(taxDetails?.breakdown?.[0]?.tax_rate_details?.country ||
            country) && (
            <div className="flex justify-between text-sm">
              <span className="text-text">
                Applicable Tax Rate (
                {taxDetails?.breakdown?.[0]?.tax_rate_details?.country ||
                  country}
                )
              </span>
              <span className="font-medium">
                {taxDetails?.breakdown?.[0]?.tax_rate_details
                  ?.percentage_decimal ?? 0}
                %
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="font-semibold">Total</span>
              {isCalculatingTax && (
                <span className="text-[10px] text-primary animate-pulse italic">
                  Calculating tax...
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                ${finalTotal}
              </span>
              <span className="text-xs text-text block">/{periodLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {yearlySavings &&
        parseFloat(yearlySavings) > 0 &&
        billingCycle === "yearly" && (
          <DiscountAlert yearlySavings={yearlySavings} />
        )}

      <Button
        variant="primary"
        className="w-full py-5 text-base"
        disabled={!canCheckout || isProcessing || isCalculatingTax}
        onClick={onCheckout}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size={4} className="border-white" />
            Processing...
          </div>
        ) : (
          `Subscribe  $${finalTotal}/${periodLabel}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text">
        <Shield className="w-3.5 h-3.5" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
};

export default OrderSummary;
