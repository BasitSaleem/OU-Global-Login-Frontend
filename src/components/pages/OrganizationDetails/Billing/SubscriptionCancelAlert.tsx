import { Subscription } from "@/apiHooks.ts/organization/organization.types";
import { formatDate } from "@/utils/helpers";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface SubscriptionCancelAlertProps {
  subscription: Subscription | undefined;
}

const SubscriptionCancelAlert = ({
  subscription,
}: SubscriptionCancelAlertProps) => {
  if (subscription?.cancel_at_period_end) {
    const endDate: string = formatDate(subscription?.current_period_end);
    return (
      <div className="mt-2 flex items-center gap-2 py-1 px-2 bg-[#FFF9EE] text-[#927401] text-xs font-medium rounded-md border border-[#F5E3C3] dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40">
        <AlertTriangle height={16} width={16} />
        <p>
          Your subscription has been cancelled. You will continue to have full
          access to all features included in your plan until {endDate}. After
          this date, your organization will become inactive.
        </p>
      </div>
    );
  }
  return null;
};

export default SubscriptionCancelAlert;
