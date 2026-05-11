import React from "react";

export type BillingCycle = "monthly" | "yearly";

interface BillingCycleToggleProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  /** Discount badge label — defaults to "Save up to 20%" */
  savingLabel?: string;
  className?: string;
}

const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({
  value,
  onChange,
  savingLabel = "Save up to 20%",
  className = "",
}) => {
  return (
    <div
      className={` flex items-center gap-2 p-1 bg-[#EEEDF0] rounded-2xl w-fit ${className}`}
    >
      <button
        onClick={() => onChange("monthly")}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
          value === "monthly"
            ? "bg-primary text-white shadow-md"
            : "text-black hover:bg-primary/10"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange("yearly")}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
          value === "yearly"
            ? "bg-primary text-white shadow-md"
            : "text-black hover:bg-primary/10"
        }`}
      >
        Yearly
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            value === "yearly"
              ? "bg-white/20 text-white"
              : "bg-primary/10 text-primary"
          }`}
        >
          {savingLabel}
        </span>
      </button>
    </div>
  );
};

export default BillingCycleToggle;
