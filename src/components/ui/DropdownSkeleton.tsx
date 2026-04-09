import { Skeleton } from "./skeleton";

const DropdownSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2 animate-pulse">
      <Skeleton width={100} height={16} />
      <Skeleton width={"100%"} height={40} />
    </div>
  );
};

export default DropdownSkeleton;
