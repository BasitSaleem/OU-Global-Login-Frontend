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
import { SUBSCRIPTION_STATUS_COLOR } from "@/utils/ColorClasses";
import CancelSubscriptionModal from "@/components/modals/CancelSubscriptionModal";
import { Skeleton } from "@/components/ui/skeleton";
const PlanSection = ({ organization, loading }: { organization?: OgOrganization, loading: boolean }) => {
  const { data, isLoading, error } = useGetAllPlans();
  const [cancelSubscriptionModal, setCancelSubscriptionModal] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const CARD_WIDTH = 320;
  const GAP = 16;
  const TOTAL_MOVE = CARD_WIDTH + GAP;
  const [maxIndex, setMaxIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const planCount = data?.plans?.length ?? 0;

  const sortedPlans = React.useMemo(() => {
    if (!data?.plans) return [];

    const typeOrder = ["RETAIL", "MANUFACTURING", "ECOMMERCE", "HYBRID"];
    const packageOrder = ["BASIC", "PRO", "PREMIUM"];

    return [...data.plans].sort((a, b) => {
      const typeDiff = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
      if (typeDiff !== 0) return typeDiff;
      const aName = a.package_name.toUpperCase();
      const bName = b.package_name.toUpperCase();

      const aLevel = packageOrder.findIndex((p) => aName.includes(p));
      const bLevel = packageOrder.findIndex((p) => bName.includes(p));

      return aLevel - bLevel;
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
  const cancelSubscription = () => {
    setCancelSubscriptionModal(true);
  }

  return (
    <div className="text-center md:text-left">
      <div className="flex justify-between items-center gap-2 ">
        <div className="flex gap-2 ">
          <h1 className="text-text font-bold">
            {loading ? <Skeleton width={180} height={20} className="mt-1" /> : <>Your are on<span className="pl-1.5 text-primary font-semibold">
              {organization?.subscriptions?.[0]?.oiPackage?.package_name}
            </span>{" "}
              plan</>}

          </h1>
          {loading ? <Skeleton width={50} height={25} circle /> : (
            <span
              className={`px-1.5 py-1 rounded-full text-xs text-text font-semibold capitalize ${SUBSCRIPTION_STATUS_COLOR[
                organization?.subscriptions?.[0]?.status ?? ""
              ]
                }`}
            >
              {organization?.subscriptions?.[0]?.status ?? "No Subscription"}
            </span>
          )}
        </div>
        {organization?.subscriptions?.[0]?.status !== "TRIAL" &&
          organization?.subscriptions?.[0]?.status !== "CANCELLED" && (
            loading ? (
              <Skeleton width={200} height={35} circle />
            ) : (
              <Button variant="destructive"
                className="rounded-full"
                onClick={cancelSubscription}
              >
                Cancel Subscription
              </Button>
            )
          )}
      </div>
      {/* {loading ? <Skeleton width={200} height={10} className="mt-1" /> : (
        <p className="text-body-small mt-2">
          {organization?.subscriptions?.[0]?.status === "CANCELLED" ? (
            "Your subscription has been cancelled."
          ) : (
            organization?.subscriptions?.[0]?.oiPackage?.package_name ? (
              <>
                Your Organization is currently on the{" "}
                <span className="text-primary font-semibold">
                  {organization?.subscriptions?.[0]?.oiPackage?.package_name}
                </span>{" "}
                Plan.
              </>
            ) : (
              "No subscription plan found."
            )
          )}
        </p>
      )} */}
      {loading ? (
        <div className="w-full mt-4 bg-primary/10 border-primary/10 border rounded-3xl px-6 mb-6 flex items-center justify-between">
          <div className="flex flex-col py-4 gap-2 md:py-5 md:mt-10">
            <Skeleton width={450} height={10} />
            <Skeleton width={400} height={10} />
            <div className="flex gap-2 md:my-6">
              <Skeleton width={100} height={32} />
              <Skeleton width={100} height={32} />
            </div>
          </div>
          <div className="flex flex-col py-4 gap-2 md:py-6">
            <Skeleton width={250} height={10} />
            <Skeleton width={200} height={10} />
            <Skeleton width={260} height={10} />
            <Skeleton width={230} height={10} />
          </div>
        </div>
      ) : (
        <TrialBanner
          subscription={organization?.subscriptions?.[0]}
          orgId={organization?.id!}
        />
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
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -mr-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 "
          >
            {" "}
            <ChevronRight size={40} color="white" />
          </Button>
          <div className="overflow-hidden w-full  py-4 -my-4">
            {error && <ErrorMessage message={error.message} />}
            {!isLoading && data && (
              <motion.div
                className="flex gap-4 touch-pan-y cursor-grab active:cursor-grabbing"
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
              > <>

                  {sortedPlans?.map((plan) => (
                    <motion.div key={plan.id} className="flex-shrink-0 w-80">
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={
                          plan.id === organization?.subscriptions?.[0]?.oiPackage?.id
                        }
                        subscriptionStatus={organization?.subscriptions?.[0]?.status}
                        subscriptionId={organization?.subscriptions?.[0]?.id}
                      />
                    </motion.div>
                  ))}

                </>

              </motion.div>
            )}
          </div>
        </div>
      )}
      <CancelSubscriptionModal
        isOpen={cancelSubscriptionModal}
        onClose={() => setCancelSubscriptionModal(false)}
        subscriptionId={organization?.subscriptions?.[0]?.id as string}
        orgId={organization?.id as string}
      />
    </div >
  );
};

export default PlanSection;
