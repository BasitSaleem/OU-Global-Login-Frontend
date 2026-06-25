import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PaymentCardSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2].map((item) => (
        <div
          key={item}
          className="w-full h-[180px] bg-bg-secondary rounded-xl p-6 border flex flex-col justify-between animate-pulse"
        >
          <div className="flex items-center justify-between">
            <Skeleton width={30} height={30} circle />
            <Skeleton width={100} height={10} />
          </div>
          <Skeleton width={100} height={10} />
        </div>
      ))}
    </>
  );
};

export default PaymentCardSkeleton;
