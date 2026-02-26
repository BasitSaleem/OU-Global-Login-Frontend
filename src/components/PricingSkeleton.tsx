import React from "react";

interface PricingSkeletonProps {
  className?: string;
}

const PricingSkeleton: React.FC<PricingSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center p-5 rounded-3xl border-2 h-[830px] bg-gray border-gray-200 animate-pulse ${className}`}
    >
      {/* Badge skeleton */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200 rounded-2xl" />

      <div className="w-full flex flex-col items-center gap-4 mt-4">
        {/* Title */}
        <div className="h-6 w-40 bg-gray-200 rounded-md" />

        {/* Price */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-28 bg-gray-200 rounded-md" />
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
        </div>

        {/* Button */}
        <div className="w-full h-10 bg-gray-200 rounded-full" />

        {/* User count */}
        <div className="h-4 w-32 bg-gray-200 rounded-md mt-1" />

        {/* Features list */}
        <div className="w-full flex flex-col gap-3 mt-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSkeleton;
