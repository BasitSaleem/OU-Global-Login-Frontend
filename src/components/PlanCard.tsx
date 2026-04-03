import React from "react";
import { OiPlanType } from "@/apiHooks.ts/plans/plans.types";
import { useParams, useRouter } from "next/navigation";
import { useCancelSubscription } from "@/apiHooks.ts/subscription/subscription.api";

interface PlanCardProps {
  plan: OiPlanType;
  isCurrentPlan?: boolean;
  subscriptionStatus?: string;
  className?: string;
  subscriptionId?: string;
}

const getPlanStyles = (type: string) => {
  switch (type.toLowerCase()) {
    case "retail":
      return {
        borderColor: "#FFCB00",
        buttonColor: "#1AD1B9",
        priceColor: "#1AD1B9",
        badgeColor: "#FFCB00",
        background: "white",
      };
    case "manufacturing":
      return {
        borderColor: "#5588DF",
        buttonColor: "#5588DF",
        priceColor: "#5588DF",
        badgeColor: "#5588DF",
        background:
          "linear-gradient(0deg, rgba(85,136,223,0.02) 0%, rgba(85,136,223,0.02) 100%), white",
      };
    case "ecommerce":
      return {
        borderColor: "#8B5CF6",
        buttonColor: "#8B5CF6",
        priceColor: "#8B5CF6",
        badgeColor: "#8B5CF6",
        background: "white",
      };
    case "hybrid":
      return {
        borderColor: "#6B7280",
        buttonColor: "#6B7280",
        priceColor: "#6B7280",
        badgeColor: "#6B7280",
        background: "white",
      };
    default:
      return {
        borderColor: "#E5E7EB",
        buttonColor: "#38ACCC",
        priceColor: "#38ACCC",
        badgeColor: "#38ACCC",
        background: "white",
      };
  }
};

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan = false,
  className = "",
}) => {
  const styles = getPlanStyles(plan.type);
  const { orgId } = useParams();
  const router = useRouter();

  const renderFeatures = () => {
    const features = [
      { text: `${plan.no_of_users || "0"} users`, included: plan.show_users },
      { text: "Human Resource", included: plan.show_people },
      {
        text: `${plan.no_of_stores || "0"} Locations`,
        included: plan.show_stores,
      },
      {
        text: `${plan.no_of_warehouses || "0"} Warehouse`,
        included: plan.show_warehouses,
      },
      {
        text: `${plan.no_of_products || "0"} Products`,
        included: plan.show_products,
      },
      { text: "Advance Point of Sales", included: plan.show_pos },
      { text: "Online Store", included: plan.show_online_store },
      { text: "Manufacturing", included: plan.show_manufacturing },
    ].filter((f) => f.included !== null);

    return features.map((feature, index) => (
      <div
        key={index}
        className={`text-center flex justify-center flex-col text-base font-normal leading-9 break-words font-inter ${feature.included
            ? "text-text opacity-100"
            : "text-text opacity-60 line-through"
          }`}
      >
        {feature.text}
      </div>
    ));
  };

  const badgeLabel = isCurrentPlan
    ? "Current Plan"
    : plan.type.charAt(0).toUpperCase() + plan.type.slice(1).toLowerCase();

  return (
    <div
      className={`relative flex flex-col items-center p-5 rounded-3xl border-2 box-border h-[830px] cursor-pointer ${className}`}
      style={{
        borderColor: styles.borderColor,
        // background: styles.background,
      }}
    >
      {/* Badge — always visible */}
      <div
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7  flex items-center justify-center z-10 rounded-2xl"
        style={{ backgroundColor: styles.badgeColor }}
      >
        <div className="text-center flex justify-center flex-col text-sm font-semibold break-words text-white">
          {badgeLabel}
        </div>
      </div>

      <div className={`w-full flex flex-col items-center gap-2.5 mt-2.5`}>
        {/* Title */}
        <div className="w-full text-center text-xl font-semibold text-text">
          {plan.package_name}
        </div>

        {/* Price */}
        <div className="w-full text-center flex flex-col items-center">
          <span
            className="text-4xl font-semibold font-inter"
            style={{ color: styles.priceColor }}
          >
            ${plan.monthly_price}
          </span>
          <span
            className="text-sm font-normal text-text"
            style={{ color: styles.priceColor }}
          >
            /month
          </span>
        </div>

        {/* Button */}
        <div
          className={`w-full h-10 rounded-full flex items-center justify-center ${isCurrentPlan ? "opacity-50 cursor-not-allowed" : "cursor-pointer transition-opacity hover:opacity-90"}`}
          style={{ backgroundColor: styles.buttonColor }}
          onClick={() => {
            if (isCurrentPlan) return;
            router.push(
              `/organization-details/${orgId}/billing/checkout/${plan.id}`,
            );
          }}
        >
          <div className="text-white text-base font-semibold font-inter">
            {isCurrentPlan ? "Activated" : "Upgrade Now"}
          </div>
        </div>

        {/* Users */}
        <div className="w-full text-center text-base font-normal font-inter">
          {plan.no_of_users} users
        </div>

        {/* Features */}
        <div className="w-full text-center flex flex-col gap-1 mt-2">
          {renderFeatures()}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
