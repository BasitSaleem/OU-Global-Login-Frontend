import React, { useMemo } from "react";
import { Plus, Shield, Tag } from "lucide-react";
import { Button, LoadingSpinner } from "@/components/ui";
import { packageAddOnsType } from "@/apiHooks.ts/plans/plans.types";
import { TaxData } from "@/apiHooks.ts/subscription/subscription.api";
import DiscountAlert from "./DiscountAlert";

type BillingCycle = "monthly" | "yearly";

interface OrderSummaryProps {
  packageName: string;
  currency: string;
  billingCycle: BillingCycle;
  basePrice: number;
  discountedBasePrice: number;
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
  isPaymentMethodAvailable: boolean;
  onCheckout: () => void;
  onManageCards: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageName,
  isPaymentMethodAvailable,
  billingCycle,
  basePrice,
  discountedBasePrice,
  onManageCards,
  yearlyPerMonth,
  discount,
  yearlySavings,
  country,
  selectedAddOns,
  availableAddOns,
  addOnsTotal,
  taxDetails,
  isProcessing,
  isCalculatingTax,
  canCheckout,
  onCheckout,
}) => {
  const { totalAddOnsOriginal, totalAddOnsDiscounted } = useMemo(() => {
    let original = 0;
    let discounted = 0;
    Object.entries(selectedAddOns).forEach(([id, quantity]) => {
      const entry = availableAddOns.find((a) => a.addOnId === id);
      if (entry) {
        const monthlyOriginal = parseFloat(entry.addOn.monthly_price || "0");
        const yearlyOriginal = parseFloat(entry.addOn.yearly_price || "0");
        const originalPrice =
          billingCycle === "monthly" ? monthlyOriginal : yearlyOriginal;

        let unitPrice = 0;
        if (billingCycle === "monthly") {
          const discPercent = parseFloat(entry.addOn.monthly_discount || "0");
          unitPrice = originalPrice * (1 - discPercent / 100);
        } else {
          unitPrice = parseFloat(
            entry.addOn.discounted_yearly_price ||
              entry.addOn.yearly_price ||
              "0",
          );
        }

        original += originalPrice * quantity;
        discounted += unitPrice * quantity;
      }
    });
    return { totalAddOnsOriginal: original, totalAddOnsDiscounted: discounted };
  }, [selectedAddOns, availableAddOns, billingCycle]);

  const addOnsSavings = totalAddOnsOriginal - totalAddOnsDiscounted;
  const planSavings = basePrice - discountedBasePrice;
  const totalDiscountAmount = planSavings + addOnsSavings;

  const periodLabel = billingCycle === "monthly" ? "mo" : "yr";
  const numSelectedAddOns = Object.keys(selectedAddOns).length;

  const subtotal = discountedBasePrice + addOnsTotal;

  const taxPercent = useMemo(() => {
    if (!taxDetails) return "0";
    const percentage =
      taxDetails.breakdown?.[0]?.tax_rate_details?.percentage_decimal;
    if (percentage) {
      return parseFloat(percentage).toFixed(1);
    }

    if (!taxDetails.subtotal || !taxDetails.tax) return "0";
    return ((taxDetails.tax / taxDetails.subtotal) * 100).toFixed(1);
  }, [taxDetails]);

  const taxAmount = subtotal * (parseFloat(taxPercent) / 100);
  const displayTotal = subtotal + taxAmount;

  const finalTotal = isCalculatingTax
    ? "..."
    : taxDetails?.total != null
      ? displayTotal.toFixed(2)
      : subtotal.toFixed(2);

  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
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
              const monthlyOriginal = parseFloat(
                entry.addOn.monthly_price || "0",
              );
              const yearlyOriginal = parseFloat(
                entry.addOn.yearly_price || "0",
              );
              const originalPrice =
                billingCycle === "monthly" ? monthlyOriginal : yearlyOriginal;

              const totalOriginalPrice = originalPrice * quantity;

              return (
                <div key={id} className="flex justify-between text-sm">
                  <span className="text-text flex items-center gap-1.5 flex-1 pr-2">
                    <Plus className="w-3 h-3 text-primary shrink-0" />
                    <span className="truncate">
                      {entry.addOn.name} {quantity > 1 ? `(x${quantity})` : ""}
                    </span>
                  </span>
                  <div className="text-right">
                    <span className="font-medium shrink-0">
                      ${totalOriginalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between text-sm border-t border-dashed pt-2">
              <span className="text-text">Add-ons subtotal</span>
              <span className="font-medium">
                ${totalAddOnsOriginal.toFixed(2)}
              </span>
            </div>
          </>
        )}

        {totalDiscountAmount > 0 && (
          <div className="flex justify-between text-sm border-t pt-3">
            <span className="text-text flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Discount {discount && `(${discount}%)`}
            </span>
            <span className="font-medium text-green-600">
              -${totalDiscountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t pt-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text font-medium">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text">Tax</span>
            <span className="font-medium">
              {isCalculatingTax && !taxDetails ? (
                "..."
              ) : (
                <div className="text-right">
                  <div>${taxAmount.toFixed(2)}</div>
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
      {isPaymentMethodAvailable ? (
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

export default OrderSummary;
