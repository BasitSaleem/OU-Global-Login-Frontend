import React from "react";
import { Minus, Plus, PackageOpen } from "lucide-react";
import { AddOnType } from "@/apiHooks.ts/addons/addons.types";

interface BillingAddOnsListProps {
  addOns: AddOnType[];
  selectedAddOns: Record<string, number>;
  billingCycle: "MONTHLY" | "YEARLY";
  onUpdateQuantity: (addOnId: string, quantity: number) => void;
}

const BillingAddOnsList: React.FC<BillingAddOnsListProps> = ({
  addOns,
  selectedAddOns,
  billingCycle,
  onUpdateQuantity,
}) => {
  if (addOns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <PackageOpen className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">
            No add-ons available
          </p>
          <p className="text-sm text-text mt-1">
            Add-ons will appear here once they are configured.
          </p>
        </div>
      </div>
    );
  }

  const periodLabel = billingCycle === "MONTHLY" ? "mo" : "yr";

  return (
    <div className="border rounded-xl overflow-hidden border-none">
      {[...addOns]
        .sort(
          (a, b) =>
            Number(b.is_quantity_allowed) - Number(a.is_quantity_allowed),
        )
        .map((addOn) => {
          const quantity = selectedAddOns[addOn.id] || 0;

          const unitPrice =
            billingCycle === "MONTHLY"
              ? parseFloat(addOn.monthly_price || "0")
              : parseFloat(addOn.yearly_price || "0");

          const handleIncrement = () =>
            onUpdateQuantity(addOn.id, quantity + 1);

          const handleDecrement = () =>
            onUpdateQuantity(addOn.id, quantity > 0 ? quantity - 1 : 0);

          return (
            <div
              key={addOn.id}
              className="flex items-center bg-transparent justify-between gap-4  py-4 "
            >
              {/* ── Col 1 : name + price ─────────────────────── */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">
                  {addOn.name}
                </p>

                {/* {addOn.description && (
                <p className="text-xs text-text mt-0.5 truncate">
                  {addOn.description}
                </p>
              )} */}

                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-sm ">
                    +${unitPrice.toFixed(2)}
                    <span className="text-xs font-normal text-text ml-0.5">
                      /{periodLabel}
                    </span>
                  </span>

                  {quantity > 1 && (
                    <span className="text-xs text-text">
                      +${(unitPrice * quantity).toFixed(2)} total
                    </span>
                  )}
                </div>
              </div>

              {/* ── Col 2 : control ──────────────────────────── */}
              <div className="flex items-center gap-1 shrink-0">
                {addOn.is_quantity_allowed ? (
                  /* ── Quantity stepper ── */
                  <>
                    <button
                      onClick={handleDecrement}
                      disabled={quantity === 0}
                      className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-colors
                      ${
                        quantity === 0
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "hover:bg-primary/5 hover:text-primary cursor-pointer"
                      }`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span
                      className={`w-8 text-center text-sm font-semibold tabular-nums transition-colors
                      ${quantity > 0 ? "text-primary" : "text-text"}`}
                    >
                      {quantity}
                    </span>

                    <button
                      onClick={handleIncrement}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-primary text-white hover:opacity-90 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  /* ── Toggle switch ── */
                  <button
                    role="switch"
                    aria-checked={quantity > 0}
                    onClick={() =>
                      onUpdateQuantity(addOn.id, quantity > 0 ? 0 : 1)
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none
                    ${quantity > 0 ? "bg-primary" : "bg-gray"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                      ${quantity > 0 ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default BillingAddOnsList;
