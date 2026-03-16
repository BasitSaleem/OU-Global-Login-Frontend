import React from "react";
import { Check, Zap } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

interface BillingCycleToggleProps {
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  yearlySavings: string | null;
}

interface PlanCardProps {
  packageName: string;
  planType: string;
  currency: string;
  basePrice: number;
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  yearlySavings: string | null;
  features: string[];
}

const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({
  billingCycle,
  setBillingCycle,
  yearlySavings,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-3">Billing Cycle</label>
    <div className="inline-flex bg-background rounded-lg p-1 border">
      <button
        onClick={() => setBillingCycle("monthly")}
        className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
          billingCycle === "monthly"
            ? "bg-primary text-white shadow-sm"
            : "text-text hover:text-primary"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setBillingCycle("yearly")}
        className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          billingCycle === "yearly"
            ? "bg-primary text-white shadow-sm"
            : "text-text hover:text-primary"
        }`}
      >
        Yearly
        {yearlySavings && parseFloat(yearlySavings) > 0 && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              billingCycle === "yearly"
                ? "bg-white/20 text-white"
                : "bg-green-100 text-green-700"
            }`}
          >
            Save ${yearlySavings}
          </span>
        )}
      </button>
    </div>
  </div>
);

const PlanCard: React.FC<PlanCardProps> = ({
  packageName,
  planType,
  basePrice,
  billingCycle,
  setBillingCycle,
  yearlySavings,
  features,
}) => {
  return (
    <div className="bg-bg-secondary border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{packageName}</h2>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {planType}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-primary">
            {/* {currency} */}$ {basePrice.toFixed(2)}
          </span>
          <span className="text-xs text-text block">
            /{billingCycle === "monthly" ? "mo" : "yr"}
          </span>
        </div>
      </div>

      <BillingCycleToggle
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        yearlySavings={yearlySavings}
      />

      {features.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            What&apos;s included
          </label>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
