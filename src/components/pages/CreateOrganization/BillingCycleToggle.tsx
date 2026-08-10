"use client";
import React from "react";

interface BillingCycleToggleProps {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

export const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({
  billingCycle,
  setBillingCycle,
}) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-sm font-bold ${billingCycle === "monthly" ? "text-text" : "text-gray-400"}`}
      >
        Monthly
      </span>
      <div
        onClick={() =>
          setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
        }
        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${billingCycle === "yearly" ? "bg-[#1AD1B9]" : "bg-gray-200"}`}
      >
        <div
          className={`w-4 h-4 bg-bg-secondary rounded-full shadow-sm transition-all duration-300 ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`}
        />
      </div>
      <span
        className={`text-sm font-bold ${billingCycle === "yearly" ? "text-text" : "text-gray-400"}`}
      >
        Yearly
      </span>
    </div>
  );
};

export default BillingCycleToggle;
