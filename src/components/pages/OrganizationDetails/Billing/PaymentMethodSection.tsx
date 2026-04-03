import React from "react";
import { SvgIcon } from "@/components/ui/SvgIcon";

import { IdCard } from "lucide-react";
import { useGetPaymentMethods } from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui";

const PaymentMethodSection = ({ loading }: { loading: boolean }) => {
  const { orgId } = useParams();
  const { data, isLoading } = useGetPaymentMethods(orgId as string);
  const router = useRouter();

  if (isLoading || loading) {
    return (
      <div className="flex flex-col space-y-4 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0">
              <div className="flex gap-2">
                <Skeleton width={30} height={30} circle />
                <div className="flex flex-col gap-y-2">
                  <Skeleton width={200} height={10} />
                  <Skeleton width={190} height={10} />
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <Skeleton width={200} height={10} />
                <Skeleton width={190} height={10} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="text-center md:text-left mb-6">
        <h1 className="text-heading-1 font-bold pt-8 pb-4">Payment method</h1>
      </div>
      <div className="flex flex-col  gap-y-4">
        {data?.paymentMethods?.map((card) => (
          <div
            key={card.id}
            className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0"
          >
            <div className="flex flex-col sm:flex-row justify-start items-center gap-2 sm:gap-3 text-center sm:text-left">
              <SvgIcon
                name={card.brand?.toLowerCase()}
                width={30}
                height={30}
              />
              <p className="text-body-small">
                {card.brand?.toLowerCase()} -- {card.last4} Expires{" "}
                {card.exp_month}/{card.exp_year}
              </p>
            </div>
            {card?.is_primary && (
              <div className=" bg-[#efedf7] text-primary p-1.5 text-sm border-0 rounded-3xl px-4  w-full sm:w-auto">
                Primary
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        className="w-full mt-10 py-5 text-text hover:text-text"
        leftIcon={<IdCard className="text-current" />}
        onClick={() =>
          router.push(`/organization-details/${orgId}/payment-cards`)
        }
      >
        Add Card
      </Button>
    </>
  );
};

export default PaymentMethodSection;
