import React from "react";
import { OiPlanType } from "@/apiHooks.ts/plans/plans.types";
import { useParams, useRouter } from "next/navigation";
import { SvgIcon } from "./ui/SvgIcon";
import {
  getPlanFeatures,
  formatFeature,
} from "./pages/Checkout/RenderPackageFeature";

interface PlanCardProps {
  plan: OiPlanType;
  isCurrentPlan?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  subscriptionStatus?: string;
  className?: string;
  subscriptionId?: string;
  billingCycle: "monthly" | "yearly";
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan = false,
  isSelected = false,
  onClick,
  subscriptionStatus,
  className = "",
  billingCycle,
}) => {
  const { orgId } = useParams();
  const router = useRouter();

  const isPro = plan.package_name.toUpperCase().includes("PRO");

  const features = getPlanFeatures(plan).map((f) => ({
    text: f,
    included: true,
  }));

  const buttonColor = plan.package_name.toUpperCase().includes("ENTERPRISE")
    ? "bg-[#5588DF]"
    : "bg-[#1AD1B9]";

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col p-8 bg-background rounded-[40px] border-2 transition-all duration-300 cursor-pointer h-full ${
        isSelected ? "scale-[1.02]" : "border-border hover:border-gray-200"
      } ${className}`}
      style={
        isSelected
          ? {
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(background, background), linear-gradient(to right, #1AD1B9, #716AE2, #5588DF)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }
          : {}
      }
    >
      {/* Most Popular Badge */}
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1AD1B9] to-[#716AE2] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-text">{plan.package_name}</h3>
        {isCurrentPlan && subscriptionStatus !== "CANCELLED" && (
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold text-nowrap">
            Current Plan
          </span>
        )}
      </div>

      <p className="text-text text-sm mb-8">
        {isPro
          ? "Ideal for growing businesses"
          : plan.package_name.toUpperCase().includes("BASIC")
            ? "Perfect for small businesses getting started"
            : "For established businesses scaling up"}
      </p>

      <div className="flex items-baseline gap-1 mb-8">
        <span
          className={`text-4xl font-bold ${plan.package_name.toUpperCase().includes("ENTERPRISE") ? "text-[#5588DF]" : "text-[#1AD1B9]"}`}
        >
          $
          {billingCycle === "monthly"
            ? plan.monthly_price
            : (Number(plan.discounted_yearly_price) / 12).toFixed(2) ||
              plan.yearly_price}
        </span>
        <span className="text-text font-medium">/month</span>
      </div>

      <button
        className={`w-full py-4 rounded-2xl text-white font-bold text-lg mb-8 transition-opacity cursor-pointer hover:opacity-90 ${buttonColor}`}
        onClick={(e) => {
          e.stopPropagation();
          if (isCurrentPlan && subscriptionStatus !== "CANCELLED") return;
          router.push(
            `/organization-details/${orgId}/billing/checkout/${btoa(plan.id as string)}?billingCycle=${billingCycle}`,
          );
        }}
      >
        {isCurrentPlan && subscriptionStatus !== "CANCELLED"
          ? "Current Plan"
          : "Upgrade Now"}
      </button>

      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="shrink-0 w-5 h-5 flex items-center justify-center">
              <SvgIcon name="check" className="text-primary" />
            </div>
            <span className="text-text font-medium ">
              {formatFeature(feature.text)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanCard;
