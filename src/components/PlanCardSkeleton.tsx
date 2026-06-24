import React from "react";
import { Skeleton } from "./ui/skeleton";

interface PlanCardSkeletonProps {
  className?: string;
}

const PlanCardSkeleton: React.FC<PlanCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative w-full flex flex-col p-6 rounded-[32px] border-2 border-border bg-background min-h-[250px] animate-pulse ${className}`}
    >      <div className="mb-4">
        <Skeleton className="h-8 w-3/4 rounded-lg bg-gray-100" />
      </div>

      <div className="space-y-2 mb-10">
        <Skeleton className="h-4 w-full rounded bg-gray-50" />
        <Skeleton className="h-4 w-5/6 rounded bg-gray-50" />
      </div>

      <div className="mt-auto space-y-6">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-12 w-24 rounded-xl bg-gray-100" />
          <Skeleton className="h-6 w-16 rounded-lg bg-gray-50" />
        </div>

        <div>
          <Skeleton className="h-6 w-2/3 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default PlanCardSkeleton;
