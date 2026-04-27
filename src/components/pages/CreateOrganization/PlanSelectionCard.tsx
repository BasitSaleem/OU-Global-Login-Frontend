"use client";
import React from "react";
import { OiPlanType } from "@/apiHooks.ts/plans/plans.types";
import { SvgIcon } from "@/components/ui/SvgIcon";
import {
  getPlanFeatures,
  formatFeature,
} from "@/components/pages/Checkout/RenderPackageFeature";

interface PlanSelectionCardProps {
  plan: OiPlanType;
  isSelected?: boolean;
  onClick?: () => void;
  billingCycle: "monthly" | "yearly";
}

const PlanSelectionCard: React.FC<PlanSelectionCardProps> = ({
  plan,
  isSelected = false,
  onClick,
  billingCycle,
}) => {
  const isPro = plan.package_name.toUpperCase().includes("PRO");

  const features = getPlanFeatures(plan).map((f) => ({
    text: f,
    included: true,
  }));

  return (
    <div
      onClick={onClick}
      className={`relative w-full flex flex-col px-5 py-4 bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer h-full ${isSelected ? "scale-[1.01] shadow-lg" : "border-gray-100 hover:border-primary/30"
        }`}
      style={
        isSelected
          ? {
            border: "2px solid transparent",
            backgroundImage:
              "linear-gradient(white, white), linear-gradient(to right, #1AD1B9, #716AE2, #5588DF)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }
          : {}
      }
    >
      {isPro && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1AD1B9] to-[#716AE2] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
          Most Popular
        </div>
      )}

      <div className="mb-1.5">
        <h3 className="text-base font-bold text-text flex items-center justify-between">
          {plan.package_name}
          {isSelected && (
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <SvgIcon name="check" className="text-white w-2 h-2" />
            </div>
          )}
        </h3>
      </div>

      <p className="text-gray-500 text-[11px] mb-3 line-clamp-1">
        {isPro
          ? "Ideal for growing businesses"
          : plan.package_name.toUpperCase().includes("BASIC")
            ? "Perfect for small businesses getting started"
            : "For established businesses scaling up"}
      </p>

      <div className="flex items-baseline gap-1 mb-3">
        <span
          className={`text-xl font-bold ${plan.package_name.toUpperCase().includes("ENTERPRISE") ? "text-[#5588DF]" : "text-[#1AD1B9]"}`}
        >
          $
          {billingCycle === "monthly"
            ? plan.monthly_price
            : (Number(plan.discounted_yearly_price) / 12).toFixed(2) ||
            plan.yearly_price}
        </span>
        <span className="text-gray-500 text-[10px] font-medium">/month</span>
      </div>

      <button
        className={`w-full py-2.5 rounded-lg font-bold text-xs mb-4 transition-all ${isSelected
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        {isSelected ? "Plan Selected" : "Start 30-Day Free Trial"}
      </button>

      <div className="space-y-1.5">
        {features.slice(0, 4).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="shrink-0 w-3.5 h-3.5 flex items-center justify-center">
              <SvgIcon name="check" className="text-primary w-2.5 h-2.5" />
            </div>
            <span className="text-gray-600 font-medium text-[10px]">
              {formatFeature(feature.text)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelectionCard;
