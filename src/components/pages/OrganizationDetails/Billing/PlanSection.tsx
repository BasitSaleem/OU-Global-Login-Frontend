import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  Store,
  Factory,
  ShoppingCart,
  Layers,
} from "lucide-react";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import TrialBanner from "@/components/TrialBanner";
import { useGetAllPlans } from "@/apiHooks.ts/plans/plans.api";
import PricingSkeleton from "@/components/PricingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import PlanCard from "@/components/PlanCard";
import { SUBSCRIPTION_STATUS_COLOR } from "@/utils/ColorClasses";
import { Skeleton } from "@/components/ui/skeleton";
import BillingCycleToggle from "./BillingCycleToggle";
import SubscriptionCancelAlert from "./SubscriptionCancelAlert";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

const typeData = [
  {
    id: "RETAIL",
    label: "Retail",
    icon: Store,
    description: "Perfect for stores, shops and multi locations business",
  },
  {
    id: "MANUFACTURING",
    label: "Manufacturing",
    icon: Factory,
    description: "Ideal for factories and production line management",
  },
  {
    id: "ECOMMERCE",
    label: "Ecommerce",
    icon: ShoppingCart,
    description: "Best for online stores and digital marketplaces",
  },
  {
    id: "HYBRID",
    label: "Hybrid",
    icon: Layers,
    description: "Versatile solutions for combined business models",
  },
];

const CARD_WIDTH = 380;
const GAP = 16;
const TOTAL_MOVE = CARD_WIDTH + GAP;

