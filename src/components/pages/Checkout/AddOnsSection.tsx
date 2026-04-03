import React from "react";
import { Check, Minus, Plus, Puzzle, X } from "lucide-react";
import { packageAddOnsType } from "@/apiHooks.ts/plans/plans.types";

type BillingCycle = "monthly" | "yearly";

interface AddOnsSectionProps {
  addOns: packageAddOnsType[];
  selectedAddOns: Record<string, number>; // addOnId -> quantity
  billingCycle: BillingCycle;
  onUpdateQuantity: (addOnId: string, quantity: number) => void;
}

const AddOnsSection: React.FC<AddOnsSectionProps> = ({
  addOns,
  selectedAddOns,
  billingCycle,
  onUpdateQuantity,
}) => {
  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Puzzle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Add-ons</h2>
          <p className="text-xs text-text">
            Enhance your plan with additional features
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {addOns.length === 0 ? (
          <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 text-center">
            <p className="text-sm font-medium text-text">
              Add-on is not available in the Package
            </p>
          </div>
        ) : (
          addOns.map((entry) => {
            const addOn = entry.addOn;
            const quantity = selectedAddOns[entry.addOnId] || 0;
            const isSelected = quantity > 0;
            const addOnPrice =
              billingCycle === "monthly"
                ? parseFloat(addOn.monthly_price || "0")
                : parseFloat(addOn.yearly_price || "0");

            const handleToggle = () => {
              if (isSelected) {
                onUpdateQuantity(entry.addOnId, 0);
              } else {
                onUpdateQuantity(entry.addOnId, 1);
              }
            };

            const handleIncrement = (e: React.MouseEvent) => {
              e.stopPropagation();
              onUpdateQuantity(entry.addOnId, quantity + 1);
            };

            const handleDecrement = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (quantity > 1) {
                onUpdateQuantity(entry.addOnId, quantity - 1);
              } else {
                onUpdateQuantity(entry.addOnId, 0);
              }
            };

            return (
              <div
                key={entry.id}
                onClick={handleToggle}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-background hover:border-primary/30"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* Add-on info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{addOn.name}</p>
                  {addOn.description && (
                    <p className="text-xs text-text mt-0.5 truncate">
                      {addOn.description}
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                {isSelected && addOn.is_quantity_allowed && (
                  <div className="flex items-center gap-2 bg-background border rounded-lg p-1 mr-2 shadow-sm">
                    <button
                      onClick={handleDecrement}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-text" />
                    </button>
                    <span className="text-xs font-bold min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-text" />
                    </button>
                  </div>
                )}

                {/* Price */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {/* {addOn.currency} */}$
                    {(addOnPrice * (quantity || 1)).toFixed(2)}
                  </span>
                  <span className="text-xs text-text block">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                    {quantity > 1 ? ` (x${quantity})` : ""}
                  </span>
                </div>

                {/* Add/Remove indicator */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-red-100 text-red-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {isSelected ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AddOnsSection;
