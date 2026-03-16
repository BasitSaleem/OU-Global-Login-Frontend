import React from "react";
import { Plus, Shield, Tag } from "lucide-react";
import { Button, LoadingSpinner } from "@/components/ui";
import { packageAddOnsType } from "@/apiHooks.ts/plans/plans.types";

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
  isProcessing: boolean;
  canCheckout: boolean;
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
  selectedAddOns,
  availableAddOns,
  addOnsTotal,
  totalPrice,
  isProcessing,
  canCheckout,
  onCheckout,
}) => {
  const periodLabel = billingCycle === "monthly" ? "mo" : "yr";
  const numSelectedAddOns = Object.keys(selectedAddOns).length;

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
              <span className="font-medium">
                {/* {currency}  */}${addOnsTotal.toFixed(2)}
              </span>
            </div>
          </>
        )}

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
              <span className="text-xs text-text block">/{periodLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {yearlySavings &&
        parseFloat(yearlySavings) > 0 &&
        billingCycle === "yearly" && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-700 font-medium text-center">
              🎉 You save ${yearlySavings}/year with annual billing!
            </p>
          </div>
        )}

      <Button
        variant="primary"
        className="w-full py-5 text-base"
        disabled={!canCheckout || isProcessing}
        onClick={onCheckout}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size={4} className="border-white" />
            Processing...
          </div>
        ) : (
          `Subscribe  $${totalPrice.toFixed(2)}/${periodLabel}`
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
