"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Clock, Crown } from "lucide-react";
import { Subscription } from "@/apiHooks.ts/organization/organization.types";
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  }, [subscription?.trial_ends_at]);

  const shouldShowBanner = isVisible && subscription?.status === "TRIAL";

  if (!shouldShowBanner) return null;

  const handleNavigation = () => {
    router.push(
      `/organization-details/${orgId}/billing/checkout/${subscription?.oiPackage?.id || ""}`,
    );
  };

  return (
    <div className="w-full mt-4 bg-primary/10 border-border/50 border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Left section: Icon and Text */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#F3E8FF] rounded-2xl flex items-center justify-center shrink-0">
          <Clock className="text-[#FF5B5B] w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-text">
            Your free trial ends in{" "}
            <span className="text-primary">{daysRemaining ?? "0"}</span>{" "}
            {daysRemaining === 1 ? "day" : "days"}
          </h2>
          <p className="text-sm text-text font-medium">
            Upgrade now to keep full access to all features
          </p>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-6">
        {/* <Button
          variant="ghost"
          onClick={() => setIsVisible(false)}
          className="border-none py-5 rounded-xl"
        >
          Dismiss
        </Button> */}
        <Button
          leftIcon={<Crown className="w-5 h-5 animate-crown-attention" />}
          onClick={handleNavigation}
          className="bg-[#1AD1B9] text-white px-6 py-5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default TrialBanner;
