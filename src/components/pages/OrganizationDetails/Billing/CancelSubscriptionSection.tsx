"use client";

import React from "react";
import { AlertTriangle, Info } from "lucide-react";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import CancelSubscriptionButton from "./CancelSubscriptionButton";
import { useSubscriptionState } from "@/apiHooks.ts/subscription/subscription.api";

const CancelSubscriptionSection = ({
  loading,
  organization,
}: {
  loading: boolean;
  organization: OgOrganization;
}) => {
  const { data: state } = useSubscriptionState(organization?.id);
  const subscription = organization?.subscriptions?.[0];

  if (
    subscription?.status === "TRIAL" ||
    subscription?.status === "CANCELLED" ||
    subscription?.cancel_at_period_end
  ) {
    return null;
  }

  // A pending plan/frequency change is executed by a Stripe Subscription
  // Schedule; the subscription can't also take a cancellation at the same time.
  // Ask the user to undo the scheduled change first.
  const hasScheduledChange =
    Boolean(state?.planChangeScheduled) ||
    Boolean(state?.frequencyChangeScheduled);

  if (hasScheduledChange) {
    return (
      <section className="flex w-full flex-row items-start gap-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-4 rounded-xl mt-5 mb-2 shadow-sm">
        <div className="bg-[#f59e0b]/20 p-2 rounded-lg shrink-0">
          <Info className="text-[#f59e0b]" size={20} />
        </div>
        <div className="flex flex-col mt-0.5">
          <p className="text-foreground text-sm font-semibold">
            Scheduled change pending
          </p>
          <p className="text-text-secondary text-sm mt-1">
            You have a scheduled plan change. Undo it above before cancelling your subscription.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-row items-center justify-between bg-[#FEF1F0] py-1 px-2 rounded-lg mt-5 -mb-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-red-500" size={24} />
        <p className="text-text text-sm font-normal">
          <span className="text-sm text-red-500 font-medium ">
            Cancel subscription.
          </span>{" "}
          Your {organization?.packageName} plan stays active until the end of
          your current billing cycle. You won&apos;t be charged again.
        </p>
      </div>

      <CancelSubscriptionButton loading={loading} organization={organization} />
    </section>
  );
};

export default CancelSubscriptionSection;
