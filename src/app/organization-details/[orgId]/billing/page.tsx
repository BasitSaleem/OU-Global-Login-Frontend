"use client";

import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";
import { useParams } from "next/navigation";
import BillingSection from "@/components/pages/OrganizationDetails/Billing/BillingSection";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";

import NotFound from "@/components/NotFound";
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
  return (
    <div className="px-2 py-12 w-full mx-auto   md:px-11 ">
      <BillingSection loading={isLoading} />
      <PlanSection organization={organization} loading={isLoading} />
      <RenewalSection organization={organization} loading={isLoading} />
      <PaymentMethodSection loading={isLoading} />
      <InvoicesSection organization={organization} loading={isLoading} />
    </div>
  );
}

export default BillingPage;
