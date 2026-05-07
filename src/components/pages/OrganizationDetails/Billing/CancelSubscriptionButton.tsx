import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import CancelSubscriptionModal from "@/components/modals/CancelSubscriptionModal";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";

interface CancelSubscriptionButtonProps {
  loading: boolean;
  organization: OgOrganization | undefined;
}

const CancelSubscriptionButton = ({
  loading,
  organization,
}: CancelSubscriptionButtonProps) => {
  const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false);

  const cancelSubscription = () => {
    setCancelSubscriptionModal(true);
  };

  const subscription = organization?.subscriptions?.[0];

  return (
    <>
      {subscription?.status !== "TRIAL" &&
        subscription?.status !== "CANCELLED" &&
        !subscription?.cancel_at_period_end && (
          <div className="w-full md:w-auto">
            {loading ? (
              <Skeleton
                width="100%"
                height={40}
                className="md:w-[200px]"
                circle
              />
            ) : (
              <Button
                variant="destructive"
                className="rounded-full md:w-auto md:mt-2 bg-transparent text-text border-none hover:text-white active:bg-red-700"
                onClick={cancelSubscription}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        )}
      <CancelSubscriptionModal
        isOpen={cancelSubscriptionModal}
        onClose={() => setCancelSubscriptionModal(false)}
        subscriptionId={organization?.subscriptions?.[0]?.id as string}
        orgId={organization?.id as string}
      />
    </>
  );
};

export default CancelSubscriptionButton;