const PlanSection = ({
  organization,
  loading,
}: {
  organization?: OgOrganization;
  loading: boolean;
}) => {
  const { data, isLoading, error } = useGetAllPlans();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeType, setActiveType] = useState<string>("RETAIL");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPlans = useMemo(() => {
    if (!data?.plans) return [];

    const packageOrder = ["BASIC", "PRO", "PREMIUM"];

    return [...data.plans]
      .filter((plan) => plan.type === activeType)
      .sort((a, b) => {
        const aName = a.package_name.toUpperCase();
        const bName = b.package_name.toUpperCase();

        if (activeType === "HYBRID") {
          const getHybridOrder = (name: string) => {
            if (name.includes("BUSINESS")) return 0;
            if (name.includes("ENTERPRISE")) return 1;
            return 2;
          };

          return getHybridOrder(aName) - getHybridOrder(bName);
        }

        const aLevel = packageOrder.findIndex((p) => aName.includes(p));
        const bLevel = packageOrder.findIndex((p) => bName.includes(p));

        return aLevel - bLevel;
      });
  }, [data?.plans, activeType]);
  const planCount = filteredPlans.length;

  useEffect(() => {
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

  const handleActivePlanClick = () => {
    const currentPkgId = organization?.subscriptions?.[0]?.oiPackage?.id;
    if (!currentPkgId || !data?.plans) return;

    const fullPlan = data.plans.find((p: any) => p.id === currentPkgId);
    if (fullPlan) {
      setActiveType(fullPlan.type);

      const packageOrder = ["BASIC", "PRO", "PREMIUM"];
      const plansOfType = data.plans
        .filter((plan: any) => plan.type === fullPlan.type)
        .sort((a: any, b: any) => {
          const aName = a.package_name.toUpperCase();
          const bName = b.package_name.toUpperCase();

          const aLevel = packageOrder.findIndex((p) => aName.includes(p));
          const bLevel = packageOrder.findIndex((p) => bName.includes(p));

          return aLevel - bLevel;
        });

      const index = plansOfType.findIndex((p: any) => p.id === currentPkgId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  };

  return (
    <div className="text-center md:text-left">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 ">
          <h1 className="text-text font-bold text-lg md:text-xl">
            {loading ? (
              <Skeleton width={180} height={24} className="mt-1" />
            ) : (
              <>
                {organization?.subscriptions?.[0]?.status === "CANCELLED" ? (
                  <>
                    You just cancelled your
                    <span
                      onClick={handleActivePlanClick}
                      className={`pl-1.5 bg-transparent font-semibold cursor-pointer hover:underline underline-offset-4 decoration-primary/50 transition-all ${SUBSCRIPTION_STATUS_COLOR[organization?.subscriptions?.[0]?.status ?? ""]} ${organization?.subscriptions?.[0]?.status === "CANCELLED" ? "line-through" : ""}`}
                    >
                      {
                        organization?.subscriptions?.[0]?.oiPackage
                          ?.package_name
                      }
                    </span>{" "}
                    plan
                  </>
                ) : (
                  <>
                    You are on
                    <span
                      onClick={handleActivePlanClick}
                      className="pl-1.5 text-primary font-semibold cursor-pointer hover:underline underline-offset-4 decoration-primary/50 transition-all"
                    >
                      {
                        organization?.subscriptions?.[0]?.oiPackage
                          ?.package_name
                      }
                    </span>{" "}
                    plan
                  </>
                )}
              </>
            )}
          </h1>

          {loading ? (
            <Skeleton width={80} height={24} circle />
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs  font-semibold capitalize ${
                SUBSCRIPTION_STATUS_COLOR[
                  organization?.subscriptions?.[0]?.status ?? ""
                ]
              }`}
            >
              {organization?.subscriptions?.[0]?.status ?? "No Subscription"}
            </span>
          )}
        </div>
      </div>
      {loading ? (
        <div className="w-full mt-4 bg-primary/10 border-primary/10 border rounded-3xl px-4 md:px-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col py-6 md:py-10 gap-3 w-full md:w-auto">
            <Skeleton width="80%" height={12} className="md:w-[450px]" />
            <Skeleton width="60%" height={12} className="md:w-[400px]" />
            <div className="flex gap-2 mt-4 md:my-6">
              <Skeleton width={110} height={36} />
              <Skeleton width={110} height={36} />
            </div>
          </div>
          <div className="flex flex-col py-6 md:py-6 gap-2 w-full md:w-auto items-center md:items-end">
            <Skeleton width="100%" height={8} className="md:w-[250px]" />
            <Skeleton width="90%" height={8} className="md:w-[200px]" />
            <Skeleton width="95%" height={8} className="md:w-[260px]" />
            <Skeleton width="85%" height={8} className="md:w-[230px]" />
          </div>
        </div>
      ) : (
        <>
          <TrialBanner
            subscription={organization?.subscriptions?.[0]}
            orgId={organization?.id!}
          />
          <SubscriptionCancelAlert
            subscription={organization?.subscriptions?.[0]}
          />

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-2 p-1 bg-[#EEEDF0]  rounded-2xl w-fit">
                {typeData.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setActiveType(type.id);
                        setCurrentIndex(0);
                      }}
                      className={`flex items-center gap-1 px-4  cursor-pointer py-2 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white shadow-md"
                          : "text-black hover:bg-primary/10"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              <BillingCycleToggle
                value={billingCycle}
                onChange={setBillingCycle}
              />
            </div>
            <p className="text-gray-500 text-lg">
              {typeData.find((t) => t.id === activeType)?.description}
            </p>
          </div>
        </>
      )}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <PricingSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          className="mt-9 relative group w-full grid grid-cols-1"
          ref={containerRef}
        >
          {planCount > 3 && (
            <>
              <Button
                variant="basic"
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -ml-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 "
              >
                {" "}
                <ChevronLeft size={40} color="white" />
              </Button>

              <Button
                variant="basic"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 -mr-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 text-white"
              >
                {" "}
                <ChevronRight size={40} color="white" />
              </Button>
            </>
          )}
          <div className=" w-full py-4 -my-4">
            {error && <ErrorMessage message={error.message} />}
            {!isLoading && data && (
              <motion.div
                className={`flex gap-4 touch-pan-y cursor-grab`}
                style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
                animate={{ x: -currentIndex * TOTAL_MOVE }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragElastic={0.1}
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
                {" "}
                <>
                  {filteredPlans?.map((plan) => (
                    <motion.div key={plan.id} className="shrink-0 w-[380px]">
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={
                          plan.id ===
                          organization?.subscriptions?.[0]?.oiPackage?.id
                        }
                        subscriptionStatus={
                          organization?.subscriptions?.[0]?.status
                        }
                        subscriptionId={organization?.subscriptions?.[0]?.id}
                        billingCycle={billingCycle}
                      />
                    </motion.div>
                  ))}
                </>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSection;
