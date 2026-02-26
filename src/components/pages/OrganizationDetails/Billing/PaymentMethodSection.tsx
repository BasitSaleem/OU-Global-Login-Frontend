import React from "react";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { Button } from "@/components/ui";
import { IdCard } from "lucide-react";
import { useGetPaymentMethods } from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";

const PaymentMethodSection = () => {
  const { data, isLoading, error } = useGetPaymentMethods();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0">
              <div className="flex flex-col sm:flex-row justify-start items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="w-[30px] h-[30px] rounded-md bg-gray-300" />
                <div className="h-4 w-44 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-24 bg-gray-300 rounded-3xl sm:w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <>
      <div className="text-center md:text-left mb-6">
        <h1 className="text-heading-1 font-bold pt-8 pb-4">Payment method</h1>
      </div>
      <div className="flex flex-col gap-y-4">
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
      <div
        className="border flex justify-center items-center my-6 py-2 rounded-lg gap-2 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => router.push("/payment-cards")}
      >
        <IdCard color="gray" />
        Add Card
      </div>
    </>
  );
};

export default PaymentMethodSection;
