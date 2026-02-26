const DropdownSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded-md" />
    </div>
  );
};

export default DropdownSkeleton;
