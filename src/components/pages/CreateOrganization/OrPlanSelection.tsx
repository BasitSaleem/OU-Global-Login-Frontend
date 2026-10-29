"use client";
import { Button } from "@/components/ui";
import PlanCardSkeleton from "@/components/PlanCardSkeleton";
import PlanSelectionCard from "./PlanSelectionCard";
import { BillingCycleToggle } from "./BillingCycleToggle";
import type { OrPlanSelectionState } from "@/hooks/useOrPlanSelection";

const usd = (minor: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);

export default function OrPlanSelection({
  state,
  billingCycle = "monthly",
  setBillingCycle,
}: {
  state: OrPlanSelectionState;
  billingCycle?: "monthly" | "yearly";
  setBillingCycle?: (cycle: "monthly" | "yearly") => void;
}) {
  if (!state.selectionEnabled)
    return (
      <p role="status">
        {state.accessPending
          ? "Checking Owners Reach access…"
          : state.accessError
            ? "We could not check Owners Reach access. Refresh the page to try again."
            : "Owners Reach is not available for your account. Contact Owners Universe support to get access."}
      </p>
    );
  if (state.isPending)
    return (
      <div
        aria-label="Loading Owners Reach plans"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <PlanCardSkeleton />
        <PlanCardSkeleton />
        <PlanCardSkeleton />
      </div>
    );
  if (state.isError || !state.data)
    return (
      <div role="alert" className="space-y-3">
        <p>
          Owners Reach plans are unavailable right now. Refresh to try again.
        </p>
        <Button variant="secondary" onClick={() => void state.refetch()}>
          Refresh Owners Reach plans
        </Button>
      </div>
    );
  const plans = state.data.plans;
  const yearlyAvailable = plans.some((plan) => plan.yearlyPriceMinor != null);
  const yearly = yearlyAvailable && billingCycle === "yearly";
  const trialDays = plans[0]?.trialDays;
  return (
    <section aria-label="Owners Reach plans" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-text">Choose your Owners Reach plan</p>
        {yearlyAvailable && setBillingCycle && (
          <BillingCycleToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        )}
      </div>
      <p className="text-sm text-text-secondary">
        Prices in USD, billed {yearly ? "yearly" : "monthly"}. Credits are used for lead
        discovery and enrichment.
        {trialDays
          ? ` Your ${trialDays}-day free trial starts now; you choose monthly or yearly billing when you subscribe.`
          : ""}
      </p>
      {state.stale && (
        <p role="alert">
          Your previous selection is no longer current. Review these plans and
          select one again.
        </p>
      )}
      {state.isFetching && <p role="status">Refreshing plans…</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...plans]
          .sort(
            (a, b) =>
              ["starter", "growth", "scale"].indexOf(a.code) -
              ["starter", "growth", "scale"].indexOf(b.code),
          )
          .map((plan) => {
            // Yearly is shown per month, billed yearly, as for the other products.
            const showYearly = yearly && plan.yearlyPriceMinor != null;
            const perMonthMinor = showYearly
              ? Math.round(plan.yearlyPriceMinor! / 12)
              : plan.monthlyPriceMinor;
            return (
              <PlanSelectionCard
                key={plan.planId}
                plan={{
                  name: plan.displayName,
                  tagline:
                    plan.includedCredits.toLocaleString("en-US") +
                    " credits · " +
                    plan.seats +
                    " seats · " +
                    plan.concurrentRuns +
                    " concurrent runs",
                  price: perMonthMinor / 100,
                  trialDays: 0,
                  priceLabel: usd(perMonthMinor),
                  actionLabel: showYearly
                    ? `Select plan · ${usd(plan.yearlyPriceMinor!)}/year`
                    : "Select plan",
                  isBasic: plan.code === "starter",
                  isEnterprise: plan.code === "scale",
                }}
                isSelected={state.selection?.itemId === plan.planId}
                onClick={() => state.select(plan)}
                billingCycle={showYearly ? "yearly" : "monthly"}
              />
            );
          })}
      </div>
      {!state.onboardingEnabled && (
        <p role="status">
          Owners Reach activation is not available yet. You can review the plans
          here.
        </p>
      )}
    </section>
  );
}
