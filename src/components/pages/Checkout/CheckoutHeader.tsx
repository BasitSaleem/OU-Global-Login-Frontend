import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CheckoutHeader = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 mb-8">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 text-text" />
      </button>
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-text mt-0.5">
          Review your plan and complete your subscription
        </p>
      </div>
    </div>
  );
};

export default CheckoutHeader;
