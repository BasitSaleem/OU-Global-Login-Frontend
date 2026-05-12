import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
import { Dots } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { SUBSCRIPTION_STATUS_COLOR } from "@/utils/ColorClasses";
import { formatDate } from "@/utils/helpers";

const RenewalSection = ({
  organization,
  loading,
}: {
  organization?: OgOrganization;
  loading: boolean;
}) => {
  const { subscriptions } = organization || {};

  return (
    <>
      <div className="text-center md:text-left mb-6">
        <h1 className="text-heading-1 font-bold pt-8 pb-2">
          {loading ? (
            <Dots text="Loading Billing" position="left" />
          ) : (
            "Billing"
          )}
        </h1>
        {loading ? (
          <p className="text-body-small">
            {loading ? (
              <div className="flex flex-col items-start gap-2 ml-2">
                <Skeleton width={200} height={10} />{" "}
                <Skeleton width={150} height={10} />{" "}
              </div>
            ) : (
              "Invoices are generated every 24 hours and transactions are rolled into one invoice during this period."
            )}
          </p>
        ) : (
          <>Renewal information.</>
        )}
      </div>
      <div className="border rounded-lg w-full mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 py-6 px-4 md:px-9">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 md:items-start text-center md:text-left"
              >
                <Skeleton width="120px" height={18} />
                <Skeleton width="100px" height={18} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 py-4 px-4 md:px-9">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-text font-bold mb-1">Your Plan</h1>
              <p className="text-body-small">
                {subscriptions?.[0]?.status === "CANCELLED"
                  ? "--"
                  : subscriptions?.[0]?.oiPackage?.package_name}
                &nbsp;
                {subscriptions?.[0]?.status === "TRIAL" && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs text-text font-semibold capitalize ${
                      SUBSCRIPTION_STATUS_COLOR[
                        organization?.subscriptions?.[0]?.status ?? ""
                      ]
                    }`}
                  >
                    {organization?.subscriptions?.[0]?.status ??
                      "No Subscription"}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-text font-bold mb-1">Billing Cycle</h1>
              <p className="text-body-small capitalize">
                {subscriptions?.[0]?.status === "TRIAL" ||
                subscriptions?.[0]?.status === "CANCELLED"
                  ? "--"
                  : subscriptions?.[0]?.billing_cycle?.toLowerCase()}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-text font-bold mb-1">Next Billing Date</h1>
              <p className="text-body-small">
                {(subscriptions !== undefined &&
                  (subscriptions?.[0]?.status === "TRIAL" ||
                    subscriptions?.[0]?.status === "CANCELLED")) ||
                subscriptions?.[0]?.cancel_at_period_end === true
                  ? "--"
                  : formatDate(subscriptions?.[0]?.current_period_end!)}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-text font-bold mb-1">Total</h1>
              <p className="text-body-small">
                {subscriptions?.[0]?.status === "TRIAL" ||
                subscriptions?.[0]?.status === "CANCELLED"
                  ? "--"
                  : `$` +
                    Number(
                      subscriptions?.[0]?.payments?.[0]?.amount ?? 0,
                    ).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RenewalSection;
