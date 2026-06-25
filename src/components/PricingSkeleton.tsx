import React from "react";
import { Skeleton } from "./ui/skeleton";

interface PricingSkeletonProps {
  className?: string;
}

const PricingSkeleton: React.FC<PricingSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center p-5 rounded-3xl h-[830px] border-2 border-border animate-pulse ${className}`}
    >
      {/* Badge skeleton */}
      <Skeleton className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-skeleton "
        width="120px" height="30px" circle />
      <div className="flex flex-col gap-3 justify-center items-center mt-10 mb-5">
        <Skeleton width={200} height={20} />
        <Skeleton width={150} height={20} />
        <Skeleton width={120} height={20} />
      </div>
      <Skeleton width={280} height={40} circle />
      <div className="flex flex-col gap-5 mt-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} width={300} height={25} />
        ))}
      </div>
    </div>
  );
};

export default PricingSkeleton;
