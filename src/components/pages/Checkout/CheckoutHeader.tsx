import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CheckoutHeader = ({
  title = "Checkout",
  description = "Review your plan and complete your subscription",
}: {
  title?: string;
  description?: string;
}) => {
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
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-text mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export default CheckoutHeader;
