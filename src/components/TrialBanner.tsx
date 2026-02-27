"use client";
import { Subscription } from "@/apiHooks.ts/organization/organization.types";
import { useRouter } from "next/navigation";

import React from "react";
import { IconComponent } from "./ui/Icons";

const TrialBanner = ({ subscription }: { subscription?: Subscription }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(true);

  // Calculate days remaining
  const daysRemaining = React.useMemo(() => {
    if (!subscription?.trial_ends_at) return null;

    const endDate = new Date(subscription.trial_ends_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate day difference

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  }, [subscription?.trial_ends_at]);

  // Show banner for any plan with active trial (15 days or less remaining)
  const shouldShowBanner =
    isVisible &&
    subscription?.status === "TRIAL" &&
    subscription?.trial_ends_at &&
    daysRemaining !== null &&
    daysRemaining <= 15;

  if (!shouldShowBanner) return null;

  return (
    <>
      <div className="w-full mt-4 bg-primary/10 border-primary/10 border-3 rounded-3xl px-6 mb-6 flex items-center justify-between">
        <div className="flex-1 py-4 md:py-0">
          <h2 className="text-xl font-semibold text-primary">
            {daysRemaining === 0
              ? "Your free trial ends today"
              : `Your free trial ends in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`}
          </h2>
          <p className="text-[16px] text-gray-500 mb-4">
            Upgrade now to keep full access to all features
          </p>
          <div className="flex gap-3 items-center justify-center md:justify-start">
            <button className="bg-primary text-white px-6 py-2 rounded-[8px] font-medium cursor-pointer text-sm hover:bg-primary/90 transition-colors">
              Upgrade now
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-white border border-primary text-primary px-6 py-2 rounded-[8px] font-medium cursor-pointer text-sm hover:bg-primary/5 transition-colors"
            >
              Dismiss
            </button>
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
