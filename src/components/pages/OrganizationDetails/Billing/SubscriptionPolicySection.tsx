"use client";

import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { useSubscriptionState } from "@/apiHooks.ts/subscription/subscription.api";
import { ScheduledChangesBanners } from "./ScheduledChangesBanners";
import { ManagePlanSection } from "./ManagePlanSection";
import { ActiveAddonsSection } from "./ActiveAddonsSection";
import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionPolicySection = ({
  organization,
}: {
  organization: OgOrganization;
}) => {
  const orgId = organization?.id;
  const sub = organization?.subscriptions?.[0];

  const { data: state, isLoading } = useSubscriptionState(orgId);

  if (isLoading) {
    return (
      <section className="w-full mt-8">
        <div className="mb-6">
          <Skeleton width="200px" height="32px" className="mb-2" />
          <Skeleton width="350px" height="20px" />
        </div>
        <div className="space-y-6">
          <Skeleton width="100%" height="180px" className="rounded-xl" />
          <Skeleton width="100%" height="100px" className="rounded-xl" />
        </div>
      </section>
    );
  }

  if (!sub || !orgId || !state) return null;

  const isLive = state.status === "ACTIVE" || state.status === "PAST_DUE";
  const hasScheduledChange =
    state.planChangeScheduled || state.frequencyChangeScheduled;
  const canScheduleNew =
    isLive && !state.cancelAtPeriodEnd && !hasScheduledChange;

  if (!isLive || sub.cancel_at_period_end) return null;

  return (
    <section className="w-full mt-8">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-foreground">Manage your plan</h2>
        <p className="text-sm text-text-secondary mt-1">
          Make changes to your subscription, billing frequency, or add-ons.
        </p>
      </div>

      <div className="space-y-8">
        <ScheduledChangesBanners state={state} sub={sub} orgId={orgId} />

        {canScheduleNew && (
          <ManagePlanSection state={state} sub={sub} orgId={orgId} />
        )}

        {state.addons.length > 0 && (
          <ActiveAddonsSection addons={state.addons} orgId={orgId} sub={sub} />
        )}
      </div>
    </section>
  );
};

export default SubscriptionPolicySection;
