"use client";
import React from "react";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { getPlanTextColor } from "@/utils/package-utils";

// Normalized shape both Owners Inventory plans and Owners Pulse packages get
// mapped to, so the same card renders either product's tiers identically.
export interface PlanCardData {
  name: string;
  tagline: string;
  price: number;
  trialDays: number;
  isBasic?: boolean;
  isPro?: boolean;
  isBusiness?: boolean;
  isEnterprise?: boolean;
}

interface PlanSelectionCardProps {
  plan: PlanCardData;
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
  const { name, tagline, price, trialDays, isBasic, isPro, isBusiness, isEnterprise } =
    plan;

  if (!isDirectFlow) {
    return (
      <div
        onClick={onClick}
        className={`relative w-full flex flex-col p-6 rounded-4xl border-2 transition-all duration-300 cursor-pointer h-full ${
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
            {name}
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

        <p className="text-text text-sm mb-10 leading-tight pr-4">{tagline}</p>

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
                ${price.toFixed(0)}
              </span>
              <span className="text-gray-400 text-lg font-medium">/month</span>
            </div>
            {billingCycle === "yearly" && (
              <div className="text-gray-400 text-xs mt-1">Billed yearly</div>
            )}
          </div>

          <div className="text-text font-bold">
            Start {trialDays}-Day Free Trial
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-full flex flex-col p-4 rounded-4xl border-2 transition-all duration-300 cursor-pointer ${
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
          <h3 className="text-xl font-bold text-text">{name}</h3>
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
              className={`text-4xl font-bold ${getPlanTextColor({
                isBasic,
                isPro,
                isBusiness,
                isEnterprise,
              })}`}
            >
              ${price.toFixed(0)}
            </span>
            <span className="text-gray-400 text-sm font-medium">/month</span>
          </div>
          {billingCycle === "yearly" && (
            <span className="text-gray-400 text-xs">Billed yearly</span>
          )}
        </div>
      </div>

      <p className="text-text text-sm mb-3 leading-tight max-w-[80%]">
        {tagline}
      </p>

      <div className="mt-auto text-text font-bold text-sm">
        Start {trialDays}-Day Free Trial
      </div>
    </div>
  );
};

export default PlanSelectionCard;
