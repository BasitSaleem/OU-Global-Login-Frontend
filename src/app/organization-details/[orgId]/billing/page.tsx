"use client";
import { useParams } from "next/navigation";

import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";
import BillingSection from "@/components/pages/OrganizationDetails/Billing/BillingSection";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";

import NotFound from "@/components/NotFound";
import { useAppSelector } from "@/redux/store";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import BillingAddOnsSection from "@/components/pages/OrganizationDetails/Billing/AddOnsSection";
import CancelSubscriptionSection from "@/components/pages/OrganizationDetails/Billing/CancelSubscriptionSection";

function BillingPage() {
  const { orgId } = useParams();

  const {
    data: organization,
    isLoading,
    error,
  } = useOrganizationDetails(orgId as string);

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
        <BillingSection loading={isLoading} />
        <PlanSection organization={organization} loading={isLoading} />
        <CancelSubscriptionSection
          loading={isLoading}
          organization={organization}
        />
        <BillingAddOnsSection organization={organization} />
        <RenewalSection organization={organization} loading={isLoading} />
        <PaymentMethodSection loading={isLoading} />
        <InvoicesSection organization={organization} loading={isLoading} />
      </div>
    </AuthGuard>
  );
}

export default BillingPage;
