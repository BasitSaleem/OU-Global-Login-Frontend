import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { formatDate } from "@/utils/helpers";
import React from "react";

const RenewalSection = ({ organization }: { organization: OgOrganization }) => {
  const { subscriptions } = organization;

  return (
    <>
      <div className="text-center md:text-left mb-9">
        <h1 className="text-heading-1 font-bold pt-8 pb-2">Billing</h1>
        <p className="text-body-small">Renewal information.</p>
      </div>
      <div className="border rounded-lg w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 py-6 px-4 md:px-9">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-heading-1 font-bold mb-1">Your Plan</h1>
            <p className="text-body-small">
              {subscriptions?.[0]?.status === "CANCELLED"
                ? "--"
                : subscriptions?.[0]?.oiPackage?.package_name}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-heading-1 font-bold mb-1">Billing Cycle</h1>
            <p className="text-body-small capitalize">
              {subscriptions?.[0]?.status === "TRIAL" ||
              subscriptions?.[0]?.status === "CANCELLED"
                ? "--"
                : subscriptions?.[0]?.billing_cycle?.toLowerCase()}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-heading-1 font-bold mb-1">Next Billing Date</h1>
            <p className="text-body-small">
              {subscriptions?.[0]?.status === "TRIAL" ||
              subscriptions?.[0]?.status === "CANCELLED"
                ? "--"
                : formatDate(subscriptions?.[0]?.current_period_end)}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-heading-1 font-bold mb-1">Total</h1>
            <p className="text-body-small">
              {subscriptions?.[0]?.status === "TRIAL" ||
              subscriptions?.[0]?.status === "CANCELLED"
                ? "--"
                : subscriptions?.[0]?.payments?.[0]?.amount + ".00"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenewalSection;
