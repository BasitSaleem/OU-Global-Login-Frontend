"use client";
import { Subscription } from "@/apiHooks.ts/organization/organization.types";
import { useRouter } from "next/navigation";

import React from "react";
import { IconComponent } from "./ui/Icons";
import { Button } from "./ui";

const TrialBanner = ({
  subscription,
  orgId,
}: {
  subscription?: Subscription;
  orgId: string;
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);
  const daysRemaining = React.useMemo(() => {
    if (!subscription?.trial_ends_at) return null;

    const endDate = new Date(subscription.trial_ends_at);
    endDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  }, [subscription?.trial_ends_at]);

  // Show banner for any plan with active trial status
  const shouldShowBanner = isVisible && subscription?.status === "TRIAL";

  if (!shouldShowBanner) return null;

  const handleNavigation = () => {
    router.push(
      `/organization-details/${orgId}/billing/checkout/${subscription?.oiPackage?.id}`,
    );
  };

  return (
    <>

      <div className="w-full mt-4 bg-primary/10 border-primary/10 border rounded-3xl px-6 mb-6 flex items-center justify-between">
        <div className="flex-1 py-4 md:py-0">
          <h2 className="text-xl font-semibold text-primary">
            {daysRemaining === null
              ? "You are currently on a free trial"
              : daysRemaining === 0
                ? "Your free trial ends today"
                : `Your free trial ends in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`}
          </h2>
          <p className="text-[16px] text-gray-500 mb-4">
            Upgrade now to keep full access to all features
          </p>
          <div className="flex gap-3 items-center justify-center md:justify-start">
            <Button
              onClick={handleNavigation}
              variant="primary"
            >
              Upgrade now
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="secondary"
            >
              Dismiss
            </Button>
          </div>
        </div>

        <div className="hidden md:block ml-8">
          <IconComponent name="freeTrial" className="w-52 h-52" />
        </div>
      </div>

    </>
  );
};

export default TrialBanner;
