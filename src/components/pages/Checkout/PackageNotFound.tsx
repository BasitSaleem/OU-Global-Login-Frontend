import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const PackageNotFound = ({ orgId }: { orgId: string }) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-bg-secondary border rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
        <h2 className="text-xl font-bold">Plan Not Found</h2>
        <p className="text-text text-sm">
          The selected plan could not be found. Please go back and select a
          valid plan.
        </p>
        <Button
          variant="primary"
          onClick={() => router.push(`/organization-details/${orgId}/billing`)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Billing
        </Button>
      </div>
    </div>
  );
};

export default PackageNotFound;
