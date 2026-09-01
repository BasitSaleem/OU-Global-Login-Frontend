import React from "react";
import { Check } from "lucide-react";
import { OpService } from "@/apiHooks.ts/opSubscription/opSubscription.api";

interface OpServiceItemProps {
  svc: OpService;
  isSelected: boolean;
  onToggle: (id: string) => void;
  svcPrice: (svc: {
    monthly_price: string;
    yearly_price: string | null;
  }) => string;
}

const OpServiceItem: React.FC<OpServiceItemProps> = ({
  svc,
  isSelected,
  onToggle,
  svcPrice,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(svc.id)}
      className={` relative text-left p-4 cursor-pointer rounded-xl border transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 bg-bg-secondary"
      }`}
    >
      {isSelected && (
        <span className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full border border-primary bg-bg-secondary text-primary flex items-center justify-center">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      <span className="font-bold text-text text-sm block pr-6 mb-1">
        {svc.name}
      </span>
      <span className="text-xs font-normal text-text-secondary block">
        {svcPrice(svc)}
        {Number(svc.setup_fee) > 0
          ? ` · $${Number(svc.setup_fee).toLocaleString()} setup`
          : ""}
      </span>
    </button>
  );
};

export default OpServiceItem;
