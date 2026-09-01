import OwnersProductItem, { OwnerKey, OWNER_META } from "./OwnersProductItem";
import { Skeleton } from "@/components/ui/skeleton";

const OWNER_ORDER = ["OI", "OP", "OJ", "OM", "OA"];

interface BillingSectionProps {
  loading: boolean;
  organization?: { products?: Array<{ product_name?: string }> };
  selectedOwner: OwnerKey;
  setSelectedOwner: (owner: OwnerKey) => void;
}

const BillingSection = ({
  loading,
  organization,
  selectedOwner,
  setSelectedOwner,
}: BillingSectionProps) => {
  // Only show a switcher icon for the products this organization actually has.
  const productNames = (organization?.products ?? [])
    .map((p) => p.product_name)
    .filter(Boolean) as string[];
  const shownOwners = OWNER_ORDER.filter((n) => productNames.includes(n))
    .map((n) => OWNER_META[n])
    .filter(Boolean);

  return (
    <div className="flex w-full justify-between items-center mb-2">
      <h1 className="font-bold text-2xl text-center md:text-left">
        {loading ? "Loading Billing..." : "Billing"}
      </h1>
      <div className="flex justify-center md:justify-center">
        <div className="flex items-center justify-center w-full gap-2 ">
          {loading
            ? Array.from({ length: shownOwners.length || 1 }).map((_, index) => (
                <Skeleton key={index} width={30} height={30} />
              ))
            : shownOwners.map((owner) => (
                <OwnersProductItem
                  key={owner.value}
                  value={owner.value}
                  toolTipText={owner.toolTipText}
                  iconUrl={owner.iconUrl}
                  isDisabled={false}
                  selectedOwner={selectedOwner}
                  setSelectedOwner={setSelectedOwner}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
