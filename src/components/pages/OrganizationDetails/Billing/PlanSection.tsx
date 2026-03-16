import React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import TrialBanner from "@/components/TrialBanner";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import PricingSkeleton from "@/components/PricingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import PlanCard from "@/components/PlanCard";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

const DUMMY_PRICING_PLANS = [
  {
    title: "Basic",
    price: "Free",
    pricePeriod: "",
    buttonText: "Activated",
    userCount: "2 seats",
    features: [
      "Human Resource",
      "Single Location",
      "Single Warehouse",
      "100 Products",
      "Advance Point of Sales",
      "100 Invoices / Month",
      "50 Purchase Orders / Month",
      "100 Transfer Orders / Month",
      "Online Store",
      "Coupons",
      "Basic Accounts & Financials",
    ],
    borderColor: "#FFCB00",
    buttonColor: "#1AD1B9",
    priceColor: "#1AD1B9",
    badge: {
      text: "Current Plan",
      backgroundColor: "#FFCB00",
      textColor: "#231F20",
    },
    isCurrentPlan: true,
  },
  {
    title: "Standard",
    price: "$49",
    pricePeriod: "/month",
    buttonText: "Upgrade Now",
    userCount: "5 users",
    features: [
      "5 users",
      "Human Resource",
      "02 Locations",
      "02 Warehouse",
      "Unlimited Products",
      "Advance Point of Sales",
      "700 Invoices / Month",
      "500 Purchase Orders / Month",
      "700 Transfer Orders / Month",
      "Online Store",
      "Coupons",
      "Basic Accounts & Financials",
    ],
    borderColor: "#E5E7EB",
    buttonColor: "#38ACCC",
    priceColor: "#38ACCC",
  },
  {
    title: "Professional",
    price: "$99",
    pricePeriod: "/month",
    buttonText: "Upgrade Now",
    userCount: "10 users",
    features: [
      "10 users",
      "Human Resource",
      "04 Locations",
      "03 Warehouse",
      "Unlimited Products",
      "Advance Point of Sales",
      "3000 Invoices / Month",
      "1500 Purchase Orders / Month",
      "3000 Transfer Orders / Month",
      "Online Store",
      "Coupons",
      "Loyality",
      "Production Orders",
      "Machines",
      "Advance Accounts & Financials",
    ],
    borderColor: "#5588DF",
    buttonColor: "#5588DF",
    priceColor: "#5588DF",
    background:
      "linear-gradient(0deg, rgba(85, 136, 223, 0.02) 0%, rgba(85, 136, 223, 0.02) 100%), white",
    badge: {
      text: "Most Popular",
      backgroundColor: "#5588DE",
    },
    isPopular: true,
    onButtonClick: () => console.log("Upgrade to Professional"),
  },
  {
    title: "Premium",
    price: "$199",
    pricePeriod: "/month",
    buttonText: "Upgrade Now",
    userCount: "Unlimited Users",
    features: [
      "Unlimited Users",
      "Human Resource",
      "06 Locations",
      "06 Warehouse",
      "Unlimited Products",
      "Advance Point of Sales",
      "4500 Invoices / Month",
      "5500 Purchase Orders / Month",
      "2500 Transfer Orders / Month",
      "Online Store",
      "Coupons",
      "Loyalty",
      "Production Orders",
      "Machines",
      "Advance Accounts & Financials",
    ],
    borderColor: "#8B5CF6",
    buttonColor: "#8B5CF6",
    priceColor: "#8B5CF6",
    badge: {
      text: "Best Value",
      backgroundColor: "#8B5CF6",
    },
    onButtonClick: () => console.log("Upgrade to Premium"),
  },
  // {
  //     title: "Enterprise",
  //     price: "$399",
  //     pricePeriod: "/month",
  //     buttonText: "Contact Sales",
  //     userCount: "Unlimited Users",
  //     features: [
  //         "Unlimited Users",
  //         "Human Resource",
  //         "10 Locations",
  //         "10 Warehouse",
  //         "Unlimited Products",
  //         "Advance Point of Sales",
  //         "10000 Invoices / Month",
  //         "10000 Purchase Orders / Month",
  //         "10000 Transfer Orders / Month",
  //         "Online Store",
  //         "Coupons",
  //         "Loyalty",
  //         "Production Orders",
  //         "Machines",
  //         "Advanced Accounts & Financials",
  //         "Priority Support",
  //         "Custom Integrations",
  //         "Dedicated Account Manager"
  //     ],
  //     borderColor: "#10B981",
  //     buttonColor: "#10B981",
  //     priceColor: "#10B981",
  //     badge: {
  //         text: "Enterprise",
  //         backgroundColor: "#10B981"
  //     },
  //     onButtonClick: () => console.log('Contact for Enterprise')
  // },
  {
    title: "Starter",
    price: "$19",
    pricePeriod: "/month",
    buttonText: "Get Started",
    userCount: "1 user",
    features: [
      "1 user",
      "Single Location",
      "Single Warehouse",
      "50 Products",
      "Basic Point of Sales",
      "50 Invoices / Month",
      "25 Purchase Orders / Month",
      "50 Transfer Orders / Month",
      "Basic Accounts",
    ],
    borderColor: "#6B7280",
    buttonColor: "#6B7280",
    priceColor: "#6B7280",
    onButtonClick: () => console.log("Get Starter Plan"),
  },
];

