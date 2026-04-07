import { useState } from "react";
import OwnersProductItem, { OwnerKey } from "./OwnersProductItem";
import { Icons } from "@/components/utils/icons";
import { Skeleton } from "@/components/ui/skeleton";

const owners: {
  value: OwnerKey;
  toolTipText: string;
  iconUrl: string;
  isDisabled: boolean;
}[] = [
    {
      value: "inventory",
      toolTipText: "Owners Inventory",
      iconUrl: "OI",
      isDisabled: false,
    },
    {
      value: "jungle",
      toolTipText: "Owners Jungle",
      iconUrl: "OJ",
      isDisabled: true,
    },
    {
      value: "marketplace",
      toolTipText: "Owner Marketplace",
      iconUrl: "OM",
      isDisabled: true,
    },
    {
      value: "analytics",
      toolTipText: "Analytics",
      iconUrl: "OA",
      isDisabled: true,
    },
  ];

const BillingSection = ({ loading }: { loading: boolean }) => {
  const [selectedOwner, setSelectedOwner] = useState<OwnerKey>("inventory");

  return (
    <>
      <h1 className="font-bold text-2xl text-center md:text-left">
        {loading ? "Loading Billing..." : "Billing"}
      </h1>
      <div className="flex justify-center md:justify-start mt-3">
        <div className="flex items-center justify-center w-full gap-2 mb-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} width={30} height={30} />
            ))
          ) : (
            owners.map((owner) => (
              <OwnersProductItem
                key={owner.value}
                value={owner.value}
                toolTipText={owner.toolTipText}
                iconUrl={owner.iconUrl}
                isDisabled={owner.isDisabled}
                selectedOwner={selectedOwner}
                setSelectedOwner={setSelectedOwner}
              />)
            ))}
        </div>
      </div>
    </>
  );
};

export default BillingSection;
