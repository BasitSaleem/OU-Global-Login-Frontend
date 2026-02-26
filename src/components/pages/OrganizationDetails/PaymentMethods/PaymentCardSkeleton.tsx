import React from "react";

const PaymentCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="w-full h-[180px] bg-bg-secondary rounded-xl p-6 border flex flex-col justify-between animate-pulse"
        >
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* Card Icon Skeleton */}
              <div className="w-12 h-12 bg-gray-300 rounded-md" />

              <div className="space-y-2">
                {/* Card Number */}
                <div className="w-24 h-4 bg-gray-300 rounded" />
                {/* Expiry */}
                <div className="w-20 h-3 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Primary Badge Skeleton */}
            <div className="w-16 h-6 bg-gray-200 rounded-full" />
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end">
            {/* Make Primary Button */}
            <div className="w-28 h-8 bg-gray-200 rounded-md" />

            {/* Action Icons */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-md" />
              <div className="w-8 h-8 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentCardSkeleton;
