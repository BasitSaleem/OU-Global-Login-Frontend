import { LoadingSpinner } from "@/components/ui";

const CheckoutLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={8} className="border-primary" />
        <p className="text-text text-sm">Loading checkout...</p>
      </div>
    </div>
  );
};

export default CheckoutLoading;
