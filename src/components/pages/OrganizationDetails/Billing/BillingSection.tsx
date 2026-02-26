import { useState } from "react";
import OwnersProductItem, { OwnerKey } from "./OwnersProductItem";
import { Icons } from "@/components/utils/icons";

const owners: {
  value: OwnerKey;
  toolTipText: string;
  iconUrl: string;
  isDisabled: boolean;
}[] = [
  {
    value: "inventory",
    toolTipText: "Owners Inventory",
    iconUrl: Icons.ownerinventory,
    isDisabled: false,
  },
  {
    value: "jungle",
    toolTipText: "Owners Jungle",
    iconUrl: Icons.ownerjungle,
    isDisabled: true,
  },
  {
    value: "marketplace",
    toolTipText: "Owner Marketplace",
    iconUrl: Icons.ownermarketplace,
    isDisabled: true,
  },
  {
    value: "analytics",
    toolTipText: "Analytics",
    iconUrl: Icons.owneranalytics,
    isDisabled: true,
  },
];

const BillingSection = () => {
  const [selectedOwner, setSelectedOwner] = useState<OwnerKey>("inventory");

  return (
    <>
      <h1 className="font-bold text-2xl text-center md:text-left">Billing</h1>
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-2 mb-3">
          {owners.map((owner) => (
            <OwnersProductItem
              key={owner.value}
              value={owner.value}
              toolTipText={owner.toolTipText}
              iconUrl={owner.iconUrl}
              isDisabled={owner.isDisabled}
              selectedOwner={selectedOwner}
              setSelectedOwner={setSelectedOwner}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BillingSection;
