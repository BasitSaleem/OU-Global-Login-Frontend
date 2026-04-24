"use client";

import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";
import { useParams, useRouter } from "next/navigation";
import BillingSection from "@/components/pages/OrganizationDetails/Billing/BillingSection";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";

import NotFound from "@/components/NotFound";
import { useAppSelector } from "@/redux/store";
function BillingPage() {
  const { orgId } = useParams();
  const decodedId = atob(orgId as string);
  const router = useRouter();
  const {
    data: organization,
    isLoading,
    error,
  } = useOrganizationDetails(decodedId);

  if (error) {
    return <NotFound title={error?.message} />;
  }
  const user = useAppSelector((s) => s.auth.user);

  const userRole = organization?.memberships?.find(
    (m) => m.user_id === user?.id,
  )?.role;

  if (userRole !== "OWNER") {
    return null;
  }
  return (
    <div className="px-2 py-12 w-full mx-auto   md:px-11 overflow-x-hidden ">
      <BillingSection loading={isLoading} />
      <PlanSection organization={organization} loading={isLoading} />
      <RenewalSection organization={organization} loading={isLoading} />
      <PaymentMethodSection loading={isLoading} />
      <InvoicesSection organization={organization} loading={isLoading} />
    </div>
  );
}

export default BillingPage;
