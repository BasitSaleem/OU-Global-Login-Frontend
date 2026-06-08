"use client";
import React from "react";
import { OiPlanType } from "@/apiHooks.ts/plans/plans.types";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { getPlanTextColor, returnPackageName } from "@/utils/package-utils";

interface PlanSelectionCardProps {
  plan: OiPlanType;
  isSelected?: boolean;
  onClick?: () => void;
  billingCycle: "monthly" | "yearly";
  isDirectFlow?: boolean;
}

const PlanSelectionCard: React.FC<PlanSelectionCardProps> = ({
  plan,
  isSelected = false,
  onClick,
  billingCycle,
  isDirectFlow = false,
}) => {
  const isBasic = plan.package_name.toUpperCase().includes("BASIC");
  const isPro = plan.package_name.toUpperCase().includes("PRO");
  const isBusiness = plan.package_name.toUpperCase().includes("BUSINESS");
  const isEnterprise =
    plan.package_name.toUpperCase().includes("PREMIUM") ||
    plan.package_name.toUpperCase().includes("ENTERPRISE");

  if (!isDirectFlow) {
    return (
      <div
        onClick={onClick}
        className={`relative w-full flex flex-col p-6 rounded-[32px] border-2 transition-all duration-300 cursor-pointer h-full ${
          isSelected
            ? "bg-primary/10 border-[#B2A5FF]"
            : isPro || isBusiness
              ? "bg-bg-secondary border-transparent"
              : "bg-bg-secondary border-gray-100"
        }`}
        style={
          (isPro || isBusiness) && !isSelected
            ? {
                border: "2px solid #f3f4f6",
                backgroundImage:
                  "linear-gradient(bg-secondary, bg-secondary), linear-gradient(to right, #1AD1B9, #7C3AED)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }
            : {}
        }
      >
        {(isPro || isBusiness) && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1AD1B9] to-[#7C3AED] text-white text-[10px] font-bold px-4 py-1 rounded-lg shadow-md z-20">
            Most Popular
          </div>
        )}

        <div className="mb-2">
          <h3 className="text-xl font-bold text-text flex items-center justify-between">
            {returnPackageName(plan.package_name)}
            {isSelected && (
              <SvgIcon
                name="check2"
                width={20}
                height={20}
                className="text-primary"
              />
            )}
          </h3>
        </div>

        <p className="text-text text-sm mb-10 leading-tight pr-4">
          {isPro || isBusiness
            ? "Ideal for growing businesses"
            : isBasic
              ? "Perfect for small businesses getting started"
              : "For established businesses scaling up"}
        </p>

        <div className="mt-auto space-y-6">
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-4xl font-bold ${getPlanTextColor({
                  isBasic,
                  isPro,
                  isBusiness,
                  isEnterprise,
                })}`}
              >
                $
                {billingCycle === "monthly"
                  ? Number(plan.monthly_price).toFixed(0)
                  : (Number(plan.discounted_yearly_price) / 12).toFixed(0) ||
                    Number(plan.yearly_price).toFixed(0)}
              </span>
              <span className="text-gray-400 text-lg font-medium">/month</span>
            </div>
            {billingCycle === "yearly" && (
              <div className="text-gray-400 text-xs mt-1">Billed yearly</div>
            )}
          </div>

          <div className="text-text font-bold">
            Start {plan?.free_trial_days}-Day Free Trial
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-full flex flex-col p-4 rounded-[32px] border-2 transition-all duration-300 cursor-pointer ${
        isSelected
          ? "bg-[#F8F7FF] border-[#B2A5FF]"
          : isPro || isBusiness
            ? "bg-white border-transparent"
            : "bg-white border-gray-100"
      }`}
      style={
        (isPro || isBusiness) && !isSelected
          ? {
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(to right, #1AD1B9, #7C3AED)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }
          : {}
      }
    >
      {(isPro || isBusiness) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1AD1B9] to-[#7C3AED] text-white text-[10px] font-bold px-4 py-1 rounded-lg shadow-md z-20">
          Most Popular
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-text">
            {/* {plan.package_name?.split(" ")[1]} */}
            {returnPackageName(plan.package_name)}
          </h3>
          <SvgIcon
            name="check2"
            width={20}
            height={20}
            className="text-[#7C3AED]"
          />
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-bold ${
                isBasic
                  ? "text-[#1AD1B9]"
                  : isPro || isBusiness
                    ? "text-[#38ACCC]"
                    : isEnterprise
                      ? "text-[#5588DF]"
                      : "text-[#1AD1B9]"
              }`}
            >
              $
              {billingCycle === "monthly"
                ? Number(plan.monthly_price).toFixed(0)
                : (Number(plan.discounted_yearly_price) / 12).toFixed(0) ||
                  Number(plan.yearly_price).toFixed(0)}
            </span>
            <span className="text-gray-400 text-sm font-medium">/month</span>
          </div>
          {billingCycle === "yearly" && (
            <span className="text-gray-400 text-xs">Billed yearly</span>
          )}
        </div>
      </div>

      <p className="text-text text-sm mb-3 leading-tight max-w-[80%]">
        {isPro || isBusiness
          ? "Ideal for growing businesses"
          : isBasic
            ? "Perfect for small businesses getting started"
            : "For established businesses scaling up"}
      </p>

      <div className="mt-auto text-text font-bold text-sm">
        Start 30-Day Free Trial
      </div>
    </div>
  );
};

export default PlanSelectionCard;
