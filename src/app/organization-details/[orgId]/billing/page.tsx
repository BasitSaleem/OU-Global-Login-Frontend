"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";
import BillingSection from "@/components/pages/OrganizationDetails/Billing/BillingSection";
import OpBillingSection from "@/components/pages/OrganizationDetails/Billing/OpBillingSection";
import OrBillingSection from "@/components/pages/OrganizationDetails/Billing/OrBillingSection";
import {
  OwnerKey,
  OWNER_META,
} from "@/components/pages/OrganizationDetails/Billing/OwnersProductItem";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
import { withOiSubscriptions } from "@/utils/oiSubscriptions";

import NotFound from "@/components/NotFound";
import { useAppSelector } from "@/redux/store";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import BillingAddOnsSection from "@/components/pages/OrganizationDetails/Billing/AddOnsSection";
import CancelSubscriptionSection from "@/components/pages/OrganizationDetails/Billing/CancelSubscriptionSection";
import SubscriptionPolicySection from "@/components/pages/OrganizationDetails/Billing/SubscriptionPolicySection";

const OWNER_ORDER = ["OI", "OP", "OR", "OJ", "OM", "OA"];

function BillingPage() {
  const { orgId } = useParams();

  const {
    data: organization,
    isLoading,
    error,
  } = useOrganizationDetails(orgId as string);

  // ?product=<key> opens a product tab directly (e.g. after an Owners Reach checkout).
  const requestedOwner = useSearchParams().get("product") as OwnerKey | null;
  const [selectedOwner, setSelectedOwner] = useState<OwnerKey>(
    requestedOwner ?? "inventory",
  );

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
  // Owners Inventory sections only see Owners Inventory subscriptions.
  const oiOrganization = withOiSubscriptions(organization);

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
        ) : selectedOwner === "lead" ? (
          <OrBillingSection organization={organization} loading={isLoading} />
        ) : (
          <>
            <PlanSection organization={oiOrganization} loading={isLoading} />
            <CancelSubscriptionSection
              loading={isLoading}
              organization={oiOrganization}
            />
            <SubscriptionPolicySection organization={oiOrganization} />
            <BillingAddOnsSection organization={oiOrganization} />
            <RenewalSection organization={oiOrganization} loading={isLoading} />
            <PaymentMethodSection loading={isLoading} />
            <InvoicesSection organization={oiOrganization} loading={isLoading} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}

export default BillingPage;
