"use client";

import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";
import { useParams } from "next/navigation";
import BillingSection from "@/components/pages/OrganizationDetails/Billing/BillingSection";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
import ErrorMessage from "@/components/ErrorMessage";
import PricingSkeleton from "@/components/PricingSkeleton";
import NotFound from "@/components/NotFound";

function BillingPage() {
  const { orgId } = useParams();
  const {
    data: organization,
    isLoading,
    error,
  } = useOrganizationDetails(orgId as string);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <PricingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error || !organization) {
    return <NotFound title={error?.message} />;
  }
  return (
    <div className="px-2 py-12 w-full mx-auto   md:px-11 ">
      <BillingSection />
      <PlanSection organization={organization} />
      <RenewalSection organization={organization} />
      <PaymentMethodSection />
      <InvoicesSection />
    </div>
  );
}

export default BillingPage;