const PlanSection = ({ organization }: { organization: OgOrganization }) => {
  const { data, isLoading, error } = useGetAllPlans();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const CARD_WIDTH = 320;
  const GAP = 16;
  const TOTAL_MOVE = CARD_WIDTH + GAP;

  // Dynamic calculation for max index
  const [maxIndex, setMaxIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const planCount = data?.plans?.length ?? 0;

  const sortedPlans = React.useMemo(() => {
    if (!data?.plans) return [];

    const typeOrder = ["RETAIL", "MANUFACTURING", "ECOMMERCE", "HYBRID"];

    return [...data.plans].sort((a, b) => {
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });
  }, [data?.plans]);

  React.useEffect(() => {
    const updateMaxIndex = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardsVisible = Math.floor(containerWidth / TOTAL_MOVE);
        const CalculatedMaxIndex = Math.max(0, planCount - cardsVisible);
        setMaxIndex(CalculatedMaxIndex);
      }
    };

    updateMaxIndex();
    window.addEventListener("resize", updateMaxIndex);
    return () => window.removeEventListener("resize", updateMaxIndex);
  }, [planCount, TOTAL_MOVE]);

  const maxOffset = -(maxIndex * TOTAL_MOVE);

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="text-center md:text-left">
      <div className="flex justify-between items-center gap-2 ">
        <div className="flex gap-2 ">
          <h1 className="text-heading-1 font-bold">
            Your plan{" "}
            <span className="text-primary font-semibold">
              {organization.subscriptions?.[0]?.oiPackage?.package_name}
            </span>{" "}
          </h1>

          <span
            className={`px-1.5 py-1 rounded-full text-xs font-semibold capitalize ${
              organization.subscriptions?.[0]?.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : organization.subscriptions?.[0]?.status === "TRIAL"
                  ? "bg-blue-100 text-blue-700"
                  : organization.subscriptions?.[0]?.status === "PAST_DUE"
                    ? "bg-red-100 text-red-700"
                    : organization.subscriptions?.[0]?.status === "CANCELLED"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-gray-100 text-gray-400"
            }`}
          >
            {organization.subscriptions?.[0]?.status ?? "No Subscription"}
          </span>
        </div>
        {organization.subscriptions?.[0]?.status !== "TRIAL" &&
          organization.subscriptions?.[0]?.status !== "CANCELLED" && (
            <CancelSubscriptionButton
              subscriptionId={organization.subscriptions?.[0]?.id!}
              orgId={organization.id as string}
            />
          )}
      </div>
      <p className="text-body-small mt-2">
        {organization.subscriptions?.[0]?.status === "CANCELLED" ? (
          "Your subscription has been cancelled."
        ) : (
          <>
            Your Organization is currently on the{" "}
            <span className="text-primary font-semibold">
              {organization.subscriptions?.[0]?.oiPackage?.package_name}
            </span>{" "}
            Plan.
          </>
        )}
      </p>

      {/* Alert box for showing you are on free trail which will be end on the DATE if the status TRAIL */}
      <TrialBanner
        subscription={organization.subscriptions?.[0]}
        orgId={organization.id}
      />

      <div
        className="mt-9 relative group w-full grid grid-cols-1"
        ref={containerRef}
      >
        <Button
          variant="basic"
          onClick={handlePrev}
          // disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -ml-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 "
        >
          {" "}
          <ChevronLeft size={40} color="white" />
        </Button>

        <Button
          variant="basic"
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -mr-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 "
        >
          {" "}
          <ChevronRight size={40} color="white" />
        </Button>

        <div className="overflow-hidden w-full  py-4 -my-4">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <PricingSkeleton key={i} />
              ))}
            </div>
          )}
          {error && <ErrorMessage message={error.message} />}
          {!isLoading && data && (
            <motion.div
              className="flex gap-4 touch-pan-y cursor-grab active:cursor-grabbing"
              style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
              animate={{ x: -currentIndex * TOTAL_MOVE }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragElastic={0.1}
              // If all cards fit, maxOffset is 0, so no drag possible to the left
              dragConstraints={{ right: 0, left: maxOffset }}
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x;

                if (swipe < -50 && currentIndex < maxIndex) {
                  setCurrentIndex((prev) => prev + 1);
                } else if (swipe > 50 && currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                }
              }}
            >
              {sortedPlans.map((plan) => (
                <motion.div key={plan.id} className="flex-shrink-0 w-80">
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={
                      plan.id === organization.subscriptions?.[0]?.oiPackage?.id
                    }
                    subscriptionStatus={organization.subscriptions?.[0]?.status}
                    subscriptionId={organization.subscriptions?.[0]?.id}
                  />
                </motion.div>
              ))}
              {/* {DUMMY_PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80"
                // animate={{
                //     scale: index === currentIndex ? 1 : 0.95,
                //     opacity: index === currentIndex ? 1 : 0.7
                // }}
                // transition={{ duration: 0.3 }}
              >
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  pricePeriod={plan.pricePeriod}
                  buttonText={plan.buttonText}
                  userCount={plan.userCount}
                  features={plan.features}
                  borderColor={plan.borderColor}
                  buttonColor={plan.buttonColor}
                  priceColor={plan.priceColor}
                  background={plan.background}
                  badge={plan.badge}
                  isCurrentPlan={plan.isCurrentPlan}
                  isPopular={plan.isPopular}
                  onButtonClick={plan.onButtonClick}
                />
              </motion.div>
            ))} */}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanSection;
