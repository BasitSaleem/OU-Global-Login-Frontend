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
  subscriptionStatus?: string;
  className?: string;
  subscriptionId?: string;
  billingCycle: "monthly" | "yearly";
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan = false,
  subscriptionStatus,
  className = "",
  billingCycle,
}) => {
  const { orgId } = useParams();
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col p-6 bg-background rounded-[32px] border-2 transition-all duration-300 h-full ${
        isHovered ? "scale-[1.02] border-transparent" : "border-border"
      } ${className}`}
      style={
        isHovered
          ? {
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(var(--color-bg-secondary, #fff), var(--color-bg-secondary, #fff)), linear-gradient(to right, #1AD1B9, #716AE2, #5588DF)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }
          : {}
      }
    >
      {/* Most Popular Badge */}
      {isPro && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1AD1B9] to-[#716AE2] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-text">{plan.package_name}</h3>
        {isCurrentPlan && subscriptionStatus !== "CANCELLED" && (
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold text-nowrap">
            Current Plan
          </span>
        )}
      </div>

      <p className="text-text-secondary text-xs mb-4">
        {isPro
          ? "Ideal for growing businesses"
          : plan.package_name.toUpperCase().includes("BASIC")
            ? "Perfect for small businesses getting started"
            : "For established businesses scaling up"}
      </p>

      <div className="flex items-baseline gap-1 mb-5">
        <span
          className={`text-3xl font-bold ${plan.package_name.toUpperCase().includes("ENTERPRISE") ? "text-[#5588DF]" : "text-[#1AD1B9]"}`}
        >
          $
          {billingCycle === "monthly"
            ? plan.monthly_price
            : (Number(plan.discounted_yearly_price) / 12).toFixed(2) ||
              plan.yearly_price}
        </span>
        <span className="text-text font-medium text-sm">/month</span>
      </div>

      <button
        className={`w-full py-2.5 rounded-xl text-white font-bold text-sm mb-5 transition-opacity cursor-pointer hover:opacity-90 ${buttonColor}`}
        onClick={(e) => {
          e.stopPropagation();
          if (isCurrentPlan && subscriptionStatus !== "CANCELLED") return;
          router.push(
            `/organization-details/${orgId}/billing/checkout/${plan.id as string}?billingCycle=${billingCycle}`,
          );
        }}
      >
        {isCurrentPlan && subscriptionStatus !== "CANCELLED"
          ? "Current Plan"
          : "Upgrade Now"}
      </button>

      <div className="space-y-2">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="shrink-0 w-4 h-4 flex items-center justify-center">
              <SvgIcon name="check" className="text-primary w-3.5 h-3.5" />
            </div>
            <span className="text-text font-medium text-sm">
              {formatFeature(feature.text)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanCard;
