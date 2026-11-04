"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";
import BillingSection from "@/components/pages/OrganizationDetails/Billing/BillingSection";
import OpBillingSection from "@/components/pages/OrganizationDetails/Billing/OpBillingSection";
import {
  OwnerKey,
  OWNER_META,
} from "@/components/pages/OrganizationDetails/Billing/OwnersProductItem";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";

import NotFound from "@/components/NotFound";
import { useAppSelector } from "@/redux/store";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import BillingAddOnsSection from "@/components/pages/OrganizationDetails/Billing/AddOnsSection";
import CancelSubscriptionSection from "@/components/pages/OrganizationDetails/Billing/CancelSubscriptionSection";
import SubscriptionPolicySection from "@/components/pages/OrganizationDetails/Billing/SubscriptionPolicySection";
import PlatformBillingSection from "@/components/pages/OrganizationDetails/Billing/PlatformBillingSection";
import { useBillingOptions } from "@/apiHooks.ts/billing/billingGateway.api";

const OWNER_ORDER = ["OI", "OP", "OJ", "OM", "OA"];

function BillingPage() {
  const { orgId } = useParams();

  const {
    data: organization,
    isLoading,
    error,
  } = useOrganizationDetails(orgId as string);

  const [selectedOwner, setSelectedOwner] = useState<OwnerKey>("inventory");

  // Gateway for this org (billing country / live subscription). Redirect
  // gateways (PayFast) price plans in their own currency.
  const { data: billingOptions } = useBillingOptions(orgId as string);
  const localPricing =
    billingOptions?.flow === "redirect"
      ? { provider: billingOptions.provider, currency: billingOptions.currency }
      : undefined;
  const latestSubscription = organization?.subscriptions?.[0];
  const isPlatformBilled =
    !!latestSubscription?.provider &&
    latestSubscription.provider !== "STRIPE" &&
    latestSubscription.status !== "CANCELLED";

  // Keep the selected product valid for THIS org: default to the first product
  // the org actually has (in OWNER_ORDER), and correct the selection if it's not
  // one the org owns.
  useEffect(() => {
    const names = (organization?.products ?? [])
      .map((p) => p.product_name)
      .filter(Boolean) as string[];
    const availableKeys = OWNER_ORDER.filter((n) => names.includes(n))
      .map((n) => OWNER_META[n]?.value)
      .filter(Boolean) as OwnerKey[];
    if (availableKeys.length && !availableKeys.includes(selectedOwner)) {
      setSelectedOwner(availableKeys[0]);
    }
  }, [organization, selectedOwner]);

  if (error) {
    return <NotFound title={error?.message} />;
  }
  const user = useAppSelector((s) => s.auth.user);

  const userRole = organization?.memberships?.find(
    (m) => m.user_id === user?.id,
  )?.role;

  if (userRole !== "OWNER" && userRole !== "ADMIN") {
    return null;
  }

  if (!organization) {
    return <NotFound title={"Organization Not Found"} />;
  }

  return (
    <AuthGuard>
      <div className="px-2 pt-2 pb-12 max-w-7xl w-full flex flex-col items-center mx-auto   md:px-11 overflow-x-hidden ">
        <BillingSection
          loading={isLoading}
          organization={organization}
          selectedOwner={selectedOwner}
          setSelectedOwner={setSelectedOwner}
        />

        {selectedOwner === "pulse" ? (
          <OpBillingSection orgId={orgId as string} />
        ) : isPlatformBilled ? (
          // Billed by our own engine (PayFast): no saved cards, no Stripe
          // schedules; renewals are paid per period from this page.
          <>
            <PlanSection
              organization={organization}
              loading={isLoading}
              localPricing={localPricing}
            />
            <PlatformBillingSection
              orgId={orgId as string}
              organization={organization}
            />
            <InvoicesSection organization={organization} loading={isLoading} />
          </>
        ) : (
          <>
            <PlanSection
              organization={organization}
              loading={isLoading}
              localPricing={localPricing}
            />
            <CancelSubscriptionSection
              loading={isLoading}
              organization={organization}
            />
            <SubscriptionPolicySection organization={organization} />
            <BillingAddOnsSection organization={organization} />
            <RenewalSection organization={organization} loading={isLoading} />
            <PaymentMethodSection loading={isLoading} />
            <InvoicesSection organization={organization} loading={isLoading} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}

export default BillingPage;
