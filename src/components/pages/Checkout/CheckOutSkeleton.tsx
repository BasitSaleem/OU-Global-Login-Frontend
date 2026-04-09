import CheckoutHeader from "@/components/pages/Checkout/CheckoutHeader";
import { Skeleton } from "@/components/ui/skeleton";

const CheckOutSkeleton = () => {
  return (
    <div className="w-full max-w-full mx-auto md:px-8 pb-60">
      <CheckoutHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-secondary/20 p-6 md:p-8 rounded-2xl border border-border">
            <div className="flex justify-between items-start mb-6">
              <Skeleton width="40%" height="32px" />
              <div className="flex items-center gap-3">
                <Skeleton width="80px" height="32px" />
                <Skeleton width="80px" height="32px" />
              </div>
            </div>
            <Skeleton width="100%" height="1px" className="my-6" />
            <Skeleton width="200px" height="24px" className="mb-4" />
            <div className="space-y-4">
              {[80, 60, 70, 50, 75, 65].map((width, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton width="24px" height="24px" circle />
                  <Skeleton width={`${width}%`} height="16px" />
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons Skeleton */}
          <div className="bg-bg-secondary/20 p-6 md:p-8 rounded-2xl border border-border">
            <Skeleton width="30%" height="28px" className="mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-xl gap-4"
                >
                  <div className="flex-1 w-full space-y-2">
                    <Skeleton width="40%" height="24px" />
                    <Skeleton width="70%" height="16px" />
                  </div>
                  <Skeleton width="120px" height="40px" />
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Country Skeleton */}
          <div className="bg-bg-secondary/20 p-6 md:p-8 rounded-2xl border border-border">
            <Skeleton width="40%" height="28px" className="mb-2" />
            <Skeleton width="60%" height="16px" className="mb-6" />
            <div className="space-y-2">
              <Skeleton width="100px" height="20px" />
              <Skeleton width="100%" height="48px" />
            </div>
          </div>

          {/* Payment Method Skeleton */}
          <div className="bg-bg-secondary/20 p-6 md:p-8 rounded-2xl border border-border">
            <div className="flex justify-between items-center mb-6">
              <Skeleton width="40%" height="28px" />
              <Skeleton width="120px" height="36px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border h-[100px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton width="30px" height="20px" />
                    <Skeleton width="40%" height="20px" />
                  </div>
                  <Skeleton width="60%" height="16px" className="mt-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Order Summary Skeleton */}
          <div className="bg-bg-secondary/20 p-6 md:p-8 rounded-2xl border border-border sticky top-6">
            <Skeleton width="50%" height="28px" className="mb-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton width="40%" height="20px" />
                <Skeleton width="25%" height="20px" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton width="50%" height="20px" />
                <Skeleton width="20%" height="20px" />
              </div>
            </div>

            <Skeleton width="100%" height="1px" className="my-6" />

            <div className="flex justify-between items-end mb-8">
              <Skeleton width="30%" height="24px" />
              <Skeleton width="40%" height="32px" />
            </div>

            <Skeleton width="100%" height="48px" />
            <div className="flex justify-center mt-4">
              <Skeleton width="60%" height="16px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSkeleton;
