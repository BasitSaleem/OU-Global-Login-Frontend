import React from "react";
import { AlertTriangle } from "lucide-react";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import CancelSubscriptionButton from "./CancelSubscriptionButton";

const CancelSubscriptionSection = ({
  loading,
  organization,
}: {
  loading: boolean;
  organization: OgOrganization;
}) => {
  return (
    <section className="flex flex-row items-center justify-between bg-[#FEF1F0] py-1 px-2 rounded-lg mt-4 -mb-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-red-500" size={24} />
        <p className="text-text text-sm font-normal">
          <span className="text-sm text-red-500 font-medium ">
            Cancel subscription.
          </span>{" "}
          Your Retail ${organization?.packageName} stays active until the end of
          your current billing cycle. You won&apos;t be charged again.
        </p>
      </div>

      <CancelSubscriptionButton loading={loading} organization={organization} />
    </section>
  );
};

export default CancelSubscriptionSection;
